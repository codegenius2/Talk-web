import {create} from 'zustand';


export const useTextAreaStore = create(() => ({inputAreaIsLarge: false}))
export const useInputStore = create(() => ({inputText: ""}))
export const useSendingTextStore = create(() => ({sendingText: ""}))

const emptyBlob = new Blob([], {type: 'audio/mp3'});

export type SendingAudio = {
    sendingAudio: Blob
    // duration is in ms
    duration: number
}

export const useSendingAudioStore = create<SendingAudio>(
    () => ({sendingAudio: emptyBlob, duration: 0})
)
