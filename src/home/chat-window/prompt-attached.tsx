import React from "react"
import {Chat} from "../../state/app-state.ts"
import {escapeSpaceKey} from "../../util/util.tsx";
import {PromptList} from "./prompt/prompt-list.tsx";
import {AttachedPreview} from "./attached/attached-preview.tsx";

type MLProps = {
    chatProxy: Chat
}

// prompt and attached
export const PromptAttached: React.FC<MLProps> = ({chatProxy}) => {
    // console.info("Promptory rendered", new Date().toLocaleString())

    return (
        <div
            onKeyDown={escapeSpaceKey}
            onKeyUp={escapeSpaceKey}
            className="flex w-full gap-2 overflow-hidden divide-x-1 divide-neutral-500">
            <PromptList chatProxy={chatProxy}/>
            <AttachedPreview chatProxy={chatProxy}/>
        </div>
    )
}
