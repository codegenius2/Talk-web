import {MyText, newMyText} from "./text.tsx";
import {Audio, newAudio} from "./audio.tsx";
import {formatISO} from "date-fns";
import {Ability, ChatGPTLLM} from "./ability/client-ability.tsx";
import {Message} from "../api/restful.ts";

// Data structure that represents the conversation. Each "QueAns" constitutes a complete round trip.

// do not change these types by modifying fields, use useConvStore instead

export type Conversation = {
    qaSlice: QueAns[]
    pushQueAns: (queAns: QueAns) => void
    removeQueAns: (queAns: QueAns) => void
    updateQueAns: (queAns: QueAns) => void
    updateQueText: (id: string, myText: MyText) => void
    updateQueAudio: (id: string, audio: Audio) => void
    updateAnsText: (id: string, myText: MyText) => void
    updateAnsAudio: (id: string, audio: Audio) => void
    getQueText: (id: string) => MyText
    getQueAudio: (id: string) => Audio | undefined
    getAnsText: (id: string) => MyText
    getAnsAudio: (id: string) => Audio

    ability: Ability
    setAbility: (ability: Ability) => void
    getChatGPT: () => ChatGPTLLM
    setChatGPT: (chatGPT: ChatGPTLLM) => void
}

// exactly one pair of Q&A
export type QueAns = {
    id: string;
    que: Que
    ans: Ans
    createdAt: string // did not use Date due to persist issue: when restored from db, it becomes a string
}

type Que = {
    text: MyText
    audio?: Audio // if user sends only words to dialog window, those words will not be synthesized to audio
    textFirst: boolean
}

type Ans = {
    text: MyText
    audio: Audio
}

export const newQueAns = (id: string, textFirst: boolean, queText: MyText, audio?: Audio): QueAns => {

    return {
        id: id,
        que: {
            text: queText,
            audio: audio,
            textFirst: textFirst
        },
        ans: {
            text: newMyText("receiving", ""),
            audio: newAudio("receiving")
        },
        createdAt: formatISO(new Date())
    }
}

export const historyMessages = (qaSlice: QueAns[], maxHistory: number): Message[] => {
    if (maxHistory <= 0) {
        return []
    }
    const messages: Message[] = []
    for (const qa of qaSlice.slice().reverse()) {
        if (messages.length === maxHistory) {
            break
        }
        if (qa.ans.text.status === 'received') {
            messages.push({role: "assistant", content: qa.ans.text.text})
            if (messages.length === maxHistory) {
                break
            }
        }
        if (['received', 'sent'].includes(qa.que.text.status)) {
            messages.push({role: "user", content: qa.que.text.text})
        }
    }
    return messages.reverse()
}
