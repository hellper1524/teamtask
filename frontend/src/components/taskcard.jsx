const NEXT_STATUS = { todo: "doing", doing: "done", done: "todo" };
const STATUS_LABEL = { todo: "Por hacer", doing: "En progreso", done: "Hecho" };

export default function TaskCard({ task, onAdvance, onDelete }) {
  return (
    <div className={`task-card status-${task.status}`}>
      <div className="task-card-header">
        <h4>{task.title}</h4>
        <button className="icon-btn" onClick={() => onDelete(task.id)} title="Eliminar">
          ✕
        </button>
      </div>
      {task.description && <p className="task-desc">{task.description}</p>}
      <button className="advance-btn" onClick={() => onAdvance(task.id, NEXT_STATUS[task.status])}>
        Mover a: {STATUS_LABEL[NEXT_STATUS[task.status]]}
      </button>
    </div>
  );
}