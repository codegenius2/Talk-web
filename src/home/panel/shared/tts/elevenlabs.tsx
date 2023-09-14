/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {MySwitch} from "../widget/switch.tsx";
import {useSnapshot} from "valtio/react";
import {Choice} from "../../../../data-structure/provider-api-refrence/types.ts";
import {SliderRange} from "../widget/slider-range.tsx";
import {ElevenlabsTTSOption,} from "../../../../data-structure/client-option.tsx";
import {appState} from "../../../../state/app-state.ts";
import {elevenlabsAPIReference} from "../../../../data-structure/provider-api-refrence/elevenlabs-tts.ts";
import {SelectBoxOrNotAvailable} from "../select-box-or-not-available.tsx";
import _ from "lodash";

type Props = {
    elevenlabsTTSOptionProxy: ElevenlabsTTSOption
    setEnabled: (enabled: boolean) => void
}

const ElevenlabsTTS: React.FC<Props> = ({elevenlabsTTSOptionProxy,setEnabled}) => {
    const elevenlabsTTSSnap = useSnapshot(elevenlabsTTSOptionProxy)
    const elevenlabsAbilitySnap = useSnapshot(appState.ability.tts.elevenlabs)

    const [voiceChoices, setVoicesChoice] = useState<Choice<string>[]>([])

    useEffect(() => {
        // eslint-disable-next-line valtio/state-snapshot-rule
        const voices = _.map(elevenlabsAbilitySnap.voices,
            v => ({
                name: v.name,
                value: v.id,
                tags: _.uniq(v.tags).map(tag => tag)
            }))
        setVoicesChoice(voices)
    }, [elevenlabsAbilitySnap])

    const setVoice = useCallback((voiceId?: string) => {
        elevenlabsTTSOptionProxy.voiceId = voiceId
    }, [])

    const setStability = useCallback((stability: number) => {
        elevenlabsTTSOptionProxy.stability = stability
    }, [])

    const setClarity = useCallback((clarity: number) => {
        elevenlabsTTSOptionProxy.clarity = clarity
    }, [])

    return (
        <div className="flex flex-col w-full items-center justify-between gap-2">
            <div
                className="flex flex-col justify-center gap-2 py-2 px-3 border-2 border-neutral-500 border-dashed
                        rounded-lg w-full">
                <div className="flex justify-between items-center w-full ">
                    <p className="prose text-lg text-neutral-600">Elevenlabs</p>
                    <MySwitch enabled={elevenlabsTTSSnap.enabled} setEnabled={setEnabled}/>
                </div>
                {elevenlabsTTSSnap.enabled &&
                    <>
                        <SelectBoxOrNotAvailable
                            title={"Voice"}
                            choices={voiceChoices}
                            defaultValue={elevenlabsTTSSnap.voiceId}
                            setValue={setVoice}/>
                        <SliderRange title="Stability"
                                     defaultValue={elevenlabsAPIReference.stability.default}
                                     range={({
                                         start: elevenlabsAPIReference.stability.rangeStart,
                                         end: elevenlabsAPIReference.stability.rangeEnd
                                     })}
                                     setValue={setStability}
                                     value={elevenlabsTTSSnap.stability}/>

                        <SliderRange title="Clarity"
                                     defaultValue={elevenlabsAPIReference.clarity.default}
                                     range={({
                                         start: elevenlabsAPIReference.clarity.rangeStart,
                                         end: elevenlabsAPIReference.clarity.rangeEnd
                                     })}
                                     setValue={setClarity}
                                     value={elevenlabsTTSSnap.clarity}/>

                    </>
                }
            </div>
        </div>
    )
}

export default ElevenlabsTTS;

