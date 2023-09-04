import React, {CSSProperties, useCallback, useEffect, useRef} from "react";
import {useConvStore} from "../state/conversation.tsx";
import {QueAns} from "../data-structure/conversation.tsx";
import {Audio} from "./audio.tsx";
import {AssistantText, SelfText} from "./text.tsx";
import ErrorBoundary from "./error-boundary.tsx";
import {VariableSizeList, VariableSizeList as List} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

export const MessageList: React.FC = () => {
    const qaSlice: QueAns[] = useConvStore((state) => state.qaSlice)
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current!.scrollIntoView({behavior: 'instant'});
    }); // run once on mount

    return (<div
            className="overflow-y-auto overflow-x-hidden w-full hide-scrollbar hover:show-scrollbar"
        >
            <div className="flex flex-col gap-5 rounded-lg w-full justify-end">
                {/*crucial; don't merge the 2 divs above, or sc*/}
                {qaSlice.map((qa, index) =>
                    // last 10 item has no delay, the rest has 4000s and 300ms more delay for each 10 items
                    <Qa key={qa.id} qa={qa} delay={(qaSlice.length - index) / 10 * 1000}/>
                )}
            </div>
            <div ref={scrollRef}/>
        </div>
    )
};

type Props = {
    index: number
    style: CSSProperties
    data: QueAns[]
    measure: (index: number, size: number) => void
}

const Item: React.FC<Props> = ({index, style, data, measure}) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            measure(index, ref.current.getBoundingClientRect().height);
        }
    }, [measure]);

    return (
        <div ref={ref} style={style}>
            {<Qa key={data[index].id} qa={data[index]} delay={(data.length - index) / 10 * 1000}/>}
        </div>
    );
};

export const VirtualMessageList = () => {
    const qaSlice: QueAns[] = useConvStore((state) => state.qaSlice)

    const listRef = useRef<VariableSizeList>(null);
    const itemSizes = useRef<number[]>([]);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollToItem(qaSlice.length);
        }
    }); // run once on mount

    const measure = useCallback((index: number, size: number) => {
        itemSizes.current[index] = size;
        listRef.current!.resetAfterIndex(index);
    }, []);

    const getItemSize = useCallback((index: number) => {
        return itemSizes.current[index] || 200;
    }, []);

    return (
        <div className="w-full h-full">
            {/*AutoSizer get w and h of its container*/}
            <AutoSizer>
                {({height, width}) => (
                    <List
                        ref={listRef}
                        height={height}
                        width={width}
                        itemCount={qaSlice.length}
                        itemSize={getItemSize}
                        itemData={qaSlice}
                    >
                        {props => <Item {...props} measure={measure}/>}
                    </List>)
                }
            </AutoSizer>
        </div>
    );
};

type render = 'queText' | 'queAudio' | 'ansText' | 'ansAudio' | undefined

type QaProps = {
    qa: QueAns
    delay: number // ms, delay rendering of audios not in window
}
// if there are multiple elements are pending, only render the first of them
const Qa: React.FC<QaProps> = ({qa, delay}) => {
    const renderOrder: render[] = ['queText', 'queAudio', 'ansText', 'ansAudio']
    const statusSlice: string[] = [qa.que.text.status, qa.que.audio?.status ?? "", qa.ans.text.status, qa.ans.audio.status]

    if (!qa.que.textFirst) {
        [renderOrder[0], renderOrder[1]] = [renderOrder[1], renderOrder[0]]
    }
    const newOrder: render[] = []
    let thereIsAPendingAlready = false
    for (let i = 0; i < statusSlice.length; i++) {
        if (['sending', 'receiving', 'error', 'deleted'].includes(statusSlice[i])) {
            if (!thereIsAPendingAlready) {
                newOrder.push(renderOrder[i])
                thereIsAPendingAlready = true
            }
        } else {
            newOrder.push(renderOrder[i])
        }
    }

    return <ErrorBoundary>
        <div className="flex flex-col gap-1 mr-2">
            {newOrder.map((render) => {
                    switch (render) {
                        case 'queText' :
                            return <SelfText text={qa.que.text} qaId={qa.id} key={"que.text"}/>
                        case 'queAudio' :
                            return <div className="rounded-lg max-w-1/2 md:max-w-2/5 w-full text-neutral-900 self-end"
                                        key={"que.audio"}>
                                <Audio audio={qa.que.audio} self={true} delay={delay}/>
                            </div>
                        case 'ansText' :
                            return <AssistantText qaId={qa.id} text={qa.ans.text} key={"ans.text"}/>
                        case 'ansAudio':
                            return <div className="rounded-lg max-w-1/2 md:max-w-2/5 w-full text-neutral-900"
                                        key={"ans.audio"}>
                                <Audio audio={qa.ans.audio} self={false} delay={delay}/>
                            </div>
                        default:
                            console.error("impossible render case", render)
                    }
                }
            )}
        </div>
    </ErrorBoundary>

}

