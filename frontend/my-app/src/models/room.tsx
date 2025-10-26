import type { Participant } from "./Participant";

export type Room = {
    id: string;
    participants: Participant[];
}