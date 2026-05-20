const todo = document.querySelector("#Todo");
const progress = document.querySelector("#Progress");
const done = document.querySelector("#Done");

const tasks = document.querySelectorAll(".task");

tasks.forEach((task) => {
  task.addEventListener("drag", (e) => {
    dragElement = task;
    
  });
});

function addDragEventsOnColumns(column) {
  column.addEventListener("dragenter", (e) => {
    e.preventDefault();
    column.classList.add("hover-over");

  })
  column.addEventListener("dragleave", (e) => {
    e.preventDefault();
    column.classList.remove("hover-over");
  });

  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  column.addEventListener("drop", (e) => {
    
    e.preventDefault();
    

    column.appendChild(dragElement);
    column.classList.remove("hover-over");
  });
}
addDragEventsOnColumns(todo);
addDragEventsOnColumns(progress);
addDragEventsOnColumns(done);   

