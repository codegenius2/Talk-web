import React from "react";
import {SubscribeSendingMessage} from "./subscribe-sending-message";
import {TimeoutContentDetection} from "./timeout-content-detection";

export const Workers: React.FC = () => {
    return <>
        <SubscribeSendingMessage/>
        <TimeoutContentDetection/>
    </>
}