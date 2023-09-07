import React, {useCallback, useEffect, useState} from "react";
import {Chat, useChatStore} from "../../../state/chat.tsx";
import {Preview} from "./preview.tsx";
import {useMouseStore} from "../../../state/mouse.tsx";


type Props = {
    chat: Chat
}
export const ChatComponent: React.FC<Props> = ({chat}) => {
    const currentChatId = useChatStore(state => state.currentChatId)
    const setCurrentChatId = useChatStore(state => state.setCurrentChatId)
    const [selected, setSelected] = useState(false)
    const [over, setOver] = useState(false)
    const removeChat = useChatStore(state => state.removeChat)
    const clearMessages = useChatStore(state => state.clearMessages)
    const isMouseDown = useMouseStore(state => state.isMouseDown)

    useEffect(() => {
        setSelected(currentChatId === chat.id)
    }, [currentChatId, chat]);

    const rmChat = useCallback(() => {
        removeChat(chat.id)
        clearMessages(chat.id)
        if (currentChatId == chat.id) {
            setCurrentChatId("")
        }
    }, [removeChat, chat, clearMessages, currentChatId, setCurrentChatId]);

    return (
        <div className="relative w-full h-full flex gap-1 justify-between items-center"
             onMouseOver={() => setOver(true)}
             onMouseLeave={() => setOver(false)}
             onMouseDown={() => setCurrentChatId(chat.id)}
             onMouseUp={() => setCurrentChatId(chat.id)}
             onMouseEnter={() => isMouseDown && setCurrentChatId(chat.id)}
        >
            <div
                className={`w-full pl-3 pr-10 py-1 gap-y-0.5 flex-col h-14 font-medium text-neutral-800 rounded-lg 
             ${selected ? " bg-white bg-opacity-90" : "bg-white bg-opacity-40 hover:bg-neutral-100 hover:bg-opacity-70 "}`}
            >
                <div className="">
                    <p className="w-auto break-keep">{chat.name}</p>
                </div>
                <div className="">
                    <div className="w-auto text-sm text-neutral-600">
                        <Preview chat={chat}/>
                    </div>
                </div>
            </div>
            {over && <div
                className="absolute right-2 text-neutral-500 rounded-lg p-0.5 hover:text-neutral-100 hover:bg-neutral-500/[0.4]"
                onClick={rmChat}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2}
                     stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </div>}

        </div>
    )
}
