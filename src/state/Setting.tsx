import {create} from 'zustand';

interface Setting {
    maxHistoryMessage: number
    minSpeakTimeToSend: number // in ms
}

export const useSettingStore = create<Setting>(
    () => (
        {
            maxHistoryMessage: 4,
            minSpeakTimeToSend: 500
        }
    )
)