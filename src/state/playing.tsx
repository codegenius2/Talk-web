import {create} from 'zustand';


interface Playing {
    playingAudioIndex?: string
    forceLock: (audioIndex: string) => void
    unLock: (audioIndex: string) => void
}

export const usePlayingStore = create<Playing>(
    (set, get) => (
        {
            playingAudioIndex: undefined,
            forceLock: (audioIndex: string) => set((state) => ({
                ...state,
                playingAudioIndex: audioIndex
            })),
            unLock: (audioIndex: string) => {
                if (get().playingAudioIndex === audioIndex) {
                    set((state) => ({...state, playingAudioIndex: undefined}))
                } else {
                    throw new Error("failed to unLock: you haven't lock, audioIndex:" + audioIndex)
                }
            },

        }
    )
)