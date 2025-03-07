import { useEffect, useState } from 'react';
import axios from 'axios';
import image from './image.png';

const BASE_URL = 'https://backend-todo-application.vercel.app'; // Updated API base URL

const Home = () => {
    const [tab, setTab] = useState(1);
    const [task, setTask] = useState('');
    const [todos, setTodos] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [updateId, setUpdateId] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleTabs = (tab) => {
        setTab(tab);
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!task.trim()) {
            return alert("Task cannot be empty.");
        }
        axios.post(`${BASE_URL}/new-task`, { task })
            .then(res => {
                setTodos(res.data);
                setTask('');
            })
            .catch(error => console.error("Error adding task:", error));
    };

    useEffect(() => {
        axios.get(`${BASE_URL}/read-tasks`)
            .then(res => {
                setTodos(res.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching tasks:", error);
                setLoading(false);
            });
    }, []);

    const handleEdit = (id, task) => {
        setIsEdit(true);
        setTask(task);
        setUpdateId(id);
    };

    const updateTask = () => {
        if (!task.trim()) {
            return alert("Updated task cannot be empty.");
        }
        axios.post(`${BASE_URL}/update-task`, { updateId, task })
            .then(res => {
                setTodos(res.data);
                setTask('');
                setIsEdit(false);
            })
            .catch(error => console.error("Error updating task:", error));
    };

    const handleDelete = (id) => {
        axios.post(`${BASE_URL}/delete-task`, { id })
            .then(res => setTodos(res.data))
            .catch(error => console.error("Error deleting task:", error));
    };

    const handleComplete = (id) => {
        axios.post(`${BASE_URL}/complete-task`, { id })
            .then(res => setTodos(res.data))
            .catch(error => console.error("Error completing task:", error));
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center p-5 bg-white rounded-lg shadow-lg w-full max-w-3xl">
                <img src={image} alt="Todo Logo" width="20%" />
                <h2 className="font-bold text-2xl mb-4">Todo App</h2>
                <div className="flex gap-3 mb-4">
                    <input
                        value={task}
                        onChange={e => setTask(e.target.value)}
                        type="text"
                        placeholder="Enter todo"
                        className="w-64 p-2 outline-none border border-blue-300 rounded-md"
                    />
                    <button onClick={isEdit ? updateTask : handleAddTask} className="bg-blue-600 text-white px-4 rounded-md hover:opacity-90">
                        {isEdit ? "Update" : "Add"}
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full bg-gray-50 p-5 rounded-lg">
                    {loading ? <p>Loading tasks...</p> : todos.map(todo => (
                        <div key={todo.id} className="flex justify-between items-start bg-white p-3 rounded-md shadow-sm">
                            <div>
                                <p className="text-lg font-semibold">{todo.task}</p>
                                <p className="text-sm text-gray-700">Status: {todo.status}</p>
                            </div>
                            <button className="text-red-500 cursor-pointer" onClick={() => handleDelete(todo.id)}>Delete</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
