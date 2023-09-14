import React, {useEffect, useRef} from "react";
import {Chat, dragChat} from "../../../state/app-state.ts";
import {useDrag, useDrop} from "react-dnd";
import {Identifier, XYCoord} from "dnd-core";
import {ChatComponent} from "./chat-component.tsx";
import {cx} from "../../../util/util.tsx";
import {controlState} from "../../../state/control-state.ts";

export const ItemTypes = {
    CARD: 'card',
}

export interface DragItem {
    index: number
    chat: Chat,
    type: string
}

type Props = {
    chatSnap: Chat
    index: number
}

export const DraggableChat: React.FC<Props> = ({chatSnap, index}) => {
    const ref = useRef<HTMLDivElement>(null)
    const [{handlerId}, drop] = useDrop<
        DragItem,
        void,
        { handlerId: Identifier | null }
    >({
        accept: ItemTypes.CARD,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(item: DragItem, monitor) {
            if (!ref.current) {
                return
            }
            const dragIndex = item.index
            const hoverIndex = index

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return
            }

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect()

            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

            // Determine mouse position
            const clientOffset = monitor.getClientOffset()

            // Get pixels to the top
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }

            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return
            }

            // Time to actually perform the action
            dragChat(dragIndex, hoverIndex)

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex
        },
    })

    const [{isDragging}, drag] = useDrag({
        type: ItemTypes.CARD,
        item: () => {
            return {chatSnap, index}
        },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
    })

    useEffect(() => {
        controlState.isMouseDragging = isDragging
        if (!isDragging) {
            // there seem to be a bug when using react-dnd: window onMouseUp listener is not called after drop
            controlState.isMouseLeftDown = false
        }
    }, [isDragging]);

    drag(drop(ref))
    return (
        <div
            className={cx(isDragging ? "opacity-40 bg-neutral-600 rounded-lg" : "")}
            ref={ref}
            data-handler-id={handlerId}
        >
            <ChatComponent chatSnap={chatSnap}/>
        </div>
    )
}
