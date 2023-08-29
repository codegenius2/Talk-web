import React, {KeyboardEventHandler, useCallback, useState} from "react";
import {timeElapsedMMSS} from "../util/Util.tsx";
import {useRecorderStore} from "../state/Recording.tsx";
import {useInputStore, useSendingTextStore, useTextAreaStore} from "../state/Input.tsx";

const TextArea: React.FC = () => {
    const isRecording = useRecorderStore((state) => state.isRecording)
    const inputAreaIsLarge = useTextAreaStore((state) => state.inputAreaIsLarge)
    const recordDuration = useRecorderStore<number>((state) => state.duration)

    const stopPropagation = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        console.log('stopPropagation', event.code);
        event.stopPropagation();
    };

    const inputText = useInputStore((state) => state.inputText)

    // if user is typing in a composing way
    const [isComposing, setIsComposing] = useState(false);

    const sendAndClearText = () => {
        const it = useInputStore.getState().inputText
        if (it) {
            useSendingTextStore.setState({sendingText: it})
        }
        useInputStore.setState({inputText: ""})
    }

    const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = useCallback((event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && !isComposing) {
            event.preventDefault(); // prevent new line action
            sendAndClearText();
        } else {
            event.stopPropagation();
        }
    }, []);

    const handleCompositionStart = () => {
        setIsComposing(true);
    };

    const handleCompositionEnd = () => {
        setIsComposing(false);
    };

    return (<div className="flex flex-col items-center w-full mt-auto bottom-0 max-w-4xl backdrop-blur bg-opacity-75">
            <button
                className={"rounded-full bg-equal-200 flex items-center justify-center w-10 -mb-1 "
                    + (isRecording ? 'hidden' : '')}
                onClick={() => useTextAreaStore.setState({inputAreaIsLarge: !inputAreaIsLarge})}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" className="text-equal-400 w-6 h-6 mb-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d={inputAreaIsLarge ? "M19.5 8.25l-7.5 7.5-7.5-7.5" : "M4.5 15.75l7.5-7.5 7.5 7.5"}/>
                </svg>
            </button>
            <div className="flex w-full">
                    <textarea
                        className={"w-full outline-0 rounded-lg resize-none bg-equal-200 pl-2 py-1 mt-auto "
                            + (isRecording ? 'hidden' : '')}
                        rows={inputAreaIsLarge ? 8 : 2}
                        onKeyUp={stopPropagation}
                        value={inputText}
                        onChange={(e) => useInputStore.setState({inputText: e.target.value})}
                        onKeyDown={handleKeyDown}
                        onCompositionStart={handleCompositionStart}
                        onCompositionEnd={handleCompositionEnd}
                        placeholder="Message"/>
                <div
                    className={"flex flex-col justify-center items-center w-full outline-0 rounded-lg h-20 resize-none bg-equal-200 py-1 mt-auto "
                        + (isRecording ? '' : 'hidden')}>
                    <p className="prose text-2xl  text-red-400 bg-white rounded-lg px-2">
                        {timeElapsedMMSS(recordDuration)}
                    </p>
                    <div className="flex justify-between items-center w-full">
                        <div className="w-1/2">
                            <div className="flex justify-end mr-10 md:mr-20">
                                <div className="prose text-equal-500">
                                    Release to <div className="inline text-blue-500">send</div>
                                </div>
                            </div>
                        </div>
                        <div className="w-1/2">
                            <div className="flex ml-10 md:ml-20">
                                <div className="prose text-equal-500">
                                    Press any key to <div className="inline text-red-400">cancel</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    className={"-ml-8 mb-1 self-end capitalize text-equal-700 " + (isRecording ? 'hidden' : '')}
                    onClick={sendAndClearText}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                         stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
                    </svg>
                </button>
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 m-[2px] md:left-auto">
                    <div
                        className="bg-black bg-opacity-10 backdrop-blur backdrop-filter md:bg-opacity-0  flex items-stretch justify-end rounded-t-[10px] px-3 py-1 md:m-1 md:rounded-lg">
                        <button
                            className="bg-white bg-opacity-0  hover:bg-opacity-10 pointer-events-auto mr-1 flex rounded-md px-3 py-2 text-xs font-medium  text-white  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-50">Preview
                        </button>
                        <button
                            className="bg-white bg-opacity-[0.15] pointer-events-auto flex rounded-md px-3 py-2 text-xs font-medium   text-white  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-50">Code
                        </button>
                        <div className="my-2 mx-1 w-[2px] grow-0 bg-white bg-opacity-10"></div>
                        <button
                            className="bg-white bg-opacity-0 hover:bg-opacity-10 pointer-events-auto relative rounded-md px-4 py-2 text-xs font-medium  text-white  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-50">
                            <span className="">Copy</span><span
                            className="opacity-0 absolute inset-0 flex items-center justify-center">Copied!</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TextArea;
