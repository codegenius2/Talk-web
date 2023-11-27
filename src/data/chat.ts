import {newReceived, newSent} from "../data-structure/message.tsx";
import {appState, createChat} from "../state/app-state.ts";

export const createDemoChatIfNecessary = () => {
    if (appState.ability.demo && appState.chats.length === 0 && !appState.pref.dismissDemo) {
        createChat("Demo", [
            newSent("Hello!"),
            newReceived(`Hello! How may I assist you today? 
        
Feel free to ask me anything. Please note, I’ll reply with **pseudo** text and voice.
        
For genuine AI responses, you may want to set up your own instance following the instructions at 
[proxoar/talk](https://github.com/proxoar/talk).`),
        ])
    }
}