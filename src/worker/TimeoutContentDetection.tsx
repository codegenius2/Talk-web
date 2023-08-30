import {useConvStore} from "../state/ConversationStore.tsx";
import React, {useEffect} from "react";
import {timeDiffSecond} from "../util/Util.tsx";
import {contentTimeoutSeconds} from "../config.ts";
import {error} from "../ds/Text.tsx";
import {error as errorAudio} from "../ds/Audio.tsx";

const timeoutCheckStatus = ['sending', 'receiving']

// if content stays at 'sending' or 'receiving' status for over contentTimeoutSeconds, mark it as timeout
export const TimeoutContentDetection: React.FC = () => {

    const updateQueText = useConvStore((state) => (state.updateQueText))
    const updateQueAudio = useConvStore((state) => (state.updateQueAudio))
    const updateAnsText = useConvStore((state) => (state.updateAnsText))
    const updateAnsAudio = useConvStore((state) => (state.updateAnsAudio))

    useEffect(() => {
        const interval = setInterval(() => {
            const state = useConvStore.getState();
            // for better performance, only check last 60 qa
            for (const qa of state.qaSlice.slice(-60)) {
                if (timeDiffSecond(qa.createdAt) < contentTimeoutSeconds) {
                    continue
                }
                if (timeoutCheckStatus.includes(qa.que.text.status)) {
                    updateQueText(qa.id, error(qa.que.text, "timeout"))
                }
                if (timeoutCheckStatus.includes(qa.que.audio?.status ?? "")) {
                    updateQueAudio(qa.id, errorAudio(qa.que.audio!, "timeout"))
                }
                if (timeoutCheckStatus.includes(qa.ans.text.status)) {
                    updateAnsText(qa.id, error(qa.ans.text, "timeout"))
                }
                if (timeoutCheckStatus.includes(qa.ans.audio?.status ?? "")) {
                    updateAnsAudio(qa.id, errorAudio(qa.ans.audio, "timeout"))
                }
            }
        }, 2000);

        return () => {
            if (interval) {
                clearInterval(interval)
            }
        };
    }, []);
    return null
}



