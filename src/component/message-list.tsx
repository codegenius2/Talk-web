import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import {useConvStore} from "../state/conversation.tsx";
import {QueAns} from "../data-structure/conversation.tsx";
import {Audio} from "./audio.tsx";
import {AssistantText, SelfText} from "./text.tsx";
import ErrorBoundary from "./error-boundary.tsx";

// Now you can use <List {...props} />
export const MessageList: React.FC = () => {
    const qaSlice: QueAns[] = useConvStore((state) => state.qaSlice)
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current!.scrollIntoView({behavior: 'instant'});
    }); // run once on mount

    return (<div
            className="overflow-y-auto overflow-x-hidden w-full hide-scrollbar hover:show-scrollbar"
        >
            <div className="flex flex-col gap-5 rounded-lg w-full justify-end">
                {/*crucial; don't merge the 2 divs above, or sc*/}
                {qaSlice.map((qa) =>
                    <Qa key={qa.id} qa={qa}/>
                )}
            </div>
            <div ref={scrollRef}/>
        </div>
    )
};

type render = 'queText' | 'queAudio' | 'ansText' | 'ansAudio' | undefined

type QaProps = {
    qa: QueAns
}
// if there are multiple elements are pending, only render the first of them
const Qa: React.FC<QaProps> = ({qa}) => {
    const renderOrder: render[] = ['queText', 'queAudio', 'ansText', 'ansAudio']
    const statusSlice: string[] = [qa.que.text.status, qa.que.audio?.status ?? "", qa.ans.text.status, qa.ans.audio.status]

    if (!qa.que.textFirst) {
        [renderOrder[0], renderOrder[1]] = [renderOrder[1], renderOrder[0]]
    }
    const newOrder: render[] = []
    let thereIsAPendingAlready = false
    for (let i = 0; i < statusSlice.length; i++) {
        if (['sending', 'receiving', 'error', 'deleted'].includes(statusSlice[i])) {
            if (!thereIsAPendingAlready) {
                newOrder.push(renderOrder[i])
                thereIsAPendingAlready = true
            }
        } else {
            newOrder.push(renderOrder[i])
        }
    }

    return <ErrorBoundary>
        <div className="flex flex-col gap-1 mr-2">
            {newOrder.map((render) => {
                    switch (render) {
                        case 'queText' :
                            return <SelfText text={qa.que.text} qaId={qa.id} key={"que.text"}/>
                        case 'queAudio' :
                            return <div className="rounded-lg max-w-1/2 md:max-w-2/5 w-full text-neutral-900 self-end"
                                        key={"que.audio"}>
                                <Audio audio={qa.que.audio} self={true}/>
                            </div>
                        case 'ansText' :
                            return <AssistantText qaId={qa.id} text={qa.ans.text} key={"ans.text"}/>
                        case 'ansAudio':
                            return <div className="rounded-lg max-w-1/2 md:max-w-2/5 w-full text-neutral-900"
                                        key={"ans.audio"}>
                                <Audio audio={qa.ans.audio} self={false}/>
                            </div>
                        default:
                            console.error("impossible render case", render)
                    }
                }
            )}
        </div>
    </ErrorBoundary>

}

