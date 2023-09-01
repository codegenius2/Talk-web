import React from 'react';
import {useConvStore} from "../../state/conversation.tsx";
import {DiscreteRange} from "./widget/discrete-range.tsx";
import {MySwitch} from "./widget/switch.tsx";
import {historyChoices} from "../../ds/ability/defauts.ts";
import {ListBox} from "./widget/list-box.tsx";
import {NumStr} from "../../ds/ability/client-ability.tsx";


const ChatGpt: React.FC = () => {

        const getChatGPT = useConvStore((state) => state.getChatGPT);
        const setChatGPT = useConvStore((state) => state.setChatGPT);

        const setEnabled = (enabled: boolean) => {
            console.log(enabled)
            setChatGPT(
                {...getChatGPT(), enabled: enabled}
            )
        }

        const setMaxHistory = (hist: NumStr) => {
            if (typeof hist === 'string') {
                if (hist.match(/^\d+$/)) {
                    hist = Number(hist)
                } else {
                    hist = 0
                }
            }
            setChatGPT({
                ...getChatGPT(),
                maxHistory: {...getChatGPT().maxHistory, chosen: hist as number}
            })
        }

        const setModel = (model?: NumStr) => setChatGPT({
            ...getChatGPT(),
            models: {...getChatGPT().models, chosen: model as number | undefined}
        })

        const gpt = getChatGPT()

        return <div
            className="flex flex-col w-full items-center justify-between gap-2 px-3 py-4 rounded-xl bg-white bg-opacity-40 backdrop-blur">
            <div className="flex justify-between items-center w-full px-3 ">
                <p className="prose text-lg text-neutral-600">ChatGPT</p>
                <MySwitch enabled={gpt.enabled} setEnabled={setEnabled}/>
            </div>
            {gpt.enabled &&
                <div
                    className="flex flex-col justify-center gap-2 py-2 border-2 border-neutral-500 border-dashed rounded-lg w-full px-3">
                    {gpt.maxHistory.available &&
                        <DiscreteRange choices={historyChoices}
                                       title="Max History"
                                       setValue={setMaxHistory}
                                       value={gpt.maxHistory.chosen ?? gpt.maxHistory.default}
                                       outOfLeftBoundary={0}
                        />}
                    {gpt.models.available &&
                        <div className="flex justify-between items-center gap-2">
                            <p className="prose text-neutral-600">Model</p>
                            <div className="rounded-xl w-full md:ml-3 py-1">
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

