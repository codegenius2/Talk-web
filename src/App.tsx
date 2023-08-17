import './App.css'
import MessageList from "./component/MessageList.tsx";
import TextArea from "./component/TextArea.tsx";
import Record from "./component/Record.tsx";
import Websocket from "./websocket/Websocket.tsx";
import {PendingTextHandler} from "./handler/PendingTextHandler.tsx";
import {PendingAudioHandler} from "./handler/PendingAudioHandler.tsx";
import {PendingInMessageHandler} from "./handler/PendingInMessageHandler.tsx";
import {PendingInTranscriptionHandler} from "./handler/PendingInTranscriptionHandler.tsx";
import {PendingInAudioHandler} from "./handler/PendingInAudioHandler.tsx";
import {Message} from "./component/Interface.tsx";
import {InAudio, InMessage, InTranscription} from "./api/API.tsx";
import {useState} from "react";
import ReconnectingWebSocket from 'reconnecting-websocket';

export default function App() {
    const [socket, setSocket] = useState<ReconnectingWebSocket | undefined>(undefined);

    const [pendingText, setPendingText] = useState<string[]>([]);
    const [pendingAudio, setPendingAudio] = useState<Blob[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);

    const [pendingInMessage, setPendingInMessage] = useState<InMessage[]>([])
    const [pendingInTranscription, setPendingInTranscription] = useState<InTranscription[]>([])
    const [pendingInAudio, setPendingInAudio] = useState<InAudio[]>([])
    return (
        <div className="flex flex-col items-center h-screen p-1 ">
            <div className="w-full max-w-2xl mx-auto mb-5 grow">
                <div className="flex flex-col gap-3 h-full">
                    <div className="bg-gray-100 rounded-lg flex-grow">
                        <MessageList messages={messages}/>
                    </div>

                    <TextArea setPendingText={setPendingText}/>
                    <Record setPendingAudio={setPendingAudio}/>

                    <Websocket setSocket={setSocket}
                               setPendingInTranscription={setPendingInTranscription}
                               setPendingInAudio={setPendingInAudio}
                               setPendingInMessage={setPendingInMessage}
                    />
                    <PendingTextHandler pendingText={pendingText}
                                        setPendingText={setPendingText}
                                        messages={messages}
                                        setMessages={setMessages}
                                        socket={socket}
                    />
                    <PendingAudioHandler pendingAudio={pendingAudio}
                                         setPendingAudio={setPendingAudio}
                                         messages={messages}
                                         setMessages={setMessages}
                                         socket={socket}
                    />
                    <PendingInMessageHandler pendingInMessage={pendingInMessage}
                                             setPendingInMessage={setPendingInMessage}
                                             messages={messages}
                                             setMessages={setMessages}
                    />
                    <PendingInTranscriptionHandler pendingInTranscription={pendingInTranscription}
                                                   setPendingInTranscription={setPendingInTranscription}
                                                   messages={messages}
                                                   setMessages={setMessages}
                    />
                    <PendingInAudioHandler pendingInAudio={pendingInAudio}
                                           setPendingInAudio={setPendingInAudio}
                                           messages={messages}
                                           setMessages={setMessages}
                    />
                </div>
            </div>
        </div>
    )
}
