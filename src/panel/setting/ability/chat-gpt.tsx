import React, {useCallback} from 'react';
import {MySwitch} from "../widget/switch.tsx";
import {ClientChatGPT, historyChoices, tokenChoices} from "../../../state/data-structure/client-ability/chat-gpt.ts";
import {DiscreteRange} from "../widget/discrete-range.tsx";
import {ListBox} from "../widget/list-box.tsx";
import {useSnapshot} from "valtio/react";
import {Choice} from "../../../state/data-structure/client-ability/types.ts";
import {SliderRange} from "../widget/slider-range.tsx";

type Props = {
    chatGPTProxy: ClientChatGPT
}

const ChatGpt: React.FC<Props> = ({chatGPTProxy}) => {
        const chatGPTSnp = useSnapshot(chatGPTProxy)

        const setEnabled = useCallback((enabled: boolean) => {
            chatGPTProxy.enabled = enabled
        }, [chatGPTProxy])

        const setMaxHistory = useCallback((hist: number) => {
            chatGPTProxy.maxHistory.chosen = hist
        }, [chatGPTProxy])

        const setModel = useCallback((model?: string) => {
            chatGPTProxy.models.chosen = model
        }, [chatGPTProxy])

        const setMaxTokens = useCallback((token: number) => {
            chatGPTProxy.maxTokens.chosen = token
        }, [chatGPTProxy])

        const setTemperature = useCallback((temperature: number) => {
            chatGPTProxy.temperature.chosen = temperature
        }, [chatGPTProxy])

        const setPresencePenalty = useCallback((presencePenalty: number) => {
            chatGPTProxy.presencePenalty.chosen = presencePenalty
        }, [chatGPTProxy])

        const setFrequencyPenalty = useCallback((frequencyPenalty: number) => {
            chatGPTProxy.frequencyPenalty.chosen = frequencyPenalty
        }, [chatGPTProxy])

        return <div
            className="flex flex-col w-full items-center justify-between gap-2 pt-1 pb-3 px-3 rounded-xl
            bg-white bg-opacity-40 backdrop-blur z-10 ">
            <div className="flex justify-between items-center w-full px-3 ">
                <p className="prose text-lg text-neutral-600">ChatGPT</p>
                <MySwitch enabled={chatGPTSnp.enabled} setEnabled={setEnabled}/>
            </div>
            {chatGPTSnp.enabled &&
                <div
                    className="flex flex-col justify-center gap-2 py-2 px-3 border-2 border-neutral-500 border-dashed rounded-lg w-full">
                    <DiscreteRange choices={historyChoices}
                                   title="Max History"
                                   setValue={setMaxHistory}
                                   value={chatGPTSnp.maxHistory.chosen ?? chatGPTSnp.maxHistory.default}
                                   showRange={true}
                                   outOfLeftBoundary={chatGPTSnp.maxHistory.rangeStart}
                                   defaultValue={chatGPTSnp.maxHistory.default}
                                   range={{
                                       rangeStart: chatGPTSnp.maxHistory.rangeStart,
                                       rangeEnd: chatGPTSnp.maxHistory.rangeEnd,
                                   }}
                    />
                    <DiscreteRange choices={tokenChoices}
                                   title="Max Tokens"
                                   setValue={setMaxTokens}
                                   value={chatGPTSnp.maxTokens.chosen ?? chatGPTSnp.maxTokens.default}
                                   showRange={true}
                                   outOfLeftBoundary={chatGPTSnp.maxTokens.rangeStart}
                                   defaultValue={chatGPTSnp.maxTokens.default}
                                   range={{
                                       rangeStart: chatGPTSnp.maxTokens.rangeStart,
                                       rangeEnd: chatGPTSnp.maxHistory.rangeEnd,
                                   }}
                    />
                    <SliderRange title="Temperature"
                                 defaultValue={chatGPTSnp.temperature.default}
                                 range={({
                                     start: chatGPTSnp.temperature.rangeStart,
                                     end: chatGPTSnp.temperature.rangeEnd
                                 })}
                                 setValue={setTemperature}
                                 value={chatGPTSnp.temperature.chosen ?? chatGPTSnp.temperature.default}/>

                    <SliderRange title="Presence Panelty"
                                 defaultValue={chatGPTSnp.presencePenalty.default}
                                 range={({
                                     start: chatGPTSnp.presencePenalty.rangeStart,
                                     end: chatGPTSnp.presencePenalty.rangeEnd
                                 })}
                                 setValue={setPresencePenalty}
                                 value={chatGPTSnp.presencePenalty.chosen ?? chatGPTSnp.presencePenalty.default}/>

                    <SliderRange title="Frequency Panelty"
                                 defaultValue={chatGPTSnp.frequencyPenalty.default}
                                 range={({
                                     start: chatGPTSnp.frequencyPenalty.rangeStart,
                                     end: chatGPTSnp.frequencyPenalty.rangeEnd
                                 })}
                                 setValue={setFrequencyPenalty}
                                 value={chatGPTSnp.frequencyPenalty.chosen ?? chatGPTSnp.frequencyPenalty.default}/>

                    <div className="flex justify-between items-center gap-2">
                        <p className="prose text-neutral-600">Model</p>
                        <div className="rounded-xl w-full md:ml-3 py-1">
                            <ListBox choices={chatGPTSnp.models.choices as Choice<string>[]}
                                     value={chatGPTSnp.models.chosen}
                                     setValue={setModel}
                                     mostEffort={true}
                            />
                        </div>
                    </div>
                </div>}
        </div>
    }
;

export default ChatGpt;

