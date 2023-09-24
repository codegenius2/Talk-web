import React, {useCallback, useEffect, useState} from 'react'
import {controlState, RecordingCtx} from "../../state/control-state.ts"
import {cx, timeElapsedMMSS} from "../../util/util.tsx"
import {HiMiniMicrophone} from "react-icons/hi2"

type Props = {
    chatId: string
}

const Recorder: React.FC<Props> = ({chatId}) => {
    // console.info("Recorder rendered", new Date().toLocaleString())

    // These local variables monitor the recorder's state, updated through callbacks by the recorder itself.
    const [isRecording, setIsRecording] = useState(false)
    const [recordDuration, setRecordDuration] = useState(0)
    const [context, setContext] = useState<RecordingCtx | undefined>(undefined)

    const recorder = controlState.recorder

    useEffect(() => {
        const startListener = (ctx?: RecordingCtx) => {
            setContext(ctx)
            setIsRecording(true)
        }
        const doneListener = (blob: Blob, duration: number, ctx?: RecordingCtx) => {
            setContext(ctx)
            setIsRecording(false)

            controlState.sendingMessages.push(
                {
                    chatId: chatId,
                    text: "",
                    audioBlob: blob,
                    durationMs: duration
                }
            )
            controlState.sendingMessageSignal++
        }
        const cancelListener = (_blob: Blob, _duration: number, ctx?: RecordingCtx) => {
            setContext(ctx)
            setIsRecording(false)
        }
        recorder.addStartListener(startListener)
        recorder.addDoneListener(doneListener)
        recorder.addCancelListener(cancelListener)
        return () => {
            recorder.removeStartListener(startListener)
            recorder.removeDoneListener(doneListener)
            recorder.removeCancelListener(cancelListener)
        }
    }, [recorder, setIsRecording, setContext, chatId])

    // create an interval to increase recording time
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (isRecording) {
            interval = setInterval(() => {
                setRecordDuration(recorder.currentRecordingDuration())
            }, 50)
        }
        return () => {
            if (interval) {
                clearInterval(interval)
            }
        }
    }, [isRecording, recorder, setRecordDuration])

    const handleClickStart = useCallback(() => {
        console.debug('handleClickStart')
        recorder.start({triggeredBy: 'click'}).catch((e) => {
                console.error("failed to start recorder", e)
            }
        )
    }, [recorder])

    const handleClickDone = useCallback(() => {
        console.debug('handleClickDone')
        recorder.done()
    }, [recorder])

    const handleClickCancel = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation()
        if (recorder.currentContext()?.triggeredBy === 'click') {
            recorder.cancel()
        }
    }, [recorder])

    const handleTouchStart = useCallback(() => {
        console.debug('handleTouchStart')
        recorder.start({triggeredBy: 'touch'}).catch((e) => {
            console.error("failed to start recorder", e)
        })
    }, [recorder])

    const handleTouchEnd = useCallback(() => {
        console.debug('handleTouchEnd')
        if (recorder.currentContext()?.triggeredBy === 'touch') {
            recorder.done()
        }
    }, [recorder])

    const handleTouchCancel = useCallback(() => {
        console.debug('handleTouchCancel')
        if (recorder.currentContext()?.triggeredBy === 'touch') {
            recorder.cancel()
        }
    }, [recorder])

    return <div onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchCancel}
                className="w-full select-none rounded-lg">
        {/* when not recording*/}
        {isRecording ?
            <div
                onClick={handleClickDone}
                className="relative flex items-center justify-evenly">
                {context?.triggeredBy === "spacebar" &&
                    <div
                        className={cx("hidden sm:block overflow-hidden whitespace-nowrap text-neutral-500 text-sm " +
                            "bg-white rounded-full px-2")}>
                        Press any key to <div className="inline text-red-400">cancel</div>
                    </div>
                }
                <div className="flex items-center justify-center bg-neutral-100 rounded-lg px-2 py-1 ">
                    <div>
                        <HiMiniMicrophone className="h-7 w-7 text-rose-500"/>
                    </div>
                    <p className="rounded-lg px-2 text-xl prose text-rose-500">
                        {timeElapsedMMSS(recordDuration)}
                    </p>
                </div>
                {context?.triggeredBy === "spacebar" &&
                    <div
                        className={cx("hidden sm:block overflow-hidden whitespace-nowrap text-neutral-500 text-sm bg-white " +
                            "rounded-full px-2")}>
                        Release to <div className="inline text-blue-500">send</div>
                    </div>}
                {context?.triggeredBy === "click" &&
                    <div
                        onClick={handleClickCancel}
                        className={cx("absolute flex items-center right-0 h-full overflow-hidden whitespace-nowrap " +
                            "text-neutral-500 text-sm bg-white rounded-lg px-2")}>
                        <p className="text-neutral-500">Cancel</p>
                    </div>}
            </div>
            :
            <div
                onClick={handleClickStart}
                className="flex items-center justify-center gap-3  py-1 ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                     stroke="currentColor" className="h-7 w-7 text-neutral-600">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/>
                </svg>
                <div className="text-lg text-neutral-600 prose">
                    Hold <span
                    className="hidden rounded-md bg-white text-neutral-700 opacity-70 px-1.5 sm:inline">Spacebar</span> to
                    speak
                </div>
            </div>
        }
    </div>
}

export default Recorder

