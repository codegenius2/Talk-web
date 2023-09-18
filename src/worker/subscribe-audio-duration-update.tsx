import React, {useEffect} from "react";
import {useSnapshot} from "valtio/react";
import {controlState} from "../state/control-state.ts";
import {findChatProxy, findMessage} from "../state/app-state.ts";

export const SubscribeAudioDurationUpdate: React.FC = () => {

    const {audioDurationUpdateSignal} = useSnapshot(controlState)
    useEffect(() => {
        if (controlState.audioDurationUpdates.length === 0) {
            return;
        }
        const [au] = controlState.audioDurationUpdates.splice(0, 1)
        if (!au) {
            return
        }
        const chat = findChatProxy(au.chatId);
        if (!chat) {
            return;
        }
        const message = findMessage(chat[0], au.messageId)
        if (message && message.audio) {
            message.audio.durationMs = au.durationMs
        }
    }, [audioDurationUpdateSignal]);
    return null
}
