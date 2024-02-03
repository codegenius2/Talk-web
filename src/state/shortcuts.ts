import React, {ModifierKey} from "react";

export type Shortcuts = {
    send: KeyCombo
    newLine: KeyCombo
    sendZeroAttachedMessage: KeyCombo
    sendWithBestModel: KeyCombo
    sendWithBestModelAndZeroAttachedMessage: KeyCombo
}

export type KeyCombo = {
    name: string,
    key: string,
    mKeys: ModifierKey[]
}


export const defaultShortcuts = (): Shortcuts => ({
    send: {
        name: "Send",
        key: "Enter",
        mKeys: []
    },
    newLine: {
        name: "New line",
        key: "Enter",
        mKeys: ["Shift"]
    },
    sendZeroAttachedMessage: {
        name: "Send with 0 attached message",
        key: "Enter",
        mKeys: ["Control"]
    },
    sendWithBestModel: {
        name: `Send with ${bestModel} model`,
        key: "Enter",
        mKeys: ["Meta"]
    },
    sendWithBestModelAndZeroAttachedMessage: {
        name: `Send with ${bestModel} model and 0 attached message`,
        key: "Enter",
        mKeys: ["Meta", "Control"]
    }
})

export const bestModel = "gpt-4-turbo-preview"

const mods: ModifierKey[] = ["Meta", "Control", "Alt", "Shift"]
export const matchKeyCombo = (keyCombo: KeyCombo, e: React.KeyboardEvent<HTMLTextAreaElement>): boolean => {
    if (e.key !== keyCombo.key) {
        return false
    }
    for (const m of mods) {
        if (e.getModifierState(m) !== keyCombo.mKeys.includes(m)) {
            return false
        }
    }
    return true
}