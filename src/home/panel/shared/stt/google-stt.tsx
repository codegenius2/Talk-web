/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {MySwitch} from "../widget/switch.tsx";
import {useSnapshot} from "valtio/react";
import {GoogleOption,} from "../../../../data-structure/client-option.tsx";
import {appState} from "../../../../state/app-state.ts";
import {SelectBoxOrNotAvailable} from "../select-box-or-not-available.tsx";
import _ from "lodash";
import {Choice, emptyStringChoice} from "../../../../data-structure/provider-api-refrence/types.ts";
import {googleSTTAPIReference} from "../../../../data-structure/provider-api-refrence/google-stt.ts";
import { GoogleLogo } from '../widget/logo.tsx';

type Props = {
    googleOptionProxy: GoogleOption
    setEnabled: (enabled: boolean) => void
}

const GoogleStt: React.FC<Props> = ({googleOptionProxy, setEnabled}) => {
    const googleOptionSnap = useSnapshot(googleOptionProxy)
    const googleAbilitySnap = useSnapshot(appState.ability.stt.google)
    const [recognizerChoices, setRecognizerChoices] = useState<Choice<string>[]>([emptyStringChoice])

    const setRecognizer = useCallback((rec?: string) => {
        googleOptionProxy.recognizer = rec ?? ""
    }, [googleOptionSnap])

    const setModel = useCallback((model?: string) => {
        googleOptionProxy.model = model ?? ""
    }, [googleOptionSnap])

    const setLanguage = useCallback((lang?: string) => {
        googleOptionProxy.language = lang ?? ""
    }, [googleOptionSnap])

    useEffect(() => {
        // eslint-disable-next-line valtio/state-snapshot-rule
        const choices = _.map(googleAbilitySnap.recognizers, r => ({
            name: r.id,
            value: r.name,
            tags: _.map(r.tags, t => t)
        }))
        setRecognizerChoices(choices)
    }, [googleAbilitySnap]);

    return (
        <div className="flex flex-col w-full items-center justify-between gap-2">
            <div
                className="flex flex-col justify-center gap-2 py-2 px-3 border-2 border-neutral-500 border-dashed
                        rounded-lg w-full">
                <div className="flex justify-between items-center w-full ">
                    <GoogleLogo/>
                    <MySwitch enabled={googleOptionSnap.enabled} setEnabled={setEnabled}/>
                </div>
                {googleOptionSnap.enabled &&
                    <>
                        <SelectBoxOrNotAvailable
                            title={"Recognizer"}
                            choices={recognizerChoices}
                            defaultValue={googleOptionSnap.recognizer}
                            setValue={setRecognizer}/>
                        <SelectBoxOrNotAvailable
                            title={"Model"}
                            choices={googleSTTAPIReference.models.choices}
                            defaultValue={googleSTTAPIReference.models.default.value}
                            setValue={setModel}/>
                        <SelectBoxOrNotAvailable
                            title={"Language"}
                            choices={googleSTTAPIReference.language.choices}
                            defaultValue={googleSTTAPIReference.language.default.value}
                            setValue={setLanguage}/>
                    </>
                }
            </div>
        </div>
    )
}

export default GoogleStt;

