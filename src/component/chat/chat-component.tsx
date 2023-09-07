import React, {useEffect, useState} from "react";
import {Chat, useChatStore} from "../../state/convs.tsx";
import {Preview} from "../chat/preview.tsx";


type Props = {
    chat: Chat
}
export const ChatComponent: React.FC<Props> = ({chat}) => {
    const currentChatId = useChatStore(state => state.currentChatId)
    const setCurrentChatId = useChatStore(state => state.setCurrentChatId)
    const [selected, setSelected] = useState(false)

    useEffect(() => {
        setSelected(currentChatId === chat.id)
    }, [currentChatId, chat]);

    return (
        <div
            className={`w-full flex-col h-14 font-medium text-neutral-800 rounded-lg  ${selected ? " bg-white bg-opacity-90" : "bg-white bg-opacity-40 hover:bg-neutral-100 hover:bg-opacity-70 "}`}
            onClick={() => setCurrentChatId(chat.id)}
        >
            <div className="px-3 py-1">
                <div className="break-keep w-auto">{chat.name}</div>
            </div>
            <div className="">
                <p className="text-sm text-neutral-500 w-auto">
                    <Preview chat={chat}/>
                </p>
            </div>
        </div>
    )
}
