import {MyText, newMyText} from "./Text.tsx";
import {Audio, newAudio} from "./Audio.tsx";
import {formatISO} from "date-fns";
// do not change these types by modifying fields, use useConvStore instead

// multi Q&A, representing the whole dialog window
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