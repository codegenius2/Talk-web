import {KeyboardEventHandler, useCallback, useState} from "react";
import {useInputStore, useSendStore} from "../state/Input.tsx";


const TextArea = () => {

    const inputText = useInputStore((state) => state.inputText)

    // if user is typing in a composing way
    const [isComposing, setIsComposing] = useState(false);

    const sendAndClearText = () => {
        if (inputText) {
            useSendStore.setState({sendingText: inputText})
        }
        useInputStore.setState({inputText: ""})
    }

    const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = useCallback((event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && !isComposing) {
            event.preventDefault(); // prevent new line action
            sendAndClearText();
        }
    }, []);

    const handleCompositionStart = () => {
        setIsComposing(true);
    };

    const handleCompositionEnd = () => {
        setIsComposing(false);
    };


    return (<div className="relative">

        <textarea
            placeholder="What would you like to say?"
            className="textarea textarea-bordered textarea-lg w-full px-0 py-0"
            value={inputText}
            onChange={(e) => useInputStore.setState({inputText: e.target.value})}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
        />
            <button
                type="submit"
                className="btn btn-sm absolute bottom-2 right-0.5 capitalize"
                onClick={sendAndClearText}
            >
                Send
            </button>
        </div>
    )
}
export default TextArea