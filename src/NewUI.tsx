import './App.css'
import {useLayoutEffect, useRef, useState} from "react";
import myAudio from './assets/hello_en_gb_1.mp3';
import AudioUI from "./AudioUI.tsx";

export default function NewUI() {
    const [inputAreaIsLarge, setInputAreaIsLarge] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (scrollRef.current) {
            const {scrollHeight} = scrollRef.current;
            scrollRef.current.scrollTop = scrollHeight;
        }
    }, [inputAreaIsLarge]);

    return (
        <div className="flex flex-col items-center justify-between h-screen gap-1 p-1 overflow-hidden" id="container">
            {/*crucial; don't merge the following 2 divs*/}
            <div className="overflow-auto w-full max-w-2xl " ref={scrollRef}>
                <div className="flex flex-col gap-3 rounded-lg w-full justify-end max-w-2xl">
                    {[1, 2].map((i) =>
                        <div className="flex flex-col gap-1 mr-2" id="message-list" key={i}>
                            <div
                                className="rounded-full self-end w-auto text-sm text-violet-100 bg-blue-600 px-2 py-1.5">
                                <p>Hello Hello Hello</p>
                            </div>
                            <div
                                className="rounded-lg self-end text-sm text-neutral-900 w-1/2">
                                <AudioUI url={myAudio} audioIndex={100+i} self={true}/>
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
                <button className="rounded-full bg-slate-200 flex items-center justify-center w-10 -mb-1 "
                        onClick={() => setInputAreaIsLarge(!inputAreaIsLarge)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="text-slate-400 w-6 h-6 mb-0.5">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d={inputAreaIsLarge ? "M19.5 8.25l-7.5 7.5-7.5-7.5" : "M4.5 15.75l7.5-7.5 7.5 7.5"}/>
                    </svg>
                </button>
                <div className="flex w-full">
                        <textarea
                            className="w-full outline-0 rounded-lg resize-none bg-slate-200 pl-2 py-1 mt-auto"
                            rows={inputAreaIsLarge ? 8 : 2}
                            placeholder="Message"/>
                    <button className="-ml-10 self-end bottom-1.5 right-1.5 capitalize text-slate-700">
                        Send
                    </button>
                </div>

            </div>
        </div>
    )
}
