import React from 'react';
import {LLM} from "../shared/llm/llm.tsx";
import {TTS} from "../shared/tts/tts.tsx";
import {useSnapshot} from "valtio/react";
import {STT} from "../shared/stt/stt.tsx";
import {OtherSetting} from "./other-setting.tsx";
import {Chat} from "../../../state/app-state.ts";

type Props = {
    chatProxy: Chat
}

export const Current: React.FC<Props> = ({chatProxy}) => {
    useSnapshot(chatProxy)
    return (
        <>
            <div className="z-40 w-full">
                <LLM llmOptionProxy={chatProxy.option.llm}/>
            </div>
            <div className="z-30 w-full">
                <TTS ttsOptionProxy={chatProxy.option.tts}/>
            </div>
            <div className="z-20 w-full">
                <STT sttOptionProxy={chatProxy.option.stt}/>
            </div>
            <div className="z-10 w-full">
                <OtherSetting chatProxy={chatProxy}/>
            </div>
        </>
    )
}

