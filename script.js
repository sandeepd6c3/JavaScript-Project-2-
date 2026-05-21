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

    column.appendChild(dragElement);
    column.classList.remove("hover-over");
  });
}
addDragEventsOnColumns(todo);
addDragEventsOnColumns(progress);
addDragEventsOnColumns(done);

// Modal related code
const toggleModalBtn = document.querySelector("#toggle-modal");
const modal = document.querySelector(".modal");
const modalBG = document.querySelector(".modal .bg");
const addTaskButton=document.querySelector("#add-new-task");

toggleModalBtn.addEventListener("click", () => {
  modal.classList.toggle("active");
});

modalBG.addEventListener("click", () => {
  modal.classList.remove("active");
});

addTaskButton.addEventListener("click",()=>{

  const taskTitleInput=document.querySelector("#task-title-input").value;
  const taskDescriptionInput=document.querySelector("#task-description-input").value;

const div=document.querySelector("div");

div.classList.add("task");
  div.setAttribute("draggable","true");

  div.innerHTML=`
  <h2>${taskTitleInput}</h2>
  <p>${taskDescriptionInput}</p>
  <button>Delete</button>
  `
  todo.appendChild(div);
  modal.classList.remove("active");
    
  div.addEventListener("drag", (e) => {
    dragElement = div;
  });

});
