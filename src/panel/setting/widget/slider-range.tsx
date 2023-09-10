import React, {KeyboardEventHandler, useCallback, useEffect, useRef, useState} from "react";
import {useSnapshot} from "valtio/react";
import {controlState} from "../../../state/control-state.ts";

type Props = {
    title: string
    value: number
    setValue: (value: number) => void
    defaultValue: number,
    range: { start: number, end: number }
}

export const SliderRange: React.FC<Props> = ({
                                                 title,
                                                 value,
                                                 setValue,
                                                 defaultValue,
                                                 range
                                             }) => {

    const controlSnp = useSnapshot(controlState)

    const inputBoxRef = useRef<HTMLInputElement>(null);
    const sliderRef = useRef<HTMLInputElement>(null);
    const [width, setWidth] = useState("0px")
    const [longValue, setLongValue] = useState(0)

    // init
    useEffect(() => {
        if (value < range.start || value > range.end) {
            setValue(defaultValue)
            setLongValue(defaultValue)
        } else {
            setLongValue(value)
        }
    }, []);

    // if use is clicking, global controlSnp.isMouseLeftDown won't be updated before this event is propagated,
    // in such case, set clicking = true can help
    const handleMouseAction = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>, clicking: boolean = false) => {
            if (sliderRef.current && (clicking || controlSnp.isMouseLeftDown)) {
                const clientWidth = sliderRef.current.clientWidth
                const {left, right} = sliderRef.current.getBoundingClientRect()
                let res
                if (e.clientX <= left) {
                    setValue(range.start)
                    setLongValue(range.start)
                } else if (e.clientX >= right) {
                    setValue(range.end)
                    setLongValue(range.end)
                } else {
                    const relativeX = e.clientX - left;
                    let percent = relativeX / clientWidth
                    if (percent <= 0) {
                        percent = 0
                    }
                    if (percent > 1) {
                        percent = 1
                    }
                    res = range.start + (range.end - range.start) * percent
                    setLongValue(res)
                    const str = e.shiftKey ? res.toFixed(2) : res.toFixed(1)
                    res = Number.parseFloat(str)
                    setValue(res)
                }
            }
        }, [controlSnp.isMouseLeftDown, setValue, range.start, range.end]
    )

    const onBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        const text = e.currentTarget.value
        const parse = Number.parseFloat(text)
        let res: number
        if (isNaN(parse)) {
            res = defaultValue
        } else if (parse < range.start || parse > range.end) {
            res = defaultValue
        } else {
            res = parse
        }
        setValue(res)
        setLongValue(res)
    }, [defaultValue, range.end, range.start, setValue])


    useEffect(() => {
            if (!sliderRef.current) {
                return
            }
            let w
            if (longValue <= range.start) {
                w = "0px"
            } else if (longValue >= range.end) {
                w = "100%"
            } else {
                const clientWidth = sliderRef.current.clientWidth
                const percent = (longValue - range.start) / (range.end - range.start)
                const pixel = clientWidth * percent
                w = `${pixel}px`
            }
            setWidth(w)
        }, [range.end, range.start, longValue]
    )

    const onContextMenu = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
            e.preventDefault()
            setValue(defaultValue)
            setLongValue(defaultValue)
        }, [defaultValue, setValue, setLongValue]
    )

    const handleKeyDown: KeyboardEventHandler<HTMLElement> = (event) => {
        if (event.key === 'Escape' || event.key === 'Enter') {
            inputBoxRef.current?.blur()
        }
    }

    useEffect(() => {
        if (inputBoxRef.current) {
            const text = "" + value
            inputBoxRef.current.value = text
            inputBoxRef.current.size = text.length + 1
        }
    }, [value]);

    return (
        <div className="flex flex-col gap-y-0.5">
            <div className="flex justify-between items-center max-h-10">
                <p className="text-neutral-600">{title}</p>
                <input
                    ref={inputBoxRef}
                    className="min-w-11 max-h-6 text-center px-0.5 align-middle outline-0 overflow-hidden border
                        border-neutral-500 rounded-xl resize-none bg-transparent"
                    onInput={(e) => e.currentTarget.size = e.currentTarget.value.length + 1}
                    onBlur={onBlur}
                    onFocus={(e) => {
                        e.target.select()
                    }}
                    onKeyDown={handleKeyDown}
                >
                </input>
            </div>

            <div
                className="relative flex justify-center items-center w-full rounded-xl overflow-hidden"
                ref={sliderRef}
                onMouseDown={e => handleMouseAction(e, true)}
                onMouseMove={handleMouseAction}
                onMouseLeave={handleMouseAction}
                onContextMenu={onContextMenu}
            >
                <div className="flex w-full justify-start items-start bg-neutral-200 bg-opacity-30"
                >
                    <p style={{width: `${width}`}}
                       className="prose bg-blue-600 text-transparent"> x </p>
                </div>
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="text-neutral-800">{value}</div>
                </div>
            </div>
        </div>
    );

}