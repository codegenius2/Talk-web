import {useCombobox} from "downshift";
import React from "react";
import {cx} from "../../../../util/util.tsx";

type Book = {
    author: string
    title: string
}

export const ComboBoxExample = () => {


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

    function getBooksFilter(inputValue: string | undefined) {
        const lowerCasedInputValue = inputValue?.toLowerCase() ?? ""

        return function booksFilter(book: Book) {
            return (
                !inputValue ||
                book.title.toLowerCase().includes(lowerCasedInputValue) ||
                book.author.toLowerCase().includes(lowerCasedInputValue)
            )
        }
    }

    const [items, setItems] = React.useState(books)
    const [selectedItem, setSelectedItem] = React.useState<Book>()
    const {
        isOpen,
        getToggleButtonProps,
        getMenuProps,
        getInputProps,
        highlightedIndex,
        getItemProps,
        selectItem,
    } = useCombobox({
        onInputValueChange({inputValue}) {
            setItems(books.filter(getBooksFilter(inputValue)))
        },
        items,
        itemToString(item) {
            return item ? item.title : ''
        },
        selectedItem,
        onSelectedItemChange: ({selectedItem: newSelectedItem}) =>
            setSelectedItem(newSelectedItem!),
    })
    return (
        <div>
            <div className="flex items-center justify-between gap-1">
                <div className="flex rounded-xl border border-neutral-500 w-52">
                    <input
                        className="w-full pl-1.5 h-7 outline-none text-neutral-800 border-none bg-transparent"
                        {...getInputProps()}
                    />
                    <button
                        aria-label="clear selection"
                        className="px-2 text-neutral-500"
                        type="button"
                        tabIndex={-1}
                        onClick={() => selectItem(null)}
                    >
                        &#215;
                    </button>
                    <button
                        aria-label="toggle menu"
                        className="px-2 text-neutral-500"
                        type="button"
                        {...getToggleButtonProps()}
                    >
                        {isOpen ? <>&#8593;</> : <>&#8595;</>}
                    </button>
                </div>
            </div>
            <ul
                className={cx("z-50 bg-opacity-40 backdrop-blur fixed bg-white mt-1 max-h-80",
                    " overflow-y-scroll rounded-xl",
                    !(isOpen && items.length) && 'hidden')}
                {...getMenuProps()}
            >
                {isOpen &&
                    items.map((item, index) => (
                        <li
                            className={cx(
                                highlightedIndex === index && "bg-white/[0.4]",
                                selectedItem === item && 'bg-white/[0.8]',
                                'py-1.5 px-1.5 shadow-sm flex flex-col',
                            )}
                            key={`${item.author}${index}`}
                            {...getItemProps({item, index})}
                        >
                            <div className="flex justify-between items-center w-full gap-4 pr-1">
                                <div>{item.title}</div>
                                <span className="text-sm text-gray-700">{item.author}</span>
                            </div>
                        </li>
                    ))}
            </ul>
        </div>
    )
}