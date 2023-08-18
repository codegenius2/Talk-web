import './App.css'
import MessageList from "./component/MessageList.tsx";
import TextArea from "./component/TextArea.tsx";
import Websocket from "./websocket/Websocket.tsx";
import {Subscribers} from "./subscriber/Subscribers.tsx";

export default function App() {
    return (
        <div className="flex flex-col items-center h-screen p-1 ">
            <div className="w-full max-w-2xl mx-auto mb-5 grow">
                <div className="flex flex-col gap-3 h-full">
                    <div className="bg-gray-100 rounded-lg flex-grow">
                        <MessageList/>
                    </div>

                    <TextArea/>
                    {/*<Record setPendingAudio={setPendingAudio}/>*/}
                    <Websocket/>
                    <Subscribers/>
                </div>
            </div>
        </div>
    )
}
