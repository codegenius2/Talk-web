import React from 'react';
import {ClearMessageButton} from "./widget/button.tsx";
import {useChatStore} from "../../../state/chat.tsx";

type Props = {
    chatId: string
}

export const CurrentSetting: React.FC<Props> = ({chatId}) => {
    const clearMessages = useChatStore(state => state.clearMessages)
    return <div
        className="flex flex-col w-full items-center justify-between gap-2 rounded-xl bg-white
            bg-opacity-40 backdrop-blur">
        <div className="flex justify-between items-center w-full px-3 ">
            <p className="prose text-lg text-neutral-600">Other</p>
        </div>
        <div
            className="flex flex-wrap justify-start items-center gap-2 py-2 border-2 border-neutral-500 border-dashed rounded-lg w-full px-3">
            <ClearMessageButton action={() => clearMessages(chatId)} countDownMs={1000}/>
        </div>
    </div>
}
