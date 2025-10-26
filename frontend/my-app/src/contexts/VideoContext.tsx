import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type PropsWithChildren } from "react";
import type { WebsocketContext } from "./AbstractWebsocketContext";

interface VideoContextInterface extends WebsocketContext {
    sendVideoFrame: (frame: ArrayBuffer) => void;
    otherCameraFrame: string | null;
};

const VideoContext = createContext<VideoContextInterface | null>(null);

export function useVideo() {
    const ctx = useContext(VideoContext);

    if (!ctx) throw new Error("useVideo must be used within a VideoProvider");

    return ctx;
}

function VideoProvider({ children }: Readonly<PropsWithChildren>) {
    const wsVideoRef = useRef<WebSocket | null>(null);

    // Current other video frame received
    const [otherCameraFrame, setOtherCameraFrame] = useState<string | null>(null);

    const openConnection = useCallback((roomId: string, sessionId: string) => {
        if (!wsVideoRef.current) {
            const url = `ws://localhost:8000/ws/video/${roomId}?session_id=${encodeURIComponent(sessionId)}`;
            
            const ws = new WebSocket(url);
            ws.binaryType = "arraybuffer";
            wsVideoRef.current = ws;

            ws.onmessage = (e: MessageEvent<ArrayBuffer>) => {
                try {
                    const blob = new Blob([e.data], { type: "image/jpeg" });
                    const url = URL.createObjectURL(blob);


                    if (otherCameraFrame) URL.revokeObjectURL(otherCameraFrame);

                    setOtherCameraFrame(url);
                } catch (err) {
                    console.warn("Failed to treat received camera frame");
                }
            }
        }
    }, []);

    const closeConnection = useCallback(() => {
        if (wsVideoRef.current) {
            const ws = wsVideoRef.current;

            ws.close();

            wsVideoRef.current = null;
            setOtherCameraFrame(null);
        }
    }, []);

    const sendVideoFrame = useCallback((frame: ArrayBuffer) => {
        if (wsVideoRef.current) {
            const ws = wsVideoRef.current;

            if (ws.readyState === WebSocket.OPEN) {
                ws.send(frame);
            }
        }
    }, []);

    const value = useMemo<VideoContextInterface>(() => ({
        openConnection,
        closeConnection,

        sendVideoFrame,
        otherCameraFrame
    }), [otherCameraFrame]);

    return <VideoContext value={value}>
        {children}
    </VideoContext>
}

export default VideoProvider;