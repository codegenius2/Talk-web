import React, {Dispatch, SetStateAction, useEffect} from "react";
import {Message} from "../component/Interface.tsx";
import {Message as CMessage, OutConversation, outEventTypeConversation} from "../api/API.tsx";
import {v4 as uuidv4} from 'uuid';
import {getConversation, sendMessage} from "./Util.tsx";
import {systemMessage} from "../Shared.tsx";
import ReconnectingWebSocket from "reconnecting-websocket";

const maxHistoryMessage = 4

interface HandlerProps {
    pendingText: string[],
    setPendingText: Dispatch<SetStateAction<string[]>>;
    messages: Message[]
    setMessages: Dispatch<SetStateAction<Message[]>>;
    socket: ReconnectingWebSocket | undefined
}

export const PendingTextHandler: React.FC<HandlerProps> = ({
                                                               pendingText,
                                                               setPendingText,
                                                               messages,
                                                               setMessages,
                                                               socket
                                                           }) => {
    useEffect(() => {
        // for each text, form a conversation and  make ask AI for answer
        if (pendingText.length === 0) {
            return
        }
        let conv = getConversation(messages)
        const newMessages: Message[] = []
        pendingText.forEach(text => {
            const m: CMessage = {
                role: "assistant",
                content: text
            }
            conv = conv.slice(-maxHistoryMessage)
            conv = [...conv, m]
            const sendConv = [systemMessage, ...conv]
            const id = uuidv4()
            const event: OutConversation = {
                type: outEventTypeConversation,
                id: id,
                conversation: sendConv
            }
            sendMessage(socket, event)

            // add message to message list
            const useMessage: Message = {
                id: id,
                role: 'user',
                text: {
                    text: text,
                    status: 'done',
                    createdAt: Date.now(),
                },
                whoIsOnTheTop: 'text',
                createdAt: Date.now(),
            }
            const assistantMessage: Message = {
                id: uuidv4(),
                replyToId: id,
                role: 'assistant',
                text: {
                    text:"",
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
            newMessages.push(useMessage, assistantMessage)
        })
        if (newMessages.length !== 0) {
            setMessages(prev => [...prev, ...newMessages])
        }
        setPendingText([])
    }, [pendingText])
    return null
}

