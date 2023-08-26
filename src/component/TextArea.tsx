import React, {KeyboardEventHandler, useCallback, useState} from "react";
import {timeElapsedMMSS} from "../Util.tsx";
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

    return (<div className="flex flex-col items-center w-full mt-auto bottom-0 max-w-2xl backdrop-blur bg-opacity-75">
            <button
                className={"rounded-full bg-slate-200 flex items-center justify-center w-10 -mb-1 "
                    + (isRecording ? 'hidden' : '')}
                onClick={() => useTextAreaStore.setState({inputAreaIsLarge: !inputAreaIsLarge})}
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
                        onKeyUp={stopPropagation}
                        value={inputText}
                        onChange={(e) => useInputStore.setState({inputText: e.target.value})}
                        onKeyDown={handleKeyDown}
                        onCompositionStart={handleCompositionStart}
                        onCompositionEnd={handleCompositionEnd}
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
                                <div className="prose text-slate-500 bg-white rounded-full px-2">
                                    Release to <div className="inline text-blue-500">send</div>
                                </div>
                            </div>
                        </div>
                        <div className="w-1/2">
                            <div className="flex ml-10">
                                <div className="prose text-slate-500 bg-white rounded-full px-2">
                                    Press any key to <div className="inline text-red-400">cancel</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    className={"-ml-8 mb-1 self-end capitalize text-slate-700 " + (isRecording ? 'hidden' : '')}
                    onClick={sendAndClearText}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                         stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default TextArea;
