import {QueAns} from "../ds/Conversation.tsx";
import {Message} from "../api/Interface.tsx";

export const base64ToBlob = (base64String: string, mimeType: string): Blob => {
    console.debug("decoding base64(truncated to 100 chars)", base64String.slice(0, 100))
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

export const historyMessages = (qaSlice: QueAns[], maxHistory: number): Message[] => {
    if (maxHistory <= 0) {
        return []
    }
    let messages: Message[] = []
    qaSlice.map(qa => qa.que.text)
        .filter(t => t.status == "received")
        .forEach(t => messages.push({role: "user", content: t.text}))
    qaSlice.map(qa => qa.ans.text)
        .filter(t => t.status == "received")
        .forEach(t => messages.push({role: "assistant", content: t.text}))
    messages = messages.slice(-maxHistory)
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

export type RecordingMimeType = {
    mimeType: string
    fileName: string
}

const popularMimeTypes: RecordingMimeType[] = [
    {mimeType: 'audio/webm; codecs=vp9', fileName: "audio.webm"},
    {mimeType: 'audio/webm; codecs=opus', fileName: "audio.webm"},
    {mimeType: 'audio/webm', fileName: "audio.webm"},
    {mimeType: 'audio/mp4', fileName: "audio.mp4"},
]

export function chooseAudioMimeType(): RecordingMimeType | undefined {
    const find = popularMimeTypes.find(m => MediaRecorder.isTypeSupported(m.mimeType));
    console.debug("found mimeType: ", find)
    return find
}

export function timeDiffSecond(isoTime: string): number {
  const isoDate = new Date(isoTime);
  const currentDate = new Date();
  const difference = currentDate.getTime() - isoDate.getTime();
    return Math.floor(difference / 1000);
}

export function joinClassNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}
