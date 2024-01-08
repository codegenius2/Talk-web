/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react'
import {MySwitch} from "../widget/switch.tsx"
import {DiscreteRange} from "../widget/discrete-range.tsx"
import {useSnapshot} from "valtio/react"
import {SliderRange} from "../widget/slider-range.tsx"
import {GeminiOption, LLMOption} from "../../../../data-structure/client-option.tsx"
import {attachNumberChoices,} from "../../../../data-structure/provider-api-refrence/chat-gpt.ts"
import {geminiAPIReference, maxOutputTokens} from '../../../../data-structure/provider-api-refrence/gemini.ts'
import {appState} from "../../../../state/app-state.ts"
import {Choice} from "../../../../data-structure/provider-api-refrence/types.ts"
import {SelectBoxOrNotAvailable} from "../select-box-or-not-available.tsx"
import {llmAPIReference} from "../../../../data-structure/provider-api-refrence/llm.ts"
import {GeminiLogo} from "../widget/logo.tsx"
import {map} from "lodash";

type Props = {
    geminiOptionProxy: GeminiOption
    llmOptionProxy: LLMOption
    setEnabled: (enabled: boolean) => void
}

const Gemini: React.FC<Props> = ({geminiOptionProxy, llmOptionProxy, setEnabled}) => {

    const geminiOptionSnap = useSnapshot(geminiOptionProxy)

    const {models} = useSnapshot(appState.ability.llm.gemini)
    const {maxAttached} = useSnapshot(llmOptionProxy)

    const [modelChoices, setModelChoices] = useState<Choice<string>[]>([])

    useEffect(() => {
        const choices = map(appState.ability.llm.gemini.models, (model): Choice<string> => ({
            name: model.displayName,
            value: model.name,
            tags: []
        }))
        setModelChoices(choices)
    }, [models])

    const setMaxAttached = useCallback((hist: number) => {
        llmOptionProxy.maxAttached = hist
    }, [llmOptionProxy])

    const setModel = useCallback((model?: string | number) => {
        geminiOptionProxy.model = model as string
    }, [geminiOptionSnap])

    const setMaxOutputTokens = useCallback((token: number) => {
        geminiOptionProxy.maxOutputTokens = token
    }, [geminiOptionSnap])

    const setTemperature = useCallback((temperature: number) => {
        geminiOptionProxy.temperature = temperature
    }, [geminiOptionSnap])

    const setTopP = useCallback((topP: number) => {
        geminiOptionProxy.topP = topP
    }, [geminiOptionSnap])

    const setTopK = useCallback((topK: number) => {
        geminiOptionProxy.topK = topK
    }, [geminiOptionSnap])

    return (
        <div className="flex flex-col w-full items-center justify-between gap-2">
            <div
                className="flex flex-col justify-center gap-2 py-2 px-3 border-2 border-neutral-500 border-dashed
                        rounded-lg w-full">
                <div className="flex justify-between items-center w-full ">
                    <GeminiLogo/>
                    <MySwitch enabled={geminiOptionSnap.enabled} setEnabled={setEnabled}/>
                </div>
                {geminiOptionSnap.enabled &&
                    <>
                        <DiscreteRange choices={attachNumberChoices}
                                       title="Attached Messages"
                                       setValue={setMaxAttached}
                                       value={maxAttached}
                                       showRange={true}
                                       outOfLeftBoundary={llmAPIReference.maxAttached.rangeStart}
                                       defaultValue={llmAPIReference.maxAttached.default}
                                       range={{
                                           rangeStart: llmAPIReference.maxAttached.rangeStart,
                                           rangeEnd: llmAPIReference.maxAttached.rangeEnd,
                                       }}
                        />
                        <DiscreteRange choices={maxOutputTokens}
                                       title="Max Output Tokens"
                                       setValue={setMaxOutputTokens}
                                       value={geminiOptionSnap.maxOutputTokens}
                                       showRange={true}
                                       outOfLeftBoundary={geminiAPIReference.maxOutputTokens.rangeStart}
                                       defaultValue={geminiAPIReference.maxOutputTokens.default}
                                       range={{
                                           rangeStart: geminiAPIReference.maxOutputTokens.rangeStart,
                                           rangeEnd: geminiAPIReference.maxOutputTokens.rangeEnd,
                                       }}
                        />
                        <SliderRange title="Temperature"
                                     defaultValue={geminiAPIReference.temperature.default}
                                     range={({
                                         start: geminiAPIReference.temperature.rangeStart,
                                         end: geminiAPIReference.temperature.rangeEnd
                                     })}
                                     setValue={setTemperature}
                                     value={geminiOptionSnap.temperature}/>
                        <SliderRange title="TopP"
                                     defaultValue={geminiAPIReference.topP.default}
                                     range={({
                                         start: geminiAPIReference.topP.rangeStart,
                                         end: geminiAPIReference.topP.rangeEnd
                                     })}
                                     setValue={setTopP}
                                     value={geminiOptionSnap.topP}/>
                        <SliderRange title="TopK"
                                     defaultValue={geminiAPIReference.topK.default}
                                     range={({
                                         start: geminiAPIReference.topK.rangeStart,
                                         end: geminiAPIReference.topK.rangeEnd
                                     })}
                                     setValue={setTopK}
                                     value={geminiOptionSnap.topK}/>
                        <SelectBoxOrNotAvailable
                            title={"Model"}
                            choices={modelChoices}
                            defaultValue={geminiOptionSnap.model}
                            setValue={setModel}
                        />
                    </>
                }
            </div>
        </div>
    )
}

export default Gemini

