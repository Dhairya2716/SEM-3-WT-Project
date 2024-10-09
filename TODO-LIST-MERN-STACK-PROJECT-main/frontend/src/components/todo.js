import React, { useEffect, useState } from "react";
import './todo.css';

function Todo() {
    const [todoList, setTodoList] = useState([]);
    const [editableId, setEditableId] = useState(null);
    const [editedTask, setEditedTask] = useState("");
    const [editedStatus, setEditedStatus] = useState("");
    const [newTask, setNewTask] = useState("");
    const [newStatus, setNewStatus] = useState("");
    const [newDeadline, setNewDeadline] = useState("");
    const [editedDeadline, setEditedDeadline] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [message, setMessage] = useState(""); 

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
                setError(err.message);
                setLoading(false);
            });
    }, []);

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
            setMessage("All fields must be filled out.");
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
            .then((addedTask) => {
                setTodoList([...todoList, addedTask]);
                setMessage("Task added successfully!");
                setNewTask("");
                setNewStatus("");
                setNewDeadline("");
            })
            .catch((err) => setMessage("Failed to add task"));
    };

    const saveEditedTask = (id) => {
        const editedData = {
            task: editedTask,
            status: editedStatus,
            deadline: editedDeadline,
        };

        if (!editedTask || !editedStatus || !editedDeadline) {
            setMessage("All fields must be filled out.");
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
                setTodoList((prevList) =>
                    prevList.map((item) => (item._id === id ? { ...item, ...editedData } : item))
                );
                setMessage("Task updated successfully!");
            })
            .catch((err) => setMessage("Failed to update task"));
    };

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
                setMessage("Task deleted successfully!");
            })
            .catch((err) => setMessage("Failed to delete task"));
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredTodoList = searchTerm
        ? todoList.filter((task) =>
            task.task.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : todoList;

    return (
        <div className="container mt-5 todo-container">
            <h2 className="text-center header-title mb-4">Todo List</h2>
            {message && <div className="alert alert-info text-center">{message}</div>} {/* Feedback message */}

            <div className="col-md-6 mx-auto my-3 search-bar">
    <div className="input-group">
      <input
        type="text"
        className="form-control rounded-pill shadow-sm"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search tasks"
        aria-label="Search tasks"
      />
      <span className="input-group-text bg-white border-0 rounded-pill search-icon">
        <i className="bi bi-search"></i>
      </span>
    </div>
  </div>

        

            <div className="row">
                <div className="col-md-7 mb-4">
                    {loading ? (
                        <div className="d-flex justify-content-center align-items-center">
                            <div className="spinner-border text-primary" role="status"></div>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger">{error}</div>
                    ) : (
                        <div className="todo-list">
                            {filteredTodoList.map((data) => (
                                <div className="card mb-3 fade-in" key={data._id}>
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            {editableId === data._id ? (
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={editedTask}
                                                    onChange={(e) => setEditedTask(e.target.value)}
                                                />
                                            ) : (
                                                data.task
                                            )}
                                        </h5>
                                        <p className="card-text">
                                            {editableId === data._id ? (
                                                <select
                                                    className="form-control"
                                                    value={editedStatus}
                                                    onChange={(e) => setEditedStatus(e.target.value)}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Overdue">Overdue</option>
                                                    <option value="Completed">Completed</option>
                                                </select>
                                            ) : (
                                                <span className={`status-badge ${data.status.toLowerCase()}`}>
                                                    {data.status}
                                                </span>
                                            )}
                                        </p>
                                        <p className="card-text">
                                            Deadline:{" "}
                                            {editableId === data._id ? (
                                                <input
                                                    type="datetime-local"
                                                    className="form-control"
                                                    value={editedDeadline}
                                                    onChange={(e) => setEditedDeadline(e.target.value)}
                                                />
                                            ) : (
                                                data.deadline ? new Date(data.deadline).toLocaleString() : ''
                                            )}
                                        </p>
                                        <div className="actions">
                                            {editableId === data._id ? (
                                                <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() => saveEditedTask(data._id)}
                                                >
                                                    Save
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => toggleEditable(data._id)}
                                                >
                                                    <i className="bi bi-pencil-square"></i> Edit
                                                </button>
                                            )}
                                            <button
                                                className="btn btn-danger btn-sm ml-2"
                                                onClick={() => deleteTask(data._id)}
                                            >
                                                <i className="bi bi-trash-fill"></i> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="col-md-5">
                    <h3 className="text-center mb-4">Add Task</h3>
                    <form className="bg-light p-4 rounded shadow-sm">
                        <div className="mb-3">
                            <label>Task</label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Enter Task"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label>Status</label>
                            <select
                                className="form-control"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                            >
                                <option value="">Select Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Overdue">Overdue</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label>Deadline</label>
                            <input
                                className="form-control"
                                type="datetime-local"
                                value={newDeadline}
                                onChange={(e) => setNewDeadline(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={addTask}
                            className="btn btn-success btn-block"
                            disabled={!newTask || !newStatus || !newDeadline}
                        >
                            Add Task
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Todo;
