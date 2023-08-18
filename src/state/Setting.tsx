import {create} from 'zustand';

interface Setting {
    maxHistoryMessage: number
}

export const useSettingStore = create<Setting>(
    () => (
        {
            maxHistoryMessage: 4
        }
    )
)