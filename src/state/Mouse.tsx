import {create} from 'zustand';

type Mouse = {
    isMouseDown: boolean
    setMouseDown: (down: boolean) => void
}

export const useMouseStore = create<Mouse>(
    (set) => (
        {
            isMouseDown: true,
            setMouseDown: (down: boolean) => set(() => ({
                isMouseDown: down
            })),
        }
    )
)