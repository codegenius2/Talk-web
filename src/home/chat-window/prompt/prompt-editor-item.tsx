import React, {useCallback, useEffect, useRef, useState} from "react"
import {cx} from "../../../util/util.tsx";
import {blueColor, neutralColor} from "../compnent/theme.ts";
import {LLMMessage, Role} from "../../../shared-types.ts";
import {useSnapshot} from "valtio/react";
import _ from "lodash";
import {AiOutlinePlus} from "react-icons/ai";
import {Prompt} from "../../../state/promt-state.ts";

type Props = {
    promptProxy: Prompt
    messageProxy: LLMMessage
    index: number
}

export const PromptEditorItem: React.FC<Props> = ({promptProxy, messageProxy, index}) => {
    const [hovering, setHovering] = useState(false)

    const {role} = useSnapshot(messageProxy, {sync: true})

    const remove = useCallback(() => {
        promptProxy.messages.splice(index, 1)
    }, [index, promptProxy.messages]);

    const add = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        const newIndex = e.shiftKey || e.altKey || e.ctrlKey || e.metaKey ? index : index + 1
        // eslint-disable-next-line valtio/state-snapshot-rule
        promptProxy.messages.splice(newIndex, 0, {role: "user", content: ""})
    }, [index, promptProxy.messages]);

    return (
        <div className={cx("flex flex-col",
            role === "assistant" && "items-start",
            role === "system" && "items-center",
            role === "user" && "items-end",)}
             onMouseOver={() => setHovering(true)}
             onMouseLeave={() => setHovering(false)}
        >
            <div className="relative flex flex-col gap-[1px] w-[80%]">
                <div className="flex w-full select-none gap-1 justify-center items-center h-6">
                    {hovering &&
                        <>
                            <div className="absolute left-1 flex gap-1">
                                <ActionDot actionType="Delete" clickAction={remove}/>
                                <ActionDot actionType="New" clickAction={add}/>
                            </div>
                            <Dot messageProxy={messageProxy} targetRole={"assistant"}/>
                            <Dot messageProxy={messageProxy} targetRole={"system"}/>
                            <Dot messageProxy={messageProxy} targetRole={"user"}/>
                        </>
                    }
                </div>
                <TextArea messageProxy={messageProxy}/>
            </div>

        </div>
    )
}

type TextAreaProps = {
    messageProxy: LLMMessage
}

const TextArea: React.FC<TextAreaProps> = ({messageProxy}) => {
    const {role, content} = useSnapshot(messageProxy,{sync:true})
    const textAreaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        const textarea = textAreaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [content]);

    let theme
    switch (role) {
        case "user":
            theme = userTheme
            break;
        case "assistant":
            theme = assistantTheme
            break;
        case "system":
            theme = systemTheme
            break;
    }
    return <textarea ref={textAreaRef}
                     onChange={(e) => {
                         e.persist()
                         messageProxy.content = e.target.value
                     }}
                     value={content}
                     className={cx("w-full overflow-auto h-auto rounded-xl whitespace-pre-wrap px-3 pt-1 pb-0.5 outline-none",
                         "resize-none transition-none scrollbar-hidden-instant hover:scrollbar-visible leading-snug",
                         theme.bg, theme.text,
                     )}>
                </textarea>
}

type RoleDotProps = {
    targetRole: Role
    messageProxy: LLMMessage
}

const Dot: React.FC<RoleDotProps> = ({messageProxy, targetRole}) => {
    const [hovering, setHovering] = useState(false)

    let bg = ""
    switch (targetRole) {
        case "assistant":
            bg = "bg-neutral-100"
            break;
        case "system":
            bg = "bg-fuchsia-600"
            break;
        case "user":
            bg = "bg-blue-700"
            break;
    }
    return <div
        onMouseOver={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onClick={() => messageProxy.role = targetRole}
        className={cx("relative h-4 w-4 rounded-full transition-all duration-100 cursor-pointer",
            (targetRole === messageProxy.role || hovering) ? "bg-opacity-100" : "bg-opacity-20",
            hovering && "scale-125",
            bg,
        )}>
        {hovering &&
            <div className=" bg-neutral-200/[0.8] rounded-full px-2 fixed -top-6 left-1/2 -translate-x-1/2
            transform text-sm text-neutral-800">
                {_.capitalize(targetRole)}
            </div>
        }
    </div>
}

type ActionDotProps = {
    actionType: 'Delete' | 'New'
    clickAction: (e: React.MouseEvent) => void
}

const ActionDot: React.FC<ActionDotProps> = ({actionType, clickAction}) => {
    const [hovering, setHovering] = useState(false)

    return <div
        onMouseOver={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onClick={clickAction}
        className={cx("relative flex justify-center items-center h-4 w-4 rounded-full transition-all duration-100",
            hovering ? "scale-125 bg-neutral-600/[0.8] text-neutral-100" : "bg-neutral-200/[0.8] text-neutral-600 cursor-pointer",
        )}>
        {actionType === "New" && <AiOutlinePlus className="h-full w-full"/>}
        {actionType === "Delete" && <AiOutlinePlus className="h-full w-full rotate-45"/>}
        {hovering &&
            <div className="fixed -top-6 left-1/2 -translate-x-1/2 transform bg-neutral-200/[0.8] rounded-full px-2
             text-sm text-neutral-800">
                {actionType}
            </div>
        }
    </div>
}


const userTheme = {
    bg: blueColor.bg,
    text: blueColor.text,
}

const assistantTheme = {
    bg: neutralColor.bg,
    text: neutralColor.text,
}

const systemTheme = {
    bg: "bg-fuchsia-600 bg-opacity-80 backdrop-blur",
    text: "text-violet-100",
}
