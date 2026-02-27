import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Todo.css";

export default function Todo() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const addTask = () => {
    if (!task.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: task, completed: false }]);
    setTask("");
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const deleteAll = () => {
    if (tasks.length === 0) return;
    if(window.confirm("Are you sure?")) {
      setTasks([]);
    }
  };

  const startEdit = (id, text) => {
    setEditId(id);
    setEditText(text);
  };

  const saveEdit = (id) => {
    if (!editText.trim()) return;
    setTasks(tasks.map(t => (t.id === id ? { ...t, text: editText } : t)));
    setEditId(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditText("");
  };

  return (
    <div className="page-center">
      <div className="todo-container">
        <h1 className="todo-title">✨ My Tasks ✨</h1>

        <div className="input-group">
          <input type="text" placeholder="Add Task" value={task} onChange={e => setTask(e.target.value)} onKeyDown={e => e.key === "Enter" && addTask()} className="todo-input" />
          <button onClick={addTask} className="todo-button">Add</button>
        </div>

        {tasks.length === 0 && (
          <p className="empty-state">No Tasks Yet</p>
        )}

        <ul className="task-list">
          <AnimatePresence>
            {tasks.map(t => (
              <motion.li key={t.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.3 }} className={`task-item ${t.completed ? "completed" : ""}`}>
                {editId === t.id ? (
                  <div className="edit-group">
                    <input type="text" value={editText} className="edit-input" autoFocus
                      onChange={e => setEditText(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter") saveEdit(t.id);
                        if (e.key === "Escape") cancelEdit();
                      }}
                    />
                    <button onClick={() => saveEdit(t.id)} className="save-btn" title="Save">✔</button>
                    <button onClick={cancelEdit} className="cancel-btn" title="Cancel">✖</button>
                  </div>
                ) : (
                  <>
                    <span onClick={() => toggleComplete(t.id)}>{t.text}</span>
                    <div className="buttons">
                      <button onClick={() => startEdit(t.id, t.text)} className="edit-btn" title="Edit">✎</button>
                      <button onClick={() => toggleComplete(t.id)} className="complete-btn" title="Toggle Complete">✔</button>
                      <button onClick={() => deleteTask(t.id)} className="delete-btn" title="Delete">✖</button>
                    </div>
                  </>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {tasks.length > 0 && (
          <button className="delete-all-button" onClick={deleteAll} title="Delete All Tasks">Delete All</button>
        )}
      </div>
    </div>
  );
}