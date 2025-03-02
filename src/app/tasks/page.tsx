"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("low");

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
  }

  async function addTask() {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, priority }),
    });

    if (res.ok) {
      fetchTasks();
      setTitle("");
    }
  }

  async function deleteTask(id) {
    await fetch("/api/tasks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchTasks();
  }

  return (
    <main className="p-5">
      <h1 className="text-2xl font-bold">Auto Todo Builder</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task Title"
        className="border p-2"
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button onClick={addTask} className="bg-blue-500 text-white p-2 ml-2">
        Add Task
      </button>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="flex justify-between p-2 border">
            <span>{task.title} - {task.priority}</span>
            <button onClick={() => deleteTask(task.id)} className="bg-red-500 text-white p-1">Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
