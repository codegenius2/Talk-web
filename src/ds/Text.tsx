// do not change these types by modifying fields, using the defined functions instead

import {formatISO} from "date-fns";

export type TextStatus = 'sending' | 'sent' | 'receiving' | 'typing' | 'half-received' | 'received' | 'error'

export type MyText = {
    textLastUpdatedAt?: string
    // 'receiving' means content is still receiving new chars from server
    // if content is not  updated in the past X seconds
    // status 'receiving' should be changed to 'half-received'
    status: TextStatus
    errorMessage?: string
    text: string;
}

export const newMyText = (status: TextStatus, text: string): MyText => {
    return {
        status: status,
        text: text
    }
}

export const sent = (prev: MyText): MyText => {
    switch (prev.status) {
        case "sending":
            return {
                ...prev,
                status: 'sent'
            }
        case "sent":
        case "receiving":
        case "typing":
        case "half-received":
        case "received":
        case "error":
            return {...prev}
    }
}

export const newText = (prev: MyText, newText: string, eof: boolean): MyText => {
    switch (prev.status) {
        case "sending":
        case "sent":
        case "receiving":
        case "typing":
            return {
                ...prev,
                text: prev.text + newText,
                textLastUpdatedAt: formatISO(new Date()),
                status: eof ? 'received' : 'typing'
            }
        case "half-received":
            console.warn("bad state: updating a half-received text", prev.text, newText);
            return {...prev,}
        case "received":
        case "error":
            throw new Error("invalid state");
    }
}

export const error = (prev: MyText, errMsg: string): MyText => {
    switch (prev.status) {
        case "sending":
        case "sent":
        case "receiving":
        case "typing":
        case "half-received":
            return {
                ...prev,
                errorMessage: errMsg,
                status: 'error'
            }
        case "received":
            console.error("invalid state, errMsg:" + errMsg)
            return {...prev,}
        case "error":
            console.error("invalid state, errMsg:" + errMsg)
            return {...prev,}
    }
}