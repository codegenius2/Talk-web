import React from "react";
import {SubscribeSendingAudio} from "./SubscribeSendingAudio.tsx";
import {SubscriberSendingText} from "./SubscribeSendingText.tsx";

export const Subscribers: React.FC = () => {
    return <>
        <SubscriberSendingText/>
        <SubscribeSendingAudio/>
    </>
}