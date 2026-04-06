let todo = document.querySelector("#todo");
let progress = document.querySelector("#progress");
let done = document.querySelector("#done");
let draggedItem = null;

console.log(todo, progress, done);

const task = document.querySelectorAll(".task");

task.forEach((task) => {
  task.addEventListener("drag", (e) => {
    draggedItem = task;
  });
});

function addDragEvents(column) {
  column.addEventListener("dragenter", (e) => {
    e.preventDefault();
    column.classList.add("hover-over");
  });

  column.addEventListener("dragleave", (e) => {
    e.preventDefault();
    column.classList.remove("hover-over");
  });

  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
  column.addEventListener("drop", (e) => {
    e.preventDefault();
    console.log("Dropped", draggedItem, column);
column.appendChild(draggedItem);
column.classList.remove("hover-over");
  });
}

// Apply to all
addDragEvents(progress);
addDragEvents(todo);
addDragEvents(done);
