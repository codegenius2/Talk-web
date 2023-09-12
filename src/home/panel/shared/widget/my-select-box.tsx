import {useSelect} from "downshift";
import {cx} from "../../../../util/util.tsx";

type Book = {
    author: string
    title: string
}

export const SelectBoxExample = () => {

    const books: Book[] = [
        {author: 'Harper Lee', title: 'To Kill a MockingbirdTo Kill a Mockingbird'},
        {author: 'Lev Tolstoy', title: 'War and Peace'},
        {author: 'Fyodor Dostoyevsy', title: 'The Idiot'},
        {author: 'Oscar Wilde', title: 'A Picture of Dorian Gray'},
        {author: 'George Orwell', title: '1984'},
        {author: 'Jane Austen', title: 'Pride and Prejudice'},
        {author: 'Marcus Aurelius', title: 'Meditations'},
        {author: 'Fyodor Dostoevsky', title: 'The Brothers Karamazov'},
        {author: 'Lev Tolstoy', title: 'Anna Karenina'},
        {author: 'Fyodor Dostoevsky', title: 'Crime and Punishment'},
    ]

    function itemToString(item: Book | null) {
        return item ? item.title : ''
    }

    const {
        isOpen,
        selectedItem,
        getToggleButtonProps,
        getMenuProps,
        highlightedIndex,
        getItemProps,
    } = useSelect({
        items: books,
        itemToString,
    })
    return (
        <div>
            <p className="prose border border-neutral-500 rounded-xl cursor-pointer text-neutral-800 px-1.5
             truncate ... outline-none bg-white bg-opacity-50 backdrop-blur"
                 {...getToggleButtonProps()}>
                    {selectedItem ? selectedItem.title : 'Elements'}
            </p>
            <ul
                className={cx("z-50 bg-opacity-40 backdrop-blur fixed bg-white mt-1 max-h-80",
                    " overflow-y-scroll rounded-xl ",
                    !(isOpen) && 'hidden')}
                {...getMenuProps()}
            >
                {isOpen &&
                    books.map((item, index) => (
                        <li
                            className={cx(
                                highlightedIndex === index && "bg-white/[0.35]",
                                selectedItem?.title === item.title && 'bg-white/[0.8]',
                                'rounded-xl py-1.5 px-1.5 shadow-sm flex flex-col',
                            )}
                            key={`${item.author}${index}`}
                            {...getItemProps({item, index})}
                        >
                            <div className="flex w-full items-center justify-between gap-4 pr-1">
                                <div>{item.title}</div>
                                <span className="text-sm text-gray-700">{item.author}</span>
                            </div>
                        </li>
                    ))}
            </ul>
        </div>
    )
}