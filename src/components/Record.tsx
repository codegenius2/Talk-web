import {Dispatch, SetStateAction, useState} from "react";

interface RecordProps {
    setPendingAudio: Dispatch<SetStateAction<Blob[]>>;
}

const Record: React.FC<RecordProps> = ({setPendingAudio}) => {
    const [isRecording, setIsRecording] = useState(false);

    if (isRecording) {
        // setPendingAudio([])
        return <></>
    } else {
        return <button
            type="button"
            className={"btn w-full capitalize text-lg"}
            onClick={() => setIsRecording(true)}
        >
            Record
        </button>
    }
}

export default Record