import React from 'react'
import {proxy} from "valtio";
import {subscribeKey} from "valtio/utils";

interface MState {
    loadAudio: boolean
    isAttached: boolean
}

interface MessageState {
    record: Record<string, MState>
}

const messageState = proxy<MessageState>({
    record: {}
})

const clear = () => {
    const keys = Object.keys(messageState.record);
    for (const key of keys) {
        delete messageState.record[key]
    }
}
subscribeKey(messageState.record, "a", () => {
    console.log("messageState.state.a changed:", messageState.record["a"])
})

export const Greeting: React.FC = () => {
    return (
        <div>
            <h1 onClick={() => {
                messageState.record["a"].loadAudio = true
            }}>
                set a
            </h1>
            <h1 onClick={() => {
                delete messageState.record["a"]
            }}>
                delete a
            </h1>
            <h1 onClick={() => {
                clear()
            }}>
                clear
            </h1>
        </div>
    )
}


