import {useConvStore} from "../state/ConversationStore.tsx";
import {QueAns} from "../ds/Conversation.tsx";
import React, {useEffect} from "react";
import {useSocketEvensStore} from "../state/SocketEvents.tsx";
import {onError, onNewContent} from "../ds/Text.tsx";

export const SubscribeInMessage: React.FC = () => {

    const qaSlice = useConvStore((state) => state.qaSlice)
    const replaceQueAns = useConvStore((state) => state.replaceQueAns)
    const pendingInMessage = useSocketEvensStore((state) => state.inMessages)
    const popInMessage = useSocketEvensStore((state) => state.popInMessage)

    useEffect(() => {
            if (pendingInMessage.length === 0) {
                return
            }
            const inMsg = popInMessage()
            const qasMatched = qaSlice.filter(q => q.id === inMsg.id)
            if (qasMatched.length === 0) {
                console.error("InMessage event has no matched QueAns", inMsg)
                return
            } else if (qasMatched.length > 1) {
                console.error("InMessage event matched more than one QueAns", qasMatched)
                return
            }
            const qa = qasMatched[0]
            const text = qa.ans.text
            const newText = inMsg.err ? onError(text, inMsg.err) : onNewContent(text, inMsg.content, inMsg.eof)
            const newQa: QueAns = {
                ...qa,
                ans: {
                    ...qa.ans,
                    text: newText
                }
            }
            replaceQueAns(newQa)
        }, [pendingInMessage]
    )
    return null
}



