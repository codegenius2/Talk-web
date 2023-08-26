import React from "react";
import {SubscribeInMessage} from "./SubscribeInMessage.tsx";
import {SubscribeInAudio} from "./SubscribeInAudio.tsx";
import {SubscribeInTranscription} from "./SubscribeInTranscription.tsx";
import {SubscribeSendingAudio} from "./SubscribeSendingAudio.tsx";
import {TextSubscriber} from "./SubscribeSendingText.tsx";

export const Subscribers: React.FC = () => {
    return <>
        <SubscribeInMessage/>
        <SubscribeInAudio/>
        <SubscribeInTranscription/>

        <TextSubscriber/>
        <SubscribeSendingAudio/>
    </>
}