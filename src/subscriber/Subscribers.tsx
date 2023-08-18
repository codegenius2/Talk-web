import React from "react";
import {SubscribeInMessage} from "./SubscribeInMessage.tsx";
import {TextSubscriber} from "./SubscribeSendText.tsx";
import {SubscribeInAudio} from "./SubscribeInAudio.tsx";
import {SubscribeInTranscription} from "./SubscribeInTranscription.tsx";

export const Subscribers: React.FC = () => {
    return <>
        <SubscribeInMessage/>
        <SubscribeInAudio/>
        <SubscribeInTranscription/>
        <TextSubscriber/>
    </>
}