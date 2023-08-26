import {QueAns} from "../ds/Conversation.tsx";
import React, {useEffect} from "react";
import {useSocketEvensStore} from "../state/SocketEvents.tsx";
import {onError, onNewAudioBlobId} from "../ds/Audio.tsx";
import {useConvStore} from "../state/ConversationStore.tsx";
import {addBlob} from "../store/BlobDB.tsx";
import {v4 as uuidv4} from 'uuid';
import {base64ToBlob} from "../Util.tsx";

export const SubscribeInAudio: React.FC = () => {

    const qaSlice = useConvStore((state) => state.qaSlice)
    const replaceQueAns = useConvStore((state) => state.replaceQueAns)
    const pendingInAudio = useSocketEvensStore((state) => state.inAudios)
    const popInAudio = useSocketEvensStore((state) => state.popInAudio)

    useEffect(() => {
            if (pendingInAudio.length === 0) {
                return
            }
            const inAudio = popInAudio()
            const qasMatched = qaSlice.filter(q => q.id === inAudio.id)
            if (qasMatched.length === 0) {
                console.error("InAudio event has no matched QueAns", inAudio)
                return
            } else if (qasMatched.length > 1) {
                console.error("InAudio event matched more than one QueAns", qasMatched)
                return
            }
            const qa = qasMatched[0]
            const audio = qa.ans.audio
            if (inAudio.err === '') {
                const blob = base64ToBlob(inAudio.audio, inAudio.format);
                const id = uuidv4()
                addBlob({id: id, blob: blob}).then(() => {
                    console.debug("saved audio blob", id)
                    const newAudio = onNewAudioBlobId(audio, id)
                    const newQa: QueAns = {
                        ...qa,
                        ans: {
                            ...qa.ans,
                            audio: newAudio
                        }
                    }
                    replaceQueAns(newQa)
                }).catch((e) => {
                    console.error("failed to save audio blob", id, e)
                })
            } else {
                const newAudio = onError(audio, inAudio.err)
                const newQa: QueAns = {
                    ...qa,
                    ans: {
                        ...qa.ans,
                        audio: newAudio
                    }
                }
                replaceQueAns(newQa)
            }
        }, [pendingInAudio]
    )
    return null
}



