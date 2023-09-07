import {useCallback} from "react";
import {PiPlusLight} from "react-icons/pi";
import {CiSearch} from "react-icons/ci";
import {ChatComponent} from "./chat-component.tsx";
import {useSettingStore} from "../../../state/setting.ts";
import {useChatStore} from "../../../state/chat.tsx";
import {randomHash} from "../../../util/util.tsx";

export const ChatList = () => {
    const ability = useSettingStore(state => state.ability)
    const setCurrentChatId = useChatStore(state => state.setCurrentChatId)
    const cs = useChatStore(state => state.cs)
    const pushChat = useChatStore(state => state.pushChat)
    // const[isSearching,setIsSearching] = useState(false)

    const newChat = useCallback((): void => {
        const id = randomHash()
        const chat = {
            id: id,
            name: "New Chat",
            ms: [],
            ability: ability,
        }
        pushChat(chat)
        setCurrentChatId(id)
    }, [ability, pushChat, setCurrentChatId])

    return (
        <div className="flex h-full w-full flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
                <div
                    className="mr-auto flex w-full items-center justify-center gap-2 rounded-xl bg-white bg-opacity-40 backdrop-blur">
                    <CiSearch/>
                    <p className="text-neutral-600 prose">Search</p>
                </div>
                <div
                    className="flex justify-center items-center rounded-xl stroke-white text-neutral-500
                 bg-white bg-opacity-80 backdrop-blur cursor-pointer"
                    onClick={newChat}>
                    <PiPlusLight size={24}/>
                </div>
            </div>
            <div className="h-full w-full overflow-hidden overflow-y-auto rounded-xl pr-1 scrollbar-hide hover:scrollbar-show">
                <div
                    className="flex cursor-pointer flex-col gap-1">
                    {Object.entries(cs).map(([key, c]) =>
                        <ChatComponent chat={c} key={key}/>
                    )}
                </div>
            </div>
        </div>
    )
}