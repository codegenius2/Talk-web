import {proxy} from "valtio";


export type Layout = {
    settingPanelScrollOffset: number
}

export const layoutState = proxy<Layout>({
    settingPanelScrollOffset: 0,
})