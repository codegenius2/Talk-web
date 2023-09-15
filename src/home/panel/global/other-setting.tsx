import React, {useCallback} from 'react';
import {CountDownButton, ResetButton} from "../shared/widget/button.tsx";
import {appState, clearChats} from "../../../state/app-state.ts";
import {BsTrash3} from "react-icons/bs";
import {MySwitch} from "../shared/widget/switch.tsx";
import {useSnapshot} from "valtio/react";


export const OtherSetting: React.FC = () => {
    const refSnap = useSnapshot(appState.pref)

    const showBorderAround = useCallback((enabled: boolean) => {
        appState.pref.showBorderAroundHistoryMessage = enabled
    }, []);

    return <div
        className="flex flex-col w-full items-center justify-between gap-2 rounded-xl bg-white
            bg-opacity-40 backdrop-blur pt-1 pb-3 px-3 ">
        <div className="flex justify-between items-center w-full px-3 ">
            <p className="prose text-lg text-neutral-600">Other</p>
        </div>
        <div
            className="flex flex-col justify-start items-center gap-2 py-2 border-2 border-neutral-500 border-dashed
            rounded-lg px-3">
            <div className="flex justify-between items-center w-full ">
                <p className="prose text text-neutral-600">Border for History</p>
                <MySwitch enabled={refSnap.showBorderAroundHistoryMessage} setEnabled={showBorderAround}/>
            </div>
            <div className="flex flex-wrap py-2 w-full gap-2">
                <CountDownButton text={"Clear All Chats"}
                                 countDownMs={1000}
                                 color="red"
                                 action={clearChats}
                                 icon={<BsTrash3 className="text-lg"/>}
                />
                <ResetButton countDownMs={2000}/>
            </div>
        </div>
    </div>
}

