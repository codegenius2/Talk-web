/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {MySwitch} from "../widget/switch.tsx";
import {DiscreteRange} from "../widget/discrete-range.tsx";
import {useSnapshot} from "valtio/react";
import {SliderRange} from "../widget/slider-range.tsx";
import {ChatGPTOption, LLMOption} from "../../../../data-structure/client-option.tsx";
import {
    chatGPTAPIReference,
    historyChoices,
    tokenChoices
} from "../../../../data-structure/provider-api-refrence/chat-gpt.ts";
import {appState} from "../../../../state/app-state.ts";
import {Choice} from "../../../../data-structure/provider-api-refrence/types.ts";
import {SelectBoxOrNotAvailable} from "../select-box-or-not-available.tsx";
import _ from "lodash";
import {llmAPIReference} from "../../../../data-structure/provider-api-refrence/llm.ts";
import {ChatGPTLogo} from "../widget/logo.tsx";

type Props = {
    chatGPTOptionProxy: ChatGPTOption
    llmOptionProxy: LLMOption
    setEnabled: (enabled: boolean) => void
}

const ChatGpt: React.FC<Props> = ({chatGPTOptionProxy, llmOptionProxy, setEnabled}) => {

    const chatGPTOptionSnap = useSnapshot(chatGPTOptionProxy)

    const {models} = useSnapshot(appState.ability.llm.chatGPT)
    const {maxHistory} = useSnapshot(llmOptionProxy)

    const [modelChoices, setModelChoices] = useState<Choice<string>[]>([])

    useEffect(() => {
        const choices = _.map(appState.ability.llm.chatGPT.models, (model): Choice<string> => ({
            name: model,
            value: model,
            tags: []
        }))
        setModelChoices(choices)
    }, [models]);

    const setMaxHistory = useCallback((hist: number) => {
        llmOptionProxy.maxHistory = hist
    }, [llmOptionProxy])

    const setModel = useCallback((model?: string | number) => {
        chatGPTOptionProxy.model = model as string
    }, [chatGPTOptionSnap])

    const setMaxTokens = useCallback((token: number) => {
        chatGPTOptionProxy.maxTokens = token
    }, [chatGPTOptionSnap])

    const setTemperature = useCallback((temperature: number) => {
        chatGPTOptionProxy.temperature = temperature
    }, [chatGPTOptionSnap])

    const setTopP = useCallback((topP: number) => {
        chatGPTOptionProxy.topP = topP
    }, [chatGPTOptionSnap])

    const setPresencePenalty = useCallback((presencePenalty: number) => {
        chatGPTOptionProxy.presencePenalty = presencePenalty
    }, [chatGPTOptionSnap])

    const setFrequencyPenalty = useCallback((frequencyPenalty: number) => {
        chatGPTOptionProxy.frequencyPenalty = frequencyPenalty
    }, [chatGPTOptionSnap])

    return (
        <div className="flex flex-col w-full items-center justify-between gap-2">
            <div
                className="flex flex-col justify-center gap-2 py-2 px-3 border-2 border-neutral-500 border-dashed
                        rounded-lg w-full">
                <div className="flex justify-between items-center w-full ">
                    <ChatGPTLogo/>
                    <MySwitch enabled={chatGPTOptionSnap.enabled} setEnabled={setEnabled}/>
                </div>
                {chatGPTOptionSnap.enabled &&
                    <>
                        <DiscreteRange choices={historyChoices}
                                       title="Max Hisotry"
                                       setValue={setMaxHistory}
                                       value={maxHistory}
                                       showRange={true}
                                       outOfLeftBoundary={llmAPIReference.maxHistory.rangeStart}
                                       defaultValue={llmAPIReference.maxHistory.default}
                                       range={{
                                           rangeStart: llmAPIReference.maxHistory.rangeStart,
                                           rangeEnd: llmAPIReference.maxHistory.rangeEnd,
                                       }}
                        />
                        <DiscreteRange choices={tokenChoices}
                                       title="Max Tokens"
                                       setValue={setMaxTokens}
                                       value={chatGPTOptionSnap.maxTokens}
                                       showRange={true}
                                       outOfLeftBoundary={chatGPTAPIReference.maxTokens.rangeStart}
                                       defaultValue={chatGPTAPIReference.maxTokens.default}
                                       range={{
                                           rangeStart: chatGPTAPIReference.maxTokens.rangeStart,
                                           rangeEnd: chatGPTAPIReference.maxTokens.rangeEnd,
                                       }}
                        />
                        <SliderRange title="Temperature"
                                     defaultValue={chatGPTAPIReference.temperature.default}
                                     range={({
                                         start: chatGPTAPIReference.temperature.rangeStart,
                                         end: chatGPTAPIReference.temperature.rangeEnd
                                     })}
                                     setValue={setTemperature}
                                     value={chatGPTOptionSnap.temperature}/>

                        <SliderRange title="TopP"
                                     defaultValue={chatGPTAPIReference.topP.default}
                                     range={({
                                         start: chatGPTAPIReference.topP.rangeStart,
                                         end: chatGPTAPIReference.topP.rangeEnd
                                     })}
                                     setValue={setTopP}
                                     value={chatGPTOptionSnap.topP}/>

                        <SliderRange title="Presence Panelty"
                                     defaultValue={chatGPTAPIReference.presencePenalty.default}
                                     range={({
                                         start: chatGPTAPIReference.presencePenalty.rangeStart,
                                         end: chatGPTAPIReference.presencePenalty.rangeEnd
                                     })}
                                     setValue={setPresencePenalty}
                                     value={chatGPTOptionSnap.presencePenalty}/>

                        <SliderRange title="Frequency Panelty"
                                     defaultValue={chatGPTAPIReference.frequencyPenalty.default}
                                     range={({
                                         start: chatGPTAPIReference.frequencyPenalty.rangeStart,
                                         end: chatGPTAPIReference.frequencyPenalty.rangeEnd
                                     })}
                                     setValue={setFrequencyPenalty}
                                     value={chatGPTOptionSnap.frequencyPenalty}/>
                        <SelectBoxOrNotAvailable
                            title={"Model"}
                            choices={modelChoices}
                            defaultValue={chatGPTOptionSnap.model}
                            setValue={setModel}
                        />
                    </>
                }
            </div>
        </div>
    )
}

export default ChatGpt;

