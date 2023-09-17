import React, {useCallback, useEffect} from "react";
import {controlState} from "./state/control-state.ts";

export const WindowListeners: React.FC = () => {
    const setMouseDown = useCallback((isMouseLeftDown: boolean) => {
        controlState.isMouseLeftDown = isMouseLeftDown
    }, []);

    const recorder = controlState.recorder
    useEffect(() => {

            // spacebar has the lowest priority on starting/ending a recording

            const handleKeyUp = (event: KeyboardEvent) => {
                if (event.key == ' ' && recorder.currentContext()?.triggeredBy === 'spacebar') {
                    recorder.done()
                }
            }

            const handleKeyDown = (event: KeyboardEvent) => {
                if (event.key === ' ') {
                    if (event.repeat) {
                        return
                    }
                    if (!recorder.currentContext()?.triggeredBy) {
                        console.debug('handleKeyDown with not repeated space');
                        recorder.start({triggeredBy: 'spacebar'})
                            .then(() => {
                                console.debug("then")
                            })
                            .catch((e) => {
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

            const handleMouseDown = (event: MouseEvent) => {
                if (event.button === 0) {
                    setMouseDown(true)
                    console.debug("mouse left is down")
                }
            }

            const handleMouseUp = (event: MouseEvent) => {
                if (event.button === 0) {
                    setMouseDown(false)
                    console.debug("mouse left is up")
                }
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