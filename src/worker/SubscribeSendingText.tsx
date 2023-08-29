import {v4 as uuidv4} from "uuid"
import {useConvStore} from "../state/ConversationStore.tsx";
import {useSettingStore} from "../state/Setting.tsx";
import {newQueAns} from "../ds/Conversation.tsx";
import React, {useEffect} from "react";
import {useSendingTextStore} from "../state/Input.tsx";
import {historyMessages} from "../util/Util.tsx";
import {Message} from "../api/Interface.tsx";
import {error, newMyText, sent} from "../ds/Text.tsx";
import {postConv} from "../instance.ts";

const systemMessage: Message = {
    role: "system",
    content: "You are a helpful assistant!"
}

export const SubscriberSendingText: React.FC = () => {

    const qaSlice = useConvStore((state) => state.qaSlice)
    const pushQueAns = useConvStore((state) => (state.pushQueAns))
    const updateQueText = useConvStore((state) => (state.updateQueText))
    const getQueText = useConvStore((state) => (state.getQueText))
    const maxHistoryMessage = useSettingStore((state) => state.maxHistoryMessage)
    const sendingText = useSendingTextStore((state) => state.sendingText)

    useEffect(() => {
        if (!sendingText) {
            return
        }
        let messages = historyMessages(qaSlice, maxHistoryMessage)
        messages = [systemMessage, ...messages, {role: "user", content: sendingText}]
        const id = uuidv4()
        const qa = newQueAns(id, newMyText('sending', sendingText))
        pushQueAns(qa)
        postConv({id: id, ms: messages}).then((r) => {
                if (r.status >= 200 && r.status < 300) {
                    updateQueText(id, sent(getQueText(id)))
                } else {
                    updateQueText(id, error(getQueText(id), r.statusText))
                }
                console.debug(useConvStore.getState())
            }
        ).catch((e) => {
            updateQueText(id, error(getQueText(id), e))
        })
    }, [sendingText]);
    return null
}



