import Message from "./Interface.tsx";

const selfAvatar = new URL('../assets/self-avatar.svg', import.meta.url).href;
const assistantAvatar = new URL('../assets/assistant-avatar.svg', import.meta.url).href;

export default function NewBubble(message: Message) {
    if (message.sender === "assistant") {
        return <div className="chat chat-start">
            <div className="chat-image avatar online">
                <div className="w-8 rounded-full ">
                    <img src={selfAvatar}/>
                </div>
            </div>
            <div className="flex items-center gap-1">
                <div
                    className="chat-bubble bg-white text-slate-800">{message.type === 'text' ? message.content : `<${message.type} content>`}</div>
                <time className="text-xs opacity-50 self-end mb-2">12:45</time>
            </div>
        </div>
    } else {
        return <div className="chat chat-end">
            <div className="chat-image avatar online">
                <div className="w-8 rounded-full">
                    <img src={assistantAvatar}/>
                </div>
            </div>
            <div className="flex items-center gap-1">
                <time className="text-xs opacity-50 self-end mb-2">12:45</time>
                <div
                    className="chat-bubble chat-bubble-info bg-sky-300">{message.type === 'text' ? message.content : `<${message.type} content>`}</div>
            </div>
        </div>

    }
}