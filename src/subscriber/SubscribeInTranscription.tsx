import {QueAns} from "../ds/Conversation.tsx";
import React, {useEffect} from "react";
import {useSocketEvensStore} from "../state/SocketEvents.tsx";
import {useConvStore} from "../state/ConversationStore.tsx";
import {onError, onNewContent} from "../ds/Text.tsx";

export const SubscribeInTranscription: React.FC = () => {

    const qaSlice = useConvStore((state) => state.qaSlice)
    const replaceQueAns = useConvStore((state) => state.replaceQueAns)
    const pendingInTranscription = useSocketEvensStore((state) => state.inTranscriptions)
    const popInTranscription = useSocketEvensStore((state) => state.popInTranscription)

    useEffect(() => {
            if (pendingInTranscription.length === 0) {
                return
            }
            const inTan = popInTranscription()
            const qasMatched = qaSlice.filter(q => q.id === inTan.id)
            if (qasMatched.length === 0) {
                console.error("InTranscription event has no matched QueAns", inTan)
                return
            } else if (qasMatched.length > 1) {
                console.error("InTranscription event matched more than one QueAns", qasMatched)
                return
            }
            const qa = qasMatched[0]
            const text = qa.que.text
            const newText = inTan.err ? onError(text, inTan.err) : onNewContent(text, inTan.text, inTan.eof)
            const newQa: QueAns = {
                ...qa,
                que: {
                    ...qa.que,
                    text: newText
                }
            }
            replaceQueAns(newQa)
        }, [pendingInTranscription]
    )
    return null
}



