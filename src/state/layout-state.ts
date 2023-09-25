import {proxy} from "valtio"


export type Layout = {
    settingPanelScrollOffset: number
    isMessageListOverflow: boolean
    isMessageListAtBottom: boolean
    isPromptoryFloating: boolean
    isPromptoryPinning: boolean
    promptoryButtonDistance: number
}

export const layoutState = proxy<Layout>({
    settingPanelScrollOffset: 0,
    isMessageListOverflow: false,
    isMessageListAtBottom: false,
    isPromptoryFloating: false,
    isPromptoryPinning: false,
    promptoryButtonDistance: 1000,
})