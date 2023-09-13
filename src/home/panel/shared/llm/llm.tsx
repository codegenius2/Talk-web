/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect} from 'react';
import ChatGpt from "./chat-gpt.tsx";
import {LLMOption} from "../../../../data-structure/client-option.tsx";
import {useSnapshot} from "valtio/react";

type Props = {
    llmOptionProxy: LLMOption
}

export const LLM: React.FC<Props> = ({llmOptionProxy}) => {

    const chatGPTOptionSnap = useSnapshot(llmOptionProxy.chatGPT)


    const disableAll = useCallback(() => {
        const switchable = [llmOptionProxy.chatGPT, llmOptionProxy.claude]
        switchable.forEach(it => it.enabled = false)
    }, [])

    // const claudeOptionSnap= useSnapshot(llmOptionProxy.claude)
    // Only one can be enabled simultaneously
    useEffect(() => {
        const switchable = [llmOptionProxy.chatGPT, llmOptionProxy.claude]
        const available = switchable.filter(it => it.available)
        const enabled = available.filter(it => it.enabled)
        if (enabled.length > 1) {
            enabled.slice(1).forEach(e => e.enabled = false)
        }
    }, [chatGPTOptionSnap])

    return (
        <div className="relative flex h-full select-none flex-col w-full before:bg-white before:bg-opacity-40
         pt-1 pb-3 px-3 gap-1 before:backdrop-hack before:backdrop-blur before:rounded-xl">
            <div className="flex w-full items-center justify-between px-3">
                <p className="text-lg text-neutral-600 prose">Large Language Model</p>
            </div>
            {chatGPTOptionSnap.available &&
                <ChatGpt chatGPTOptionProxy={llmOptionProxy.chatGPT}
                         setEnabled={(enabled: boolean) => {
                             if (enabled) {
                                 disableAll()
                             }
                             llmOptionProxy.chatGPT.enabled = enabled
                         }}

                />}
        </div>
    )
}