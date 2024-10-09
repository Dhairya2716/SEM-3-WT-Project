// import React, { useEffect, useState } from "react";
// import './todo.css';

function Todo() {
    const [todoList, setTodoList] = useState([]);
    const [editableId, setEditableId] = useState(null);
    const [editedTask, setEditedTask] = useState("");
    const [editedStatus, setEditedStatus] = useState("");
    const [editedDeadline, setEditedDeadline] = useState("");
    const [newTask, setNewTask] = useState("");
    const [newStatus, setNewStatus] = useState("");
    const [newDeadline, setNewDeadline] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(""); // Add a state for search term

    useEffect(() => {
        fetch('http://127.0.0.1:3001/getTodoList')
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch tasks");
                }
                return response.json();
            })
            .then((data) => {
                setTodoList(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            });
    }, []); // Add an empty dependency array to handle component updates

    const toggleEditable = (id) => {
        const rowData = todoList.find((data) => data._id === id);
        if (rowData) {
            setEditableId(id);
            setEditedTask(rowData.task);
            setEditedStatus(rowData.status);
            setEditedDeadline(rowData.deadline || "");
        } else {
            setEditableId(null);
            setEditedTask("");
            setEditedStatus("");
            setEditedDeadline("");
        }
    };

    const addTask = (e) => {
        e.preventDefault();
        if (!newTask || !newStatus || !newDeadline) {
            alert("All fields must be filled out.");
            return;
        }

        const newTodo = { task: newTask, status: newStatus, deadline: newDeadline };

        fetch('http://127.0.0.1:3001/addTodoList', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTodo),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to add task");
                }
                return response.json();
            })
            .then(() => {
                setTodoList([...todoList, newTodo]);
                setNewTask("");
                setNewStatus("");
                setNewDeadline("");
            })
            .catch((err) => console.error(err));
    };

    const saveEditedTask = (id) => {
        const editedData = {
            task: editedTask,
            status: editedStatus,
            deadline: editedDeadline,
        };

        if (!editedTask || !editedStatus || !editedDeadline) {
            alert("All fields must be filled out.");
            return;
        }

        fetch(`http://127.0.0.1:3001/updateTodoList/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editedData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to update task");
                }
                return response.json();
            })
            .then(() => {
                setEditableId(null);
                setEditedTask("");
                setEditedStatus("");
                setEditedDeadline("");
                setTodoList((prevList) =>
                    prevList.map((item) => (item._id === id ? { ...item, ...editedData } : item))
                );
            })
            .catch((err) => console.error(err));
    };

    const searchTask = (searchTerm) => {
        const filteredList = todoList.filter((item) => 
          item.task.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setTodoList(filteredList);
    }

    const deleteTask = (id) => {
        fetch(`http://127.0.0.1:3001/deleteTodoList/${id}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to delete task");
                }
                return response.json();
            })
            .then(() => {
                setTodoList(todoList.filter((item) => item._id !== id));
            })
            .catch((err) => console.error(err));
    };

    return (
        <div>
            <h1>Todo List</h1>
            <form onSubmit={addTask}>
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="New Task"
                />
                <input
                    type="text"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    placeholder="New Status"
                />
                <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    placeholder="New Deadline"
                />
                <button type="submit">Add Task</button>
            </form>
            <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search"
            />
            <button onClick={() => searchTask(searchTerm)}>Search</button>
            <ul>
                {todoList.map((item) => (
                    <li key={item._id}>
                        {editableId === item._id ? (
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                saveEditedTask(item._id);
                            }}>
                                <input
                                    type="text"
                                    value={editedTask}
                                    onChange={(e) => setEditedTask(e.target.value)}
                                    placeholder="Task"
                                />
                                <input
                                    type="text"
                                    value={editedStatus}
                                    onChange={(e) => setEditedStatus(e.target.value)}
                                    placeholder="Status"
                                />
                                <input
                                    type="date"
                                    value={editedDeadline}
                                    onChange={(e) => setEditedDeadline(e.target.value)}
                                    placeholder="Deadline"
                                />
                                <button type="submit">Save</button>
                            </form>
                        ) : (
                            <div>
                                <span>{item.task}</span>
                                <span>{item.status}</span>
                                <span>{item.deadline}</span>
                                <button onClick={() => toggleEditable(item._id)}>Edit</button>
                                <button onClick={() => deleteTask(item._id)}>Delete</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            {loading ? <p>Loading...</p> : <p>{error}</p>}
        </div>
    );
}

// export default Todo;