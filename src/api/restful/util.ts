import {Chat} from "../../state/app-state.ts"
import {isInHistory} from "../../data-structure/message.tsx"
import {LLMMessage} from "../../shared-types.ts"

export const historyMessages = (chat: Chat, maxHistory: number): LLMMessage[] => {
    if (maxHistory <= 0) {
        return []
    }
    const messages: LLMMessage[] = []
    for (let i = chat.messages.length - 1; i >= 0; i--) {
        if (messages.length === maxHistory) {
            break
        }
        const m = chat.messages[i]
        if (isInHistory(m)) {
            messages.push({role: m.role, content: m.text})
        }
    }
    return messages.reverse()
}