import React, {useEffect, useState} from "react"
import {CopyToClipboard} from "react-copy-to-clipboard"
import {MdOutlineContentCopy} from "react-icons/md"
import {cx} from "../../../util/util.tsx"
import {DropDownMenu} from "../compnent/drop-down-menu.tsx"
import {BsTrash3} from "react-icons/bs"
import {audioDb} from "../../../state/db.ts"
import {PiDownloadSimpleLight} from "react-icons/pi"

type CopyProps = {
    text: string
}

export const Copy: React.FC<CopyProps> = ({text}) => {
    const [copied, setCopied] = useState(false)
    useEffect(() => {
        const timer = setTimeout(() => {
            setCopied(false)
        }, 350)

        return () => {
            clearTimeout(timer)
        }
    }, [copied])
    return <CopyToClipboard text={text}
                            onCopy={() => setCopied(true)}>
        <MdOutlineContentCopy className={cx("p-1 rounded transition-all duration-100 h-8 w-8",
            copied ? "scale-125" :
                "h-7 w-7 text-violet-50 hover:text-neutral-500 hover:bg-white/[0.8]"
        )}/>
    </CopyToClipboard>
}

type TextMenuProps = {
    deleteAction: () => void
}

export const TextMenu: React.FC<TextMenuProps> = ({deleteAction}) => {
    return <DropDownMenu list={[
        {
            name: "Delete",
            action: deleteAction,
            icon: <BsTrash3 className="text-red-600"/>
        }
    ]}/>
}

type AudioMenuProps = {
    deleteAction: () => void
    audioId: string
}

export const AudioMenu: React.FC<AudioMenuProps> = ({deleteAction, audioId}) => {
    const [url, setUrl] = useState("")

    useEffect(() => {
            if (audioId) {
                audioDb.getItem<Blob>(audioId, (err, blob) => {
                        if (err) {
                            console.warn("failed to loaded audio blob, audioId:", audioId, err)
                            return
                        }
                        if (blob) {
                            const url = URL.createObjectURL(blob)
                            setUrl(url)
                        } else {
                            console.error("audio blob is empty, audioId:", audioId)
                        }
                    }
                ).then(() => true)
            }
        }, [audioId]
    )

    return <DropDownMenu list={[
        {
            name: "Download",
            download: {
                url: url,
                fileName: audioId
            },
            icon: <PiDownloadSimpleLight className="h-5 w-5"/>
        }, {
            name: "Delete",
            action: deleteAction,
            icon: <BsTrash3 className="text-red-600"/>
        }
    ]}/>
}