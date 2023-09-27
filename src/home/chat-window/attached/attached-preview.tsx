import React, {useEffect, useRef, useState} from "react"
import {Chat} from "../../../state/app-state.ts"
import {useSnapshot} from "valtio/react";
import {attachedMessages} from "../../../api/restful/util.ts";
import {LLMMessage} from "../../../shared-types.ts";
import {subscribeKey} from "valtio/utils";
import {layoutState} from "../../../state/layout-state.ts";
import {findPrompt, Prompt, promptState} from "../../../state/promt-state.ts";
import {AttachedItem} from "./attached-item.tsx";
import {cx} from "../../../util/util.tsx";
import {PromptEditor} from "../prompt/prompt-editor.tsx";
import {CloseIcon} from "../compnent/widget/icon.tsx";
import {subscribe} from "valtio";

type HPProps = {
    chatProxy: Chat
}

export const AttachedPreview: React.FC<HPProps> = ({chatProxy}) => {
    // console.info("AttachedPreview rendered", new Date().toLocaleString())
    const {isPAFloating, isPAPinning} = useSnapshot(layoutState)
    const [hist, setHist] = useState<LLMMessage[]>([])
    const [promptProxy, setPromptProxy] = useState<Prompt | undefined>()
    const [inputText, setInputText] = useState("")
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const updateMessages = () => {
            if (isPAFloating || isPAPinning) {
                const h = attachedMessages(chatProxy.messages, chatProxy.option.llm.maxAttached)
                setHist(h)
            }
        }
        updateMessages()
        const un1 = subscribeKey(chatProxy.option.llm, "maxAttached", updateMessages)
        const un2 = subscribeKey(chatProxy, "messages", updateMessages)

        const updatePrompt = () => {
            if (isPAFloating || isPAPinning) {
                if (chatProxy.promptId !== "") {
                    const p = findPrompt(chatProxy.promptId)
                    setPromptProxy(p)
                    if (!p) {
                        console.error("prompt not found", chatProxy.promptId)
                        chatProxy.promptId = ""
                    }
                }
            }
        }
        updatePrompt()
        const un3 = subscribeKey(chatProxy, "promptId", updatePrompt)
        const un31 = subscribeKey(promptState, "prompts", updatePrompt)

        const updateInputText = () => {
            if (isPAFloating || isPAPinning) {
                setInputText(chatProxy.inputText)
            }
        }
        updateInputText()
        const un4 = subscribeKey(chatProxy, "inputText", updatePrompt)

        return () => {
            un1()
            un2()
            un3()
            un31()
            un4()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPAFloating, isPAPinning]);

    useEffect(() => {
        const scroll = () => {
            if (scrollRef.current) {
                scrollRef.current.scrollTop += layoutState.PAButtonWheelDeltaY
            }
        }
        scroll()
        return subscribe(layoutState, scroll)
    }, []);
    return (
        <div
            className={cx("flex flex-col w-full pb-2",
                "bg-opacity-40 backdrop-blur bg-neutral-200 rounded-lg"
            )}>
            <div className="flex items-center justify-between gap-2">
                <div className="select-none text-xl text-neutral-600 ml-2.5">Attached Messages Preview</div>
                <div
                    onClick={() => layoutState.isPAPinning = false}
                    className={cx("rounded-full mr-1 text-neutral-500 p-0.5 bg-neutral-100/[0.3]",
                        "hover:bg-neutral-500/[0.4] hover:text-neutral-100 transition duration-300 cursor-pointer",
                        isPAPinning ? "" : "opacity-0"
                    )}>
                    <CloseIcon className="h-5 w-5"/>
                </div>
            </div>
            <div
                ref={scrollRef}
                className={cx("flex flex-col gap-3 pt-1 overflow-y-auto overflow-x-hidden",
                    (isPAFloating) && "scrollbar-visible-neutral-300",
                    (isPAPinning) && "scrollbar-hidden hover:scrollbar-visible-neutral-300",
                    (!isPAFloating && !isPAPinning) && "scrollbar-gone",
                )}>
                <div
                    className="flex flex-col px-1 ml-1.5 mr-0.5 pb-3 border-2 border-dashed border-neutral-500 rounded-lg ">
                    {promptProxy ?
                        <>
                            <PromptEditorTitle promptProxy={promptProxy}/>
                            <PromptEditor chatProxy={chatProxy} promptProxy={promptProxy}/>
                        </>
                        :
                        <EmptyPromptEditorTitle/>
                    }
                </div>
                <div className="flex flex-col gap-1 px-1.5 pb-3">
                    {
                        hist.map((h, index) => (
                                <div key={index}>
                                    <AttachedItem message={h}/>
                                </div>
                            )
                        )
                    }
                    {inputText &&
                        <div>
                            <AttachedItem message={{role: "user", content: inputText}}/>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}


type Props = {
    promptProxy: Prompt
}

const PromptEditorTitle: React.FC<Props> = ({promptProxy}) => {
    const {name} = useSnapshot(promptProxy, {sync: true})

    return (
        <div className="flex items-center text-lg gap-1">
            <div className="text-neutral-600 select-none">Prompt:</div>
            <input name="prompt name"
                   style={{width: `${name.length + 1}ch`}}
                   className="whitespace-nowrap outline-none bg-transparent text-neutral-800"
                   value={name}
                   onChange={e => promptProxy.name = e.target.value}
            />
        </div>
    )
}

const EmptyPromptEditorTitle = () => {
    return (
        <div className="flex items-center text-lg gap-1 text-neutral-600">
            <div className="select-none">Prompt:</div>
            <div className="bg-transparent line-through">None</div>
        </div>
    )
}