import React from "react";
import {SubscribeSendingAudio} from "./SubscribeSendingAudio.tsx";
import {SubscriberSendingText} from "./SubscribeSendingText.tsx";
import {TimeoutContentDetection} from "./TimeoutContentDetection.tsx";

export const Workers: React.FC = () => {
    return <>
        <SubscriberSendingText/>
        <SubscribeSendingAudio/>
        <TimeoutContentDetection/>
    </>
}