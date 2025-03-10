const body = document.querySelector("body");

const editMode = document.createElement("div");
editMode.classList.add("edit-mode");
editMode.innerHTML = `
  <i class="fa-solid fa-pen-to-square"></i>
  <span>Mode édition</span>
`;
body.prepend(editMode);
