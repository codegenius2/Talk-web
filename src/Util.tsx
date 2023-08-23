import ReconnectingWebSocket from "reconnecting-websocket";

export const sendMessage = (socket: ReconnectingWebSocket, event: unknown) => {
    const jsonString = JSON.stringify(event);
    console.debug("sending message to server(truncated to 100 chars)", jsonString.slice(0, 100))
    socket.send(jsonString)
};
export const base64ToBlob = (base64String: string, mimeType: string): Blob => {
    const byteCharacters = atob(base64String);
    const byteNumbers: number[] = [];

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers.push(byteCharacters.charCodeAt(i));
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], {type: mimeType});
}

// MM:SS
export const timeElapsedMMSS = (duration: number): string => {
    const seconds = Math.floor( duration / 1000);
    const minutes = Math.floor((seconds % 3600) / 60);

    return `${padZero(minutes)}:${padZero(seconds)}`;
};

const padZero = (num: number): string => {
    return num.toString().padStart(2, '0');
};
