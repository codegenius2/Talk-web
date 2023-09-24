/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react'
import {MySwitch} from "../widget/switch.tsx"
import {useSnapshot} from "valtio/react"
import {Choice} from "../../../../data-structure/provider-api-refrence/types.ts"
import {SliderRange} from "../widget/slider-range.tsx"
import {GoogleTTSOption} from "../../../../data-structure/client-option.tsx"
import {GoogleTTSGender} from "../../../../api/restful/model.ts"
import {appState} from "../../../../state/app-state.ts"
import {googleTTSAPIReference} from "../../../../data-structure/provider-api-refrence/google-tts.ts"
import {SelectBoxOrNotAvailable} from "../select-box-or-not-available.tsx"
import _ from "lodash"
import {GoogleLogo} from "../widget/logo.tsx"

type Props = {
    googleTTSOptionProxy: GoogleTTSOption
    setEnabled: (enabled: boolean) => void
}

const GoogleTTS: React.FC<Props> = ({googleTTSOptionProxy, setEnabled}) => {
    const googleTTSSnap = useSnapshot(googleTTSOptionProxy)
    const googleAbilitySnap = useSnapshot(appState.ability.tts.google)

    const [voiceChoices, setVoicesChoice] = useState<Choice<string>[]>([])

    const setGender = useCallback((gender?: number) => {
        googleTTSOptionProxy.gender = gender as GoogleTTSGender
    }, [googleTTSSnap])

    const setLanguage = useCallback((languageCode?: string) => {
        googleTTSOptionProxy.languageCode = languageCode ?? ""
    }, [googleTTSSnap])

    useEffect(() => {
        // eslint-disable-next-line valtio/state-snapshot-rule
        const lang = googleTTSSnap.languageCode
        if (lang) {
            const filtered = _.filter(appState.ability.tts.google.voices,
                voice =>
                    _.some(voice.tags,
                        tag => tag.startsWith(lang) || lang.startsWith(tag)
                    )
            )
                .map((v): Choice<string> => ({
                    name: v.name,
                    value: v.id,
                    tags: _.map(v.tags, tag => tag)
                }))
            setVoicesChoice(filtered)
            if (!_.some(filtered, v => v.value === googleTTSOptionProxy.voiceId)) {
                googleTTSOptionProxy.voiceId = _.first(filtered)?.value
            }
        } else {
            setVoicesChoice([])
        }
    }, [googleAbilitySnap, googleTTSSnap])

    const setVoice = useCallback((voiceId?: string | number) => {
        googleTTSOptionProxy.voiceId = voiceId as string
    }, [googleTTSSnap])

    const setSpeakingRate = useCallback((speakingRate: number) => {
        googleTTSOptionProxy.speakingRate = speakingRate
    }, [googleTTSSnap])

    const setPitch = useCallback((pitch: number) => {
        googleTTSOptionProxy.pitch = pitch
    }, [googleTTSSnap])

    const setVolumeGainDb = useCallback((volumeGainDb: number) => {
        googleTTSOptionProxy.volumeGainDb = volumeGainDb
    }, [googleTTSSnap])

    return (
        <div className="flex flex-col w-full items-center justify-between gap-2">
            <div
                className="flex flex-col justify-center gap-2 py-2 px-3 border-2 border-neutral-500 border-dashed
                        rounded-lg w-full">
                <div className="flex justify-between items-center w-full ">
                    <GoogleLogo/>
                    <MySwitch enabled={googleTTSSnap.enabled} setEnabled={setEnabled}/>
                </div>
                {googleTTSSnap.enabled &&
                    <>
                        <SelectBoxOrNotAvailable
                            title={"Gender"}
                            choices={googleTTSAPIReference.gender.choices}
                            defaultValue={googleTTSSnap.gender}
                            setValue={setGender}/>
                        <SelectBoxOrNotAvailable
                            title={"Language"}
                            choices={googleTTSAPIReference.language.choices}
                            defaultValue={googleTTSSnap.languageCode}
                            setValue={setLanguage}/>
                        <SelectBoxOrNotAvailable
                            title={"Voice"}
                            choices={voiceChoices}
                            defaultValue={googleTTSSnap.voiceId}
                            setValue={setVoice}/>
                        {/*</div>*/}
                        <SliderRange title="Speaking Rate"
                                     defaultValue={googleTTSAPIReference.speakingRate.default}
                                     range={({
                                         start: googleTTSAPIReference.speakingRate.rangeStart,
                                         end: googleTTSAPIReference.speakingRate.rangeEnd
                                     })}
                                     setValue={setSpeakingRate}
                                     value={googleTTSSnap.speakingRate}/>

                        <SliderRange title="Pitch"
                                     defaultValue={googleTTSAPIReference.pitch.default}
                                     range={({
                                         start: googleTTSAPIReference.pitch.rangeStart,
                                         end: googleTTSAPIReference.pitch.rangeEnd
                                     })}
                                     setValue={setPitch}
                                     value={googleTTSSnap.pitch}/>

                        <SliderRange title="Volume Gain Db"
                                     defaultValue={googleTTSAPIReference.volumeGainDb.default}
                                     range={({
                                         start: googleTTSAPIReference.volumeGainDb.rangeStart,
                                         end: googleTTSAPIReference.volumeGainDb.rangeEnd
                                     })}
                                     setValue={setVolumeGainDb}
                                     value={googleTTSSnap.volumeGainDb}/>
                    </>
                }
            </div>
        </div>
    )
}

export default GoogleTTS

