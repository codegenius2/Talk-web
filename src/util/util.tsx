import {SHA256} from 'crypto-js';
import {KeyboardEventHandler} from "react";
import {v4 as uuidv4} from 'uuid';
import {format} from 'date-fns'
import {RecordingMimeType} from "../config.ts";

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

// duration is in ms
export const timeElapsedMMSS = (duration: number): string => {
    let seconds = Math.floor(duration / 1000);
    const minutes = Math.floor((seconds % 3600) / 60);
    seconds = seconds % 60
    return `${padZero(minutes)}:${padZero(seconds)}`;
};

const padZero = (num: number): string => {
    return num.toString().padStart(2, '0');
};

// duration is in ms
export const formatNow = (): string => {
    return format(new Date(), 'yyyy-MM-dd_HH_mm_SS')
};

export const generateUudioId = (action: "recording" | "synthesis"): string => {
    return action + "-" + formatNow() + "-" + randomHash16Char()
}

export function currentProtocolHostPortPath(): string {
    const protocol = window.location.protocol
    const hostname = window.location.hostname;
    const port = window.location.port;
    return `${protocol}//${hostname}:${port}/`;
}

export function joinUrl(...parts: string[]): string {
    return parts.map(part => part.replace(/^\/+|\/+$/g, '')).join('/');
}

export function chooseAudioMimeType(mimeTypes: RecordingMimeType[]): RecordingMimeType | undefined {
    if (MediaRecorder) {
        const found = mimeTypes.find(m => MediaRecorder.isTypeSupported(m.mimeType));
        if (found) {
            return found
        }
    }
    console.error("cannot find mimeType for recorder")
    return undefined
}

export const cx = (...classes: (boolean | string)[]): string => {
    return classes.filter(c => typeof c === "string").join(" ")
}


export function getRandomElement<T>(...arr: T[]): T {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

export function compareSlices<T>(arr1: T[], arr2: T[]): boolean {
    const slice1 = arr1.slice();
    const slice2 = arr2.slice();

    return JSON.stringify(slice1) === JSON.stringify(slice2);
}

export const escapeSpaceKey: KeyboardEventHandler<HTMLElement> = (event) => {
    if (event.code === 'Space') {
        event.stopPropagation();
    }
}

// return a string contains 16 chars
export const randomHash16Char = (): string => {
    const str = uuidv4() + randomString(10);
    // 256**16>3.4e38, it's not likely to cause collision, but save more bytes to speed up state management
    return SHA256(str).toString().slice(0, 16);
}

// return a string contains 16 chars
export const randomHash32Char = (): string => {
    const str = uuidv4() + randomString(10);
    return SHA256(str).toString().slice(0, 32);
}

const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function randomString(length: number): string {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}

export function generateHash(input: string): string {
    return SHA256(input).toString();
}