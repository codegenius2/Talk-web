import React, {KeyboardEventHandler, useCallback, useEffect, useRef, useState} from "react";
import {useSnapshot} from "valtio/react";
import {Chat} from "../../state/app-state.ts";
import {controlState} from "../../state/control-state.ts";
import {cx} from "../../util/util.tsx";

type Props = {
    chatProxy: Chat
}

const largeTextAreaMinHeight = "min-h-96"
const smallTextAreaMinHeight = "min-h-24"
const smallTextAreaMinHeightRem = "6rem"

const TextArea: React.FC<Props> = ({chatProxy}) => {
        const chatSnap = useSnapshot(chatProxy)
        const {inputText} = useSnapshot(chatProxy, {sync: true})

        const [inputAreaIsLarge, setInputAreaIsLarge] = useState(false)
        const arrowButtonRef = useRef<HTMLButtonElement>(null);
        const sendButtonRef = useRef<HTMLButtonElement>(null);
        const textAreaRef = useRef<HTMLTextAreaElement>(null);
        // if user is typing in a composing way
        const [isComposing, setIsComposing] = useState(false);

        const stopPropagation = useCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
            console.debug('stopPropagation', event.key);
            event.stopPropagation();
        }, []);

        const sendAndClearText = useCallback(() => {
            if (sendButtonRef.current) {
                sendButtonRef.current.blur()
            }
            if (chatProxy.inputText) {
                controlState.sendingMessages.push({chatId: chatSnap.id, text: chatSnap.inputText})
                controlState.sendingMessageSignal++
                chatProxy.inputText = ""
            }
            textAreaRef.current?.focus()
        }, [chatProxy, chatSnap.id, chatSnap.inputText])

        const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = useCallback((event) => {
            event.stopPropagation();
            if (isComposing) {
                return
            } else if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                sendAndClearText();
            } else if (event.key === 'Escape') {
                if (textAreaRef.current) {
                    textAreaRef.current!.blur()
                }
            }
        }, [isComposing, sendAndClearText]);

        const handleCompositionStart = useCallback(() => {
            console.debug("is composing")
            setIsComposing(true);
        }, []);

        const handleCompositionEnd = useCallback((e: React.CompositionEvent<HTMLTextAreaElement>) => {
            chatProxy.inputText = e.currentTarget.value
            console.debug("is not composing")
            setIsComposing(false);
        }, [chatProxy]);

        const handleClick = useCallback(() => {
            if (inputAreaIsLarge && textAreaRef.current) {
                const current = textAreaRef.current
                console.debug("max height", current.style.maxHeight)
                current.style.height = smallTextAreaMinHeightRem
            }
            setInputAreaIsLarge(!inputAreaIsLarge)
            arrowButtonRef.current?.blur();
        }, [inputAreaIsLarge]);

        useEffect(() => {
            if (inputAreaIsLarge) {
                textAreaRef.current?.focus()
            } else {
                textAreaRef.current?.blur()
            }
        }, [inputAreaIsLarge])

        const autoGrowHeight = (e: React.BaseSyntheticEvent) => {
            e.currentTarget.style.height = "auto";
            e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
            if (textAreaRef.current) {
                if (textAreaRef.current.scrollHeight > textAreaRef.current.clientHeight) {
                    setInputAreaIsLarge(true)
                }
            }
        }

        return (<div className="flex flex-col items-center w-full mt-auto bottom-0 max-w-4xl">
                <button
                    ref={arrowButtonRef}
                    className="rounded-full flex items-center justify-center w-10 -mb-1 "
                    onClick={handleClick}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="text-neutral-500 w-6 h-6 mb-0.5">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d={inputAreaIsLarge ? "M19.5 8.25l-7.5 7.5-7.5-7.5" : "M4.5 15.75l7.5-7.5 7.5 7.5"}/>
                    </svg>
                </button>
                <div className="flex w-full">
                    <textarea
                        name={"Message Input"}
                        ref={textAreaRef}
                        className={cx("w-full outline-none rounded-xl resize-none bg-white pl-2 py-1 lg:p-3 mt-auto",
                            "placeholder:text-neutral-500 placeholder:select-none max-h-96 transition-all duration-150",
                            inputAreaIsLarge ? largeTextAreaMinHeight : smallTextAreaMinHeight
                        )}
                        onKeyUp={stopPropagation}
                        value={inputText}
                        onInput={autoGrowHeight}
                        onChange={(e) => {
                            e.persist()
                            chatProxy.inputText = e.target.value
                        }}
                        onKeyDown={handleKeyDown}
                        onCompositionStart={handleCompositionStart}
                        onCompositionEnd={handleCompositionEnd}
                        placeholder="Message"/>

                    <button
                        ref={sendButtonRef}
                        className="-ml-8 mb-1 self-end capitalize text-neutral-600 "
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
    }
;

export default TextArea;
