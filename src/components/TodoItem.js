export default function TodoItem({ text, updateTodo, deleteTodo }) {
    return (
        <div className="todo__item">
            <p>{text}</p>
            <div>
                <button onClick={updateTodo}>
                    <i className="ri-pencil-fill"></i>
                </button>
                <button onClick={deleteTodo}>
                    <i className="ri-delete-bin-5-fill"></i>
                </button>
            </div>
        </div>
    );
}
