/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect} from 'react'
import ChatGpt from "./chat-gpt.tsx"
import {LLMOption} from "../../../../data-structure/client-option.tsx"
import {useSnapshot} from "valtio/react"
import Gemini from "./gemini.tsx";

type Props = {
    llmOptionProxy: LLMOption
}

export const LLM: React.FC<Props> = ({llmOptionProxy}) => {
    const llmSnap = useSnapshot(llmOptionProxy)

    const disableAll = useCallback(() => {
        const switchable = [llmOptionProxy.chatGPT, llmOptionProxy.gemini]
        switchable.forEach(it => it.enabled = false)
    }, [llmSnap])

    // Only one can be enabled simultaneously
    useEffect(() => {
        const switchable = [llmOptionProxy.chatGPT, llmOptionProxy.gemini]
        const available = switchable.filter(it => it.available)
        const enabled = available.filter(it => it.enabled)
        if (enabled.length > 1) {
            enabled.slice(1).forEach(e => e.enabled = false)
        }
    })

    return (
        <div className="relative flex h-full select-none flex-col w-full before:bg-white before:bg-opacity-40
         pt-1 pb-3 px-3 gap-1 before:backdrop-hack before:backdrop-blur before:rounded-xl">
            <div className="flex w-full items-center justify-between px-3">
                <p className="text-lg text-neutral-600 prose">Large Language Model</p>
            </div>
            {llmSnap.chatGPT.available &&
                <ChatGpt chatGPTOptionProxy={llmOptionProxy.chatGPT}
                         llmOptionProxy={llmOptionProxy}
                         setEnabled={(enabled: boolean) => {
                             if (enabled) {
                                 disableAll()
                             }
                             llmOptionProxy.chatGPT.enabled = enabled
                         }}
                />}
            {llmSnap.gemini.available &&
                <Gemini geminiOptionProxy={llmOptionProxy.gemini}
                         llmOptionProxy={llmOptionProxy}
                         setEnabled={(enabled: boolean) => {
                             if (enabled) {
                                 disableAll()
                             }
                             llmOptionProxy.gemini.enabled = enabled
                         }}
                />}
        </div>
    )
}