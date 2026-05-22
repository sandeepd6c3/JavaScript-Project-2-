const todo = document.querySelector("#Todo");
const progress = document.querySelector("#Progress");
const done = document.querySelector("#Done");
const columns = [todo, progress, done];

let dragElement = null; // currently dragged task item

const taskTitleInput = document.querySelector("#task-title-input");
const taskDescriptionInput = document.querySelector("#task-description-input");
const toggleModalBtn = document.querySelector("#toggle-modal");
const modal = document.querySelector(".modal");
const modalBG = document.querySelector(".modal .bg");
const addTaskButton = document.querySelector("#add-new-task");
const clearBoardButton = document.querySelector("#clear-board");

const STORAGE_KEY = "taskBoardData";

function getSavedTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  } catch (error) {
    console.warn("Invalid saved task data", error);
    return null;
  }
}

function saveTasks() {
  const tasksToSave = Array.from(document.querySelectorAll(".task")).map((taskElement) => ({
    id: taskElement.dataset.id,
    title: taskElement.querySelector("h2")?.innerText || "Untitled",
    description: taskElement.querySelector("p")?.innerText || "",
    column: taskElement.closest(".task-column")?.id || todo.id,
  }));

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksToSave));
}

function clearTasksFromColumns() {
  columns.forEach((column) => {
    column.querySelectorAll(".task").forEach((task) => task.remove());
  });
}

function createTaskElement({ id, title, description }) {
  const taskElement = document.createElement("div");
  taskElement.classList.add("task");
  taskElement.setAttribute("draggable", "true");
  taskElement.dataset.id = id || crypto.randomUUID();

  taskElement.innerHTML = `
    <h2>${title}</h2>
    <p>${description || "No description provided."}</p>
    <button class="delete-task">Delete</button>
  `;

  attachTaskListeners(taskElement);

  return taskElement;
}

function renderTasks(taskList) {
  clearTasksFromColumns();
  taskList.forEach((taskData) => {
    const taskElement = createTaskElement(taskData);
    const targetColumn = columns.find((column) => column.id === taskData.column) || todo;
    targetColumn.appendChild(taskElement);
  });
  updateTaskCounts();
}

function loadTasks() {
  const savedTasks = getSavedTasks();
  if (Array.isArray(savedTasks) && savedTasks.length) {
    renderTasks(savedTasks);
  } else {
    const initialTasks = Array.from(document.querySelectorAll(".task")).map((taskElement) => ({
      id: taskElement.dataset.id || crypto.randomUUID(),
      title: taskElement.querySelector("h2")?.innerText || "Untitled",
      description: taskElement.querySelector("p")?.innerText || "No description provided.",
      column: taskElement.closest(".task-column")?.id || todo.id,
    }));
    initialTasks.forEach((taskData) => {
      if (!taskData.id) taskData.id = crypto.randomUUID();
    });
    saveTasks();
    renderTasks(initialTasks);
  }
}

function attachTaskListeners(taskElement) {
  taskElement.addEventListener("dragstart", () => {
    dragElement = taskElement;
  });

  taskElement.addEventListener("dragend", () => {
    dragElement = null;
  });

  const deleteButton = taskElement.querySelector(".delete-task");
  if (deleteButton) {
    deleteButton.addEventListener("click", () => {
      taskElement.remove();
      updateTaskCounts();
      saveTasks();
    });
  }
}

// Add drag events for a column so tasks can be dropped there
function addDragEventsOnColumn(column) {
  column.addEventListener("dragenter", (event) => {
    event.preventDefault();
    column.classList.add("hover-over");
  });

  column.addEventListener("dragleave", () => {
    column.classList.remove("hover-over");
  });

  column.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  column.addEventListener("drop", (event) => {
    event.preventDefault();
    if (!dragElement) return;

    column.appendChild(dragElement);
    column.classList.remove("hover-over");
    updateTaskCounts();
    saveTasks();
  });
}

// Update the task count shown in each column header
function updateTaskCounts() {
  columns.forEach((col) => {
    const countElement = col.querySelector(".right");
    if (countElement) {
      countElement.innerText = col.querySelectorAll(".task").length;
    }
  });
}

// Attach drag events for all columns
columns.forEach(addDragEventsOnColumn);
loadTasks();

// Open or close the modal when the toggle button is clicked
toggleModalBtn.addEventListener("click", () => {
  const isActive = modal.classList.toggle("active");
  if (isActive) {
    taskTitleInput.focus();
  }
});

clearBoardButton.addEventListener("click", () => {
  const shouldClear = confirm("Delete all tasks and reset the board?");
  if (!shouldClear) return;
  clearTasksFromColumns();
  updateTaskCounts();
  saveTasks();
});

// Close modal when clicking on the background overlay
modalBG.addEventListener("click", () => {
  modal.classList.remove("active");
});

// Close modal when pressing Escape
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    modal.classList.remove("active");
  }
});

// Add a new task when the button inside the modal is clicked
addTaskButton.addEventListener("click", () => {
  const title = taskTitleInput.value.trim();
  const description = taskDescriptionInput.value.trim();
  if (!title) {
    taskTitleInput.focus();
    return;
  }

  const newTask = createTaskElement({
    title,
    description,
  });
  todo.appendChild(newTask);

  updateTaskCounts();
  saveTasks();
  modal.classList.remove("active");
  taskTitleInput.value = "";
  taskDescriptionInput.value = "";
});
