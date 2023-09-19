import React from 'react';
import {cx, formatAgo} from "../../../util/util.tsx";
import {Message} from "../../../data-structure/message.tsx";
import {CgDanger} from "react-icons/cg";
import {Theme} from "./theme.ts";

interface TextProps {
    messageSnap: Message
    theme: Theme
}

export const MyError: React.FC<TextProps> = ({messageSnap, theme}) => {
    return <div
        className={cx("flex flex-col rounded-2xl whitespace-pre-wrap px-3 pt-1.5 pb-0.5",
            theme.text, theme.bg
        )}>
        <div className="leading-none">
            <CgDanger className={"w-4 h-4 mr-1 inline select-none" + theme.warningIcon}/>
            <p className="inline">{messageSnap.errorMessage}</p>
        </div>
        <div className="flex justify-end items-center gap-1 select-none">
            <p className="text-xs inline" data-pseudo-content={formatAgo(messageSnap.createdAt)}/>
        </div>
    </div>
}

