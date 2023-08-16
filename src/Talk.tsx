import React, {useState} from "react";
import Record from "./components/Record.tsx";
import TextArea from "./components/TextArea.tsx";
import OutBound from "./dataflow/OutBound.tsx";
import MessageList from "./components/MessageList.tsx";

const Talk: React.FC = () => {

    const [pendingText, setPendingText] = useState<string[]>([]);
    const [pendingAudio, setPendingAudio] = useState<Blob[]>([]);
    return (
        <div className="flex flex-col gap-3 h-full">
            <OutBound pendingAudio={pendingAudio} pendingText={pendingText}/>
            <div className="bg-gray-100 rounded-lg flex-grow">
                <MessageList/>
            </div>

            <TextArea setPendingText={setPendingText}/>
            <Record setPendingAudio={setPendingAudio}/>
        </div>
    )
};

export default Talk;
