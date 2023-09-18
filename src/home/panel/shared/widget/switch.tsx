import React, {useEffect, useRef} from 'react'
import {Switch} from '@headlessui/react'

export type  MySwitchProps = {
    enabled: boolean
    setEnabled: (enabled: boolean) => void
}

export const MySwitch: React.FC<MySwitchProps> = ({enabled, setEnabled}) => {
    const switchBoxRef = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        if (switchBoxRef.current) {
            switchBoxRef.current.blur()
        }
    }, [enabled])
    return (
        <div className="flex items-center">
            <Switch
                ref={switchBoxRef}
                checked={enabled}
                onChange={setEnabled}
                className={`${enabled ? 'bg-blue-600 border-transparent' : ' border-neutral-600'} relative 
                inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out 
                focus:outline-none focus-visible:ring-2 focus-visible:ring-white 
                focus-visible:ring-opacity-75 border-2 border-neutral-600 border-dotted`}
            >
                <span
                    aria-hidden="true"
                    className={`${enabled ? 'translate-x-5' : 'translate-x-0'}
             pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-2xl ring-0 transition duration-200 ease-in-out`}
                />
            </Switch>
        </div>
    )
}
