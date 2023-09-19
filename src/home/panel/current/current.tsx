import React, {useEffect, useState} from 'react';
import {LLM} from "../shared/llm/llm.tsx";
import {TTS} from "../shared/tts/tts.tsx";
import {STT} from "../shared/stt/stt.tsx";
import {OtherSetting} from "./other-setting.tsx";
import {useSnapshot} from "valtio/react";
import {appState, Chat, currentChatProxy} from "../../../state/app-state.ts";

export const Current: React.FC = () => {
    const {currentChatId} = useSnapshot(appState)
    const [chatProxy, setChatProxy] = useState<Chat>()
    useEffect(() => {
        setChatProxy(currentChatProxy())
    }, [currentChatId]);

    if (chatProxy) {
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
    }else{
        return <></>
    }
}

