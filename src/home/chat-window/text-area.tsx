import React, {KeyboardEventHandler, useCallback, useEffect, useRef, useState} from "react"
import {useSnapshot} from "valtio/react"
import {appState, Chat} from "../../state/app-state.ts"
import {controlState, SendMessageOption} from "../../state/control-state.ts"
import {cx} from "../../util/util.tsx"
import {searchLinuxTerminalHistoryPotision} from "../../data-structure/message.tsx";
import {bestModel, matchKeyCombo} from "../../state/shortcuts.ts";
import IosSpinner from "../../assets/svg/ios-spinner.svg?react"

type Props = {
    chatProxy: Chat
}


const largeTextAreaMinHeight = "min-h-96"
const smallTextAreaMinHeight = "min-h-24"
const smallTextAreaMinHeightRem = "6rem"

const TextArea: React.FC<Props> = ({chatProxy}) => {
    // console.info("TextArea rendered", new Date().toLocaleString())
    const {inputText, option} = useSnapshot(chatProxy, {sync: true})
    const {showMarkdown} = useSnapshot(appState.pref)

    const [inputAreaIsLarge, setInputAreaIsLarge] = useState(false)
    const arrowButtonRef = useRef<HTMLButtonElement>(null)
    const sendButtonRef = useRef<HTMLButtonElement>(null)
    const textAreaRef = useRef<HTMLTextAreaElement>(null)
    // if user is typing in a composing way
    const [isComposing, setIsComposing] = useState(false)
    const [linuxTerminalHistoryIndex, setLinuxTerminalHistoryIndex] = useState(-1)

    const stopSpacePropagation = useCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === ' ') {
            event.stopPropagation()
        }
    }, [])

    const autoGrowHeight = useCallback((e: React.BaseSyntheticEvent) => {
        e.currentTarget.style.height = "auto"
        e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`
    }, [])

    const resetHeight = useCallback(() => {
        if (textAreaRef.current) {
            textAreaRef.current.focus()
            textAreaRef.current.style.height = `0px`
        }
    }, [])

    // eslint-disable-next-line valtio/state-snapshot-rule
    const sendAndClearText = useCallback((option?: SendMessageOption) => {
        if (sendButtonRef.current) {
            sendButtonRef.current.blur()
        }
        if (chatProxy.inputText) {
            // eslint-disable-next-line valtio/state-snapshot-rule
            controlState.sendingMessages.push({chatId: chatProxy.id, text: chatProxy.inputText, option: option})
            controlState.sendingMessageSignal++
            chatProxy.inputText = ""
        }
        // reset window size of <textarea> after clearing text
        resetHeight()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = useCallback((event) => {

        if (event.key === ' ' || event.key === 'Escape') {
            event.stopPropagation()
        }

        // never interrupt composing
        if (isComposing) {
            setLinuxTerminalHistoryIndex(-1)
            return
        }

        // search history or reset history
        if (event.key === 'ArrowUp' || (event.key === "p" && event.ctrlKey)) {
            const [res, newIndex] = searchLinuxTerminalHistoryPotision(chatProxy.messages,
                linuxTerminalHistoryIndex,
                chatProxy.inputText,
                "up")
            if (newIndex !== -1) {
                chatProxy.inputText = res
            }
            setLinuxTerminalHistoryIndex(newIndex)
            return
        } else if (event.key === 'ArrowDown' || (event.key === "n" && event.ctrlKey)) {
            const [res, newIndex] = searchLinuxTerminalHistoryPotision(chatProxy.messages,
                linuxTerminalHistoryIndex,
                chatProxy.inputText,
                "down")
            if (newIndex !== -1) {
                chatProxy.inputText = res
            }
            setLinuxTerminalHistoryIndex(newIndex)
            return
        } else {
            setLinuxTerminalHistoryIndex(-1)
        }

        if (event.key === 'Escape') {
            if (textAreaRef.current) {
                textAreaRef.current!.blur()
            }
        } else {
            const sc = appState.pref.shortcuts
            if (matchKeyCombo(sc.newLine, event)) {
                if (event.key === 'Enter' && !event.ctrlKey && !event.metaKey && !event.altKey) {
                    // try our best to use native 'new-line', in order to preserve edit stack(ctrl/cmd + z)
                } else {
                    event.preventDefault()
                    const target = event.currentTarget
                    const caretPosition = target.selectionStart;
                    target.value =
                        target.value.slice(0, caretPosition) +
                        "\n" +
                        target.value.slice(caretPosition);
                    setTimeout(() => target.selectionStart = target.selectionEnd = caretPosition + 1)
                }
            } else if (matchKeyCombo(sc.send, event)) {
                sendAndClearText()
                event.preventDefault()
            } else if (matchKeyCombo(sc.sendWithBestModel, event)) {
                sendAndClearText({model: bestModel})
                event.preventDefault()
            } else if (matchKeyCombo(sc.sendZeroAttachedMessage, event)) {
                sendAndClearText({ignoreAttachedMessage: true})
                event.preventDefault()
            } else if (matchKeyCombo(sc.sendWithBestModelAndZeroAttachedMessage, event)) {
                sendAndClearText({
                    ignoreAttachedMessage: true,
                    model: bestModel
                })
                event.preventDefault()
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isComposing, linuxTerminalHistoryIndex, sendAndClearText])

    const handleCompositionStart = useCallback(() => {
        setIsComposing(true)
    }, [])

    const handleCompositionEnd = useCallback((e: React.CompositionEvent<HTMLTextAreaElement>) => {
        chatProxy.inputText = e.currentTarget.value
        console.debug("composition ended")
        setIsComposing(false)
    }, [chatProxy])

    const handleClick = useCallback(() => {
        if (inputAreaIsLarge && textAreaRef.current) {
            const current = textAreaRef.current
            current.style.height = smallTextAreaMinHeightRem
        }
        setInputAreaIsLarge(!inputAreaIsLarge)
        arrowButtonRef.current?.blur()
    }, [inputAreaIsLarge])

    useEffect(() => {
        if (inputAreaIsLarge) {
            textAreaRef.current?.focus()
        } else {
            textAreaRef.current?.blur()
        }
    }, [inputAreaIsLarge])


    return (<div className="flex flex-col items-center w-full mt-auto bottom-0 max-w-4xl">
            <div className="relative flex items-center justify-center w-full">
                <div className="absolute left-2 flex items-center gap-1.5">
                    <p className={cx("flex text-sm rounded-full w-5 h-5 items-center cursor-pointer",
                        "justify-center select-none",
                        option.llm.maxAttached > 0 ? "bg-blue-600/[0.8] text-neutral-100" : "text-violet-100 bg-white bg-opacity-20"
                    )}
                       onClick={() => {
                           if (chatProxy.option.llm.maxAttached > 0) {
                               chatProxy.option.llm.maxAttached = 0
                           } else {
                               chatProxy.option.llm.maxAttached = 4
                           }
                       }
                       }
                    >
                        {option.llm.maxAttached === Number.MAX_SAFE_INTEGER ? '∞' : option.llm.maxAttached}
                    </p>
                    <p className={cx("flex text-[11px] rounded-full w-5 h-5 items-center",
                        " cursor-pointer justify-center select-none",
                        showMarkdown ? "bg-blue-600/[0.8] text-neutral-100" : "text-violet-100 bg-white bg-opacity-20"
                    )}
                       onClick={() => appState.pref.showMarkdown = !appState.pref.showMarkdown}
                    >MD </p>
                    <TextPendingIcon/>
                </div>
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
            </div>
            <div className="relative flex w-full">
                    <textarea
                        name={"Message Input"}
                        ref={textAreaRef}
                        className={cx("w-full outline-none rounded-xl resize-none bg-white pl-2 py-1 lg:p-3 mt-auto",
                            "placeholder:text-neutral-500 placeholder:select-none max-h-96 transition-all duration-150",
                            inputAreaIsLarge ? largeTextAreaMinHeight : smallTextAreaMinHeight
                        )}
                        value={inputText}
                        onInput={autoGrowHeight}
                        onChange={(e) => {
                            e.persist()
                            chatProxy.inputText = e.target.value
                        }}
                        onKeyDown={handleKeyDown}
                        onKeyUp={stopSpacePropagation}
                        onCompositionStart={handleCompositionStart}
                        onCompositionEnd={handleCompositionEnd}
                        placeholder="Message"/>
                <button
                    ref={sendButtonRef}
                    className="-ml-8 mb-1 self-end capitalize text-neutral-600 "
                    onClick={() => sendAndClearText()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                         stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
                    </svg>
                </button>
            </div>
        </div>
    )
}

const TextPendingIcon = () => {

    const {isTextPending} = useSnapshot(controlState)

    return (
        <div className={cx("flex rounded-full w-5 h-5 items-center",
            "select-none transform duration-200 ",
            isTextPending ? "opacity-100" : "opacity-0")}>
            <IosSpinner className={"stroke-white"}/>
        </div>

    )
}


export default TextArea
