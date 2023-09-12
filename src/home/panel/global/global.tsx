import React from 'react';
import {LLM} from "../shared/llm/llm.tsx";
import {appState} from "../../../state/app-state.ts";

export const Global: React.FC = () => {
    return (
        <div className="z-40 w-full">
            <LLM llmOptionProxy={appState.option.llm}/>
        </div>
    )
}

