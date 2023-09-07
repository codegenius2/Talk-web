import {useCallback} from "react";
import {PiPlusLight} from "react-icons/pi";
import {useSettingStore} from "../../state/setting.ts";
import {randomHash} from "../../util/util.tsx";
import {CiSearch} from "react-icons/ci";
import {useChatStore} from "../../state/convs.tsx";
import {ChatComponent} from "./chat-component.tsx";

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
        <div className="flex flex-col w-full h-full gap-4">
            <div className="flex justify-between items-center gap-2">
                <div
                    className="flex justify-center items-center gap-2 rounded-xl w-full mr-auto bg-white bg-opacity-40 backdrop-blur">
                    <CiSearch/>
                    <p className="prose text-neutral-600">Search</p>
                </div>
                <div
                    className="flex justify-center items-center rounded-xl stroke-white text-neutral-600
                 bg-white bg-opacity-80 backdrop-blur cursor-pointer"
                    onClick={newChat}>
                    <PiPlusLight size={24}/>
                </div>
            </div>
            <div className="w-full h-full pr-1 overflow-y-auto rounded-xl overflow-hidden scrollbar-hide hover:scrollbar-show ">
                <div
                    className="flex flex-col gap-1 cursor-pointer">
                    {Object.entries(cs).map(([key, c]) =>
                        <ChatComponent chat={c} key={key}/>
                    )}
                </div>
            </div>
        </div>
    )
}