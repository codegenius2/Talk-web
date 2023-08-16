import './App.css'
import Talk from "./Talk.tsx";

export default function App() {
    return (
        <div className="flex flex-col items-center h-screen p-1 ">
            <div className="w-full max-w-2xl mx-auto mb-5 grow">
                <Talk/>
            </div>
        </div>
    )
}
