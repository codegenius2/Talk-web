/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect} from 'react';
import {useSnapshot} from "valtio/react";
import {STTOption,} from "../../../../data-structure/client-option.tsx";
import Whisper from "./whisper.tsx";

type Props = {
    sttOptionProxy: STTOption
}

export const STT: React.FC<Props> = ({sttOptionProxy}) => {
    useSnapshot(sttOptionProxy)
    const whisperSnap = useSnapshot(sttOptionProxy.whisper)

    const disableAll = useCallback(() => {
        const switchable = [sttOptionProxy.whisper]
        switchable.forEach(it => it.enabled = false)
    }, [])

    // Only one can be enabled simultaneously
    useEffect(() => {
        const switchable = [sttOptionProxy.whisper,]
        const available = switchable.filter(it => it.available)
        const enabled = available.filter(it => it.enabled)
        if (enabled.length > 1) {
            enabled.slice(1).forEach(e => e.enabled = false)
        }
    }, [])

    return (
        <div className="relative flex h-full select-none flex-col w-full before:bg-white before:bg-opacity-40
         pt-1 pb-3 px-3 gap-1 before:backdrop-hack before:backdrop-blur before:rounded-xl">
            <div className="flex w-full items-center justify-between px-3">
                <p className="text-lg text-neutral-600 prose">Speech to Text</p>
            </div>
            {whisperSnap.available &&
                <Whisper
                    whisperOptionProxy={sttOptionProxy.whisper}
                    setEnabled={(enabled: boolean) => {
                        if (enabled) {
                            disableAll()
                        }
                        sttOptionProxy.whisper.enabled = enabled
                    }}
                />}
        </div>
    )
}