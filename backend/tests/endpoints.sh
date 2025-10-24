#!/usr/bin/env bash
set -euo pipefail

BASE="http://127.0.0.1:8000"

echo "Creating room..."
response=$(curl -s -X POST "$BASE/rooms?title=caca")
room_id=$(echo "$response" | jq -r '.room_id // .["room_id"] // .id // empty')
if [ -z "$room_id" ]; then
  echo "ERROR: impossible de récupérer room_id depuis la réponse:"
  echo "$response"
  exit 1
fi
echo "Room created: $room_id"

# Join player1
resp1=$(curl -s -X POST "$BASE/rooms/$room_id/join" -H "Content-Type: application/json" -d '{"display_name":"player1"}')
session1=$(echo "$resp1" | jq -r '.session_id // .sessionId // .id // .client_id // empty')
if [ -z "$session1" ]; then
  echo "Warning: impossible de parser session_id pour player1. Response was:"
  echo "$resp1"
  echo "I will fallback to 'player1' as session_id — assure-toi que ton serveur accepte ça."
  session1="player1"
fi
echo "player1 session: $session1"

# Join player2
resp2=$(curl -s -X POST "$BASE/rooms/$room_id/join" -H "Content-Type: application/json" -d '{"display_name":"player2"}')
session2=$(echo "$resp2" | jq -r '.session_id // .sessionId // .id // .client_id // empty')
if [ -z "$session2" ]; then
  echo "Warning: impossible de parser session_id pour player2. Response was:"
  echo "$resp2"
  echo "I will fallback to 'player2' as session_id — assure-toi que ton serveur accepte ça."
  session2="player2"
fi
echo "player2 session: $session2"

# Create HTML for player1
cat >player1.html <<EOF
<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<title>player1 - ws video test</title>
<style>
  body { font-family: Arial, sans-serif; padding: 16px; }
  video, img { width: 480px; border: 1px solid #222; display:block; margin-bottom:8px; }
  .controls { margin-top: 8px; }
  button { padding: 8px 12px; font-size: 14px; }
  .hint { color: #666; font-size: 13px; margin-top:6px; }
</style>
</head>
<body>
<h1>Player1 (session: ${session1})</h1>

<!-- local preview (stream) -->
<video id="localPreview" autoplay playsinline muted></video>

<!-- remote frames (received from other peers) -->
<img id="remoteFrame" alt="remote frame will appear here"/>

<div class="controls">
  <button id="startBtn">Start camera & connect</button>
  <button id="stopBtn" disabled>Stop</button>
</div>
<div class="hint">Open this file in one tab and player2.html in another tab. Click Start on each.</div>

<script>
(async () => {
  const roomId = "${room_id}";
  const sessionId = "${session1}";
  const WS_URL = \`ws://127.0.0.1:8000/ws/video/\${roomId}?session_id=\${sessionId}\`;

  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const localPreview = document.getElementById('localPreview');
  const remoteFrame = document.getElementById('remoteFrame');

  let ws = null;
  let stream = null;
  let captureInterval = null;

  function connectWs() {
    ws = new WebSocket(WS_URL);
    ws.binaryType = 'arraybuffer';
    ws.onopen = () => console.log('WS open');
    ws.onclose = () => console.log('WS closed');
    ws.onerror = e => console.error('WS error', e);
    ws.onmessage = ev => {
      // On reçoit des frames (ArrayBuffer avec image/jpeg)
      try {
        const blob = new Blob([ev.data], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        remoteFrame.src = url;
        // cleanup URL after short time to avoid leak
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      } catch (err) {
        console.error('receive error', err);
      }
    };
  }

  async function startCaptureAndSend() {
    // getUserMedia must be called from a user gesture to reliably prompt permission
    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    localPreview.srcObject = stream;

    // We'll capture frames onto a canvas at ~10fps and send as JPEG ArrayBuffer
    const track = stream.getVideoTracks()[0];
    const settings = track.getSettings();
    const canvas = document.createElement('canvas');
    canvas.width = settings.width || 640;
    canvas.height = settings.height || 480;
    const ctx = canvas.getContext('2d');

    // send frames every 100ms
    captureInterval = setInterval(async () => {
      try {
        ctx.drawImage(localPreview, 0, 0, canvas.width, canvas.height);
        const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.6));
        const buf = await blob.arrayBuffer();
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(buf);
        }
      } catch (e) {
        console.error('frame send error', e);
      }
    }, 100);
  }

  function stopAll() {
    if (captureInterval) { clearInterval(captureInterval); captureInterval = null; }
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      stream = null;
      localPreview.srcObject = null;
    }
    if (ws) {
      try { ws.close(); } catch(_) {}
      ws = null;
    }
  }

  startBtn.addEventListener('click', async () => {
    startBtn.disabled = true;
    try {
      connectWs();
      await startCaptureAndSend();
      stopBtn.disabled = false;
    } catch (e) {
      console.error('Start failed', e);
      startBtn.disabled = false;
      alert('Error starting camera or WS (see console).');
    }
  });

  stopBtn.addEventListener('click', () => {
    stopAll();
    startBtn.disabled = false;
    stopBtn.disabled = true;
  });

})();
</script>
</body>
</html>
EOF

# Create HTML for player2
cat >player2.html <<EOF
<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<title>player2 - ws video test</title>
<style>
  body { font-family: Arial, sans-serif; padding: 16px; }
  video, img { width: 480px; border: 1px solid #222; display:block; margin-bottom:8px; }
  .controls { margin-top: 8px; }
  button { padding: 8px 12px; font-size: 14px; }
  .hint { color: #666; font-size: 13px; margin-top:6px; }
</style>
</head>
<body>
<h1>Player2 (session: ${session2})</h1>

<video id="localPreview" autoplay playsinline muted></video>
<img id="remoteFrame" alt="remote frame will appear here"/>

<div class="controls">
  <button id="startBtn">Start camera & connect</button>
  <button id="stopBtn" disabled>Stop</button>
</div>
<div class="hint">Open this file in one tab and player1.html in another tab. Click Start on each.</div>

<script>
(async () => {
  const roomId = "${room_id}";
  const sessionId = "${session2}";
  const WS_URL = \`ws://127.0.0.1:8000/ws/video/\${roomId}?session_id=\${sessionId}\`;

  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const localPreview = document.getElementById('localPreview');
  const remoteFrame = document.getElementById('remoteFrame');

  let ws = null;
  let stream = null;
  let captureInterval = null;

  function connectWs() {
    ws = new WebSocket(WS_URL);
    ws.binaryType = 'arraybuffer';
    ws.onopen = () => console.log('WS open');
    ws.onclose = () => console.log('WS closed');
    ws.onerror = e => console.error('WS error', e);
    ws.onmessage = ev => {
      try {
        const blob = new Blob([ev.data], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        remoteFrame.src = url;
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      } catch (err) {
        console.error('receive error', err);
      }
    };
  }

  async function startCaptureAndSend() {
    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    localPreview.srcObject = stream;
    const track = stream.getVideoTracks()[0];
    const settings = track.getSettings();
    const canvas = document.createElement('canvas');
    canvas.width = settings.width || 640;
    canvas.height = settings.height || 480;
    const ctx = canvas.getContext('2d');

    captureInterval = setInterval(async () => {
      try {
        ctx.drawImage(localPreview, 0, 0, canvas.width, canvas.height);
        const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.6));
        const buf = await blob.arrayBuffer();
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(buf);
        }
      } catch (e) {
        console.error('frame send error', e);
      }
    }, 100);
  }

  function stopAll() {
    if (captureInterval) { clearInterval(captureInterval); captureInterval = null; }
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      stream = null;
      localPreview.srcObject = null;
    }
    if (ws) {
      try { ws.close(); } catch(_) {}
      ws = null;
    }
  }

  startBtn.addEventListener('click', async () => {
    startBtn.disabled = true;
    try {
      connectWs();
      await startCaptureAndSend();
      stopBtn.disabled = false;
    } catch (e) {
      console.error('Start failed', e);
      startBtn.disabled = false;
      alert('Error starting camera or WS (see console).');
    }
  });

  stopBtn.addEventListener('click', () => {
    stopAll();
    startBtn.disabled = false;
    stopBtn.disabled = true;
  });

})();
</script>
</body>
</html>
EOF

echo "Generated player1.html and player2.html"
echo "Open them in two separate tabs and click Start on each to trigger camera permission and begin streaming."
