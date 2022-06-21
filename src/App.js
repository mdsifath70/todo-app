import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TodoItem from './components/TodoItem';
import './styles/app.css';
import './styles/reset.css';

const API_URL = process.env.REACT_APP_API_URL;

function App() {
    const [todo, setTodo] = useState([]);
    const [text, setText] = useState('');
    const [isUpdating, setIsUpdating] = useState('');
    const [networkErr, setNetworkErr] = useState(false);

    // Get Todos
    useEffect(() => {
        axios
            .get(API_URL + '/get-todo')
            .then((res) => setTodo(res.data))
            .catch((err) => {
                console.log(err);
                if (err.message === 'Network Error') {
                    setNetworkErr(true);
                }
            });
    }, []);

    // Toaster
    const toastifyUpdate = (res) => {
        return {
            render: res.data.message,
            type: 'success',
            isLoading: false,
            autoClose: true,
            closeButton: true,
        };
    };

    const formSubmitHandle = (e) => {
        e.preventDefault();

        setText('');
        if (isUpdating) {
            const loading = toast.loading('Updating Todo...');
            axios
                .post(API_URL + '/update-todo', {
                    _id: isUpdating,
                    text,
                })
                .then((res) => {
                    setTodo(res.data.todo);
                    setIsUpdating('');
                    toast.update(loading, toastifyUpdate(res));
                })
                .catch((err) => console.log(err));
        } else {
            if (text) {
                const loading = toast.loading('Saving new Todo...');
                axios
                    .post(API_URL + '/save-todo', { text })
                    .then((res) => {
                        setTodo((prevState) => [...prevState, res.data.todo]);
                        toast.update(loading, toastifyUpdate(res));
                    })
                    .catch((err) => console.log(err));
            } else {
                toast.error('Please write some text');
            }
        }
    };

    const updateTodo = (id, text) => {
        setIsUpdating(id);
        setText(text);
    };

    const deleteTodo = (id) => {
        const loading = toast.loading('Deleting Todo...');
        axios
            .post(API_URL + '/delete-todo', { _id: id })
            .then((res) => {
                setTodo(res.data.todo);
                toast.update(loading, toastifyUpdate(res));
            })
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
                        {todo.length > 0 ? (
                            todo.map((item) => (
                                <TodoItem
                                    key={item._id}
                                    text={item.text}
                                    updateTodo={() =>
                                        updateTodo(item._id, item.text)
                                    }
                                    deleteTodo={() => deleteTodo(item._id)}
                                />
                            ))
                        ) : (
                            <h3 style={{ marginTop: '1rem', fontWeight: 500 }}>
                                {networkErr
                                    ? 'Backend server error!'
                                    : 'Loading...'}
                            </h3>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default App;
