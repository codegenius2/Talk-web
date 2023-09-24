import {currentProtocolHostPortPath, joinUrl} from "./util/util.tsx"

export const audioPlayerMimeType = 'audio/mpeg'
export const maxLoadedVoice = 6
export const messageTimeoutSeconds = 60
// a recoding which is less than minSpeakTimeMillis should be discarded
export const minSpeakTimeMillis = 500

export function SSEEndpoint(): string {
    const ep = joinUrl(APIEndpoint(), "events")
    console.debug("SSEEndpoint:", ep)
    return ep
}

export function APIEndpoint(): string {
    let ep = import.meta.env.VITE_REACT_APP_ENDPOINT
    if (ep) {
        return ep
    }
    ep = joinUrl(currentProtocolHostPortPath(), "api")
    console.debug("RestfulEndpoint:", ep)
    return ep
}

export type RecordingMimeType = {
    mimeType: string
    fileName: string
}

export const popularMimeTypes: RecordingMimeType[] = [
    {mimeType: 'audio/webm; codecs=vp9', fileName: "audio.webm"},
    {mimeType: 'audio/webm; codecs=opus', fileName: "audio.webm"},
    {mimeType: 'audio/webm', fileName: "audio.webm"},
    {mimeType: 'audio/mp4', fileName: "audio.mp4"},
]

