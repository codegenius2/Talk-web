import React, {KeyboardEventHandler, useCallback, useEffect, useRef, useState} from "react";
import {useSnapshot} from "valtio/react";
import {controlState} from "../../../../state/control-state.ts";

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
                                                 range,
                                             }) => {

    const controlSnp = useSnapshot(controlState)

    const inputBoxRef = useRef<HTMLInputElement>(null);
    const sliderRef = useRef<HTMLInputElement>(null);
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
                    let precision = 1
                    e.shiftKey && precision++
                    e.altKey && precision++
                    e.ctrlKey && precision++
                    e.metaKey && precision++
                    const str = res.toFixed(precision)
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

    const [leftCapacity, setLeftCapacity] = useState(50)
    const [rightCapacity, setRightCapacity] = useState(50)

    useEffect(() => {
            const percent = (defaultValue - range.start) / (range.end - range.start) * 100
            setLeftCapacity(percent)
            setRightCapacity(100 - percent)
        }, [range.end, range.start, longValue, defaultValue]
    )

    const [leftWidth, setLeftWidth] = useState(50)
    const [rightWidth, setRightWidth] = useState(50)

    useEffect(() => {
            if (defaultValue === range.start || longValue >= defaultValue) {
                setLeftWidth(0)
            } else {
                const percent = (defaultValue - longValue) / (defaultValue - range.start) * 100
                setLeftWidth(percent)
            }

            if (defaultValue === range.end || longValue <= defaultValue) {
                setRightWidth(0)
            } else {
                const percent = (longValue - defaultValue) / (range.end - defaultValue) * 100
                setRightWidth(percent)
            }
        }, [range.end, range.start, longValue, defaultValue]
    )

    const [isTransparent, setIsTransparent] = useState(true);
    const [timer, setTimer] = useState<NodeJS.Timeout>();

    useEffect(() => {
        return () => {
            clearTimeout(timer);
        };
    }, [timer]);

    const handleMouseOver = () => {
        clearTimeout(timer);
        setIsTransparent(false);
    };

    const handleMouseLeave = () => {
        const newTimer = setTimeout(() => {
            setIsTransparent(true);
        }, 1000);
        setTimer(newTimer);
    };

    const [showDivider, setShowDivider] = useState(false);

    useEffect(() => {
        if (leftWidth !== 0 || rightWidth !== 0) {
            setShowDivider(false)
        } else {
            setShowDivider(true)
        }
    }, [leftCapacity, leftWidth, rightWidth]);

    return (
        <div className="flex flex-col gap-y-0.5"
             onMouseOver={handleMouseOver}
             onMouseLeave={handleMouseLeave}
        >
            <div className="flex max-h-10 items-center justify-between">
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
                className="relative flex w-full gap-0.5 justify-center overflow-hidden rounded-xl"
                ref={sliderRef}
                onMouseDown={e => handleMouseAction(e, true)}
                // https://stackoverflow.com/questions/4770025/how-to-disable-scrolling-temporarily
                // todo support onWheel, onScroll, onTouchMove
                onMouseMove={handleMouseAction}
                onMouseLeave={handleMouseAction}
                onContextMenu={onContextMenu}
            >
                {/*slider color block*/}
                {leftCapacity !== 0 && <div style={{width: leftCapacity + "%"}}
                                            className="flex justify-end text-transparent prose h-full">
                    <div
                        style={{width: leftWidth + "%"}}
                        className="h-full bg-slider-pink  brightness-125 text-transparent">x
                    </div>
                </div>}

                {rightCapacity !== 0 && <div style={{width: rightCapacity + "%"}}
                                             className="flex justify-start text-transparent prose h-full">
                    <div
                        style={{width: rightWidth + "%"}}
                        className="h-full bg-blue-600 brightness-125 text-transparent">x
                    </div>
                </div>}

                {/*noise background*/}
                <div
                    className="absolute top-1/2 left-0 h-full w-full -translate-y-1/2 bg-cover opacity-100 brightness-200 contrast-200 bg-noise">
                    <div className="h-full w-1/2 text-transparent brightness-125 prose">{value}</div>
                </div>

                {/*text and divider*/}
                <div
                    className={"absolute top-1/2 left-1 -translate-y-1/2 text-neutral-800 font-md text-md " +
                        "transition duration-200 " + (isTransparent ? "text-opacity-0" : "text-opacity-100")}>
                    {range.start}
                </div>
                <div
                    className={"absolute top-1/2 right-1 -translate-y-1/2 text-neutral-800 font-md text-md " +
                        "transition duration-200 " + (isTransparent ? "text-opacity-0" : "text-opacity-100")}>
                    {range.end}
                </div>

                {showDivider && <div
                    // if divider is at start or end, move it px towards center to avoid overflow-hidden
                    style={{left: leftCapacity - leftCapacity / 100 * 0.6 + rightCapacity / 100 * 0.6 + "%"}}
                    className="absolute top-1/2 -translate-y-1/2 h-full w-[1px] bg-neutral-500">
                </div>
                }
            </div>
        </div>
    )
}