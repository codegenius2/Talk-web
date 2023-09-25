import {appState, Chat, currentChatProxy} from "../../state/app-state.ts"
import TextArea from "./text-area.tsx"
import Recorder from "./recorder.tsx"
import React, {useEffect, useRef, useState} from "react"
import {subscribeKey} from "valtio/utils"
import {MessageList} from "./message-list/message-list.tsx"
import {PromptAttached} from "./prompt-attached.tsx"
import {cx} from "../../util/util.tsx"
import {useSnapshot} from "valtio/react"
import {layoutState} from "../../state/layout-state.ts"
import {throttle} from "lodash"
import {PromptoryButton} from "./compnent/promptory-button.tsx"


export const ChatWindow: React.FC = () => {

    const [chatProxy, setChatProxy] = useState<Chat | undefined>(undefined)
    // console.info("ChatWindow rendered", new Date().toLocaleString())
    const buttonRef = useRef<HTMLDivElement>(null)

    const {isPromptoryFloating, isPromptoryPinning} = useSnapshot(layoutState)

    useEffect(() => {
        const callback = () => {
            const cp = currentChatProxy()
            setChatProxy(cp)
        }
        const unsubscribe = subscribeKey(appState, "currentChatId", callback)
        callback()
        return unsubscribe
    }, [])


    const handleMouseMove = throttle((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            const [x, y] = [(rect.left + 18), (rect.top + 18)]
            layoutState.promptoryButtonDistance = Math.hypot(x - event.clientX, y - event.clientY)
        }
    }, 50)

    return (
        <div
            onMouseMove={handleMouseMove}
            className={cx("relative flex flex-col max-w-4xl rounded-xl w-full h-full items-center transition duration-200",
                isPromptoryFloating || isPromptoryPinning ? "bg-opacity-0" : "bg-opacity-40 backdrop-blur bg-neutral-200"
            )}>
            {chatProxy !== undefined &&
                <>
                    <div ref={buttonRef} className="flex justify-center">
                        <PromptoryButton/>
                    </div>
                    <div
                        className={cx("flex flex-col items-center w-full",
                            "transition-all duration-300",
                            isPromptoryFloating || isPromptoryPinning ? "h-full mb-10" : "h-0",
                            isPromptoryPinning && "min-h-full max-h-full"
                        )}>
                        <PromptAttached chatProxy={chatProxy} key={chatProxy.id}/>
                    </div>

                    <div
                        className="flex flex-col items-center w-full h-full justify-between gap-1 pb-2 px-2">
                        <>
                            <MessageList chatProxy={chatProxy} key={chatProxy.id}/>
                            <div
                                className="bottom-0 mt-auto flex w-full flex-col items-center gap-2 rounded-xl px-2">
                                <TextArea chatProxy={chatProxy} key={chatProxy.id}/>
                                <div className="flex w-full items-center justify-center">
                                    <Recorder chatId={chatProxy.id}/>
                                </div>
                            </div>
                        </>
                    </div>
                </>
            }
        </div>

    )
}

