import {create} from 'zustand';


export const useTextAreaStore = create(() => ({inputAreaIsLarge: false}))
export const useInputStore = create(() => ({inputText: ""}))
export const useSendingTextStore = create(() => ({sendingText: ""}))

const emptyBlob = new Blob([], { type: 'audio/mp3' });
export const useSendingAudioStore = create(() => ({sendingAudio: emptyBlob}))
