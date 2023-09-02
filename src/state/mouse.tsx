import {create} from 'zustand';

type Mouse = {
    isMouseDown: boolean
    setMouseDown: (down: boolean) => void
}

/**
 * Monitors mouse activity across the entire webpage
 *
 * This state is essential for the functionality of DiscreteRange
 */
export const useMouseStore = create<Mouse>(
    (set) => (
        {
            isMouseDown: false,
            setMouseDown: (down: boolean) => set(() => ({
                isMouseDown: down
            })),
        }
    )
)