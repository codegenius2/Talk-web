import React from "react";
import Bubble from "./Bubble.tsx";
import {Message} from "./Interface.tsx";

interface MessageListProps{
    messages : Message[]
}

const MessageList: React.FC<MessageListProps> = ({messages}) => {

    return (
        <div className="flex flex-col overflow-y-auto justify-end h-full">
            {
                messages.map((message) => <Bubble key={message.id} message={message}/>)
            }
        </div>
    );
};

export default MessageList;
