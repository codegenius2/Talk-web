
interface Message {
    id: string;
    type: 'text' | 'image' | 'audio';
    content: string;
    sender: 'self' | 'assistant';
}

export default Message;