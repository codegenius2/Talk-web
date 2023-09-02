import React from 'react';
import ChatGpt from "./chat-gpt.tsx";
import {useConvStore} from "../../state/conversation.tsx";
import {escapeSpaceKey} from "../../util/util.tsx";


const Setting: React.FC = () => {
    const ability = useConvStore((state) => state.ability);


    return (
        <div className="flex flex-col w-full items-end justify-center gap-5 select-none"
             onKeyDown={escapeSpaceKey}
        >
            {ability.llm.chatGPT.available && <ChatGpt/>}
        </div>
    )
};

export default Setting;

