import {MyText, newMyText} from "./Text.tsx";
import {Audio, newAudio} from "./Audio.tsx";
import {formatISO} from "date-fns";
// do not change these types by modifying fields, use useConvStore instead

// multi Q&A, representing the whole dialog window
export type Conversation = {
    qaSlice: QueAns[]
    pushQueAns: (queAns: QueAns) => void
    removeQueAns: (queAns: QueAns) => void
    replaceQueAns: (queAns: QueAns) => void
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
}

type Ans = {
    text: MyText
    audio: Audio
}

export const newQueAns = (id: string, questionHasAudio: boolean): QueAns => {

    return {
        id: id,
        que: {
            text: newMyText(),
            audio: questionHasAudio ? newAudio() : undefined
        },
        ans: {
            text: newMyText(),
            audio: newAudio()
        },
        createdAt: formatISO(new Date())
    }
}