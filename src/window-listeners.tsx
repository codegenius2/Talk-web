import React, {useCallback, useEffect} from "react";
import {controlState} from "./state/control-state.ts";

export const WindowListeners: React.FC = () => {
    const setMouseDown = useCallback((isMouseDown: boolean) => {
        controlState.isMouseDown = isMouseDown
    }, []);

    const recorder = controlState.recorder
    useEffect(() => {

            // spacebar has the lowest priority on starting/ending a recording

            const handleKeyUp = (event: KeyboardEvent) => {
                if (event.code == 'Space' && recorder.currentContext()?.triggeredBy === 'spacebar') {
                    recorder.done()
                }
            }

            const handleKeyDown = (event: KeyboardEvent) => {
                if (event.code === 'Space') {
                    if (event.repeat) {
                        console.debug('handleKeyDown skip repeated space');
                        return
                    }
                    if (!recorder.currentContext()?.triggeredBy) {
                        console.debug('handleKeyDown with not repeated space');
                        recorder.start({triggeredBy: 'spacebar'}).catch((e) => {
                            console.error("failed to start recorder", e)
                        })
                    }
                } else {
                    if (recorder.currentContext()?.triggeredBy === 'spacebar') {
                        // press any key other spacebar to cancel the recording
                        recorder.cancel()
                    }
                }
            };

            const handleMouseDown = () => {
                setMouseDown(true)
                console.debug("mouse is down")
            }

            const handleMouseUp = () => {
                setMouseDown(false)
                console.debug("mouse is up")
            }

            const handleBrowserBlur = () => {
                setMouseDown(false)
            }

            window.addEventListener("keydown", handleKeyDown);
            window.addEventListener("keyup", handleKeyUp);
            window.addEventListener("mousedown", handleMouseDown);
            window.addEventListener("mouseup", handleMouseUp);
            window.addEventListener("blur", handleBrowserBlur);

            return () => {
                window.removeEventListener("keydown", handleKeyDown);
                window.removeEventListener("keyup", handleKeyUp);
                window.removeEventListener("mousedown", handleMouseDown);
                window.removeEventListener("mouseup", handleMouseUp);
                window.removeEventListener("blur", handleBrowserBlur);
            }
        },
        [setMouseDown, recorder]
    )
    return null
}