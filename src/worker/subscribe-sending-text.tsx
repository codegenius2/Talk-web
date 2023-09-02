import {v4 as uuidv4} from "uuid"
import {useConvStore} from "../state/conversation.tsx";
import {newQueAns} from "../ds/conversation.tsx";
import React, {useEffect} from "react";
import {useSendingTextStore} from "../state/input.tsx";
import {historyMessages} from "../util/util.tsx";
import {newMyText, onError, onSent} from "../ds/text.tsx";
import {AxiosError} from "axios";
import {Message, toTalkOption} from "../api/restful.ts";
import {postConv} from "../api/axios.ts";
import {maxHistory} from "../ds/ability/client-ability.tsx";

const systemMessage: Message = {
    role: "system",
    content: "You are a helpful assistant!"
}

export const SubscriberSendingText: React.FC = () => {

    const qaSlice = useConvStore((state) => state.qaSlice)
    const pushQueAns = useConvStore((state) => (state.pushQueAns))
    const updateQueText = useConvStore((state) => (state.updateQueText))
    const getQueText = useConvStore((state) => (state.getQueText))
    const ability = useConvStore((state) => state.ability)
    const sendingText = useSendingTextStore((state) => state.sendingText)

    useEffect(() => {
        if (!sendingText) {
            return
        }
        let messages = historyMessages(qaSlice, maxHistory(ability.llm))
        messages = [systemMessage, ...messages, {role: "user", content: sendingText}]
        const id = uuidv4()
        const qa = newQueAns(id, true, newMyText('sending', sendingText))
        pushQueAns(qa)
        postConv({id: id, ms: messages, talkOption: toTalkOption(ability)}).then((r) => {
                if (r.status >= 200 && r.status < 300) {
                    updateQueText(id, onSent(getQueText(id)))
                } else {
                    updateQueText(id, onError(getQueText(id), r.statusText))
                }
                console.debug(useConvStore.getState())
            }
        ).catch((e: AxiosError) => {
            updateQueText(id, onError(getQueText(id), e.message))
        })
    }, [sendingText]);
    return null
}



