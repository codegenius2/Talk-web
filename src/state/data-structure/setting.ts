import {ClientAbility} from "./client-ability/client-ability.tsx";
import {ClientChatGPT} from "./client-ability/chat-gpt.ts";

export type Setting = {
    readonly ability: ClientAbility
    readonly setAbility: (ability: ClientAbility) => void
    readonly getClientChatGPT: () => ClientChatGPT
    readonly setClientChatGPT: (chatGPT: ClientChatGPT) => void
}