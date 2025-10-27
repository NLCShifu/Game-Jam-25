import { createContext, useCallback, useContext, useMemo, useRef, useState, type PropsWithChildren } from "react";
import type { WebsocketContext } from "./AbstractWebsocketContext";
import type { Room } from "../models/room";
import { GameStatus } from "../models/GameStatus";


interface MetaContextInterface extends WebsocketContext {
    startGame: () => void;

    roomState: Room | null;
    gameStatus: GameStatus;
    memeState: string | null;
    resetMeme: () => void;

    soundState: string | null;
    resetSound: () => void;

    ownLaughState: boolean | null;
    resetOwnLaugh: () => void;

    otherLaughState: boolean | null;
    resetOtherLaugh: () => void;

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
    const baseUrl = import.meta.env.VITE_API_URL;

    const [roomState, setRoomState] = useState<Room | null>(null);
    const [memeState, setMemeState] = useState<string | null>(null);
    const [soundState, setSoundState] = useState<string | null>(null);
    const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.WAITING);
    const [ownLaughState, setOwnLaughState] = useState<boolean | null>(null);
    const [otherLaughState, setOtherLaughState] = useState<boolean | null>(null);

    const openConnection = useCallback((roomId: string, sessionId: string) => {
        if (!wsMetaRef.current) {
            const url = `wss://${baseUrl}/ws/meta/${roomId}?session_id=${encodeURIComponent(sessionId)}`;

            const ws = new WebSocket(url);
            wsMetaRef.current = ws;

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log("Received ws_meta message:", data);

                if (data.room_update) {
                    setRoomState(data.room_update as Room);
                }

                if (data.meme) {
                    setMemeState(data.meme as string);
                }

                if (data.sound) {
                    setSoundState(data.sound as string);
                }

                if (data.game_started) {
                    console.log("Game started!");
                    setGameStatus(GameStatus.PLAYING);
                }
                if (data.own_laugh) {
                    setOwnLaughState(data.own_laugh as boolean);
                }

                if (data.other_laugh) {
                    setOtherLaughState(data.other_laugh as boolean);
                }

                if (data.game_result) {
                    console.log("Game ended!");
                    if (data.game_result === "won") {
                        setGameStatus(GameStatus.WON);
                    } else {
                        setGameStatus(GameStatus.LOST);
                    }
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
            wsMetaRef.current.send(JSON.stringify({ "action": "start_game" }));
        }
    }, []);

    const sendMeme = useCallback((imgName: string) => {
        if (wsMetaRef.current) {
            wsMetaRef.current.send(JSON.stringify({ meme: imgName }));
        }
    }, []);

    const sendSound = useCallback((soundName: string) => {
        if (wsMetaRef.current) {
            wsMetaRef.current.send(JSON.stringify({ sound: soundName }));
        }
    }, []);

    const resetMeme = useCallback(() => {
        setMemeState(null);
    }, []);

    const resetSound = useCallback(() => {
        setSoundState(null);
    }, []);

    const resetOwnLaugh = useCallback(() => {
        setOwnLaughState(null);
    }, []);

    const resetOtherLaugh = useCallback(() => {
        setOtherLaughState(null);
    }, []);

    const value = useMemo<MetaContextInterface>(() => ({
        openConnection,
        closeConnection,
        roomState,
        startGame,
        gameStatus,

        memeState,
        resetMeme,

        ownLaughState,
        otherLaughState,

        resetOwnLaugh,
        resetOtherLaugh,

        soundState,
        resetSound,

        sendMeme,
        sendSound,
    }), [roomState, memeState, soundState, ownLaughState, otherLaughState]);

    return (
        <Metacontext.Provider value={value}>
            {children}
        </Metacontext.Provider>
    );
}

export default MetaProvider;