import React from "react";
import {BsEmojiExpressionless, BsSoundwave} from "react-icons/bs";
import {Chat} from "../../../state/chat.tsx";
import {Spin} from "../../message/widget/spin.tsx";

type Props = {
    chat: Chat
}

export const Preview: React.FC<Props> = ({chat}) => {
    if (chat.ms.length === 0) {
        return null
    }
    const message = chat.ms[chat.ms.length - 1]

    const who = message.role == "user" ? "You" : "Assistant"
    let content = null
    switch (message.status) {
        case "sending":
        case "thinking":
            content = <Spin/>
            break;
        case "sent":
        case "typing":
        case "received":
            if (message.audio) {
                content = <div className="text-blue-600"><BsSoundwave/></div>
            } else {
                content = <p className="truncate ... ">{message.text}</p>
            }
            break;
        case "error":
            content = <div className=""><BsEmojiExpressionless/></div>
            break;
    }
    return <div className="flex items-center gap-2">
        <p>{who}:</p> {content}
    </div>
}

