import {MAudio, Message, MText} from "./Interface.tsx";
import React from "react";
import {format} from 'date-fns'
import {Spin} from "../element/Spin.tsx";

// const selfAvatar = new URL('../assets/self-avatar.svg', import.meta.url).href;
// const assistantAvatar = new URL('../assets/assistant-avatar.svg', import.meta.url).href;

const timeOutSeconds = 15

interface BubbleProps {
    message: Message
}

const NewBubble: React.FC<BubbleProps> = ({message}) => {
    return message.role === "user" ? <SelfBubble message={message}/> : <AssistantBubble message={message}/>
}

const SelfBubble: React.FC<BubbleProps> = ({message}) => {
    return (
        <div className="chat chat-end ml-20">
            <div className="chat-image avatar online">
                <div className="w-10 rounded-full text-2xl">
                    🙂
                </div>
            </div>
            <div className="flex items-center gap-1">
                <time className="text-xs opacity-50">{format(message.createdAt, 'HH:MM')}</time>
                <TextAudioStack message={message}/>
            </div>
        </div>
    )
}

const AssistantBubble: React.FC<BubbleProps> = ({message}) => {
    return (
        <div className="chat chat-start mr-20">
            <div className="chat-image avatar online">
                <div className="w-10 rounded-full text-2xl">
                    😇
                </div>
            </div>
            <div className="flex items-center gap-1 w-full">
                <div className=" w-full"><TextAudioStack message={message}/></div>
            </div>
        </div>
    )
}

interface BubbleProps {
    message: Message
}

const TextAudioStack: React.FC<BubbleProps> = ({message}) => {
    const t = message.text ? <Text text={message.text} role={message.role}/> : null
    const a = message.audio ? <Audio audio={message.audio} role={message.role}/> : null
    return message.whoIsOnTheTop === 'text' ? <div>{t} {a} </div> : <div>{a} {t} </div>
}

interface TextProps {
    text: MText
    role: 'user' | 'assistant'
}

const Text: React.FC<TextProps> = ({text, role}) => {
    // status: 'pending|receiving|done|error'
    const seconds = Math.floor((new Date().getTime() - text.createdAt) / 1000);
    if (text.status === 'pending' && seconds >= timeOutSeconds) {
        text.status = 'error'
        text.errorMessage = 'Error: timeout'
    }
    const textBgColor = role === 'user' ? 'bg-sky-300' : 'bg-white'

    switch (text.status) {
        case 'done':
        case 'receiving':
            return <div className={"chat-bubble max-width chat-bubble-info " + textBgColor}>{text.text}</div>
        case 'pending':
            return <div className={"chat-bubble max-width chat-bubble-info " + textBgColor}>
                <div className="mt-1">
                    <Spin/>
                </div>
            </div>
        case 'error':
            return <div className="chat-bubble chat-bubble-info bg-red-200 w-full max-w-full">{text.errorMessage}</div>
    }
}

interface AudioProps {
    audio: MAudio
    role: 'user' | 'assistant'
}

const Audio: React.FC<AudioProps> = ({audio, role}) => {
    // status: 'pending|receiving|done|error'
    const seconds = Math.floor((new Date().getTime() - audio.createdAt) / 1000);
    if (audio.status === 'pending' && seconds >= timeOutSeconds) {
        audio.status = 'error'
        audio.errorMessage = 'Error: timeout'
    }

    const textBgColor = role === 'user' ? 'bg-sky-300' : 'bg-white'
    switch (audio.status) {
        case 'done':
            return <audio className="w-full white rounded-full" controls={true} autoPlay={false}
                          src={audio.audioUrl}></audio>
        case 'pending':
            return <div className={"chat-bubble max-width chat-bubble-info " + textBgColor}>
                <div className="mt-1">
                    <Spin/>
                </div>
            </div>
        case 'error':
            return <div
                className="chat-bubble chat-bubble-info bg-red-200 w-full  max-w-full">{audio.errorMessage}</div>
    }
}


export default NewBubble