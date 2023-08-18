import {Message, OutConversation, outEventTypeConversation} from "../api/API.tsx";
import {v4 as uuidv4} from "uuid";
import {useConvStore} from "../state/ConversationStore.tsx";
import {useSettingStore} from "../state/Setting.tsx";
import {useSocketStore} from "../state/Socket.tsx";
import {newQueAns} from "../ds/Conversation.tsx";
import React, {useEffect} from "react";
import {useSendStore} from "../state/Input.tsx";
import {sendMessage} from "../Util.tsx";

export const systemMessage: Message = {
    role: "system",
    content: "You are a helpful assistant!"
}

export const TextSubscriber: React.FC = () => {

    const qaSlice = useConvStore((state) => state.qaSlice)
    const pushQueAns = useConvStore((state) => (state.pushQueAns))
    const maxHistoryMessage = useSettingStore((state) => state.maxHistoryMessage)
    const socket = useSocketStore.getState().socket
    const sendingText = useSendStore((state)=>state.sendingText)

    useEffect(() => {
        if (!sendingText){
            return
        }
        let messages: Message[] = []
        qaSlice.map(qa => qa.que.text)
            .filter(t => t.status == "done")
            .forEach(t => messages.push({role: "user", content: t.content}))
        qaSlice.map(qa => qa.ans.text)
            .filter(t => t.status == "done")
            .forEach(t => messages.push({role: "assistant", content: t.content}))
        messages = messages.slice(-maxHistoryMessage)

        messages = [systemMessage, ...messages, {role: "user", content: sendingText}]
        const id = uuidv4()

        const event: OutConversation = {
            type: outEventTypeConversation,
            id: id,
            conversation: messages
        }
        sendMessage(socket, event)
        const qa = newQueAns(id,false)
        pushQueAns(qa)
    }, [sendingText]);
    return null
}



