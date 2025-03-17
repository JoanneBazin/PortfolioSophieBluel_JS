import {
  initModalState,
  resetModalState,
  checkFormValidity,
  resetForm,
} from "./edit_work.js";

const gallery = document.querySelector(".gallery");
const portfolio = document.querySelector("#portfolio");
const modal = document.querySelector("#edit-modal");
const modalContainer = document.querySelector(".modal-container");
const closeModalBtn = document.querySelector(".close-modal");
const backModalBtn = document.querySelector(".back-modal");
const nextModalBtn = document.querySelector(".next-modal-button");
const firstModal = document.querySelector(".first-modal");
const secondModal = document.querySelector(".second-modal");

// Interface globale admin
export default function adminMode() {
  document.body.classList.add("edit-body");

  const editMode = document.createElement("div");
  editMode.classList.add("edit-mode");

  const editModeIcon = document.createElement("i");
  editModeIcon.classList.add("fa-solid", "fa-pen-to-square");

  const editModeText = document.createElement("span");
  editModeText.textContent = "Mode édition";

  editMode.appendChild(editModeIcon);
  editMode.appendChild(editModeText);
  document.body.prepend(editMode);

  const worksEdit = document.createElement("button");
  worksEdit.classList.add("works-edit");

  const editIcon = document.createElement("i");
  editIcon.classList.add("fa-solid", "fa-pen-to-square");

  const editText = document.createElement("span");
  editText.textContent = "modifier";

  worksEdit.appendChild(editIcon);
  worksEdit.appendChild(editText);

  portfolio.insertBefore(worksEdit, gallery);

  worksEdit.addEventListener("click", openEditModal);
}

// Gestion ouverture / fermeture modale

const openEditModal = () => {
  modal.style.display = null;
  initModalState();

  modal.addEventListener("click", closeEditModal);
  modalContainer.addEventListener("click", stopPropagation);
  closeModalBtn.addEventListener("click", closeEditModal);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || e.key === "Esc") {
      closeEditModal();
    }
  });
  firstModal.classList.remove("hidden");
  secondModal.classList.add("hidden");
  nextModalBtn.addEventListener("click", handleSwitchModal);
  backModalBtn.addEventListener("click", handleSwitchModal);
};

const stopPropagation = (e) => {
  e.stopPropagation();
};

export const closeEditModal = () => {
  if (!modal) return;
  modal.style.display = "none";
  resetModalState();

  modal.removeEventListener("click", closeEditModal);
  modalContainer.removeEventListener("click", stopPropagation);
  closeModalBtn.removeEventListener("click", closeEditModal);
  window.removeEventListener("keydown", closeEditModal);
  nextModalBtn.removeEventListener("click", handleSwitchModal);
  backModalBtn.removeEventListener("click", handleSwitchModal);
};

const handleSwitchModal = () => {
  firstModal.classList.toggle("hidden");
  secondModal.classList.toggle("hidden");

  if (firstModal.classList.contains("hidden")) {
    backModalBtn.style.visibility = "visible";
    checkFormValidity();
  } else {
    backModalBtn.style.visibility = "hidden";
    resetForm();
  }
};
