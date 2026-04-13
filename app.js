let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

function addTask() {
    const text = document.getElementById("taskInput").value;
    const date = document.getElementById("dueDate").value;
    const priority = document.getElementById("priority").value;

    if (!text) return;

    tasks.push({
        text,
        date,
        priority,
        completed: false
    });

    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

function renderTasks() {
    const list = document.getElementById("taskList");
    const search = document.getElementById("search").value.toLowerCase();
    list.innerHTML = "";

    let filtered = tasks.filter(task => 
        task.text.toLowerCase().includes(search)
    );

    if (filter === "completed")
        filtered = filtered.filter(t => t.completed);
    if (filter === "pending")
        filtered = filtered.filter(t => !t.completed);

    filtered.forEach((task, index) => {
        const li = document.createElement("li");

        let overdue = "";
        if (task.date && new Date(task.date) < new Date() && !task.completed) {
            overdue = "overdue";
        }

        li.className = `${task.priority} ${overdue}`;

        li.innerHTML = `
            <b onclick="toggleTask(${index})">${task.text}</b><br>
            📅 ${task.date || "No date"} | 🔥 ${task.priority}
            <button onclick="deleteTask(${index})">❌</button>
        `;

        list.appendChild(li);
    });

    updateStats();
}

function toggleTask(i) {
    tasks[i].completed = !tasks[i].completed;
    saveAndRender();
}

function deleteTask(i) {
    tasks.splice(i, 1);
    saveAndRender();
}

function filterTasks(type) {
    filter = type;
    renderTasks();
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;

    document.getElementById("stats").innerText =
        `Total: ${total} | Completed: ${completed} | Pending: ${total - completed}`;
}

document.getElementById("search").addEventListener("input", renderTasks);

renderTasks();