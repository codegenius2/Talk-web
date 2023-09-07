import React from "react";
import {SubscribeSendingMessage} from "./subscribe-sending-message.tsx";
import {TimeoutContentDetection} from "./timeout-content-detection.tsx";

export const Workers: React.FC = () => {
    return <>
        <SubscribeSendingMessage/>
        <TimeoutContentDetection/>
    </>
}