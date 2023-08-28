import {QueAns} from "./ds/Conversation.tsx";
import {Message} from "./api/Interface.tsx";

export const base64ToBlob = (base64String: string): Blob => {
    console.debug("decoding base64(truncated to 100 chars)", base64String.slice(0, 100))
    const byteCharacters = atob(base64String);
    const byteNumbers: number[] = [];

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers.push(byteCharacters.charCodeAt(i));
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], {type: "application/octet-stream"});
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
    if (maxHistoryMessage <= 0) {
        return []
    }
    let messages: Message[] = []
    qaSlice.map(qa => qa.que.text)
        .filter(t => t.status == "received")
        .forEach(t => messages.push({role: "user", content: t.text}))
    qaSlice.map(qa => qa.ans.text)
        .filter(t => t.status == "received")
        .forEach(t => messages.push({role: "assistant", content: t.text}))
    messages = messages.slice(-maxHistoryMessage)
    return messages
}

export function currentProtocolHostPortPath(): string {
    const protocol = window.location.protocol
    const hostname = window.location.hostname;
    const port = window.location.port;
    const path = window.location.pathname;
    return `${protocol}//${hostname}:${port}/${path}`;
}

export function joinUrl(...parts: string[]): string {
  return parts.map(part => part.replace(/^\/+|\/+$/g, '')).join('/');
}

export function randomHash(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let hash = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        hash += characters.charAt(randomIndex);
    }

    return hash;
}
