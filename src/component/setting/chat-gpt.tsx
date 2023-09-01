import React, {useCallback} from 'react';
import {useConvStore} from "../../state/ConversationStore.tsx";
import {DiscreteRange} from "./widget/discrete-range.tsx";
import {MySwitch} from "./widget/switch.tsx";
import {historyChoices} from "../../ds/ability/defauts.ts";
import {ListBox} from "./widget/list-box.tsx";


const ChatGpt: React.FC = () => {

        const getChatGPT = useConvStore((state) => state.getChatGPT);
        const setChatGPT = useConvStore((state) => state.setChatGPT);

        const gpt = getChatGPT()

        const setEnabled = useCallback(() => (enabled: boolean) => setChatGPT({...getChatGPT(), enabled: enabled}),
            [getChatGPT, setChatGPT])

        const setMaxHistory = useCallback(() => (hist: number) => setChatGPT({
            ...getChatGPT(),
            maxHistory: {...getChatGPT().maxHistory, chosen: hist}
        }), [getChatGPT, setChatGPT])

        const setModel = useCallback(() => (model: string) => setChatGPT({
            ...getChatGPT(),
            models: {...getChatGPT().models, chosen: model}
        }), [getChatGPT, setChatGPT])

        return <div
            className="flex flex-col w-full items-center justify-between gap-2 px-3 pt-2 pb-4 rounded-xl bg-white bg-opacity-40 backdrop-blur">
            <div className="flex justify-center items-center w-full">
                <p className="prose text-lg text-neutral-600">ChatGPT</p>
            </div>
            <div className="flex justify-between items-center bg-white rounded-lg w-full px-3">
                <p className="prose text-neutral-600">Enabled</p>
                <MySwitch enabled={gpt.enabled} setEnabled={setEnabled}/>
            </div>
            {gpt.enabled &&
                <div
                    className="flex justify-center items-center gap-2 w-full">
                    {gpt.maxHistory.available &&
                        <div>Max History</div>}
                    {gpt.maxHistory.available &&
                        <div className="rounded-xl overflow-hidden w-full">
                            <DiscreteRange choices={historyChoices}
                                           setValue={setMaxHistory}
                                           value={gpt.maxHistory.chosen ?? gpt.maxHistory.default}
                                           outOfLeftBoundary={0}
                            />
                        </div>}
                    {gpt.models.available &&
                        <p className="prose">Model</p>}
                    {gpt.models.available &&
                        <div className="rounded-xl overflow-hidden w-full">
                            <div className="w-full md:ml-3 py-1">
                                <ListBox choices={gpt.models.choices}
                                         value={gpt.models.chosen}
                                         setValue={setModel}
                                         mostEffort={true}
                                />
                            </div>
                        </div>}
                </div>}
        </div>
    }
;

export default ChatGpt;

