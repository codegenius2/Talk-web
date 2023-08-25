import React from 'react';
import {Spin} from "./Spin.tsx";
import {MyText} from "../ds/Text.tsx";


interface TextProps {
    text: MyText
}

export const AssistantText: React.FC<TextProps> = ({text}) => {
    switch (text.status) {
        case 'pending':
            return <div className="w-auto px-2 py-1.5">
                <Spin/>
            </div>
        case 'receiving' :
        case  'done':
            return <div
                className="rounded-lg mr-20 text-sm text-neutral-900 bg-slate-200 px-2 py-0.5">
                <p>{text.content}</p>
            </div>
        case 'error':
            return <div> {text.errorMessage}</div>
        default:
            console.error('impossible case', text.status)
            break;
    }
}

export const SelfText: React.FC<TextProps> = ({text}) => {
    switch (text.status) {
        case 'pending':
            return <div className="self-end w-auto px-2 py-1.5">
                <Spin/>
            </div>
        case 'done':
            return <div
                className="rounded-lg self-end w-auto text-sm text-violet-100 bg-blue-600 px-2 py-1.5">
                <p>{text.content}</p>
            </div>
        case 'error':
            return <div> {text.errorMessage}</div>
        default:
            console.error('impossible case', text.status)
            break;
    }
}
