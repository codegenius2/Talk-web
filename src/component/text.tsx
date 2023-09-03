import React, {useCallback} from 'react';
import {Spin} from "./spin.tsx";
import {MyText, onDelete} from "../data-structure/text.tsx";
import {RichOpText} from './rich-op-text.tsx';
import {useConvStore} from "../state/conversation.tsx";


interface TextProps {
    text: MyText
    qaId: string
}

export const AssistantText: React.FC<TextProps> = ({text}) => {
    // const updateAnsText = useConvStore(state => state.updateAnsText)

    // const handleDelete = useCallback(() => {
    //     const now = onDelete(text)
    //     updateAnsText(qaId, now)
    // }, [qaId, text, updateAnsText])

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
                className="rounded-lg max-w-3/4 mr-auto whitespace-pre-wrap text-neutral-900 bg-neutral-200 p-2">
                <p>{text.text}</p>
            </div>
        case 'error':
            return <React.Fragment> {text.errorMessage}</React.Fragment>
        default:
            console.error('impossible text status', text.status)
            return null;
    }
}

export const SelfText: React.FC<TextProps> = ({text, qaId}) => {
    const updateQueText = useConvStore(state => state.updateQueText)

    const handleDelete = useCallback(() => {
        const now = onDelete(text)
        updateQueText(qaId, now)
    }, [qaId, text, updateQueText])

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
            return <RichOpText deleteFunc={handleDelete} text={text}/>
        case 'error':
            return <div className="self-end w-auto px-2 py-1.5"> {text.errorMessage}</div>
        default:
            console.error('impossible text status', text.status)
            return null;
    }
}
