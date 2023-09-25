import React, {useCallback} from "react"
import {Prompt} from "../../../state/promt-state.ts";
import {PromptEditorItem} from "./prompt-editor-item.tsx";
import {Chat} from "../../../state/app-state.ts";
import {useSnapshot} from "valtio/react";
import {PiPlusLight} from "react-icons/pi";
import {cx} from "../../../util/util.tsx";

type Props = {
    chatProxy: Chat
    promptProxy: Prompt
}

export const PromptEditor: React.FC<Props> = ({promptProxy}) => {
    useSnapshot(promptProxy)

    const add = useCallback(() => {
        promptProxy.messages.push({role: "user", content: ""})
    }, [promptProxy.messages]);

    return (
        <div className="flex w-full flex-col">
            {promptProxy.messages.length > 0 ?
                promptProxy.messages.map((m, index) =>
                    <PromptEditorItem messageProxy={m} promptProxy={promptProxy} index={index} key={index}/>
                )
                :
                <PiPlusLight onClick={add}
                             className={cx("m-auto h-5 w-5 rounded-xl stroke-white text-neutral-500",
                                 "bg-white bg-opacity-80 backdrop-blur cursor-pointer")}/>
            }
        </div>
    )
}