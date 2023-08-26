// do not change these types by modifying fields, using the defined functions instead

import {formatISO} from "date-fns";

type TextState = {
    contentLastUpdatedAt?: string
    // 'receiving' means content is still receiving new chars from server
    // if content is not  updated in the past X seconds
    // status 'receiving' should be changed to 'half-done'
    status: 'pending' | 'receiving' | 'half-done' | 'done' | 'error'
    errorMessage?: string
}

export type MyText = TextState & { content: string }

export const newMyText = (queText?: string): MyText => {
    return {content: queText ?? "", status: 'pending'}
}

export const onNewContent = (t: MyText, newContent: string, eof: boolean): MyText => {
    switch (t.status) {
        case "pending":
        case "receiving":
            return {
                ...t,
                content: t.content + newContent,
                contentLastUpdatedAt: formatISO(new Date()),
                status: eof ? 'done' : 'receiving'
            }
        case "half-done":
            console.warn("bad state: updating a half-done text", t.content, newContent)
            return {...t}
        case "done":
            throw new Error("invalid state")
        case "error":
            throw new Error("invalid state")
    }
}

export const onError = (t: MyText, errMsg: string): MyText => {
    switch (t.status) {
        case "pending":
        case "receiving":
        case "half-done":
            return {
                ...t,
                errorMessage: errMsg,
                status: 'error'
            }
        case "done":
            throw new Error("invalid state, errMsg:" + errMsg)
        case "error":
            throw new Error("invalid state, errMsg:" + errMsg)
    }
}