import {useMouseStore} from "../state/mouse.tsx";
import React, {useEffect} from "react";
import {useRecorderStore} from "../state/recording.tsx";

export const WindowListeners: React.FC = () => {
    const setMouseDown = useMouseStore(state => state.setMouseDown)
    const recorder = useRecorderStore(state => state.recorder)

    useEffect(() => {

            // spacebar has the lowest priority on starting/ending a recording

            const handleKeyUp = (event: KeyboardEvent) => {
                console.debug('handleKeyUp');
                if (event.code == 'Space' && recorder.currentContext()?.triggeredBy === 'spacebar') {
                    recorder.done()
                }
            }

            const handleKeyDown = (event: KeyboardEvent) => {
                console.debug('handleKeyDown', event.code);
                if (event.code === 'Space') {
                    if (!recorder.currentContext()?.triggeredBy) {
                        recorder.start({triggeredBy: 'spacebar'}).catch((e) => {
                            console.error("failed to start recorder", e)
                        })
                    }
                    if (event.repeat) {
                        console.debug('handleKeyDown skip repeated space');
                        return
                    }
                } else {
                    if (recorder.currentContext()?.triggeredBy === 'spacebar') {
                        // press any key other spacebar to cancel a recorder
                        recorder.cancel()
                    }
                }
            };

            const handleMouseDown = () => {
                console.debug('handleMouseDown');
                setMouseDown(true)
            }

            const handleMouseUp = () => {
                console.debug('handleMouseUp');
                setMouseDown(false)
            }

            window.addEventListener("keydown", handleKeyDown);
            window.addEventListener("keyup", handleKeyUp);
            window.addEventListener("mousedown", handleMouseDown);
            window.addEventListener("mouseup", handleMouseUp);

            return () => {
                window.removeEventListener("keydown", handleKeyDown);
                window.removeEventListener("keyup", handleKeyUp);
                window.removeEventListener("mousedown", handleMouseDown);
                window.removeEventListener("mouseup", handleMouseUp);
            }
        },
        [setMouseDown, recorder]
    )
    return null
}