import {SHA256} from 'crypto-js';
import {KeyboardEventHandler} from "react";
import {RecordingMimeType} from "../config.ts";
import {v4 as uuidv4} from 'uuid';
import {MD5} from 'crypto-js';
import {format} from 'date-fns'

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
    return format(new Date(2014, 1, 11), 'yyyy-MM-dd_HH_mm_SS')
};

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

export function chooseAudioMimeType(mimeTypes: RecordingMimeType[]): RecordingMimeType | undefined {
    const find = mimeTypes.find(m => MediaRecorder.isTypeSupported(m.mimeType));
    console.debug("found mimeType: ", find)
    return find
}

export function joinClasses(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export function generateHash(input: string): string {
    return SHA256(input).toString();
}

export function getRandomElement<T>(arr: T[]): T | undefined {
    if (arr.length === 0) {
        return undefined;
    }

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

// return a string contains 32 chars
export const randomHash = (): string => {
    const str = uuidv4() + randomString(10);
    return md5Hash(str);
}

const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function randomString(length: number): string {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}

function md5Hash(input: string): string {
    return MD5(input).toString();
}

