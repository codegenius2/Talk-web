import React, {Dispatch, SetStateAction, useEffect} from "react";
import {Message} from "../component/Interface.tsx";
import {OutAudio, outEventTypeConversation} from "../api/API.tsx";
import {v4 as uuidv4} from 'uuid';
import {blobToBase64, getConversation, sendMessage} from "./Util.tsx";
import {systemMessage} from "../Shared.tsx";
import ReconnectingWebSocket from "reconnecting-websocket";

const maxHistoryMessage = 4

interface HandlerProps {
    pendingAudio: Blob[]
    setPendingAudio: Dispatch<SetStateAction<Blob[]>>;
    messages: Message[]
    setMessages: Dispatch<SetStateAction<Message[]>>;
    socket: ReconnectingWebSocket | undefined
}


export const PendingAudioHandler: React.FC<HandlerProps> = ({
                                                                pendingAudio,
                                                                setPendingAudio,
                                                                messages,
                                                                setMessages,
                                                                socket
                                                            }) => {
    useEffect(() => {
        if (pendingAudio.length === 0) {
            return
        }
        let conv = getConversation(messages)
        conv = conv.slice(-maxHistoryMessage)
        conv = [systemMessage, ...conv]
        const newMessages: Message[] = []
        pendingAudio.forEach(audio => {
            const id = uuidv4()

            blobToBase64(audio).then(b => {
                const event: OutAudio = {
                    type: outEventTypeConversation,
                    id: id,
                    audio: b,
                    fileName: "audio.wav",
                    conversation: conv
                }
                sendMessage(socket, event)
            })

            // add message to message list
            const userMessage: Message = {
                id: id,
                role: 'user',
                text: {
                    text: "",
                    status: 'pending',
                    createdAt: Date.now(),
                },
                audio: {
                    audioUrl: URL.createObjectURL(audio),
                    status: 'done',
                    createdAt: Date.now(),
                },
                whoIsOnTheTop: 'audio',
                createdAt: Date.now(),
            }
            const assistantMessage: Message = {
                id: uuidv4(),
                replyToId: id,
                role: 'assistant',
                text: {
                    text: "",
                    status: 'pending',
                    createdAt: Date.now(),
                },
                audio: {
                    status: 'pending',
                    createdAt: Date.now(),
                },
                whoIsOnTheTop: 'text',
                createdAt: Date.now(),
            }
            newMessages.push(userMessage, assistantMessage)
        })
        if (newMessages.length !== 0) {
            setMessages(prev => [...prev, ...newMessages])
        }
        setPendingAudio([])
    }, [pendingAudio])
    return null
}
