import React from "react"
import {BsSoundwave} from "react-icons/bs"
import {Chat} from "../../../state/app-state.ts"
import {MySpin} from "../../chat-window/compnent/widget/icon.tsx"
import {useSnapshot} from "valtio/react";

type Props = {
    chatProxy: Chat
}

export const Preview: React.FC<Props> = ({chatProxy}) => {
    // console.info("Preview rendered, chatId", chatProxy.id, new Date().toLocaleString())
    const {messages} = useSnapshot(chatProxy)

    if (messages.length === 0) {
        return null
    }
    const message = messages[messages.length - 1]

    return <div className="flex items-center gap-2">
        <p>{message.role == "user" ? "You" : "Assistant"}:</p>
        {["sending", "thinking"].includes(message.status) && <MySpin className="h-4 w-4"/>}
        {["sent", "typing", "received"].includes(message.status) &&
            (message.audio ?
                    <div className="text-blue-600"><BsSoundwave/></div>
                    :
                    <p className="truncate ... ">{message.text.slice(0, 20)}</p>
            )
        }
        {"error" === message.status && <div className="text-yellow-500">☹️</div>}
    </div>
}

