import {KeyboardEventHandler, useCallback} from "react";
import {useInputStore, useSendStore} from "../state/Input.tsx";


const TextArea = () => {

    const inputText = useInputStore((state) => state.inputText)

    const sendAndClearText = () => {
        if (inputText) {
            useSendStore.setState({sendingText: inputText})
        }
        useInputStore.setState({inputText: ""})
    }

    const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = useCallback((event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            event.preventDefault(); // prevent new line action
            sendAndClearText();
        }
    }, []);

    return (<div className="relative">

        <textarea
            placeholder="What would you like to say?"
            className="textarea textarea-bordered textarea-lg w-full px-0 py-0"
            value={inputText}
            onChange={(e) => useInputStore.setState({inputText: e.target.value})}
            onKeyDown={handleKeyDown}
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