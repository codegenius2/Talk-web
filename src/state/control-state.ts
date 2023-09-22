import {proxy, ref} from "valtio";
import {EnhancedRecorder} from "../util/enhanced-recorder.ts";
import {popularMimeTypes, RecordingMimeType} from "../config.ts";
import {chooseAudioMimeType} from "../util/util.tsx";


export type Player = {
    autoPlay: boolean
    isPlaying: boolean
    current: string // audio id
    playList: string[] // audio id list
}

export type RecordingCtx = {
    triggeredBy: 'spacebar' | 'click' | 'touch'
}

export type SendingMessage = {
    chatId: string
    text: string
    // if message
    audioBlob?: Blob
    durationMs?: number
}

export type AudioDurationUpdate = {
    chatId: string
    messageId: string
    durationMs: number
}

type ControlState = {
    isMouseLeftDown: boolean
    isMouseDragging: boolean
    player: Player
    recordingMimeType?: RecordingMimeType
    recorder: EnhancedRecorder<RecordingCtx>
    sendingMessages: SendingMessage[]
    sendingMessageSignal: number
    audioDurationUpdates: AudioDurationUpdate[]
    audioDurationUpdateSignal: number
}

export const controlState = proxy<ControlState>({
    isMouseLeftDown: false,
    isMouseDragging: false,
    player: {
        autoPlay: true,
        isPlaying: false,
        current: "",
        playList: []
    },
    recordingMimeType: chooseAudioMimeType(popularMimeTypes),
    recorder: ref<EnhancedRecorder<RecordingCtx>>(new EnhancedRecorder(false)),
    sendingMessages: ref([]),
    sendingMessageSignal: 0,
    audioDurationUpdates: ref([]),
    audioDurationUpdateSignal: 0
})

// subscribe(controlState.player, () => {
//     console.debug("player status:", controlState.player)
// })

export const playerState = controlState.player

// but ignore the audio if auto-play is not enabled
export const addToPlayList = (audioId: string) => {
    console.debug("adding audio to playlist,autoPlay: ", playerState.autoPlay)
    if (!playerState.autoPlay) {
        return
    }

    if (playerState.current === "") {
        console.debug("adding audio to playlist,confirmed, now playing")
        playerState.isPlaying = true
        playerState.current = audioId
    } else {
        console.debug("adding audio to playlist,confirmed, add te queue")
        // if playing === false, it's pause by user.
        // so don't play the audio now
        playerState.playList.push(audioId)
    }
}

// if prev audio is finished, auto play the next audio if auto-play is not enabled
export const onFinish = (audioId: string) => {
    if (playerState.current != audioId) {
        return;
    }
    if (!playerState.autoPlay || playerState.playList.length == 0) {
        playerState.isPlaying = false
        playerState.current = ""
        return
    }
    const [head] = playerState.playList.splice(0, 1)
    playerState.current = head
    playerState.isPlaying = true
}

export const pauseMe = (audioId: string) => {
    if (playerState.current === audioId) {
        playerState.isPlaying = false
    }
}

// clear playList if user ask to play a new audio
export const play = (audioId: string) => {
    if (playerState.current !== audioId) {
        playerState.playList = []
    }
    playerState.current = audioId
    playerState.isPlaying = true
}

export const clearPlayList = () => {
    playerState.isPlaying = false
    playerState.current = ""
    playerState.playList = []
}

