import React, {useCallback, useEffect, useState} from 'react';
import {RecordingCtx, controlState} from "../../state/control-state.ts";
import {cx, timeElapsedMMSS} from "../../util/util.tsx";

type Props = {
    chatId: string
}

const Recorder: React.FC<Props> = ({chatId}) => {

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
        recorder.addStartListener(startListener);
        recorder.addDoneListener(doneListener);
        recorder.addCancelListener(cancelListener);
        return () => {
            recorder.removeStartListener(startListener);
            recorder.removeDoneListener(doneListener);
            recorder.removeCancelListener(cancelListener);
        }
    }, [recorder, setIsRecording, setContext, chatId]);

    // create an interval to increase recording time
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (isRecording) {
            interval = setInterval(() => {
                setRecordDuration(recorder.currentRecordingDuration())
            }, 50);
        }
        return () => {
            if (interval) {
                clearInterval(interval)
            }
        };
    }, [isRecording, recorder, setRecordDuration]);

    const handleClickStart = useCallback(() => {
        console.debug('handleClickStart');
        recorder.start({triggeredBy: 'click'}).catch((e) => {
                console.error("failed to start recorder", e)
            }
        )
    }, [recorder])

    const handleClickDone = useCallback(() => {
        console.debug('handleClickDone');
        recorder.done()
    }, [recorder])

    // todo add a button for handleClickCancel
    // const handleClickCancel = useCallback(() => {
    //     console.debug('handleClickDone');
    //     if (recorder.currentContext()?.triggeredBy === 'click') {
    //         recorder.done()
    //     }
    // }, [])

    const handleTouchStart = useCallback(() => {
        console.debug('handleTouchStart');
        recorder.start({triggeredBy: 'touch'}).catch((e) => {
            console.error("failed to start recorder", e)
        })
    }, [recorder])

    const handleTouchEnd = useCallback(() => {
        console.debug('handleTouchEnd');
        if (recorder.currentContext()?.triggeredBy === 'touch') {
            recorder.done()
        }
    }, [recorder])

    const handleTouchCancel = useCallback(() => {
        console.debug('handleTouchCancel');
        if (recorder.currentContext()?.triggeredBy === 'touch') {
            recorder.cancel()
        }
    }, [recorder])

    return <div onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchCancel}
                className="rounded-lg w-full select-none">
        {/* when not recording*/}
        <div
            onClick={handleClickStart}
            className={cx("flex gap-3 justify-center items-center", isRecording ? "hidden" : "")}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                 stroke="currentColor" className="w-7 h-7 text-neutral-600">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/>
            </svg>
            <div className="prose text-lg text-neutral-600">
                Hold <span className="hidden sm:inline rounded-md text-neutral-700 bg-white opacity-70 px-1.5">Spacebar</span> to
                speak
            </div>
        </div>
        {/* when recording*/}
        <div
            onClick={handleClickDone}
            className={cx("flex justify-evenly items-center", isRecording ? "" : "hidden")}>
            <div
                className={"hidden sm:block overflow-hidden whitespace-nowrap text-neutral-500 text-sm bg-white rounded-full px-2 " + (context?.triggeredBy === 'spacebar' ? '' : 'hidden')}>
                Press any key to <div className="inline text-red-400">cancel</div>
            </div>
            <div className="flex justify-center items-center">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                         className="w-7 h-7 text-rose-500">
                        <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z"/>
                        <path
                            d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z"/>
                    </svg>
                </div>
                <p className="prose text-xl text-rose-500 rounded-lg px-2">
                    {timeElapsedMMSS(recordDuration)}
                </p>
            </div>
            <div
                className={"hidden sm:block overflow-hidden whitespace-nowrap text-neutral-500 text-sm bg-white rounded-full px-2 " + (context?.triggeredBy === 'spacebar' ? '' : 'hidden')}>
                Release to <div className="inline text-blue-500">send</div>
            </div>
        </div>
    </div>
}

export default Recorder;

