import { useEffect, useState } from "react";
import { api, clearToken } from "../api.js";
import TaskCard from "./TaskCard.jsx";

const COLUMNS = [
  { key: "todo", label: "Por hacer" },
  { key: "doing", label: "En progreso" },
  { key: "done", label: "Hecho" },
];

export default function TaskBoard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const data = await api.getTasks();
      setTasks(data.tasks);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const data = await api.createTask(title, description);
      setTasks((prev) => [data.task, ...prev]);
      setTitle("");
      setDescription("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleAdvance(id, status) {
    try {
      const data = await api.updateTask(id, { status });
      setTasks((prev) => prev.map((t) => (t.id === id ? data.task : t)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await api.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  function handleLogout() {
    clearToken();
    onLogout();
  }

  return (
    <div className="board-page">
      <header className="board-header">
        <h1>TeamTask</h1>
        <div>
          <span>Hola, {user.name}</span>
          <button className="link" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      {error && <p className="error">{error}</p>}

      <form className="new-task-form" onSubmit={handleCreate}>
        <input
          placeholder="Título de la tarea"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Descripción (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Agregar</button>
      </form>

      <div className="board-columns">
        {COLUMNS.map((col) => (
          <div key={col.key} className="board-column">
            <h3>{col.label}</h3>
            {tasks
              .filter((t) => t.status === col.key)
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onAdvance={handleAdvance}
                  onDelete={handleDelete}
                />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}