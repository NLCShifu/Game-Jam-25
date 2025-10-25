#!/usr/bin/env bash
set -euo pipefail

BASE="http://127.0.0.1:8000"

echo "Creating room..."
response=$(curl -s -X POST "$BASE/rooms?title=caca")
room_id=$(echo "$response" | jq -r '.room_id // .["room_id"] // .id // empty')
if [ -z "$room_id" ]; then
  echo "ERROR: can't parse room_id from response:"
  echo "$response"
  exit 1
fi
echo "Room created: $room_id"

# join player1
resp1=$(curl -s -X POST "$BASE/rooms/$room_id/join" -H "Content-Type: application/json" -d '{"display_name":"player1"}')
session1=$(echo "$resp1" | jq -r '.session_id // .sessionId // .id // .client_id // empty')
if [ -z "$session1" ]; then session1="player1"; fi
echo "player1 session: $session1"

# join player2
resp2=$(curl -s -X POST "$BASE/rooms/$room_id/join" -H "Content-Type: application/json" -d '{"display_name":"player2"}')
session2=$(echo "$resp2" | jq -r '.session_id // .sessionId // .id // .client_id // empty')
if [ -z "$session2" ]; then session2="player2"; fi
echo "player2 session: $session2"

# Function to generate HTML
generate_html() {
  local filename=$1
  local session=$2
  local player=$3
  cat >"$filename" <<EOF
<!doctype html>
<html lang="fr">
<head><meta charset="utf-8"/><title>${player} - video+audio PCM</title>
<style>
body{font-family:Arial;padding:12px;background:#fafafa}
video,img{width:480px;border:1px solid #444;display:block;margin-bottom:8px}
button{padding:8px 16px;margin:4px;cursor:pointer;border-radius:6px;border:1px solid #888}
</style>
</head>
<body>
<h2>${player} (session: ${session})</h2>

<video id="localVideo" autoplay playsinline muted></video>
<img id="remoteVideoImg" alt="remote video frame"/>
<audio id="remoteAudio" autoplay></audio>

<div>
  <button id="startBtn">Start camera+mic & connect</button>
  <button id="stopBtn" disabled>Stop</button>
</div>

<script>
(async () => {
  const roomId = "${room_id}";
  const sessionId = "${session}";
  const wsVideoUrl = \`ws://127.0.0.1:8000/ws/video/\${roomId}?session_id=\${sessionId}\`;
  const wsAudioUrl = \`ws://127.0.0.1:8000/ws/audio/\${roomId}?session_id=\${sessionId}\`;

  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const localVideo = document.getElementById('localVideo');
  const remoteImg = document.getElementById('remoteVideoImg');
  const remoteAudio = document.getElementById('remoteAudio');

  let wsVideo = null, wsAudio = null;
  let mediaStream = null, captureInterval = null;
  let audioCtx = null, processor = null, srcNode = null;

  function connectSockets() {
    wsVideo = new WebSocket(wsVideoUrl);
    wsVideo.binaryType = 'arraybuffer';
    wsVideo.onmessage = e => {
      const blob = new Blob([e.data], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      remoteImg.src = url;
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    };

    wsAudio = new WebSocket(wsAudioUrl);
    wsAudio.binaryType = 'arraybuffer';
    wsAudio.onmessage = e => {
      if (!audioCtx) audioCtx = new AudioContext();
      const buffer = e.data;
      const int16 = new Int16Array(buffer);
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 0x7fff;
      }
      const audioBuf = audioCtx.createBuffer(1, float32.length, audioCtx.sampleRate);
      audioBuf.copyToChannel(float32, 0);
      const src = audioCtx.createBufferSource();
      src.buffer = audioBuf;
      src.connect(audioCtx.destination);
      src.start();
    };
  }

  async function startMedia() {
    mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = mediaStream;

    // Video frames
    const canvas = document.createElement('canvas');
    const vTrack = mediaStream.getVideoTracks()[0];
    const settings = vTrack.getSettings();
    canvas.width = settings.width || 640;
    canvas.height = settings.height || 480;
    const ctx = canvas.getContext('2d');

    captureInterval = setInterval(async () => {
      ctx.drawImage(localVideo, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.6));
      if (wsVideo && wsVideo.readyState === WebSocket.OPEN) wsVideo.send(await blob.arrayBuffer());
    }, 100);

    // Audio PCM streaming
    audioCtx = new AudioContext();
    srcNode = audioCtx.createMediaStreamSource(mediaStream);
    processor = audioCtx.createScriptProcessor(4096, 1, 1);
    srcNode.connect(processor);
    processor.connect(audioCtx.destination);
    processor.onaudioprocess = e => {
      if (!wsAudio || wsAudio.readyState !== WebSocket.OPEN) return;
      const samples = e.inputBuffer.getChannelData(0);
      const buf = new Int16Array(samples.length);
      for (let i = 0; i < samples.length; i++) {
        const s = Math.max(-1, Math.min(1, samples[i]));
        buf[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
      }
      wsAudio.send(buf.buffer);
    };
  }

  function stopAll() {
    if (captureInterval) { clearInterval(captureInterval); captureInterval = null; }
    if (mediaStream) mediaStream.getTracks().forEach(t => t.stop());
    if (processor) processor.disconnect();
    if (srcNode) srcNode.disconnect();
    if (wsVideo) wsVideo.close(); wsVideo=null;
    if (wsAudio) wsAudio.close(); wsAudio=null;
    startBtn.disabled=false; stopBtn.disabled=true;
  }

  startBtn.addEventListener('click', async () => {
    startBtn.disabled=true;
    connectSockets();
    await startMedia();
    stopBtn.disabled=false;
  });
  stopBtn.addEventListener('click', stopAll);
})();
</script>
</body>
</html>
EOF
}

generate_html "player1.html" "$session1" "Player1"
generate_html "player2.html" "$session2" "Player2"

echo "✅ Generated player1.html and player2.html with PCM audio + JPEG video."
echo "💡 Open both in separate tabs, click Start sur chacun, et tu verras et entendras l'autre en quasi live."
