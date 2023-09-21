import React from 'react';
import {cx, formatAgo} from "../../../util/util.tsx";
import {Message} from "../../../data-structure/message.tsx";
import {MySpin} from "./widget/icon.tsx";
import {BsCheck2Circle} from "react-icons/bs";
import {CgDanger} from "react-icons/cg";
import {Theme} from "./theme.ts";

interface TextProps {
    messageSnap: Message
    theme: Theme
}

export const MyText: React.FC<TextProps> = ({messageSnap, theme}) => {
    return <div
        className={cx("flex flex-col rounded-2xl whitespace-pre-wrap px-3 pt-1.5 pb-0.5",
            theme.text, theme.bg
        )}>
        <p className="">{messageSnap.text}</p>
        <div className="flex justify-end gap-1 pointer-events-none">
            <p className="text-xs inline whitespace-nowrap" data-pseudo-content={formatAgo(messageSnap.createdAt)}></p>
            {['sent', 'received'].includes(messageSnap.status) &&
                <BsCheck2Circle className={"h-4 w-4" + theme.normalIcon}/>
            }
            {messageSnap.status === 'sending' &&
                <MySpin className={"h-4 w-4 " + theme.normalIcon}/>
            }
            {messageSnap.status === 'error' &&
                <div className="leading-none">
                    <CgDanger className={"w-4 h-4 mr-1 inline " + theme.warningIcon}/>
                    <p className="text-xs inline">{messageSnap.errorMessage}</p>
                </div>
            }
        </div>
    </div>
}

