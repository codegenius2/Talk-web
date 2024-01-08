import React, {useCallback, useEffect} from "react"
import {controlState} from "./state/control-state.ts"
import {useSnapshot} from "valtio/react";
import {appState} from "./state/app-state.ts";

export const WindowListeners: React.FC = () => {

    const {showRecorder} = useSnapshot(appState.pref)

    const setMouseDown = useCallback((isMouseLeftDown: boolean) => {
        controlState.isMouseLeftDown = isMouseLeftDown
    }, [])

    const recorder = controlState.recorder
    useEffect(() => {

            // spacebar has the lowest priority on starting/ending a recording
            const handleKeyUp = (event: KeyboardEvent) => {
                if (event.key == ' ' && recorder.currentContext()?.triggeredBy === 'spacebar') {
                    // prevent space from scrolling message list
                    event.preventDefault()
                    recorder.done()
                }
            }

            const handleKeyDown = (event: KeyboardEvent) => {
                if (event.key === ' ') {
                    // prevent space from scrolling message list
                    event.preventDefault()
                    if (event.repeat) {
                        return
                    }
                    if (!recorder.currentContext()?.triggeredBy) {
                        console.debug('handleKeyDown with not repeated space')
                        recorder.start({triggeredBy: 'spacebar'})
                            .then(() => {
                                return true
                            })
                            .catch((e) => {
                                console.error("failed to start recorder", e)
                                return true
                            })
                    }
                } else if (event.key === 'Escape') {
                    if (recorder.currentContext()) {
                        // press Escape to cancel the recording
                        recorder.cancel()
                    }
                } else {
                    if (recorder.currentContext()?.triggeredBy === 'spacebar') {
                        // press any key other spacebar to cancel the recording started by spacebar
                        recorder.cancel()
                    }
                }
            }

            const handleMouseDown = (event: MouseEvent) => {
                if (event.button === 0) {
                    setMouseDown(true)
                }
            }

            const handleMouseUp = (event: MouseEvent) => {
                if (event.button === 0) {
                    setMouseDown(false)
                }
            }

            const handleBrowserBlur = () => {
                setMouseDown(false)
                controlState.isWindowsBlurred = true
            }

            const handleBrowserFocus = () => {
                controlState.isWindowsBlurred = false
            }

            if (showRecorder) {
                window.addEventListener("keydown", handleKeyDown)
                window.addEventListener("keyup", handleKeyUp)
            }
            window.addEventListener("mousedown", handleMouseDown)
            window.addEventListener("mouseup", handleMouseUp)
            window.addEventListener("blur", handleBrowserBlur)
            window.addEventListener("focus", handleBrowserFocus)

            return () => {
                window.removeEventListener("keydown", handleKeyDown)
                window.removeEventListener("keyup", handleKeyUp)
                window.removeEventListener("mousedown", handleMouseDown)
                window.removeEventListener("mouseup", handleMouseUp)
                window.removeEventListener("blur", handleBrowserBlur)
                window.removeEventListener("focus", handleBrowserFocus)
            }
        },
        [setMouseDown, recorder, showRecorder]
    )
    return null
}