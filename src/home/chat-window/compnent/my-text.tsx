import React from 'react'
import {cx, formatAgo} from "../../../util/util.tsx"
import {Message} from "../../../data-structure/message.tsx"
import {MySpin} from "./widget/icon.tsx"
import {BsCheck2Circle} from "react-icons/bs"
import {CgDanger} from "react-icons/cg"
import {Theme} from "./theme.ts"
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import SyntaxHighlighter from 'react-syntax-highlighter';

interface TextProps {
    messageSnap: Message
    theme: Theme
}

export const MyText: React.FC<TextProps> = ({messageSnap, theme}) => {
    // console.info("Row rendered, messageSnap.id:", messageSnap.id, new Date().toLocaleString())
    // console.info("messageSnap.text", messageSnap.text)
    return <div
        className={cx("flex flex-col rounded-2xl px-3 pt-1.5 pb-0.5",
            theme.text, theme.bg
        )}>

        <div className={cx("leading-snug prose")}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    a: ({node, children, ...props}) => {
                        if (props.href?.includes('http')) {
                            props.target = '_blank'
                            props.rel = 'noopener noreferrer'
                        }
                        return <a {...props}>{children}</a>
                    },
                    code: ({className, children, ...props}) => {
                        const match = /language-(\w+)/.exec(className || '')
                        return String(children).includes("\n") ? (
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            <SyntaxHighlighter
                                {...props}
                                children={String(children).replace(/\n$/, '')}
                                style={{...theme.code}}
                                language={match?.[1]??"javascript"}
                                PreTag="div"
                            />
                        ) : (
                            <code {...props} className={className} >
                                {children}
                            </code>
                        )
                    }
                }}
            >{messageSnap.text}</ReactMarkdown>
        </div>
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

