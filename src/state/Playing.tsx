import {create} from 'zustand';


interface Playing {
    playingAudioIndex?: number
    forceLock: (audioIndex: number) => void
    unLock: (audioIndex: number) => void
}

export const usePlayingStore = create<Playing>(
    (set, get) => (
        {
            playingAudioIndex: undefined,
            forceLock: (audioIndex: number) => set((state) => ({
                ...state,
                playingAudioIndex: audioIndex
            })),
            unLock: (audioIndex: number) => {
                if (get().playingAudioIndex === audioIndex) {
                    set((state) => ({...state, playingAudioIndex: undefined}))
                } else {
                    throw new Error("failed to unLock: you haven't lock, audioIndex:" + audioIndex)
                }
            },

        }
    )
)