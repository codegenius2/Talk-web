export const StreamIdKey = "stream-id"
export const streamIdLength = 32
export const audioPlayerMimeType = 'audio/mpeg'
export const contentTimeoutSeconds = 30
// a recoding which is less than minSpeakTimeMillis should be discarded
export const minSpeakTimeMillis = 500


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
