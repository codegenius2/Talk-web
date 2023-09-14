import Example from './example.ts'
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'

export default  function Drag() {
    return (
        <DndProvider backend={HTML5Backend}>
            <Example/>
        </DndProvider>
    )
}