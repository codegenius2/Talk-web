/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useState} from 'react';
import {MySwitch} from "../widget/switch.tsx";
import {ListBox} from "../widget/list-box.tsx";
import {useSnapshot} from "valtio/react";
import {Choice} from "../../../state/data-structure/client-ability/types.ts";
import {SliderRange} from "../widget/slider-range.tsx";
import {ClientGoogleTTS} from "../../../state/data-structure/client-ability/google-tts.ts";

type Props = {
    googleTTSProxy: ClientGoogleTTS
}

const GoogleTTS: React.FC<Props> = ({googleTTSProxy}) => {
        const googleTTSSnp = useSnapshot(googleTTSProxy)
        const [voicesMatchLanguage, setVoicesMatchLanguage] = useState<Choice<string>[]>([])

        const setEnabled = useCallback((enabled: boolean) => {
            googleTTSProxy.enabled = enabled
        }, [])

        const setGender = useCallback((gender?: number) => {
            googleTTSProxy.gender.chosen = gender
        }, [])

        const setLanguage = useCallback((languageCode?: string) => {
            googleTTSProxy.language.chosen = languageCode

            if (languageCode) {
                const filtered = googleTTSProxy.voice.choices.filter(voice => {
                    voice.tags.find(tag => tag.startsWith(languageCode) || languageCode.startsWith(tag))
                })
                setVoicesMatchLanguage(filtered)
            } else {
                setVoicesMatchLanguage([])
            }
        }, [])

        const setVoice = useCallback((voice?: string) => {
            googleTTSProxy.voice.chosen = voice
        }, [])

        const setSpeakingRate = useCallback((speakingRate: number) => {
            googleTTSProxy.speakingRate.chosen = speakingRate
        }, [])

        const setPitch = useCallback((pitch: number) => {
            googleTTSProxy.pitch.chosen = pitch
        }, [])

        const setVolumeGainDb = useCallback((volumeGainDb: number) => {
            googleTTSProxy.volumeGainDb.chosen = volumeGainDb
        }, [])

        return <div
            className="flex flex-col w-full items-center justify-between gap-2 pt-1 pb-3 px-3 rounded-xl
            bg-white bg-opacity-40 backdrop-blur z-10 ">
            <div className="flex justify-between items-center w-full px-3 ">
                <p className="prose text-lg text-neutral-600">Google Text to Speech</p>
                <MySwitch enabled={googleTTSSnp.enabled} setEnabled={setEnabled}/>
            </div>
            {googleTTSSnp.enabled &&
                <div
                    className="flex flex-col justify-center gap-2 py-2 px-3 border-2 border-neutral-500 border-dashed rounded-lg w-full">
                    <div className="flex justify-between items-center gap-2">
                        <p className="prose text-neutral-600">Gender</p>
                        <div className="rounded-xl w-full md:ml-3 py-1">
                            <ListBox choices={googleTTSSnp.gender.choices as Choice<number>[]}
                                     value={googleTTSSnp.gender.chosen}
                                     setValue={setGender}
                                     mostEffort={true}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center gap-2">
                        <p className="prose text-neutral-600">Language</p>
                        <div className="rounded-xl w-full md:ml-3 py-1">
                            <ListBox choices={googleTTSSnp.language.choices as Choice<string>[]}
                                     value={googleTTSSnp.language.chosen}
                                     setValue={setLanguage}
                                     mostEffort={true}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center gap-2">
                        <p className="prose text-neutral-600">Voice</p>
                        <div className="rounded-xl w-full md:ml-3 py-1">
                            <ListBox choices={voicesMatchLanguage}
                                     value={googleTTSSnp.voice.chosen}
                                     setValue={setVoice}
                                     mostEffort={true}
                            />
                        </div>
                    </div>

                    <SliderRange title="Speaking Rate"
                                 defaultValue={googleTTSSnp.speakingRate.default}
                                 range={({
                                     start: googleTTSSnp.speakingRate.rangeStart,
                                     end: googleTTSSnp.speakingRate.rangeEnd
                                 })}
                                 setValue={setSpeakingRate}
                                 value={googleTTSSnp.speakingRate.chosen ?? googleTTSSnp.speakingRate.default}/>

                    <SliderRange title="Pitch"
                                 defaultValue={googleTTSSnp.pitch.default}
                                 range={({
                                     start: googleTTSSnp.pitch.rangeStart,
                                     end: googleTTSSnp.pitch.rangeEnd
                                 })}
                                 setValue={setPitch}
                                 value={googleTTSSnp.pitch.chosen ?? googleTTSSnp.pitch.default}/>

                    <SliderRange title="Volume Gain Db"
                                 defaultValue={googleTTSSnp.volumeGainDb.default}
                                 range={({
                                     start: googleTTSSnp.volumeGainDb.rangeStart,
                                     end: googleTTSSnp.volumeGainDb.rangeEnd
                                 })}
                                 setValue={setVolumeGainDb}
                                 value={googleTTSSnp.volumeGainDb.chosen ?? googleTTSSnp.volumeGainDb.default}/>

                </div>}
        </div>
    }
;

export default GoogleTTS;

