/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback} from 'react'
import {MySwitch} from "../widget/switch.tsx"
import {useSnapshot} from "valtio/react"
import {WhisperOption,} from "../../../../data-structure/client-option.tsx"
import {appState} from "../../../../state/app-state.ts"
import {SelectBoxOrNotAvailable} from "../select-box-or-not-available.tsx"
import _ from "lodash"
import {WhisperGPTLogo} from "../widget/logo.tsx"

type Props = {
    whisperOptionProxy: WhisperOption
    setEnabled: (enabled: boolean) => void
}

const Whisper: React.FC<Props> = ({whisperOptionProxy, setEnabled}) => {
    const whisperOptionSnap = useSnapshot(whisperOptionProxy)
    const whisperAbilitySnap = useSnapshot(appState.ability.stt.whisper)

    const setModel = useCallback((model?: string) => {
        whisperOptionProxy.model = model ?? ""
    }, [whisperOptionSnap])

    return (
        <div className="flex flex-col w-full items-center justify-between gap-2">
            <div
                className="flex flex-col justify-center gap-2 py-2 px-3 border-2 border-neutral-500 border-dashed
                        rounded-lg w-full">
                <div className="flex justify-between items-center w-full ">
                    <WhisperGPTLogo/>
                    <MySwitch enabled={whisperOptionSnap.enabled} setEnabled={setEnabled}/>
                </div>
                {whisperOptionSnap.enabled &&
                    <>
                        <SelectBoxOrNotAvailable
                            title={"Model"}
                            choices={_.map(whisperAbilitySnap.models, m => ({
                                name: m,
                                value: m,
                                tags: []
                            }))}
                            defaultValue={whisperOptionSnap.model}
                            setValue={setModel}/>
                    </>
                }
            </div>
        </div>
    )
}

export default Whisper

