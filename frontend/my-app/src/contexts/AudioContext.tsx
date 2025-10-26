import { createContext, useCallback, useContext, useMemo, useRef, type PropsWithChildren } from "react";
import type { WebsocketContext } from "./AbstractWebsocketContext";

interface CamAudioContextInterface extends WebsocketContext {
    sendAudioFrame: (samples: Int16Array) => void;
}

const CamAudioContext = createContext<CamAudioContextInterface | null>(null);

export function useAudio() {
    const ctx = useContext(CamAudioContext);

    if (!ctx) throw new Error("useAudio must be used within a AudioProvider");

    return ctx;
}

function AudioProvider({ children }: PropsWithChildren) {
    const wsAudioRef = useRef<WebSocket | null>(null);
    const playbackCtxRef = useRef<AudioContext | null>(null);
    const playbackCursorRef = useRef<number>(0);

    const openConnection = useCallback((roomId: string, sessionId: string) => {
        if (!wsAudioRef.current) {
          const url = `ws://localhost:8000/ws/audio/${roomId}?session_id=${encodeURIComponent(
            sessionId
          )}`;

          const wsAudio = new WebSocket(url);
          wsAudio.binaryType = "arraybuffer";
          wsAudioRef.current = wsAudio;

          wsAudio.onmessage = (event: MessageEvent<ArrayBuffer>) => {
            try {
              if (!event.data) return;
              const int16 = new Int16Array(event.data);
              if (!int16.length) return;

              let playbackCtx = playbackCtxRef.current;
              if (!playbackCtx) {
                playbackCtx = new AudioContext();
                playbackCtxRef.current = playbackCtx;
              }
              const float32 = new Float32Array(int16.length);
              for (let i = 0; i < int16.length; i++) {
                float32[i] = int16[i] / 0x7fff;
              }
              const audioBuffer = playbackCtx.createBuffer(
                1,
                float32.length,
                playbackCtx.sampleRate
              );
              audioBuffer.copyToChannel(float32, 0);
              const source = playbackCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(playbackCtx.destination);
              const now = playbackCtx.currentTime;
              const startAt = Math.max(now, playbackCursorRef.current);
              source.start(startAt);
              playbackCursorRef.current = startAt + audioBuffer.duration;
            } catch (err) {
              console.warn("failed to play remote audio", err);
            }
          };
        }
    }, []);

    const closeConnection = useCallback(() => {
        if (wsAudioRef.current) {
            const ws = wsAudioRef.current;

            ws.close();

            wsAudioRef.current = null;
        }
    }, []);

    const sendAudioFrame = useCallback((samples: Int16Array) => {
      console.log("entered sendAudioFrame");
        if (wsAudioRef.current) {
          const ws = wsAudioRef.current;

          if (ws.readyState == WebSocket.OPEN) {
            console.log("Sent audio");
            ws.send(samples);
          }
        }
    }, []);

    const value = useMemo<CamAudioContextInterface>(() => ({
        openConnection,
        closeConnection,

        sendAudioFrame,
    }), []);

    return <CamAudioContext value={value}>{children}</CamAudioContext>;
}

export default AudioProvider;