/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {MySwitch} from "../widget/switch.tsx";
import {DiscreteRange} from "../widget/discrete-range.tsx";
import {useSnapshot} from "valtio/react";
import {SliderRange} from "../widget/slider-range.tsx";
import {ChatGPTOption} from "../../../../data-structure/client-option.tsx";
import {
    chatGPTAPIReference,
    historyChoices,
    tokenChoices
} from "../../../../data-structure/provider-api-refrence/chat-gpt.ts";
import {appState} from "../../../../state/app-state.ts";
import {Choice} from "../../../../data-structure/provider-api-refrence/types.ts";
import {SelectBoxExample} from "../widget/my-select-box.tsx";

type Props = {
    chatGPTOptionProxy: ChatGPTOption
}

const ChatGpt: React.FC<Props> = ({chatGPTOptionProxy}) => {
    const chatGPTOptionSnp = useSnapshot(chatGPTOptionProxy)
    const chatGPTAbility = useSnapshot(appState.ability.llm.chatGPT)
    const llmOptionSnp = useSnapshot(appState.option.llm)
    const [modelChoices, setModelChoices] = useState<Choice<string>[]>([])

    useEffect(() => {
        const choices = chatGPTAbility.models?.map((model): Choice<string> => ({
            name: model,
            value: model,
            tags: []
        })) ?? []
        setModelChoices(choices)
    }, [chatGPTAbility.models]);

    const setEnabled = useCallback((enabled: boolean) => {
        chatGPTOptionProxy.enabled = enabled
    }, [])

    const setMaxHistory = useCallback((hist: number) => {
        appState.option.llm.maxHistory = hist
    }, [])

    const setModel = useCallback((model: string) => {
        chatGPTOptionProxy.model = model
    }, [])

    const setMaxTokens = useCallback((token: number) => {
        chatGPTOptionProxy.maxTokens = token
    }, [])

    const setTemperature = useCallback((temperature: number) => {
        chatGPTOptionProxy.temperature = temperature
    }, [])

    const setTopP = useCallback((topP: number) => {
        chatGPTOptionProxy.topP = topP
    }, [])

    const setPresencePenalty = useCallback((presencePenalty: number) => {
        chatGPTOptionProxy.presencePenalty = presencePenalty
    }, [])

    const setFrequencyPenalty = useCallback((frequencyPenalty: number) => {
        chatGPTOptionProxy.frequencyPenalty = frequencyPenalty
    }, [])

    return (
        <div className="flex flex-col w-full items-center justify-between gap-2">
            <div
                className="flex flex-col justify-center gap-2 py-2 px-3 border-2 border-neutral-500 border-dashed
                        rounded-lg w-full">
                <div className="flex justify-between items-center w-full ">
                    <p className="prose text-lg text-neutral-600">ChatGPT</p>
                    <MySwitch enabled={chatGPTOptionSnp.enabled} setEnabled={setEnabled}/>
                </div>
                {chatGPTOptionSnp.enabled &&
                    <>
                        <DiscreteRange choices={historyChoices}
                                       title="Max Hisotry"
                                       setValue={setMaxHistory}
                                       value={llmOptionSnp.maxHistory}
                                       showRange={true}
                                       outOfLeftBoundary={chatGPTAPIReference.maxHistory.rangeStart}
                                       defaultValue={chatGPTAPIReference.maxHistory.default}
                                       range={{
                                           rangeStart: chatGPTAPIReference.maxHistory.rangeStart,
                                           rangeEnd: chatGPTAPIReference.maxHistory.rangeEnd,
                                       }}
                        />
                        <DiscreteRange choices={tokenChoices}
                                       title="Max Tokens"
                                       setValue={setMaxTokens}
                                       value={chatGPTOptionSnp.maxTokens}
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
                                     value={chatGPTOptionSnp.temperature}/>

                        <SliderRange title="TopP"
                                     defaultValue={chatGPTAPIReference.topP.default}
                                     range={({
                                         start: chatGPTAPIReference.topP.rangeStart,
                                         end: chatGPTAPIReference.topP.rangeEnd
                                     })}
                                     setValue={setTopP}
                                     value={chatGPTOptionSnp.topP}/>

                        <SliderRange title="Presence Panelty"
                                     defaultValue={chatGPTAPIReference.presencePenalty.default}
                                     range={({
                                         start: chatGPTAPIReference.presencePenalty.rangeStart,
                                         end: chatGPTAPIReference.presencePenalty.rangeEnd
                                     })}
                                     setValue={setPresencePenalty}
                                     value={chatGPTOptionSnp.presencePenalty}/>

                        <SliderRange title="Frequency Panelty"
                                     defaultValue={chatGPTAPIReference.frequencyPenalty.default}
                                     range={({
                                         start: chatGPTAPIReference.frequencyPenalty.rangeStart,
                                         end: chatGPTAPIReference.frequencyPenalty.rangeEnd
                                     })}
                                     setValue={setFrequencyPenalty}
                                     value={chatGPTOptionSnp.frequencyPenalty}/>
                        <div className="flex justify-start items-center gap-4">
                            <p className="prose text-neutral-600">Model</p>
                            <div className="w-full overflow-x-hidden"><SelectBoxExample/></div>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}

export default ChatGpt;

