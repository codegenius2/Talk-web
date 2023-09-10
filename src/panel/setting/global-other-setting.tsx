import React from 'react';
import {ClearButton, ResetButton} from "./widget/button.tsx";
import {clearChats} from "../../state/app-state.ts";


export const GlobalOtherSetting: React.FC = () => {

    return <div
        className="flex flex-col w-full items-center justify-between gap-2 rounded-xl bg-white
            bg-opacity-40 backdrop-blur pt-1 pb-3 px-3 ">
        <div className="flex justify-between items-center w-full px-3 ">
            <p className="prose text-lg text-neutral-600">Other</p>
        </div>
        <div
            className="flex flex-wrap justify-start items-center gap-2 py-2 border-2 border-neutral-500 border-dashed rounded-lg w-full px-3">
            <ClearButton text={"Clear All Chats"}
                         countDownMs={1000}
                         action={clearChats}
            />
            <ResetButton countDownMs={2000}/>
        </div>
    </div>
}

