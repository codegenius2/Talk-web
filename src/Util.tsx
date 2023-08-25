import ReconnectingWebSocket from "reconnecting-websocket";
import {QueAns} from "./ds/Conversation.tsx";
import {Message} from "./api/API.tsx";

export const sendMessage = (socket: ReconnectingWebSocket, event: unknown) => {
    const jsonString = JSON.stringify(event);
    console.debug("sending message to server(truncated to 100 chars)", jsonString.slice(0, 100))
    socket.send(jsonString)
};

export const base64ToBlob = (base64String: string, mimeType: string): Blob => {
    console.debug("decoding base64", base64String)
    const byteCharacters = atob(base64String);
    const byteNumbers: number[] = [];

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers.push(byteCharacters.charCodeAt(i));
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], {type: mimeType});
}

export function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            let base64Data = reader.result as string;
            // Remove MIME type
            base64Data = base64Data.split(",")[1];
            resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

// MM:SS
export const timeElapsedMMSS = (duration: number): string => {
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor((seconds % 3600) / 60);

    return `${padZero(minutes)}:${padZero(seconds)}`;
};

const padZero = (num: number): string => {
    return num.toString().padStart(2, '0');
};

export const historyMessages = (qaSlice: QueAns[], maxHistoryMessage: number): Message[] => {
    let messages: Message[] = []
    qaSlice.map(qa => qa.que.text)
        .filter(t => t.status == "done")
        .forEach(t => messages.push({role: "user", content: t.content}))
    qaSlice.map(qa => qa.ans.text)
        .filter(t => t.status == "done")
        .forEach(t => messages.push({role: "assistant", content: t.content}))
    messages = messages.slice(-maxHistoryMessage)
    return messages
}