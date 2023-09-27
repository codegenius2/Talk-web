import {useSnapshot} from "valtio/react"
import {useEffect, useState} from "react"
import {cx} from "../../../util/util.tsx"
import {layoutState} from "../../../state/layout-state.ts"
import {BsCircle} from "react-icons/bs"

const handMonitorRadius = 200
const handMaxOpacity = 1
const handBgMaxOpacity = 0.4
export const PromptAttachedButton = () => {
    const {PAButtonDistance, isPAPinning} = useSnapshot(layoutState, {sync: true})
    const [iconOpacity, setIconOpacity] = useState(0)
    const [bgOpacity, setBgOpacity] = useState(0)
    const [isButtonVisible, setIsButtonVisible] = useState(false)

    useEffect(() => {
        setIsButtonVisible(PAButtonDistance <= handMonitorRadius - 50)
        if (PAButtonDistance < 10) {
            setIconOpacity(handMaxOpacity)
            setBgOpacity(handBgMaxOpacity)
        } else {
            setIconOpacity((handMonitorRadius - PAButtonDistance) / handMonitorRadius * handMaxOpacity)
            setBgOpacity((handMonitorRadius - PAButtonDistance) / handMonitorRadius * handBgMaxOpacity)
        }
    }, [PAButtonDistance])
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
                isPAPinning && "hidden"
            )}
            onMouseEnter={() => layoutState.isPAFloating = true}
            onMouseLeave={() => layoutState.isPAFloating = false}
            onClick={() => layoutState.isPAPinning = !layoutState.isPAPinning}
        >
            <BsCircle
                onWheel={e => layoutState.PAButtonWheelDeltaY = e.deltaY}
                onMouseLeave={() => layoutState.PAButtonWheelDeltaY = 0}
                style={{
                    opacity: iconOpacity
                }}
                className={cx("w-full h-full",
                    "fill-neutral-100 stroke-neutral-100",
                )}/>
        </div>
    )
}