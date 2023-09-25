import {useSnapshot} from "valtio/react"
import {useEffect, useState} from "react"
import {cx} from "../../../util/util.tsx"
import {layoutState} from "../../../state/layout-state.ts"
import {BsCircle} from "react-icons/bs"

const handMonitorRadius = 200
const handMaxOpacity = 1
const handBgMaxOpacity = 0.4
export const PromptoryButton = () => {
    const {promptoryButtonDistance,isPromptoryPinning} = useSnapshot(layoutState, {sync: true})
    const [iconOpacity, setIconOpacity] = useState(0)
    const [bgOpacity, setBgOpacity] = useState(0)
    const [isButtonVisible, setIsButtonVisible] = useState(false)

    useEffect(() => {
        setIsButtonVisible(promptoryButtonDistance <= handMonitorRadius-50)
        if (promptoryButtonDistance < 10) {
            setIconOpacity(handMaxOpacity)
            setBgOpacity(handBgMaxOpacity)
        } else {
            setIconOpacity((handMonitorRadius - promptoryButtonDistance) / handMonitorRadius * handMaxOpacity)
            setBgOpacity((handMonitorRadius - promptoryButtonDistance) / handMonitorRadius * handBgMaxOpacity)
        }
    }, [promptoryButtonDistance])
    // console.log("hand,bg,dist", handOpacity, handBgOpacity, distance)

    return (
        <div
            style={{
                backgroundColor: `rgb(23,23,23,${bgOpacity})`,
                backdropFilter: `blur(${bgOpacity > 0 ? 10 * bgOpacity : 0}px)`
            }}
            className={cx("absolute w-8 h-8 top-1 rounded-full p-1 cursor-pointer ",
                "hover:scale-125 hover:backdrop-blur-xl transition-transform duration-200",
                isButtonVisible ? "z-10" : "opacity-0 -z-10",
                isPromptoryPinning&&"hidden"
            )}
            onMouseEnter={() => layoutState.isPromptoryFloating = true}
            onMouseLeave={() => layoutState.isPromptoryFloating = false}
            onClick={() => layoutState.isPromptoryPinning = !layoutState.isPromptoryPinning}
        >
            <BsCircle
                style={{
                    opacity: iconOpacity
                }}
                className={cx("w-full h-full",
                    "fill-neutral-100 stroke-neutral-100",
                )}/>
        </div>
    )
}