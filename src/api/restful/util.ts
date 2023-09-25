import {isAttached, Message} from "../../data-structure/message.tsx"
import {LLMMessage} from "../../shared-types.ts"

export const attachedMessages = (messages:Message[], maxAttached: number): LLMMessage[] => {
    if (maxAttached <= 0) {
        return []
    }
    const hist: LLMMessage[] = []
    for (let i = messages.length - 1; i >= 0; i--) {
        if (hist.length === maxAttached) {
            break
        }
        const m = messages[i]
        if (isAttached(m)) {
            hist.push({role: m.role, content: m.text})
        }
    }
    return hist.reverse()
}