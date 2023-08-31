import React from 'react';
import {MySwitch} from "./Switch.tsx";
import {useSettingStore} from "../../state/Setting.tsx";
import {DiscreteRange} from "./DiscreteRange.tsx";
import {historyOptions} from "../../config.ts";
import ListBox from './ListBox.tsx';


const Setting: React.FC = () => {

    const historyEnabled = useSettingStore((state) => state.historyEnabled);
    const setHistoryEnabled = useSettingStore((state) => state.setHistoryEnabled);
    const maxHistory = useSettingStore((state) => state.maxHistory);
    const setMaxHistory = useSettingStore((state) => state.setMaxHistory);

    return <div className="flex flex-col w-full items-end justify-center gap-5 select-none">
        {/* LLM */}
        <div className="flex flex-col w-full items-center justify-between gap-2 px-3 pt-2 pb-4 rounded-xl bg-gray-white bg-white bg-opacity-60">
            <div className="flex justify-center items-center w-full">
                <p className="prose text-lg text-neutral-600">LLM</p>
            </div>
            <div className="flex justify-between items-center bg-white rounded-lg w-full px-3">
                <p className="prose text-neutral-600">Send History</p>
                <MySwitch enabled={historyEnabled} setEnabled={setHistoryEnabled} switchColor={"bg-blue-600"}/>
            </div>
            <div className={"rounded-xl overflow-hidden w-full  " + (historyEnabled ? "" : "hidden")}>
                <DiscreteRange options={historyOptions} setValue={setMaxHistory} value={maxHistory}
                               bgColor={"bg-blue-600"}/>
            </div>
            <div className="flex justify-between items-center bg-white rounded-lg w-full px-3">
                <p className="prose">Model</p>
                <div className="w-full md:ml-3 py-1">
                    <ListBox/>
                </div>
            </div>
        </div>
        <div className="flex flex-col w-full items-center justify-between gap-2 px-3 pt-2 pb-4 rounded-xl bg-white bg-opacity-60 ">
            <div className="flex justify-center items-center w-full">
                <p className="prose text-lg text-equal-600">Text to Speech</p>
            </div>
            <div className="flex justify-between items-center bg-white rounded-lg w-full px-3">
                <p className="prose">Language</p>
            </div>
            <div className="flex justify-between items-center bg-white rounded-lg w-full px-3">
                <p className="prose">Speed</p>
            </div>
        </div>

        <div></div>
        <div></div>
    </div>
};

export default Setting;

