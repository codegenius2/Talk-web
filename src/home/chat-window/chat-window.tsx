import {Chat} from "../../state/app-state.ts";
import {MessageList} from "./message-list.tsx";
import TextArea from "./text-area.tsx";
import Recorder from "./recorder.tsx";

type Props={
    chatProxy: Chat
}
export const ChatWindow :React.FC<Props> = ({chatProxy })=> {
    return <div
        className="flex flex-col items-center max-w-4xl w-full h-full rounded-xl justify-between gap-1 p-2
                    bg-white bg-opacity-40 backdrop-blur">
        <MessageList chatProxy={chatProxy}/>
        <div
            className="bottom-0 mt-auto flex w-full flex-col items-center gap-2 rounded-xl px-2">
            <TextArea chatProxy={chatProxy}/>
            <div className="my-1 flex w-full items-center justify-center">
                <Recorder chatId={chatProxy.id}/>
            </div>
        </div>
    </div>;
}
