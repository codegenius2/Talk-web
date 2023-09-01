import React from 'react';
import ChatGpt from "./chat-gpt.tsx";
import {useConvStore} from "../../state/conversation.tsx";


const Setting: React.FC = () => {
    const ability = useConvStore((state) => state.ability);

    // todo global and local
    return <div className="flex flex-col w-full items-end justify-center gap-5 select-none">
        {ability.llm.chatGPT.available && <ChatGpt/>}
    </div>
};

export default Setting;

