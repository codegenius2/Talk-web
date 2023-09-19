import {useSelect} from "downshift";
import {cx} from "../../../../util/util.tsx";
import {Choice} from "../../../../data-structure/provider-api-refrence/types.ts";
import {useEffect, useRef, useState} from "react";
import {layoutState} from "../../../../state/layout-state.ts";
import {useSnapshot} from "valtio/react";
import {HiCheck} from "react-icons/hi2";

type Props<T extends number | string> = {
    choices: Choice<T>[]
    defaultValue?: T
    setValue: (value?: T) => void
}

export function SelectBox<T extends number | string>({choices, defaultValue, setValue}: Props<T>) {
    const {
        isOpen,
        selectedItem,
        getToggleButtonProps,
        getMenuProps,
        highlightedIndex,
        getItemProps,
        selectItem
    } = useSelect({
        defaultSelectedItem: choices[0],
        items: choices,
        itemToString:
            c => c?.name ?? " ",
        onSelectedItemChange:
            ({selectedItem: newSelectedItem}) => setValue(newSelectedItem?.value)
    })

    useEffect(() => {
        const found = choices.find(c => c.value === defaultValue)
        if (found) {
            selectItem(found)
            setValue(found.value)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValue, choices]);

    const layoutSnap = useSnapshot(layoutState)
    const buttonRef = useRef<HTMLParagraphElement>(null);
    const [currentButtonBottom, setCurrentButtonBottom] = useState(0)
    const [buttonWidth, setButtonWidth] = useState(0)
    // set init state for UL, or UL flashes on top of screen on first open
    useEffect(() => {
        if (buttonRef.current) {
            const {bottom, left, right} = buttonRef.current.getBoundingClientRect()
            setButtonWidth(right - left)
            setCurrentButtonBottom(bottom)
            return
        }
    }, []);
    // monitor the button's location and situate the dropdown list underneath it
    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const {bottom, left, right} = buttonRef.current.getBoundingClientRect()
            setButtonWidth(right - left)
            setCurrentButtonBottom(bottom)
            return
        }
    }, [layoutSnap, isOpen]);

    return (
        <div className="">
            <p className="prose border border-neutral-500 rounded-xl cursor-pointer text-neutral-800 px-1.5
             truncate ... outline-none bg-white bg-opacity-50 backdrop-blur"
               {...getToggleButtonProps({ref: buttonRef})}>
                {selectedItem?.name ?? " "}
            </p>
            <ul
                className={cx("z-50 bg-white bg-opacity-50 shadow-neutral-300 shadow-2xl backdrop-blur-3xl fixed mt-3 mb-3 max-h-80",
                    "overflow-y-scroll rounded-lg bg-neutral-200 scrollbar-visible-neutral-500",
                    !(isOpen) && 'hidden')}
                {...getMenuProps({
                    style: {
                        top: `${currentButtonBottom}px`,
                        minWidth: `${buttonWidth}px`,
                    }
                })}
            >
                {isOpen &&
                    choices.map((c, index) => (
                        <li
                            className={cx(
                                highlightedIndex === index && "bg-white/[0.5]",
                                selectedItem?.value === c.value && 'bg-white/[1]',
                                'relative rounded-lg py-1 px-1.5 flex flex-col',
                            )}
                            key={`${c.value}${index}`}
                            {...getItemProps({item: c, index})}
                        >
                            {selectedItem?.value === c.value && (
                                <HiCheck
                                    className="absolute inset-x-0 left-0  top-1/2 -translate-y-1/2 transform h-5 w-5"
                                    aria-hidden="true"/>)
                            }
                            <div className="flex flex-nowrap items-center justify-between pr-1">
                                <span
                                    className="ml-4 flex w-full items-center justify-between gap-12">
                                    <p className="m-0">{c.name}</p>
                                    {c.tags.length > 0 &&
                                        <div className='flex items-center justify-between gap-1'>
                                            {c.tags.filter(it => it).map(tag =>
                                                <span key={tag}
                                                      className="prose rounded-md px-1 border bg-white/[0.2] border-neutral-400
                                                   whitespace-nowrap text-sm text-neutral-600">{tag}</span>
                                            )}
                                        </div>
                                    }
                              </span>
                            </div>

                        </li>
                    ))}
            </ul>
        </div>
    )
}