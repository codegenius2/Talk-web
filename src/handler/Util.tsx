import {Message} from "../component/Interface.tsx";
import {Message as CMessage} from "../api/API.tsx";
import ReconnectingWebSocket from "reconnecting-websocket";

export const sendMessage = (socket: ReconnectingWebSocket | undefined, event: unknown) => {
    const jsonString = JSON.stringify(event);
    console.debug("sending message to server(truncated to 100 chars)", jsonString.slice(0, 100))
    socket!.send(jsonString)
};

export const getConversation = (messages: Message[]): CMessage[] => {
    let conv = messages.filter(m => m?.text?.text)
        .map<CMessage>(m => ({
            role: m.role,
            content: m.text!.text!
        }));
    conv = [...conv]
    return conv
}

export function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

export async function blobsToBase64(blobs: Blob[]): Promise<string> {
    let base64String = '';
    for (const blob of blobs) {
        const base64 = await blobToBase64(blob);
        base64String += base64;
    }
    return base64String;
}

export const base64ToBlob = (base64String: string, mimeType: string): Blob => {
    const byteCharacters = atob(base64String);
    const byteNumbers: number[] = [];

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers.push(byteCharacters.charCodeAt(i));
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], {type: mimeType});
}

