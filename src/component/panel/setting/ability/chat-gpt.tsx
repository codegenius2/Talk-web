import React, {useCallback} from 'react';
import {
    ClientChatGPT,
    frequencyPenaltyChoices,
    historyChoices,
    presencePenaltyChoices,
    temperatureChoices,
    tokenChoices
} from "../../../../data-structure/ability/chat-gpt.ts";
import {produce} from "immer";
import {MySwitch} from "../widget/switch.tsx";
import {DiscreteRange} from "../widget/discrete-range.tsx";
import {ListBox} from "../widget/list-box.tsx";

type Props = {
    chatGPT: ClientChatGPT
    setChatGPT: (chatGPT: ClientChatGPT) => void
}

const ChatGpt: React.FC<Props> = ({chatGPT, setChatGPT}) => {

        const setEnabled = useCallback((enabled: boolean) => {
            console.debug("chatGPT enabled?", enabled)
            setChatGPT(
                produce(chatGPT, draft => {
                    draft.enabled = enabled
                })
            )
        }, [chatGPT, setChatGPT])

        const setMaxHistory = useCallback((hist: number) => {
            setChatGPT(
                produce(chatGPT, draft => {
                    draft.maxHistory.chosen = hist
                })
            )
        }, [chatGPT, setChatGPT])

        const setModel = useCallback((model?: string) => {
            setChatGPT(
                produce(chatGPT, draft => {
                    draft.models.chosen = model
                })
            )
        }, [chatGPT, setChatGPT])

        const setMaxTokens = useCallback((token: number) => {
            setChatGPT(
                produce(chatGPT, draft => {
                    draft.maxTokens.chosen = token
                })
            )
        }, [chatGPT, setChatGPT])

        const setTemperature = useCallback((temperature: number) => {
            setChatGPT(
                produce(chatGPT, draft => {
                    draft.temperature.chosen = temperature
                })
            )
        }, [chatGPT, setChatGPT])

        const setPresencePenalty = useCallback((presencePenalty: number) => {
            setChatGPT(
                produce(chatGPT, draft => {
                    draft.presencePenalty.chosen = presencePenalty
                })
            )
        }, [chatGPT, setChatGPT])

        const setFrequencyPenalty = useCallback((frequencyPenalty: number) => {
            setChatGPT(
                produce(chatGPT, draft => {
                    draft.frequencyPenalty.chosen = frequencyPenalty
                })
            )
        }, [chatGPT, setChatGPT])

        return <div
            className="flex flex-col w-full items-center justify-between gap-2 pt-1 pb-3 px-3 rounded-xl
            bg-white bg-opacity-40 backdrop-blur z-10 ">
            <div className="flex justify-between items-center w-full px-3 ">
                <p className="prose text-lg text-neutral-600">ChatGPT</p>
                <MySwitch enabled={chatGPT.enabled} setEnabled={setEnabled}/>
            </div>
            {chatGPT.enabled &&
                <div
                    className="flex flex-col justify-center gap-2 py-2 px-3 border-2 border-neutral-500 border-dashed rounded-lg w-full">
                    <DiscreteRange choices={historyChoices}
                                   title="Max History"
                                   setValue={setMaxHistory}
                                   value={chatGPT.maxHistory.chosen ?? chatGPT.maxHistory.default}
                                   showRange={true}
                                   outOfLeftBoundary={chatGPT.maxHistory.rangeStart}
                                   fallbackValue={chatGPT.maxHistory.default}
                                   range={{
                                       rangeStart: chatGPT.maxHistory.rangeStart,
                                       rangeEnd: chatGPT.maxHistory.rangeEnd,
                                   }}
                    />
                    <DiscreteRange choices={tokenChoices}
                                   title="Max Tokens"
                                   setValue={setMaxTokens}
                                   value={chatGPT.maxTokens.chosen ?? chatGPT.maxTokens.default}
                                   showRange={true}
                                   outOfLeftBoundary={chatGPT.maxTokens.rangeStart}
                                   fallbackValue={chatGPT.maxTokens.default}
                                   range={{
                                       rangeStart: chatGPT.maxTokens.rangeStart,
                                       rangeEnd: chatGPT.maxHistory.rangeEnd,
                                   }}
                    />
                    <DiscreteRange choices={temperatureChoices}
                                   title="Temperature"
                                   setValue={setTemperature}
                                   value={chatGPT.temperature.chosen ?? chatGPT.temperature.default}
                                   showRange={false}
                                   fallbackValue={chatGPT.temperature.default}
                                   range={{
                                       rangeStart: chatGPT.temperature.rangeStart,
                                       rangeEnd: chatGPT.temperature.rangeEnd,
                                   }}
                    />
                    <DiscreteRange choices={presencePenaltyChoices}
                                   title="Presence Penalty"
                                   setValue={setPresencePenalty}
                                   value={chatGPT.presencePenalty.chosen ?? chatGPT.presencePenalty.default}
                                   showRange={false}
                                   fallbackValue={chatGPT.presencePenalty.default}
                                   range={{
                                       rangeStart: chatGPT.presencePenalty.rangeStart,
                                       rangeEnd: chatGPT.presencePenalty.rangeEnd,
                                   }}
                    />
                    <DiscreteRange choices={frequencyPenaltyChoices}
                                   title="Frequency Penalty"
                                   setValue={setFrequencyPenalty}
                                   value={chatGPT.frequencyPenalty.chosen ?? chatGPT.frequencyPenalty.default}
                                   showRange={false}
                                   fallbackValue={chatGPT.frequencyPenalty.default}
                                   range={{
                                       rangeStart: chatGPT.frequencyPenalty.rangeStart,
                                       rangeEnd: chatGPT.frequencyPenalty.rangeEnd,
                                   }}
                    />
                    <div className="flex justify-between items-center gap-2">
                        <p className="prose text-neutral-600">Model</p>
                        <div className="rounded-xl w-full md:ml-3 py-1">
                            <ListBox choices={chatGPT.models.choices}
                                     value={chatGPT.models.chosen}
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

