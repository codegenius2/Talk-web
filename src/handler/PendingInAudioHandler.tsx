import React, {Dispatch, SetStateAction, useEffect} from "react";
import {Message} from "../component/Interface.tsx";
import {InAudio,} from "../api/API.tsx";
import {base64ToBlob} from "./Util.tsx";

interface HandlerProps {
    pendingInAudio: InAudio[]
    setPendingInAudio: Dispatch<SetStateAction<InAudio[]>>
    messages: Message[]
    setMessages: Dispatch<SetStateAction<Message[]>>;
}

export const PendingInAudioHandler: React.FC<HandlerProps> = ({
                                                                  pendingInAudio,
                                                                  setPendingInAudio,
                                                                  messages,
                                                                  setMessages,
                                                              }) => {
    useEffect(() => {
        if (pendingInAudio.length === 0) {
            return
        }
        let changed = false
        pendingInAudio.forEach(e => {
            const ft = messages.filter(m => m.replyToId === e.replyToId)
            if (ft.length === 0) {
                console.error("InAudio event has no matched message", e)
                return
            }
            ft.forEach(m => {
                if (!m.audio) {
                    console.error("m.audio should not be null", e)
                    return
                }
                if (e.err) {
                    m.audio.errorMessage += e.err
                    m.audio.status = 'error'
                } else {
                    const blob = base64ToBlob(e.audio, 'audio/mp3');
                    m.audio.audioUrl = URL.createObjectURL(blob)
                    m.audio.status = 'done'
                }
                changed = true
            })
        })
        if (changed) {
            setMessages(p => [...p])
        }
        setPendingInAudio([]);
    }, [pendingInAudio])
    return null
}

