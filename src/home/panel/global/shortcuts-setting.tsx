import React, {KeyboardEventHandler, ModifierKey, useCallback, useEffect, useRef, useState} from 'react'
import {appState} from "../../../state/app-state.ts"
import {useSnapshot} from "valtio/react"
import {KeyCombo, Shortcuts} from "../../../state/shortcuts.ts";
import {cx} from "../../../util/util.tsx";

export const ShortcutsSetting: React.FC = () => {
    const {shortcuts} = useSnapshot(appState.pref)
    // console.log("ShortcutsSetting rendered", appState.pref.shortcuts)
    return <div
        className="relative flex h-full select-none flex-col w-full before:bg-white before:bg-opacity-40
         pt-1 pb-3 px-3 gap-1 before:backdrop-hack before:backdrop-blur before:rounded-xl">
        <div className="flex justify-between items-center w-full px-3 ">
            <p className="prose text-lg text-neutral-600">Shortcuts</p>
        </div>
        <div
            className="flex flex-col justify-start items-center gap-2 py-2 border-2 border-neutral-500 border-dashed
            rounded-lg px-3 w-full divide-y-[1px] divide-neutral-500 divide-opacity-80">
            {Object.keys(shortcuts).map(item =>
                <KeyComboUI
                    key={item}
                    keyComboSnap={shortcuts[item as keyof Shortcuts] as KeyCombo}
                    keyCombo={appState.pref.shortcuts[item as keyof Shortcuts]}/>)
            }
        </div>
    </div>
}

type Props = {
    keyComboSnap: KeyCombo
    keyCombo: KeyCombo
}

export const KeyComboUI: React.FC<Props> = ({keyComboSnap, keyCombo}) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

    const [key, setKey] = useState(keyComboSnap.key)
    const [cmd, setCmd] = useState(keyComboSnap.mKeys.includes("Meta"))
    const [ctrl, setCtrl] = useState(keyComboSnap.mKeys.includes("Control"))
    const [opt, setOpt] = useState(keyComboSnap.mKeys.includes("Alt"))
    const [shift, setShift] = useState(keyComboSnap.mKeys.includes("Shift"))

    const [editingKey, setEditingKey] = useState(false)
    const editingRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        const mods: ModifierKey[] = []
        if (cmd) {
            mods.push("Meta")
        }
        if (ctrl) {
            mods.push("Control")
        }
        if (opt) {
            mods.push("Alt")
        }
        if (shift) {
            mods.push("Shift")
        }

        keyCombo.key = key
        keyCombo.mKeys = mods

    }, [cmd, ctrl, opt, shift, key, keyCombo]);


    const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = useCallback((event) => {
        event.stopPropagation()
        event.preventDefault()

        if (event.key !== '' && event.key != "Escape") {
            setKey(event.key)
        }
        setEditingKey(false)
    }, [setKey])

    return <div className="flex justify-between items-center w-full">

        <div className="flex flex-col justify-center gap-0.5">
            <p className="prose text text-neutral-600">
                {keyComboSnap.name}
            </p>
            <div className="flex gap-1">
                {editingKey ?
                    <textarea
                        ref={editingRef}
                        onBlur={() => setEditingKey(false)}
                        onKeyDown={handleKeyDown}
                        className={cx("rounded-lg border-[1px] border-neutral-500 px-1.5 bg-white bg-opacity-50",
                            "mr-2 outline-none h-7 resize-none w-12 text-center")}>
                    </textarea>
                    :
                    <div
                        onClick={() => {
                            setEditingKey(true)
                            setTimeout(() => {
                                if (editingRef.current) {
                                    editingRef.current.focus()
                                }
                            }, 20)
                        }}
                        className={cx("flex items-center justify-center rounded-lg border-[1px]" +
                            "border-neutral-500 px-1.5 bg-white bg-opacity-50 mr-2 h-7 min-w-12")}>
                        {keyComboSnap.key === " " ? "Space" : keyComboSnap.key}
                    </div>
                }
                <div
                    onClick={() => setCmd(!cmd)}
                    className={cx(
                        "flex items-center mt-auto rounded-lg px-1.5 text-sm",
                        cmd ? "bg-blue-600 text-neutral-100" : "text-neutral-800 bg-white bg-opacity-30"
                    )}>
                    {isMac ? "⌘" : "Win"}
                </div>
                <div
                    onClick={() => setCtrl(!ctrl)}
                    className={cx(
                        "flex items-center mt-auto rounded-lg px-1.5 text-sm",
                        ctrl ? "bg-blue-600 text-neutral-100" : "text-neutral-800 bg-white bg-opacity-30"
                    )}>
                    {isMac ? "⌃" : "Ctrl"}
                </div>
                <div
                    onClick={() => setOpt(!opt)}
                    className={cx(
                        "flex items-center mt-auto rounded-lg px-1.5 text-sm",
                        opt ? "bg-blue-600 text-neutral-100" : "text-neutral-800 bg-white bg-opacity-30"
                    )}>
                    {isMac ? "⌥" : "Alt"}
                </div>
                <div
                    onClick={() => setShift(!shift)}
                    className={cx(
                        "flex items-center mt-auto rounded-lg px-1.5 text-sm",
                        shift ? "bg-blue-600 text-neutral-100" : "text-neutral-800 bg-white bg-opacity-30"
                    )}>
                    {isMac ? "⇧" : "Shift"}
                </div>
            </div>
        </div>
    </div>
}

