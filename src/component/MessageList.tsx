import React from "react";
import Bubble from "./Bubble.tsx";
import {useConvStore} from "../state/ConversationStore.tsx";
import {QueAns} from "../ds/Conversation.tsx";

const MessageList: React.FC = () => {
    const qaSlice: QueAns[] = useConvStore((state) => state.qaSlice)
    return (
        <div className="flex flex-col overflow-y-auto justify-end h-full">
            {qaSlice.map((queAns) => <Bubble key={queAns.id} queAns={queAns}/>)}
        </div>
    );
};

export default MessageList;
