/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect} from 'react';
import {useSnapshot} from "valtio/react";
import {TTSOption} from "../../../../data-structure/client-option.tsx";
import GoogleTTS from "./google-tts.tsx";
import ElevenlabsTTS from "./elevenlabs.tsx";

type Props = {
    ttsOptionProxy: TTSOption
}

export const TTS: React.FC<Props> = ({ttsOptionProxy}) => {
    useSnapshot(ttsOptionProxy)
    const googleSnap = useSnapshot(ttsOptionProxy.google)
    const elevenlabsSnap = useSnapshot(ttsOptionProxy.elevenlabs)

    const disableAll = useCallback(() => {
        const switchable = [ttsOptionProxy.google, ttsOptionProxy.elevenlabs]
        switchable.forEach(it => it.enabled = false)
    }, [])

    // Only one can be enabled simultaneously
    useEffect(() => {
        const switchable = [ttsOptionProxy.google, ttsOptionProxy.elevenlabs]
        const available = switchable.filter(it => it.available)
        const enabled = available.filter(it => it.enabled)
        if (enabled.length > 1) {
            enabled.slice(1).forEach(e => e.enabled = false)
        }
    }, [])

    return (
        <div className="relative flex h-full select-none flex-col w-full before:bg-white before:bg-opacity-40
         pt-1 pb-3  px-3 gap-1 before:backdrop-hack before:backdrop-blur before:rounded-xl">
            <div className="flex w-full items-center justify-between px-3">
                <p className="text-lg text-neutral-600 prose">Text to Speech</p>
            </div>
            {googleSnap.available &&
                <GoogleTTS
                    googleTTSOptionProxy={ttsOptionProxy.google}
                    setEnabled={(enabled: boolean) => {
                        if (enabled) {
                            disableAll()
                        }
                        ttsOptionProxy.google.enabled = enabled
                    }}
                />}
            {elevenlabsSnap.available &&
                <ElevenlabsTTS
                    elevenlabsTTSOptionProxy={ttsOptionProxy.elevenlabs}
                    setEnabled={(enabled: boolean) => {
                        if (enabled) {
                            disableAll()
                        }
                        ttsOptionProxy.elevenlabs.enabled = enabled
                    }}

                />}
        </div>
    )
}