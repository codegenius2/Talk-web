import React, {useEffect} from 'react';
import {
    InAudio,
    inEventTypeAudio,
    inEventTypeMessage,
    inEventTypeTranscription,
    InMessage,
    InMeta,
    InTranscription
} from '../api/API.tsx'
import {useSocketEvensStore} from "../state/SocketEvents.tsx";
import {useSocketStore} from "../state/Socket.tsx";

const Websocket: React.FC = () => {
        const pushInMessage = useSocketEvensStore((state) => state.pushInMessage)
        const pushInTranscription = useSocketEvensStore((state) => state.pushInTranscription)
        const pushInAudio = useSocketEvensStore((state) => state.pushInAudio)

        const socket = useSocketStore.getState().socket
        useEffect(() => {
            socket.onopen = () => {
                console.log("Connected to socket server");
            };

            socket.onclose = () => {
                console.log("Disconnected from socket server");
            };

            socket.onerror = (error) => {
                console.error("Error on socket:", error);
            };

            socket.onmessage = (payload) => {
                const data = payload.data;
                console.log("Received message from server(truncated to 100 char):", data.slice(0, 100));
                const event: InMeta = JSON.parse(data)
                switch (event.type) {
                    case inEventTypeMessage:
                        pushInMessage(event as InMessage)
                        break
                    case inEventTypeTranscription:
                        pushInTranscription(event as InTranscription)
                        break
                    case inEventTypeAudio:
                        pushInAudio(event as InAudio)
                        break
                    default:
                        console.log("unknown message type", event.type);
                }
            };
            console.debug("all socket event handler registered");
        }, []);

        return null
    }
;
export default Websocket;