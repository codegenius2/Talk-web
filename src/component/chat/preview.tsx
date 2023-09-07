import React from "react";
import {Spin} from "../message/widget/spin.tsx";
import {BsEmojiExpressionless, BsSoundwave} from "react-icons/bs";
import {Chat} from "../../state/convs.tsx";

type Props = {
    chat: Chat
}

export const Preview: React.FC<Props> = ({chat}) => {
    if (chat.ms.length === 0) {
        return null
    }
    const message = chat.ms[-1]
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
                content = <BsSoundwave/>
            } else {
                content = message.text.slice(12)
            }
            break;
        case "error":
            content = <BsEmojiExpressionless/>
            break;
    }
    return <div>
        {who}: {content}
    </div>
}

