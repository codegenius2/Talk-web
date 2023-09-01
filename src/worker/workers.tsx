import React from "react";
import {SubscribeSendingAudio} from "./subscribe-sending-audio.tsx";
import {SubscriberSendingText} from "./subscribe-sending-text.tsx";
import {TimeoutContentDetection} from "./timeout-content-detection.tsx";

export const Workers: React.FC = () => {
    return <>
        <SubscriberSendingText/>
        <SubscribeSendingAudio/>
        <TimeoutContentDetection/>
    </>
}