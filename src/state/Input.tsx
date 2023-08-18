import {create} from 'zustand';


export const useInputStore = create(() => ({inputText: ""}))
export const useSendStore = create(() => ({sendingText: ""}))
