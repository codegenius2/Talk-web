import React, {useEffect, useState} from "react";
import {format, parseISO} from 'date-fns'
import {QueAns} from "../ds/Conversation.tsx";
import {MyText} from "../ds/Text.tsx";
import {Audio as _Audio} from "../ds/Audio.tsx";
import {getBlob} from "../store/BlobDB.tsx";
import {Spin} from "./Spin.tsx";

interface BubbleProps {
    queAns: QueAns
}

const NewBubble: React.FC<BubbleProps> = ({queAns}) => {
    return <div>
        <div className="chat chat-end ml-20">
            <div className="flex items-center gap-1">
                <time className="text-xs opacity-50">{format(parseISO(queAns.createdAt), 'HH:MM')}</time>
                <Text text={queAns.que.text}/>
                {queAns.que.audio && <Audio audio={queAns.que.audio}/>}
            </div>
        </div>
        <div className="chat chat-start mr-20">
            <div className="flex items-center gap-1 w-full">
                <Text text={queAns.ans.text}/>
                <Audio audio={queAns.ans.audio}/>
            </div>
        </div>
    </div>
}

interface TextProps {
    text: MyText
}

const Text: React.FC<TextProps> = ({text}) => {
    switch (text.status) {
        case 'pending':
            return <div className={"chat-bubble max-width chat-bubble-info bg-sky-300"}>
                <div className="mt-1">
                    <Spin/>
                </div>
            </div>
        case 'receiving':
        case 'done':
        case 'half-done':
            return <div className="chat-bubble max-width chat-bubble-info bg-sky-300 rounded-lg">{text.content}</div>
        case 'error':
            return <div
                className="chat-bubble chat-bubble-info bg-red-200 w-full max-w-full rounded-lg">{text.errorMessage}</div>
        default:
            return null
    }
}

interface AudioProps {
    audio: _Audio
}

const Audio: React.FC<AudioProps> = ({audio}) => {

    const [audioUrl, setAudioUrl] = useState<string>("")

    useEffect(() => {
        if (audioUrl) {
            return
        }
        if (audio.status === 'done') {
            getBlob(audio.audioBlobKey!).then(r => {
                if (r) {
                    const url = URL.createObjectURL(r.blob)
                    setAudioUrl(url)
                } else {
                    console.error("audio blob not found")
                }
            }).catch(e => {
                console.error("failed to get audio blob", audio.audioBlobKey, e)
            })
        }
    }, [audio]);

    switch (audio.status) {
        case 'pending':
            return <div className="chat-bubble max-width chat-bubble-info bg-sky-300 rounded-lg">
                <div className="mt-1">
                    <Spin/>
                </div>
            </div>
        case 'done':
            if (audioUrl) {
                return <audio className="w-full white rounded-full" controls={true} autoPlay={false}
                              src={audioUrl}></audio>
            } else {
                return <div className="chat-bubble max-width chat-bubble-info bg-sky-300 rounded-lg">
                    <div className="mt-1">
                        <Spin/>
                    </div>
                </div>
            }
        case 'error':
            return <div
                className="chat-bubble chat-bubble-info bg-red-200 w-full  max-w-full">{audio.errorMessage}</div>
        default:
            console.log('impossible case', audio.status)
            break;
    }
}


export default NewBubble