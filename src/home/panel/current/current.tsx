import React, {memo, useEffect, useState} from 'react'
import {LLM} from "../shared/llm/llm.tsx"
import {TTS} from "../shared/tts/tts.tsx"
import {STT} from "../shared/stt/stt.tsx"
import {OtherSetting} from "./other-setting.tsx"
import {useSnapshot} from "valtio/react"
import {appState, Chat, currentChatProxy} from "../../../state/app-state.ts"

 const Current_: React.FC = () => {
    // console.info("Current rendered", new Date().toLocaleString())
    const {currentChatId} = useSnapshot(appState)
    const [chatProxy, setChatProxy] = useState<Chat>()
    useEffect(() => {
        setChatProxy(currentChatProxy())
    }, [currentChatId])

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

export const Current = memo(Current_)