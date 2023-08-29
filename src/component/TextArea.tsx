import React, {KeyboardEventHandler, useCallback, useRef, useState} from "react";
import {useInputStore, useSendingTextStore, useTextAreaStore} from "../state/Input.tsx";

const TextArea: React.FC = () => {
    const inputAreaIsLarge = useTextAreaStore((state) => state.inputAreaIsLarge)
    const buttonRef= useRef(null);

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

    const handleClick = () => {
        useTextAreaStore.setState({inputAreaIsLarge: !inputAreaIsLarge})
        if (buttonRef) {
            buttonRef!.current!.blur();
        }
    };


    return (<div className="flex flex-col items-center w-full mt-auto bottom-0 max-w-4xl backdrop-blur bg-opacity-75">
            <button
                ref={buttonRef}
            className="rounded-full bg-equal-200 flex items-center justify-center w-10 -mb-1 "
                    onClick={handleClick}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" className="text-equal-400 w-6 h-6 mb-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d={inputAreaIsLarge ? "M19.5 8.25l-7.5 7.5-7.5-7.5" : "M4.5 15.75l7.5-7.5 7.5 7.5"}/>
                </svg>
            </button>
            <div className="flex w-full">
                    <textarea
                        className="w-full outline-0 rounded-lg resize-none bg-equal-200 pl-2 py-1 mt-auto "
                        rows={inputAreaIsLarge ? 8 : 2}
                        onKeyUp={stopPropagation}
                        value={inputText}
                        onChange={(e) => useInputStore.setState({inputText: e.target.value})}
                        onKeyDown={handleKeyDown}
                        onCompositionStart={handleCompositionStart}
                        onCompositionEnd={handleCompositionEnd}
                        placeholder="Message"/>

                <button
                    className="-ml-8 mb-1 self-end capitalize text-equal-700 "
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
