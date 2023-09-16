import React, {KeyboardEventHandler, useCallback, useEffect, useRef, useState} from "react";
import {useSnapshot} from "valtio/react";
import {Chat} from "../../state/app-state.ts";
import {controlState} from "../../state/control-state.ts";
import {cx} from "../../util/util.tsx";

type Props = {
    chatProxy: Chat
}
const transparentPL = 'My Placeholder'

const TextArea: React.FC<Props> = ({chatProxy}) => {
        const chatSnap = useSnapshot(chatProxy)

        const [inputAreaIsLarge, setInputAreaIsLarge] = useState(false)
        const arrowButtonRef = useRef<HTMLButtonElement>(null);
        const sendButtonRef = useRef<HTMLButtonElement>(null);
        const textAreaRef = useRef<HTMLTextAreaElement>(null);
        // if user is typing in a composing way
        const [isComposing, setIsComposing] = useState(false);
        const [text, setText] = useState(transparentPL)

        // avoid using <textarea value={chatSnap.inputText}> as it inexplicably disrupts the composition of input.
        // restore input text on mount
        useEffect(() => {
            // eslint-disable-next-line valtio/state-snapshot-rule
            setText(chatSnap.inputText)
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        const stopPropagation = useCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
            console.debug('stopPropagation', event.code);
            event.stopPropagation();
        }, []);

        const sendAndClearText = useCallback(() => {
            if (sendButtonRef.current) {
                sendButtonRef.current.blur()
            }
            if (chatProxy.inputText) {
                controlState.sendingMessages.push({chatId: chatSnap.id, text: chatSnap.inputText})
                controlState.sendingMessageSignal++
                setText("")
            }
            textAreaRef.current?.focus()
        }, [chatProxy, chatSnap.id, chatSnap.inputText])

        const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = useCallback((event) => {
            event.stopPropagation();
            if (isComposing) {
                return
            } else if ((event.ctrlKey || event.metaKey) && event.code === 'Enter') {
                sendAndClearText();
            } else if (event.code === 'Escape') {
                if (textAreaRef.current) {
                    textAreaRef.current!.blur()
                }
            }
        }, [isComposing, sendAndClearText]);

        const handleCompositionStart = useCallback(() => {
            console.debug("is composing")
            setIsComposing(true);
        }, []);

        const handleCompositionEnd = useCallback(() => {
            console.debug("is not composing")
            setIsComposing(false);
        }, []);

        const handleClick = useCallback(() => {
            setInputAreaIsLarge(!inputAreaIsLarge)
            if (arrowButtonRef) {
                arrowButtonRef!.current!.blur();
            }
        }, [inputAreaIsLarge]);

        useEffect(() => {
            if (inputAreaIsLarge) {
                textAreaRef.current?.focus()
            } else {
                textAreaRef.current?.blur()
            }
        }, [inputAreaIsLarge])

        const autoGrowHeight = (e: React.BaseSyntheticEvent) => {
            e.persist()
            e.currentTarget.style.height = "5px"
            e.currentTarget.style.height = e.currentTarget.scrollHeight + "px"
        }

        useEffect(() => {
            if (text !== transparentPL) {
                chatProxy.inputText = text
            }
        }, [chatProxy, text]);

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
                        ref={textAreaRef}
                        className={cx("w-full outline-0 rounded-xl resize-none bg-white pl-2 py-1 lg:p-3 mt-auto",
                            "placeholder:text-neutral-500 placeholder:select-none min-h-24 max-h-[30rem]",
                            text === transparentPL && "text-transparent")}
                        onKeyUp={stopPropagation}
                        value={text}
                        onInput={autoGrowHeight}
                        onChange={(e) => {
                            setText(e.target.value)
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
