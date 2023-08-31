export interface Message {
    role: string;
    content: string;
}

export interface ConversationReq {
    id: string; // unique ID for every conversation
    ms: Message[];
}