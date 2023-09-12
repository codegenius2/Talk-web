/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useState} from 'react';
import {MySwitch} from "../widget/switch.tsx";
import {useSnapshot} from "valtio/react";
import {Choice} from "../../../../data-structure/provider-api-refrence/types.ts";
import {SliderRange} from "../widget/slider-range.tsx";
import {GoogleTTSOption} from "../../../../data-structure/client-option.tsx";
import {GoogleTTSGender} from "../../../../api/restful/model.ts";
import {appState} from "../../../../state/app-state.ts";
import {googleTTSAPIReference} from "../../../../data-structure/provider-api-refrence/google-tts.ts";

type Props = {
    googleTTSOptionProxy: GoogleTTSOption
}

const GoogleTTS: React.FC<Props> = ({googleTTSOptionProxy}) => {
        const googleTTSSnp = useSnapshot(googleTTSOptionProxy)
        const googleOptionSnp = useSnapshot(appState.ability.tts.google)
        const [voiceChoices, setVoicesChoice] = useState<Choice<string>[]>([])

        const setEnabled = useCallback((enabled: boolean) => {
            googleTTSOptionProxy.enabled = enabled
        }, [])

        const setGender = useCallback((gender: number) => {
            googleTTSOptionProxy.gender = gender as GoogleTTSGender
        }, [])

        const setLanguage = useCallback((languageCode: string) => {
            googleTTSOptionProxy.languageCode = languageCode

            if (languageCode) {
                const filtered = googleOptionSnp.voices?.filter(
                    voice => {
                        voice.tags?.find(tag => tag.startsWith(languageCode) || languageCode.startsWith(tag))
                    })?.map((v): Choice<string> => ({
                    name: v.name,
                    value: v.name,
                    tags: v.tags?.map(tag => tag) ?? []
                })) ?? []
                setVoicesChoice(filtered)
            } else {
                setVoicesChoice([])
            }
        }, [])

        const setVoice = useCallback((voiceId: string) => {
            googleTTSOptionProxy.voiceId = voiceId
        }, [])

        const setSpeakingRate = useCallback((speakingRate: number) => {
            googleTTSOptionProxy.speakingRate = speakingRate
        }, [])

        const setPitch = useCallback((pitch: number) => {
            googleTTSOptionProxy.pitch = pitch
        }, [])

        const setVolumeGainDb = useCallback((volumeGainDb: number) => {
            googleTTSOptionProxy.volumeGainDb = volumeGainDb
        }, [])

        return <div
            className="flex flex-col w-full items-center justify-between gap-2 pt-1 pb-3 px-3 rounded-xl
            bg-white bg-opacity-40 backdrop-blur">
            <div className="flex justify-between items-center w-full px-3 ">
                <p className="prose text-lg text-neutral-600">Google Text to Speech</p>
                <MySwitch enabled={googleTTSSnp.enabled} setEnabled={setEnabled}/>
            </div>
            {googleTTSSnp.enabled &&
                <div
                    className="flex flex-col justify-center gap-2 py-2 px-3 border-2 border-neutral-500 border-dashed rounded-lg w-full">
                    {/*<div className="flex justify-between items-center gap-2">*/}
                    {/*    <p className="prose text-neutral-600">Gender</p>*/}
                    {/*    <div className="rounded-xl w-full md:ml-3 py-1">*/}
                    {/*        <ListBox choices={googleTTSSnp.gender.choices as Choice<number>[]}*/}
                    {/*                 value={googleTTSSnp.gender.chosen}*/}
                    {/*                 setValue={setGender}*/}
                    {/*                 mostEffort={true}*/}
                    {/*        />*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/*<div className="flex justify-between items-center gap-2">*/}
                    {/*    <p className="prose text-neutral-600">Language</p>*/}
                    {/*    <div className="rounded-xl w-full md:ml-3 py-1">*/}
                    {/*        <ListBox choices={googleTTSSnp.language.choices as Choice<string>[]}*/}
                    {/*                 value={googleTTSSnp.language.chosen}*/}
                    {/*                 setValue={setLanguage}*/}
                    {/*                 mostEffort={true}*/}
                    {/*        />*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/*<div className="flex justify-between items-center gap-2">*/}
                    {/*    <p className="prose text-neutral-600">Voice</p>*/}
                    {/*    <div className="rounded-xl w-full md:ml-3 py-1">*/}
                    {/*        <ListBox choices={voicesMatchLanguage}*/}
                    {/*                 value={googleTTSSnp.voice.chosen}*/}
                    {/*                 setValue={setVoice}*/}
                    {/*                 mostEffort={true}*/}
                    {/*        />*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    <SliderRange title="Speaking Rate"
                                 defaultValue={googleTTSAPIReference.speakingRate.default}
                                 range={({
                                     start: googleTTSAPIReference.speakingRate.rangeStart,
                                     end: googleTTSAPIReference.speakingRate.rangeEnd
                                 })}
                                 setValue={setSpeakingRate}
                                 value={googleTTSSnp.speakingRate}/>

                    <SliderRange title="Pitch"
                                 defaultValue={googleTTSAPIReference.pitch.default}
                                 range={({
                                     start: googleTTSAPIReference.pitch.rangeStart,
                                     end: googleTTSAPIReference.pitch.rangeEnd
                                 })}
                                 setValue={setPitch}
                                 value={googleTTSSnp.pitch}/>

                    <SliderRange title="Volume Gain Db"
                                 defaultValue={googleTTSAPIReference.volumeGainDb.default}
                                 range={({
                                     start: googleTTSAPIReference.volumeGainDb.rangeStart,
                                     end: googleTTSAPIReference.volumeGainDb.rangeEnd
                                 })}
                                 setValue={setVolumeGainDb}
                                 value={googleTTSSnp.volumeGainDb}/>
                </div>}
        </div>
    }
;

export default GoogleTTS;

