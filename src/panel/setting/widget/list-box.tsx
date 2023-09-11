import {Fragment, useEffect, useState} from 'react'
import {Listbox, Transition} from '@headlessui/react'
import {CheckIcon, ChevronUpDownIcon} from '@heroicons/react/20/solid'
import _ from "lodash";
import {Choice} from "../../../state/data-structure/client-ability/types.ts";
import {joinClasses} from "../../../util/util.tsx";

// https://tailwindui.com/components/application-ui/forms/select-menus

type Props<T extends number | string> = {
    choices: Choice<T>[]
    value?: T
    setValue: (value?: T) => void
    mostEffort: boolean  // as long as there is at least on choice, set it to value
}

export function ListBox<T extends number | string>({choices, value, setValue, mostEffort}: Props<T>) {

    const [item, setItem] = useState<Choice<T> | undefined>(undefined)

    useEffect(() => {
        setValue(item?.value)
    }, [item, setValue]);

    useEffect(() => {
            if (choices.length === 0) {
                setItem(undefined)
            } else {
                if (mostEffort && (item === undefined || !choices.find(c => c.value === value))) {
                    setItem(choices[0])
                }
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [choices, setValue, mostEffort]
    )

    if (choices.length === 0) {
        return <div className="flex w-full justify-end text-neutral-600 line-through">
            <div>Not Available</div>
        </div>
    }

    return (
        <Listbox value={item}
                 onChange={setItem}
        >
            {({open}) => (
                <div className="relative">
                    <Listbox.Button
                        className="relative w-full cursor-default rounded-2xl border border-neutral-500 bg-transparent
                          py-0.5 pl-3 pr-10 text-left text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300
                          focus:outline-none focus:ring-2 focus:ring-blue-400">
                          <span className="flex items-center ">
                            <span className="ml-3">{item?.name ?? ""}</span>
                          </span>
                        <span
                            className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                            <ChevronUpDownIcon className="h-5 w-5 text-neutral-400" aria-hidden="true"/>
                          </span>
                    </Listbox.Button>

                    <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options
                            className="absolute w-full rounded-xl text-base
                            shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm
                            bg-white bg-opacity-70 overflow-auto max-h-96 "
                        >
                            {choices.map((ch) => (
                                <Listbox.Option
                                    key={ch.value}
                                    value={ch}
                                    className={({active}) =>
                                        joinClasses(
                                            active ? 'bg-blue-600 text-white' : 'text-neutral-900',
                                            'rounded-lg relative cursor-default select-none py-0.5 pl-3 pr-0.5 '
                                        )
                                    }
                                >
                                    {({selected, active}) => (
                                        <>
                                            {selected ? (
                                                <CheckIcon className={joinClasses(
                                                    active ? 'text-white' : 'text-neutral-900', 'absolute inset-x-0 left-0 h-5 w-5'
                                                )} aria-hidden="true"/>) : null}
                                            <div className="flex items-center w-full ">
                                                    <span
                                                        className={joinClasses(selected ? 'font-semibold' : 'font-normal', 'flex flex-wrap justify-between items-center w-full ml-3')}
                                                    >
                                                    <p className="m-0">{ch.name}</p>
                                                    <div className='flex justify-between items-center gap-1 '>
                                                         {_.uniq(ch.tags).map(tag =>
                                                             <span key={tag}
                                                                   className="bg-neutral-400 text-white rounded-md px-1 text-xs">{tag}</span>
                                                         )}
                                                        </div>
                                                  </span>
                                            </div>

                                        </>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            )}
        </Listbox>
    )
}