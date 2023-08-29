const Head = () => {

    return <div
        className="flex justify-center items-center rounded-lg p-1 gap-2 w-full h-10 bg-equal-100 select-none">
        <div className="flex gap-3 justify-center items-center ">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                 stroke="currentColor" className="w-6 h-6 text-neutral-900">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/>
            </svg>
            <div className="prose text-equal-500">
                Hold <kbd className="border rounded-md bg-white px-1.5 py-0.5">Spacebar</kbd> to speak
            </div>
        </div>
    </div>
}


export default Head;

