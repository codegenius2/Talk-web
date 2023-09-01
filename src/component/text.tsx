import React from 'react';
import {Spin} from "./spin.tsx";
import {MyText} from "../ds/Text.tsx";
import { RichOpText } from './rich-op-text.tsx';


interface TextProps {
    text: MyText
}

export const AssistantText: React.FC<TextProps> = ({text}) => {
    switch (text.status) {
        case 'sending':
        case 'receiving':
            return <div className="w-auto p-2">
                <Spin/>
            </div>
        case 'sent':
        case 'received':
        case 'half-received':
        case 'typing' :
            return <div
                className="rounded-lg max-w-3/4 mr-auto whitespace-pre-wrap text-neutral-900 bg-equal-200 p-2">
                <p>{text.text}</p>
            </div>
        case 'error':
            return <React.Fragment> {text.errorMessage}</React.Fragment>
        default:
            console.error('impossible text status', text.status)
            return null;
    }
}

export const SelfText: React.FC<TextProps> = ({text}) => {
    switch (text.status) {
        case 'sending':
        case 'receiving':
            return <div className="self-end w-auto px-2 py-1.5">
                <Spin/>
            </div>
        case 'sent':
        case 'received':
        case 'half-received':
        case 'typing' :
            return <RichOpText text={text}/>
        case 'error':
            return <div className="self-end w-auto px-2 py-1.5"> {text.errorMessage}</div>
        default:
            console.error('impossible text status', text.status)
            return null;
    }
}
