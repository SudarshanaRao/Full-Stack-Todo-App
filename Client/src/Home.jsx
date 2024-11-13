import { useEffect, useState } from 'react';
import axios from 'axios';
import image from './image.png';

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
        axios.post('http://localhost:5000/new-task', { task })
            .then(res => {
                setTodos(res.data);
                setTask('');
            })
            .catch(error => console.error("Error adding task:", error));
    };

    useEffect(() => {
        axios.get('http://localhost:5000/read-tasks')
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
        axios.post('http://localhost:5000/update-task', { updateId, task })
            .then(res => {
                setTodos(res.data);
                setTask('');
                setIsEdit(false);
            })
            .catch(error => console.error("Error updating task:", error));
    };

    const handleDelete = (id) => {
        axios.post('http://localhost:5000/delete-task', { id })
            .then(res => setTodos(res.data))
            .catch(error => console.error("Error deleting task:", error));
    };

    const handleComplete = (id) => {
        axios.post('http://localhost:5000/complete-task', { id })
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
                <div className="flex text-sm w-full justify-evenly mt-4 mb-6">
                    <p onClick={() => handleTabs(1)} className={`${tab === 1 ? 'text-blue-700' : 'text-black'} cursor-pointer`}>All</p>
                    <p onClick={() => handleTabs(2)} className={`${tab === 2 ? 'text-blue-700' : 'text-black'} cursor-pointer`}>Active</p>
                    <p onClick={() => handleTabs(3)} className={`${tab === 3 ? 'text-blue-700' : 'text-black'} cursor-pointer`}>Completed</p>
                </div>
                {loading ? (
                    <p>Loading tasks...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full bg-gray-50 p-5 rounded-lg">
                        {todos.filter(todo => (tab === 1) || (tab === 2 && todo.status === 'active') || (tab === 3 && todo.status === 'completed')).map(todo => (
                            <div key={todo.id} className="flex justify-between items-start bg-white p-3 rounded-md shadow-sm">
                                <div>
                                    <p className="text-lg font-semibold">{todo.task}</p>
                                    <p className="text-xs text-gray-600">{new Date(todo.createdAt).toLocaleDateString()}</p>
                                    <p className="text-sm text-gray-700">Status: {todo.status}</p>
                                </div>
                                <div className="flex flex-col text-sm space-y-1 items-start">
                                    {todo.status !== 'completed' && (
                                        <button className="text-blue-600 cursor-pointer" onClick={() => handleEdit(todo.id, todo.task)}>Edit</button>
                                    )}
                                    <button className="text-red-500 cursor-pointer" onClick={() => handleDelete(todo.id)}>Delete</button>
                                    {todo.status !== 'completed' ? (
                                        <button className="text-green-600 cursor-pointer" onClick={() => handleComplete(todo.id)}>Complete</button>
                                    ) : (
                                        <span className="text-gray-500">Completed</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
