import {create} from 'zustand';

interface Setting {
    historyEnabled: boolean
    setHistoryEnabled: (historyEnabled: boolean) => void
    maxHistory?: number
    setMaxHistory: (maxHistory?: number) => void
}

export const useSettingStore = create<Setting>(
    (set) => (
        {
            historyEnabled: true,
            setHistoryEnabled: (historyEnabled: boolean) => set((state) => ({
                ...state,
                historyEnabled: historyEnabled
            })),
            maxHistory: 4,
            setMaxHistory: (maxHistory?: number) => set((state) => ({
                ...state,
                maxHistory: maxHistory
            })),

        }
    )
)