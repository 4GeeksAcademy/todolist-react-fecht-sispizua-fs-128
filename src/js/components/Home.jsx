import React, { useEffect, useState } from "react";
import "../../styles/home.css"

const Home = () => {
    const API_URL = "https://playground.4geeks.com/todo";
    const USER = "santiago";
    const [newTask, setTask] = useState({ label: "", is_done: false });
    const [tasks, setTasks] = useState([]);
    console.log(tasks);
    const [showAlert, setShowAlert] = useState(false)

    const handleInputChange = (e) => {
        console.log(e)
        setTask({
            ...newTask,
            [e.target.name]: e.target.value,
        });
    };
    // funcion para evitar el submit por defecto y mostrar una alerta si el campo esta vacio
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newTask.label) {
            setShowAlert(true);
            return
        }
        setShowAlert(false)
        createTask();
    }
    //obtener todas las tareas
    const getAllTasks = async () => {
        const response = await fetch(`${API_URL}/users/${USER}`)
        console.log(response);
        //crear usuario si no existe
        if (!response.ok) {
            console.log("debo crear al usuario");
            createUser();
            return
        }
        const data = await response.json()
        console.log(data);
        setTasks(data.todos || []);
    }

    // funcion para crear usuario
    const createUser = async () => {
        const response = await fetch(`${API_URL}/users/${USER}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            }
        }

        )
        console.log(response);
        if (!response.ok) {
            console.log("debo crear al usuario");
            return
        }
        const data = await response.json()
        console.log(data);
    }
    const createTask = async () => {
        const response = await fetch(`${API_URL}/todos/${USER}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTask),
            headers: {
                "content-type": "application/json"
            }
        });
        if (response.ok) {
            setTask({ label: "", is_done: false });
            getAllTasks();
        } else {
            console.log("Error creando tarea:", response.status);
        }
    };
    const deleteTask = async (id) => {
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: "DELETE"
        });
        if (response.ok) {
            setTasks((prev) => prev.filter((t) => t.id !== id));
        }
    }
    const cleanTasks = async () => {
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: "DELETE"
        });
        if (response.ok) {
            getAllTasks();
        }
    }
    //montaje de todas las tareas 
    useEffect(() => {
        getAllTasks()
    }, [])
    return (
        <div className="todoList">
            {showAlert && (
                <div className="alert alert-warning" role="alert">
                    No hay ninguna tarea, por favor inerte un tarea.
                </div>
            )}
            <form onSubmit={handleSubmit} className="formTodoList">
                <label htmlFor="tarea">Lista de Tareas</label>
                <input
                    placeholder="Escribe una nueva tarea..."
                    id="tarea"
                    type="text"
                    name="label"
                    value={newTask.label}
                    onChange={handleInputChange}
                />
            </form>
            {tasks.map((item) => (
                <div key={item.id} className="task">
                    {item.label}
                    <button type="button" className="botonEliminar" onClick={() => deleteTask(item.id)}>X</button>
                </div>

            ))}

            <div>
                <button type="button" onClick={() => cleanTasks()} className="btn btn-danger limpiarLista">Limpiar lista de Tareas</button>
            </div>
        </div>
    );

};

export default Home;