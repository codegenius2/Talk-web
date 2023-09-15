import React from 'react';
import {cx} from "../../../util/util.tsx";

interface TextProps {
    text: string
    theme: 'blue' | 'neutral'
}

export const MyText: React.FC<TextProps> = ({text,theme}) => {

    return <div
        className={cx("relative rounded-2xl whitespace-pre-wrap px-3 py-1.5",
            theme==="blue"?"text-violet-100 bg-blue-600":"text-black bg-neutral-100 bg-opacity-80 backdrop-blur"
        )}>
        <p>{text}</p>
    </div>
}