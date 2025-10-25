export interface WebsocketContext {
    openConnection: (roomId: string, sessionId: string) => void;
    closeConnection: () => void;
};