import React, {useCallback} from 'react';
import {Chat} from "../../../state/app-state.ts";
import {CountDownButton} from "../shared/widget/button.tsx";
import {BsTrash3} from "react-icons/bs";

type Props = {
    chatProxy: Chat
}

export const OtherSetting: React.FC<Props> = ({chatProxy}) => {
    const clearMessages = useCallback(() => {
        chatProxy.messages = []
    }, [chatProxy]);
    return <div
        className="flex flex-col w-full items-center justify-between gap-2 rounded-xl bg-white
            bg-opacity-40 backdrop-blur pt-1 pb-3 px-3 ">
        <div className="flex justify-between items-center w-full px-3 ">
            <p className="prose text-lg text-neutral-600">Other</p>
        </div>
        <div
            className="flex flex-wrap justify-start items-center gap-2 py-2 border-2 border-neutral-500 border-dashed rounded-lg w-full px-3">
            <CountDownButton text={"Clear Message"}
                             countDownMs={1000}
                             color="red"
                             action={() => clearMessages()}
                             icon={<BsTrash3 className="text-lg"/>}
            />
        </div>
    </div>
}
