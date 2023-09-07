import React, {useCallback} from 'react';
import ChatGpt from "./chat-gpt.tsx";
import {ClientAbility} from "../../data-structure/ability/client-ability.tsx";
import {produce} from "immer";
import {ClientChatGPT} from "../../data-structure/ability/chat-gpt.ts";

type Props = {
    ability: ClientAbility
    setAbility: (ability: ClientAbility) => void
}

export const AbilitySetting: React.FC<Props> = ({ability, setAbility}) => {
    const chatGPT = ability.llm.chatGPT
    const setChatGPT = useCallback((chatGPT: ClientChatGPT) => {
        setAbility(
            produce(ability, draft => {
                draft.llm.chatGPT = chatGPT
            })
        )
    }, [ability, setAbility])

    return (
        ability.llm.chatGPT.available ? <ChatGpt chatGPT={chatGPT} setChatGPT={setChatGPT}/> : <></>
    )
}

