import React, {memo} from 'react'
import {LLM} from "../shared/llm/llm.tsx"
import {TTS} from "../shared/tts/tts.tsx"
import {STT} from "../shared/stt/stt.tsx"
import {OtherSetting} from "./other-setting.tsx"
import {appState} from "../../../state/app-state.ts";
import {ShortcutsSetting} from "./shortcuts-setting.tsx";

const Global_: React.FC = () => {
    // console.info("Global rendered", new Date().toLocaleString())
    return (
        <>
            <div className="z-40 w-full">
                <LLM llmOptionProxy={appState.option.llm}/>
            </div>
            <div className="z-30 w-full">
                <TTS ttsOptionProxy={appState.option.tts}/>
            </div>
            <div className="z-20 w-full">
                <STT sttOptionProxy={appState.option.stt}/>
            </div>
            <div className="z-10 w-full">
                <ShortcutsSetting/>
            </div>
            <div className="z-10 w-full">
                <OtherSetting/>
            </div>
        </>
    )
}

export const Global = memo(Global_)
