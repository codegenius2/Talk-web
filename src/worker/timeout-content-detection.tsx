import React, {useEffect} from "react"
import {appState} from "../state/app-state.ts"
import {setErrorIfTimeout} from "../data-structure/message.tsx"

// if content stays at 'sending', 'thinking' or 'receiving' status for over contentTimeoutSeconds, mark it as timeout
export const TimeoutContentDetection: React.FC = () => {

    useEffect(() => {
        const interval = setInterval(() => {
            const chats = appState.chats
            // for better performance, only check last 20 messages
            for (const entry of Object.entries(chats)) {
                for (const message of entry[1].messages.slice(20)) {
                    setErrorIfTimeout(message)
                }
            }
        }, 2000)

        return () => {
            if (interval) {
                clearInterval(interval)
            }
        }
    }, [])
    return null
}



