import './App.css'
import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import myAudio from './assets/hello_en_gb_1.mp3';
import AudioUI from "./AudioUI.tsx";
import Recorder from "./Recorder.tsx";
import {useRecorderStore} from "./state/Recording.tsx";
import {MyRecorder} from "./MyRecorder.tsx";
import {timeElapsedMMSS} from "./Util.tsx";

export default function NewUI() {
    const [inputAreaIsLarge, setInputAreaIsLarge] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null);

    const isRecording = useRecorderStore((state) => state.isRecording)
    const recorder = useRecorderStore<MyRecorder>((state) => state.recorder)
    const recordDuration = useRecorderStore<number>((state) => state.duration)
    const incrRecordDuration = useRecorderStore((state) => state.incrDuration)
    const setRecordDuration = useRecorderStore((state) => state.setDuration)
    const [spacePressed, setSpacePressed] = useState<boolean>(false)
    const spacePressedRef = useRef(spacePressed);

    useLayoutEffect(() => {
        if (scrollRef.current) {
            const {scrollHeight} = scrollRef.current;
            scrollRef.current.scrollTop = scrollHeight;
        }
    }, [inputAreaIsLarge]);

    useEffect(() => {
        const interval = setInterval(() => {
            incrRecordDuration(1000)
        }, 1000);

        return () => {
            clearInterval(interval)
            setRecordDuration(0)
        };
    }, [isRecording]);

    useEffect(() => {
        spacePressedRef.current = spacePressed;
    }, [spacePressed]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            console.debug('handleKeyDown', event.code);
            if (event.code === 'Space') {
                if (event.repeat) {
                    console.debug('handleKeyDown skip repeated space');
                    return
                }
                setSpacePressed(true)
                recorder.start().catch((e) => {
                    console.error("failed to start recorder", e)
                })
            } else {
                if (spacePressedRef.current) {
                    recorder.cancel()
                }
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            console.debug('handleKeyUp', event.code);
            if (event.code == 'Space') {
                setSpacePressed(false)
                recorder.done()
            }
        };

        window.addEventListener("keyup", handleKeyUp);
        window.addEventListener("keydown", handleKeyDown);

        // 在组件卸载时移除事件监听器
        return () => {
            window.removeEventListener("keyup", handleKeyUp);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const stopPropagation = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        console.log('stopPropagation', event.code);
        event.stopPropagation();
    };

    return (
        <div className="flex flex-col items-center justify-between h-screen gap-1 p-1 overflow-hidden" id="container">

            {/*crucial; don't merge the following 2 divs*/}
            <div className="overflow-auto w-full max-w-2xl " ref={scrollRef}>
                <div className="flex flex-col gap-3 rounded-lg w-full justify-end max-w-2xl">
                    {[1, 2, 3, 4, 5, 6].map((i) =>
                        <div className="flex flex-col gap-1 mr-2" id="message-list" key={i}>
                            <div
                                className="rounded-full self-end w-auto text-sm text-violet-100 bg-blue-600 px-2 py-1.5">
                                <p>Hello Hello Hello</p>
                            </div>
                            <div
                                className="rounded-lg self-end text-sm text-neutral-900 w-1/2">
                                <AudioUI url={myAudio} audioIndex={100 + i} self={true}/>
                            </div>
                            <div
                                className="rounded-lg mr-20 text-sm text-neutral-900 bg-slate-200 px-2 py-0.5">
                                Hello<br/>How can I help you today?
                            </div>
                            <div
                                className="rounded-lg text-sm text-neutral-900 w-1/2">
                                <AudioUI url={myAudio} audioIndex={i} self={false}/>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col items-center w-full mt-auto bottom-0 max-w-2xl backdrop-blur bg-opacity-75">
                <button
                    className={"rounded-full bg-slate-200 flex items-center justify-center w-10 -mb-1 "
                        + (isRecording ? 'hidden' : '')}
                    onClick={() => setInputAreaIsLarge(!inputAreaIsLarge)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="text-slate-400 w-6 h-6 mb-0.5">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d={inputAreaIsLarge ? "M19.5 8.25l-7.5 7.5-7.5-7.5" : "M4.5 15.75l7.5-7.5 7.5 7.5"}/>
                    </svg>
                </button>
                <div className="flex w-full max-w-2xl">
                    <textarea
                        className={"w-full outline-0 rounded-lg resize-none bg-slate-200 pl-2 py-1 mt-auto "
                            + (isRecording ? 'hidden' : '')}
                        rows={inputAreaIsLarge ? 8 : 2}
                        onKeyDown={stopPropagation}
                        onKeyUp={stopPropagation}
                        placeholder="Message"/>
                    <div
                        className={"flex flex-col justify-center items-center w-full outline-0 rounded-lg h-20 resize-none bg-slate-200 py-1 mt-auto "
                            + (isRecording ? '' : 'hidden')}>
                        <p className="prose text-lg text-slate-800">
                            {timeElapsedMMSS(recordDuration)}
                        </p>
                        <div className="flex justify-between items-center w-full">
                            <div className="w-1/2">
                                <div className="flex justify-end mr-10">
                                    <div className="prose text-sm text-slate-500 bg-white rounded-full px-2">
                                        Release to <div className="inline text-blue-500">send</div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-1/2">
                                <div className="flex ml-10">
                                    <div className="prose text-sm text-slate-500 bg-white rounded-full px-2">
                                        Press any key to <div className="inline text-red-400">cancel</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        className={"-ml-8 mb-1 self-end capitalize text-slate-700 " + (isRecording ? 'hidden' : '')}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                             stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
                        </svg>
                    </button>
                </div>
                <div className="flex justify-center items-center w-full mt-1">
                    <Recorder/>
                </div>
            </div>
        </div>
    )
}
