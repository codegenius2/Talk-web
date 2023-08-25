import React, {useLayoutEffect, useRef} from "react";
import {useConvStore} from "../state/ConversationStore.tsx";
import {QueAns} from "../ds/Conversation.tsx";
import {Audio} from "./Audio.tsx";
import {AssistantText, SelfText} from "./Text.tsx";

const MessageList: React.FC = () => {
    const qaSlice: QueAns[] = useConvStore((state) => state.qaSlice)

    const scrollRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (scrollRef.current) {
            const {scrollHeight} = scrollRef.current;
            scrollRef.current.scrollTop = scrollHeight;
        }
    }, [qaSlice]);

    return (<div className="overflow-auto w-full max-w-2xl" ref={scrollRef}>
            <div className="flex flex-col gap-3 rounded-lg w-full justify-end max-w-2xl">
                {/*crucial; don't merge the 2 divs above, or sc*/}
                {qaSlice.map((qa) =>
                    <div className="flex flex-col gap-1 mr-2" id="message-list" key={qa.id}>
                        <SelfText text={qa.que.text}/>
                        <div
                            className="rounded-lg self-end text-sm text-neutral-900 w-1/2">
                            <Audio audio={qa.que.audio} self={true}/>
                        </div>
                        <AssistantText text={qa.ans.text}/>
                        <div className="rounded-lg text-sm text-neutral-900 w-1/2">
                            <Audio audio={qa.ans.audio} self={false}/>
                        </div>
                    </div>
                )}
                {/*<div ref={messagesEndRef}></div>*/}

            </div>
        </div>


    )
        ;
};

export default MessageList;
