import { createContext, useCallback, useContext, useMemo, useRef, useState, type PropsWithChildren } from "react";
import type { WebsocketContext } from "./AbstractWebsocketContext";
import type { Room } from "../models/room";


interface MetaContextInterface extends WebsocketContext {
    startGame: () => void;

    roomState: Room | null;

    sendMeme: (imgName: string) => void;
    sendSound: (soundName: string) => void;
}

const Metacontext = createContext<MetaContextInterface | null>(null);

export function useMeta() {
    const ctx = useContext(Metacontext);

    if (!ctx) throw new Error("useMeta must be used within a VideoProvider");

    return ctx;
}

function MetaProvider({ children }: Readonly<PropsWithChildren>) {
    const wsMetaRef = useRef<WebSocket | null>(null);

    const [roomState, setRoomState] = useState<Room | null>(null);

    const openConnection = useCallback((roomId: string, sessionId: string) => {
        if (!wsMetaRef.current) {
            const url = `ws://localhost:8000/ws/meta/${roomId}?session_id=${encodeURIComponent(sessionId)}`;
            
            const ws = new WebSocket(url);
            wsMetaRef.current = ws;

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log("Received ws_meta message:", data);

                if (data.room_update) {
                    setRoomState(data.room_update as Room);
                }
            }
        }
    }, []);

    const closeConnection = useCallback(() => {
        console.log("Close ", wsMetaRef.current);
        if (wsMetaRef.current) {
            const ws = wsMetaRef.current;

            ws.close();

            wsMetaRef.current = null;
        }
    }, []);

    const startGame = useCallback(() => {
        if (wsMetaRef.current) {
            wsMetaRef.current.send(JSON.stringify({ action: "start_game" }));
        }
    }, []);

    const sendMeme = useCallback((imgName: string) => {
        if (wsMetaRef.current) {
            wsMetaRef.current.send(JSON.stringify({ sendMeme: imgName }));
        }
    }, []);

    const sendSound = useCallback((soundName: string) => {
        if (wsMetaRef.current) {
            wsMetaRef.current.send(JSON.stringify({ sendSound: soundName }));
        }
    }, []);

    const value = useMemo<MetaContextInterface>(() => ({
        openConnection,
        closeConnection,
        roomState,
        startGame,
        sendMeme,
        sendSound,
    }), [roomState]);

    return (
        <Metacontext.Provider value={value}>
            {children}
        </Metacontext.Provider>
    );
}

export default MetaProvider;