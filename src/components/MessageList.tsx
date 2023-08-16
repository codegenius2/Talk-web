import React from "react";
import {v4 as uuidv4} from 'uuid';
import NewBubble from "./Bubble.tsx";
import Message from "./Interface.tsx";

const MessageList: React.FC = () => {

    const messages: Message[] = [
        {
            id: uuidv4(),
            type: 'text',
            content: 'Hello!',
            sender: 'self',
        },
        {
            id: uuidv4(),
            type: 'text',
            content: 'Lovely to see you!',
            sender: 'assistant',
        }
    ]
    return (
        <div className="flex flex-col overflow-y-auto justify-end h-full">
            {messages.map((message) => NewBubble(message)
            )}
        </div>
    );
};

export default MessageList;
