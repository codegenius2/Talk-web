import React from "react"
import {SubscribeSendingMessage} from "./subscribe-sending-message"
import {TimeoutContentDetection} from "./timeout-content-detection"
import {SubscribeAudioDurationUpdate} from "./subscribe-audio-duration-update.tsx"

export const Workers: React.FC = () => {
    return <>
        <SubscribeSendingMessage/>
        <SubscribeAudioDurationUpdate/>
        <TimeoutContentDetection/>
    </>
}