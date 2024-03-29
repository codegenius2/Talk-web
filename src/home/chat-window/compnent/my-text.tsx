import React, {memo, useEffect, useState} from 'react'
import {cx, formatAgo} from "../../../util/util.tsx"
import {Message} from "../../../data-structure/message.tsx"
import {MySpin} from "./widget/icon.tsx"
import {BsCheck2Circle} from "react-icons/bs"
import {CgDanger} from "react-icons/cg"
import {Theme} from "./theme.ts"
import MarkdownIt from "markdown-it/lib"
import hljs from 'highlight.js'
import 'highlight.js/styles/panda-syntax-dark.css'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import taskList from "markdown-it-task-lists"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import misub from "markdown-it-sub"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import misup from "markdown-it-sup"
import mila from "markdown-it-link-attributes"
import mimt from "markdown-it-multimd-table"
import miemoji from "markdown-it-emoji"
import mifoot from "markdown-it-footnote"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import './widget/highlightjs-plugins/copy-button-plugin.css'
import {LanguageLabelPlugin} from "./widget/highlightjs-plugins/language-label-plugin.tsx";
import {CopyButtonPlugin} from "./widget/highlightjs-plugins/copy-button-plugin.tsx";
import {debounce, throttle} from "lodash";
import {useSnapshot} from "valtio/react";
import {appState} from "../../../state/app-state.ts";
import {controlState} from "../../../state/control-state.ts";

hljs.configure({
    ignoreUnescapedHTML: true,
});
hljs.addPlugin(new LanguageLabelPlugin());
hljs.addPlugin(new CopyButtonPlugin());

const ha = throttle(debounce(() => hljs.highlightAll(), 1000, {
    'trailing': true
}), 1000);

const haNow = () => hljs.highlightAll()

interface TextProps {
    messageSnap: Message
    theme: Theme
}

export const MyText: React.FC<TextProps> = ({messageSnap, theme}) => {
    // console.info("MyText rendered, messageSnap.id:", messageSnap.id, new Date().toLocaleString())
    // console.info("messageSnap.text", messageSnap.text)
    const {showMarkdown} = useSnapshot(appState.pref)
    const {isWindowsBlurred} = useSnapshot(controlState)
    const [text, setText] = useState(messageSnap.text)
    const [hovering, setHovering] = useState(false)

    // stop updating text when mouse hovering
    useEffect(() => {
        if (!hovering) {
            controlState.isTextPending = false
        } else {
            controlState.isTextPending = messageSnap.status === "typing"
        }
    }, [messageSnap.status, hovering]);

    useEffect(() => {
        if (isWindowsBlurred) {
            setHovering(false)
        }
    }, [isWindowsBlurred]);

    useEffect(() => {
        if (!controlState.isTextPending) {
            setText(messageSnap.text)
            ha()
        }
    }, [messageSnap]);

    useEffect(() => {
        // apply highlight plugin immediately after message is fully received
        if (messageSnap.status === 'received') {
            haNow()
        }
    }, [messageSnap.status]);

    return <div
        className={cx("flex flex-col rounded-2xl px-3 pt-1.5 pb-0.5",
            theme.text, theme.bg
        )}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
    >

        <div className={cx("leading-snug",
            "prose-pre:p-0 prose-pre:pt-3 prose-li:marker:text-neutral-600"
        )}>
            {messageSnap.role === 'assistant' && showMarkdown ?
                <MDText text={text}/>
                :
                <p className="leading-snug whitespace-pre-wrap break-words">{text}</p>
            }
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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const md = new MarkdownIt({
    linkify: true,
    typographer: true,
    highlight: (str, lang) => {
        if (!lang || !hljs.getLanguage(lang)) {
            lang = "plaintext"
        }
        try {
            return `<pre class="hljs">` +
                `<code class='hljs language-${lang}'>` +
                `${hljs.highlight(str, {language: lang, ignoreIllegals: true}).value}` +
                "</code>" +
                "</pre>"
        } catch (_) { /* empty */
        }
    },
})
    .use(taskList, {enabled: true, label: true})
    .use(mimt)
    .use(mifoot)
    .use(miemoji)
    .use(misub)
    .use(misup)
    .use(mila, {
        attrs: {
            target: "_blank",
            rel: "noopener noreferrer",
        },
    })

type Props = {
    text: string
}

const MDText = memo(function MDText({text}: Props) {
    const h = md.render(text)
    return <div className="leading-snug prose" dangerouslySetInnerHTML={{__html: h}}/>
})

