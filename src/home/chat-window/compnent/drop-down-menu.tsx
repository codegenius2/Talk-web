import React, {useEffect, useRef, useState} from 'react';
import {HiMiniEllipsisHorizontal} from "react-icons/hi2";

export type Item = {
    name: string
    action?: () => void
    download?: {
        url: string,
        fileName: string
    }
    icon: React.JSX.Element
}

interface Props {
    list: Item[]
}

export const DropDownMenu: React.FC<Props> = ({list}) => {
    const [open, setOpen] = useState(false)
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event: unknown) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const toggleMenu = () => {
        setOpen(!open);
    };

    return (
        <div ref={dropdownRef} className="relative z-10 flex flex-col">
            <HiMiniEllipsisHorizontal
                onClick={toggleMenu}
                className="h-8 w-8 p-1 text-violet-50 transition-all duration-100 hover:text-violet-200"
            />
            {open &&
                //add extra content to bottom, so that menu doesn't disappear immediately when cursor leaves the last option
                <div className="absolute top-8 left-0 flex flex-col pb-10">
                    <div
                        className="flex w-32 flex-col overflow-hidden rounded-lg text-neutral-800">
                        {list.map(item =>
                            <a key={item.name} href={item.download?.url} download={item.download?.fileName}
                               target="_blank">
                                <div
                                    onClick={item.action}
                                    className="flex items-center gap-1 bg-neutral-100 px-1 py-2 hover:bg-neutral-300"
                                >
                                    <div className="flex justify-center items-center h-6 w-6 ">{item.icon}</div>
                                    {item.name}
                                </div>
                            </a>
                        )}
                    </div>
                </div>
            }
        </div>
    );
};