import React, {Dispatch, KeyboardEventHandler, SetStateAction, useState} from "react";

interface DialogProps {
    setPendingText: Dispatch<SetStateAction<string[]>>;
}

const TextArea: React.FC<DialogProps> = ({setPendingText: setPendingText}) => {
    const [text, setText] = useState("");

    const sendText = () => {
        if (text) {
            setPendingText(prev => [...prev, text])
            setText("")
        }
    }

    const handleKeyDown:KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
        if (event.ctrlKey && event.key === 'Enter') {
            event.preventDefault(); // prevent default action of starting a new line
            sendText()
        }
    };

    return (<div className="relative">

        <textarea
            placeholder="What would you like to say?"
            className="textarea textarea-bordered textarea-lg w-full px-0 py-0"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
        />
            <button
                type="submit"
                className="btn btn-sm absolute bottom-2 right-0.5 capitalize"
                onClick={sendText}
            >
                Send
            </button>
        </div>
    )
}
export default TextArea