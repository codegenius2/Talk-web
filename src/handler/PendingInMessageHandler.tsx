import React, {Dispatch, SetStateAction, useEffect} from "react";
import {Message} from "../component/Interface.tsx";
import {InMessage} from "../api/API.tsx";

interface HandlerProps {
    pendingInMessage: InMessage[],
    setPendingInMessage: Dispatch<SetStateAction<InMessage[]>>
    messages: Message[]
    setMessages: Dispatch<SetStateAction<Message[]>>;
}

export const PendingInMessageHandler: React.FC<HandlerProps> = ({
                                                                    pendingInMessage,
                                                                    setPendingInMessage,
                                                                    messages,
                                                                    setMessages,
                                                                }) => {
    useEffect(() => {
        if (pendingInMessage.length === 0) {
            return
        }
        let changed = false
        pendingInMessage.forEach(e => {
            const ft = messages.filter(m => m.replyToId === e.replyToId)
            if (ft.length === 0) {
                console.error("InMessage event has no matched message", e)
                return
            }
            ft.forEach(m => {
                if (!m.text) {
                    console.error("m.text should not be null", e)
                    return
                }
                if (e.err) {
                    m.text.text = e.err
                    m.text.status = 'error'
                } else {
                    m.text.text += e.message.content
                    if (e.eof) {
                        m.text.status = 'done'
                    } else {
                        m.text.status = 'receiving'
                    }
                }
                changed = true
            })
        })
        if (changed) {
            setMessages(p => [...p])
        }
        setPendingInMessage([]);
    }, [pendingInMessage])
    return null
}

