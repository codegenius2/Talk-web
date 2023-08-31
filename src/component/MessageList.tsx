import React, {useLayoutEffect, useRef} from "react";
import {useConvStore} from "../state/ConversationStore.tsx";
import {QueAns} from "../ds/Conversation.tsx";
import {Audio} from "./Audio.tsx";
import {AssistantText, SelfText} from "./Text.tsx";
import MessageErrorBoundary from "./MessageErrorBoundary.tsx";

export const MessageList: React.FC = () => {
    const qaSlice: QueAns[] = useConvStore((state) => state.qaSlice)

    const scrollRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (scrollRef.current) {
            const {scrollHeight} = scrollRef.current;
            scrollRef.current.scrollTop = scrollHeight;
        }
    }, [qaSlice]);
    console.debug("qaSlice ids", qaSlice.map(it => it.id))
    return (<div className="overflow-y-auto  overflow-x-hidden w-full" ref={scrollRef}>
            <div className="flex flex-col gap-5 rounded-lg w-full justify-end">
                {/*crucial; don't merge the 2 divs above, or sc*/}
                {qaSlice.map((qa) =>
                    <Qa key={qa.id} qa={qa}/>
                )}
            </div>
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
        if (['sending', 'receiving', 'error'].includes(statusSlice[i])) {
            if (!thereIsAPendingAlready) {
                newOrder.push(renderOrder[i])
                thereIsAPendingAlready = true
            }
        } else {
            newOrder.push(renderOrder[i])
        }
    }

    console.debug("message renderOrder", newOrder)
    console.debug("qa", qa)
    return <MessageErrorBoundary>
        <div className="flex flex-col gap-1 mr-2">
            {newOrder.map((render) => {
                    switch (render) {
                        case 'queText' :
                            return <SelfText text={qa.que.text} key={"que.text"}/>
                        case 'queAudio' :
                            return <div className="rounded-lg max-w-1/2 md:max-w-2/5 w-full text-neutral-900 self-end">
                                <Audio audio={qa.que.audio} self={true} key={"que.audio"}/>
                            </div>
                        case 'ansText' :
                            return <AssistantText text={qa.ans.text} key={"ans.text"}/>
                        case 'ansAudio':
                            return <div className="rounded-lg max-w-1/2 md:max-w-2/5 w-full text-neutral-900">
                                <Audio audio={qa.ans.audio} self={false} key={"ans.audio"}/>
                            </div>
                        default:
                            console.error("impossible render case", render)
                            return <div key={"impossible render case"} hidden={true}/>
                    }
                }
            )}
        </div>
    </MessageErrorBoundary>

}

