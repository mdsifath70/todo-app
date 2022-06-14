import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TodoItem from './components/TodoItem';
import './styles/app.css';
import './styles/reset.css';

const API_URL = 'https://todo-app-sifath.herokuapp.com';
// const API_URL = 'http://localhost:8080';

function App() {
    const [todo, setTodo] = useState([]);
    const [text, setText] = useState('');
    const [isUpdating, setIsUpdating] = useState('');

    useEffect(() => {
        axios
            .get(API_URL + '/get-todo')
            .then((res) => setTodo(res.data))
            .catch((err) => console.log(err));
    }, [todo]);

    const notify = (message) =>
        toast.success(message, {
            closeOnClick: false,
        });

    const formSubmitHandle = (e) => {
        e.preventDefault();

        setText('');
        if (isUpdating) {
            axios
                .post(API_URL + '/update-todo', {
                    _id: isUpdating,
                    text,
                })
                .then((res) => notify(res.data.message))
                .catch((err) => console.log(err));

            setIsUpdating('');
        } else {
            axios
                .post(API_URL + '/save-todo', { text })
                .then((res) => notify(res.data.message))
                .catch((err) => console.log(err));
        }
    };

    const updateTodo = (id, text) => {
        setIsUpdating(id);
        setText(text);
    };

    const deleteTodo = (id) => {
        axios
            .post(API_URL + '/delete-todo', { id })
            .then((res) => notify(res.data.message))
            .catch((err) => console.log(err));
    };

    return (
        <section>
            <ToastContainer />
            <div className="container">
                <div className="todo__container">
                    <h2 className="section__title">Todo App</h2>
                    <form className="input__form" onSubmit={formSubmitHandle}>
                        <input
                            type="text"
                            placeholder="Write something..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <input
                            type="submit"
                            value={isUpdating ? 'Update' : 'Add'}
                        />
                    </form>
                    <div className="todo__items-container">
                        {todo.map((item) => (
                            <TodoItem
                                key={item._id}
                                text={item.text}
                                updateTodo={() =>
                                    updateTodo(item._id, item.text)
                                }
                                deleteTodo={() => deleteTodo(item._id)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default App;
