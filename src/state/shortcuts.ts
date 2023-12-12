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
        name: "Send with gpt-4-1106-preview model",
        key: "Enter",
        mKeys: ["Meta"]
    },
    sendWithBestModelAndZeroAttachedMessage: {
        name: "Send with gpt-4-1106-preview model and 0 attached message",
        key: "Enter",
        mKeys: ["Meta", "Control"]
    }
})

const mods: ModifierKey[] = ["Meta", "Control", "Alt", "Shift"]
export const matchKeyComobo = (keyCombo: KeyCombo, e: React.KeyboardEvent<HTMLTextAreaElement>): boolean => {
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