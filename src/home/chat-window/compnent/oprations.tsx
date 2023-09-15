import React, {useEffect, useState} from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Confetti from 'react-confetti';

interface Props {
    text: string
    deleteFunc: () => void
}

export const Oprations: React.FC<Props> = ({text, deleteFunc}) => {
    const [hovering, setHovering] = useState(false)
    const [copied, setCopied] = useState(false);
    const [confettiCount, setConfettiCount] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCopied(false)
        }, 1000);

        return () => {
            clearTimeout(timer);
        };
    }, [copied]);

    return <div
        onMouseOver={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className="relative rounded-2xl self-end max-w-3/4 whitespace-pre-wrap text-violet-100 bg-blue-600 px-2 py-1.5">
        <p>{text}</p>
        {confettiCount === 0 ? null : <Confetti numberOfPieces={500} wind={0.02} key={confettiCount} recycle={false}/>}
        {hovering && <div
            className="flex justify-center rounded-lg overflow-hidden items-center pointer-events-none absolute inset-x-0 -top-8 z-10 left-auto bg-black bg-opacity-0 backdrop-blur backdrop-filter">
            <CopyToClipboard text={text}
                             onCopy={() => {
                                 setCopied(true)
                                 setConfettiCount(confettiCount + 1)
                             }}>
                <button
                    className="bg-neutral-400 bg-opacity-10 hover:bg-opacity-20 pointer-events-auto relative px-4 py-2 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-50">
                    <span className="text-green-400">Copy</span>
                </button>
            </CopyToClipboard>
            {/*<button*/}
            {/*    className="bg-neutral-400 bg-opacity-10 hover:bg-opacity-20 pointer-events-auto relative px-4 py-2 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-50">*/}
            {/*    <span className="text-sky-400">Retry</span>*/}
            {/*</button>*/}
            <button
                onClick={deleteFunc}
                className="bg-neutral-400 bg-opacity-10 hover:bg-opacity-20 pointer-events-auto relative px-4 py-2 text-xs
                 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-50">
                <span className="text-red-400">Delete</span>
            </button>
        </div>}
    </div>
}