import { Router } from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

const VALID_STATUSES = ["todo", "doing", "done"];

router.get("/", (req, res) => {
  const tasks = db
    .prepare("SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC")
    .all(req.userId);
  res.json({ tasks });
});

router.post("/", (req, res) => {
  const { title, description = "" } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: "title es obligatorio" });
  }

  const result = db
    .prepare("INSERT INTO tasks (user_id, title, description) VALUES (?, ?, ?)")
    .run(req.userId, title.trim(), description);

  const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json({ task });
});

router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  const task = db.prepare("SELECT * FROM tasks WHERE id = ? AND user_id = ?").get(id, req.userId);
  if (!task) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }
  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `status debe ser uno de: ${VALID_STATUSES.join(", ")}` });
  }

  db.prepare(
    `UPDATE tasks SET
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      status = COALESCE(?, status),
      updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
  ).run(title ?? null, description ?? null, status ?? null, id);

  const updated = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);
  res.json({ task: updated });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const task = db.prepare("SELECT * FROM tasks WHERE id = ? AND user_id = ?").get(id, req.userId);
  if (!task) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }
  db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
  res.status(204).send();
});

export default router;