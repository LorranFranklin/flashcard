const container = document.querySelector(".container");
const addTarefa = document.querySelector("#add-card");
const closeBtn = document.querySelector("#close-btn");
const addTaskModal = document.querySelector("#add-card-modal");
const saveBtn = document.querySelector("#save-btn");
const task = document.querySelector("#task");
const desc = document.querySelector("#Desc");
const errorMsg = document.querySelector("#error");

let editBool = false;
let originalId = null;
let flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];

addTarefa.addEventListener("click", () => {
  container.classList.add("hide");
  task.value = "";
  desc.value = "";
  addTaskModal.classList.remove("hide");
});

closeBtn.addEventListener("click", () => {
  container.classList.remove("hide");
  addTaskModal.classList.add("hide");
  if (editBool) {
    editBool = false;
  }
});

saveBtn.addEventListener("click", () => {
  let tempTask = task.value.trim();
  let tempDesc = desc.value.trim();
  if (!tempTask || !tempDesc) {
    errorMsg.classList.remove("hide");
  } else {
    if (editBool) {
      flashcards = flashcards.filter((flashcard) => flashcard.id !== originalId);
    }
    let id = Date.now();
    flashcards.push({ id, task: tempTask, Desc: tempDesc });
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
    container.classList.remove("hide");
    errorMsg.classList.add("hide");
    viewList();
    task.value = "";
    desc.value = "";
    editBool = false;
    addTaskModal.classList.add("hide");
  }
});

function viewList() {
  const cardsList = document.querySelector(".card-list");
  cardsList.innerHTML = "";

  flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
  flashcards.forEach((flashcard) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
    <p class="task">${flashcard.task}</p>
    <p class="Desc hide">${flashcard.Desc}</p>
    <button class="show-hide-btn">Mostrar +</button>
    <div class="btns-con">
      <button class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></button>
      <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
    </div>
    `;

    div.setAttribute("data-id", flashcard.id);
    const displayDesc = div.querySelector(".Desc");
    const showHideBtn = div.querySelector(".show-hide-btn");
    const editBtn = div.querySelector(".edit-btn");
    const deleteBtn = div.querySelector(".delete-btn");

    showHideBtn.addEventListener("click", () => {
      displayDesc.classList.toggle("hide");
    });

    editBtn.addEventListener("click", () => {
      editBool = true;
      modifyElement(editBtn, true);
      addTaskModal.classList.remove("hide");
    });

    deleteBtn.addEventListener("click", () => {
      modifyElement(deleteBtn);
    });

    cardsList.appendChild(div);
  });
}

const modifyElement = (element, edit = false) => {
  const parentDiv = element.parentElement.parentElement;
  const id = Number(parentDiv.getAttribute("data-id"));
  const parentTask = parentDiv.querySelector(".task").innerText;
  if (edit) {
    const parentDesc = parentDiv.querySelector(".Desc").innerText;
    desc.value = parentDesc;
    task.value = parentTask;
    originalId = id;
    disableBtns(true);
  } else {
    flashcards = flashcards.filter((flashcard) => flashcard.id !== id);
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
  }
  parentDiv.remove();
};

const disableBtns = (value) => {
  const editBtn = document.querySelector(".edit-btn");
  Array.from(editBtn).forEach((element) => {
    element.disabled = value;
  });
};

document.addEventListener("DOMContentLoaded", viewList);
