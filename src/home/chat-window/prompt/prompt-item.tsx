import React, {useCallback, useState} from "react"
import {CloseIcon} from "../compnent/widget/icon.tsx";
import {cx} from "../../../util/util.tsx";
import {clonePrompt, deletePrompt, Prompt, promptCountState, syncPromptIdCounts} from "../../../state/promt-state.ts";
import {Chat} from "../../../state/app-state.ts";
import {useSnapshot} from "valtio/react";
import {MdOutlineContentCopy} from "react-icons/md";
import _ from "lodash";

type Props = {
    chatProxy: Chat
    prompt: Prompt
}

export const PromptItem: React.FC<Props> = ({chatProxy, prompt}) => {
    const {promptId} = useSnapshot(chatProxy)
    const {counts} = useSnapshot(promptCountState)
    const {id, name, messages} = useSnapshot(prompt)
    const [over, setOver] = useState(false)

    const select = useCallback(() => {
        chatProxy.promptId = prompt.id
        syncPromptIdCounts()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clone = useCallback((event: React.MouseEvent<SVGElement>) => {
        event.stopPropagation()
        clonePrompt(prompt)
        syncPromptIdCounts()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const delete_ = useCallback((event: React.MouseEvent<SVGElement>) => {
        event.stopPropagation()
        deletePrompt(prompt.id)
        if (chatProxy.promptId === prompt.id) {
            chatProxy.promptId = ""
        }
        syncPromptIdCounts()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div
            onClick={select}
            onMouseOver={() => setOver(true)}
            onMouseLeave={() => setOver(false)}
            className={cx("relative flex justify-between items-center gap-0.5 w-full px-1 h-14 font-medium",
                "rounded-lg transition-all duration-100 bg-white select-none",
                promptId === id ? "bg-opacity-75" : "bg-opacity-40",
                promptId !== id && "hover:bg-neutral-100/[0.6]",
            )}>
            <div
                className={cx("flex flex-col overflow-hidden py-1 pr-2 pl-3 text-neutral-800 gap-y-0.5")}>
                <div className="flex justify-between">
                    <p className="truncate ...">{name}</p>
                </div>
                <div>
                    <div className="truncate text-sm text-neutral-600 ...">
                        {messages.length > 0 &&
                            <div>{_.capitalize(messages[0].role)}: {messages[0].content}</div>
                        }
                    </div>
                </div>
            </div>
            {over &&
                <div className="ml-auto flex items-center justify-center">
                    <MdOutlineContentCopy
                        onClick={clone}
                        className="h-6 w-6 rounded-md text-neutral-500 p-0.5 hover:bg-neutral-500/[0.4] hover:text-neutral-100"/>
                    <CloseIcon
                        onClick={delete_}
                        className="h-6 w-6 rounded-lg text-neutral-500 p-0.5 hover:bg-neutral-500/[0.4] hover:text-neutral-100"/>
                </div>
            }
            {(counts[id] ?? 0) > 0 &&
                <div>
                    <div className="absolute top-0.5 right-1 flex items-center justify-center p-1 h-4 rounded-full
                 bg-neutral-100/[0.3]  text-cyan-600">
                        {counts[id]}
                    </div>
                </div>
            }
        </div>

    )
}
