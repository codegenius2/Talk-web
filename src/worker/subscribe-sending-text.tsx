import {v4 as uuidv4} from "uuid"
import {useConvStore} from "../state/conversation.tsx";
import {newQueAns} from "../data-structure/conversation.tsx";
import React, {useEffect} from "react";
import {useSendingTextStore} from "../state/input.tsx";
import {newMyText, onError, onSent} from "../data-structure/text.tsx";
import {AxiosError} from "axios";
import {Message, toTalkOption} from "../api/restful.ts";
import {maxHistory} from "../data-structure/ability/client-ability.tsx";
import {useRestfulAPIStore} from "../state/axios.tsx";

const systemMessage: Message = {
    role: "system",
    content: "You are a helpful assistant!"
}

export const SubscriberSendingText: React.FC = () => {

    const historyMessages = useConvStore((state) => state.historyMessages)
    const pushQueAns = useConvStore((state) => (state.pushQueAns))
    const updateQueText = useConvStore((state) => (state.updateQueText))
    const getQueText = useConvStore((state) => (state.getQueText))
    const ability = useConvStore((state) => state.ability)
    const pop = useSendingTextStore((state) => state.pop)
    const sendingTexts = useSendingTextStore((state) => state.sendingTexts)
    const restfulAPI = useRestfulAPIStore((state) => state.restfulAPI);

    useEffect(() => {
        const sendingText = pop()
        if (!sendingText) {
            return
        }
        let messages = historyMessages(maxHistory(ability.llm))
        messages = [systemMessage, ...messages, {role: "user", content: sendingText}]
        console.debug("sending conversation: ", messages)

        const id = uuidv4()
        const qa = newQueAns(id, true, newMyText('sending', sendingText))
        pushQueAns(qa)
        restfulAPI.postConv({id: id, ms: messages, talkOption: toTalkOption(ability)}).then((r) => {
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
    }, [sendingTexts, ability, pop, getQueText, pushQueAns, restfulAPI, updateQueText]);
    return null
}



