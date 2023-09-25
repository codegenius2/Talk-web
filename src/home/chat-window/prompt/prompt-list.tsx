import React, {useEffect, useRef, useState} from "react"
import {Chat} from "../../../state/app-state.ts"
import {useSnapshot} from "valtio/react"
import {newPrompt, Prompt, promptState} from "../../../state/promt-state.ts"
import {layoutState} from "../../../state/layout-state.ts"
import {cx} from "../../../util/util.tsx"
import {CiSearch} from "react-icons/ci"
import {CloseIcon} from "../compnent/widget/icon.tsx"
import {PromptItem} from "./prompt-item.tsx"
import {PiPlusLight} from "react-icons/pi";

type Props = {
    chatProxy: Chat
}

export const PromptList: React.FC<Props> = ({chatProxy}) => {
    console.info("Prompts rendered", new Date().toLocaleString())
    const {promptId} = useSnapshot(chatProxy)
    const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([])
    const {prompts} = useSnapshot(promptState)
    const {isPromptoryPinning} = useSnapshot(layoutState)
    const [searchText, setSearchText] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const searchRef = useRef<HTMLInputElement>(null)
    const selectedRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const keywords = searchText.split(" ")
            .map(it => it.trim().toLowerCase())
            .filter(it => it !== "")

        let ps: Prompt[]
        if (keywords.length === 0) {
            // eslint-disable-next-line valtio/state-snapshot-rule
            ps = promptState.prompts
        } else {
            ps = promptState.prompts.filter(p => {
                const ks = keywords.slice()

                return !ks.some(k => !p.name.toLowerCase().includes(k) &&
                    !p.messages.some(m => m.content.toLowerCase().includes(k))
                )
            })
        }
        setFilteredPrompts(ps)
    }, [searchText, prompts, setFilteredPrompts])

    // scroll to selected item
    useEffect(() => {
        if (isPromptoryPinning && !isSearching && containerRef.current) {
            setTimeout(() => {
                if (selectedRef.current && containerRef.current) {
                    const containerRect = containerRef.current.getBoundingClientRect()
                    const selectedRect = selectedRef.current.getBoundingClientRect()

                    const relativeTopPosition = selectedRect.top - containerRect.top
                    const scrollToPosition = relativeTopPosition - containerRect.height / 2 + selectedRect.height / 2

                    containerRef.current.scrollBy({
                        left: 0,
                        top: scrollToPosition,
                        behavior: 'smooth'
                    })
                }
            })
        }
    }, [isSearching, isPromptoryPinning])

    return (
        <div className="flex h-full flex-col gap-2 min-w-[18rem] max-w-[18rem] p4-2">
            <div className="flex gap-1 pr-2 items-center">
                <div
                    onClick={() => {
                        setIsSearching(true)
                        setTimeout(() => searchRef.current?.select())
                    }}
                    onBlur={() => {
                        if (searchText.trim() === "") {
                            setIsSearching(false)
                        }
                    }}
                    className={cx("flex w-full bg-neutral-100/[0.4] items-center justify-center gap-2 rounded-lg",
                        isSearching ? "justify-between" : "justify-center")}>
                    {!isSearching && <CiSearch/>}
                    {!isSearching &&
                        <div
                            className="flex h-8 select-none justify-center items-center text-neutral-600 prose">Search
                            Prompts</div>}
                    {isSearching &&
                        <input
                            ref={searchRef}
                            type="text"
                            name="search prompt"
                            className="ml-2 h-8 w-full resize-none bg-transparent text-lg text-neutral-600 outline-none caret prose"
                            value={searchText}
                            onChange={(e) => {
                                setSearchText(e.target.value)
                            }}
                            onKeyDown={(e) => {
                                e.stopPropagation()
                                if (e.key === "Escape") {
                                    setIsSearching(false)
                                    setSearchText("")
                                }
                            }}
                            onClick={e => e.stopPropagation()}
                        />}
                    {isSearching &&
                        <div
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsSearching(false)
                                setSearchText("")
                            }}
                            className="rounded-full text-neutral-500 p-0.5 bg-neutral-200 mr-1
                            hover:bg-neutral-500/[0.4] hover:text-neutral-100">
                            <CloseIcon className="h-5 w-5"/>
                        </div>}
                </div>
                {!isSearching &&
                    <div
                        className="flex justify-center items-center rounded-xl stroke-white text-neutral-500
                 bg-neutral-100/[0.4] backdrop-blur cursor-pointer w-6 h-6"
                        onClick={newPrompt}
                    >
                        <PiPlusLight size={24}/>
                    </div>
                }

            </div>
            <div
                ref={containerRef}
                className="w-full overflow-y-auto scrollbar-hidden hover:scrollbar-visible pr-1">
                <div className="flex cursor-pointer flex-col gap-1">
                    {filteredPrompts.map(p =>
                        <div ref={p.id === promptId ? selectedRef : null} key={p.id}>
                            <PromptItem key={p.id} chatProxy={chatProxy} prompt={p}/>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
