export default function NavBar() {
    return (
        <div className="p-4 shadow">
            <div className="m-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
                <a href="/" className="text-xl font-bold">
                    AiTodo
                </a>
                <a href="/todos" className="text-xl">
                    Todos
                </a>
                <a href="/about" className="text-xl">
                    About
                </a>
            </div>
        </div>
    )
}
