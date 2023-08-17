import React, {Dispatch, SetStateAction, useEffect} from "react";
import {Message} from "../component/Interface.tsx";
import {InTranscription,} from "../api/API.tsx";

interface HandlerProps {
    pendingInTranscription: InTranscription[]
    setPendingInTranscription: Dispatch<SetStateAction<InTranscription[]>>
    messages: Message[]
    setMessages: Dispatch<SetStateAction<Message[]>>;
}


export const PendingInTranscriptionHandler: React.FC<HandlerProps> = ({
                                                                          pendingInTranscription,
                                                                          setPendingInTranscription,
                                                                          messages,
                                                                          setMessages,
                                                                      }) => {
    useEffect(() => {
        if (pendingInTranscription.length === 0) {
            return
        }
        let changed = false
        pendingInTranscription.forEach(e => {
            const ft = messages.filter(m => m.id === e.id)
            if (ft.length === 0) {
                console.error("InTranscription event has no matched message", e)
                return
            }
            ft.forEach(m => {
                if (!m.text) {
                    console.error("m.text should not be null", e)
                    return
                }
                if (e.err) {
                    m.text.text +=  e.err
                    m.text.status = 'error'
                } else {
                    m.text.text += e.text
                    if (e.eof) {
                        m.text.status = 'done'
                    } else {
                        m.text.status = 'receiving'
                    }
                }
                changed = true
            })
        })
        setPendingInTranscription([]);
        if (changed) {
            setMessages(p => [...p])
        }
    }, [pendingInTranscription])
    return null
}

