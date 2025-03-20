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
  if (document.querySelector(".edit-mode")) return;

  const editMode = document.createElement("div");
  editMode.classList.add("edit-mode");

  const editModeIcon = document.createElement("i");
  editModeIcon.classList.add("fa-solid", "fa-pen-to-square");

  const editModeText = document.createElement("span");
  editModeText.textContent = "Mode édition";

  editMode.appendChild(editModeIcon);
  editMode.appendChild(editModeText);
  document.body.prepend(editMode);

  if (!document.querySelector(".works-edit")) {
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
}

// Gestion ouverture / fermeture modale

const openEditModal = () => {
  if (modal.style.display === "flex") return;

  modal.style.display = "flex";
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "modal-title-gallery");
  initModalState();

  firstModal.classList.remove("hidden");
  secondModal.classList.add("hidden");
  firstModal.inert = false;
  secondModal.inert = true;

  modal.addEventListener("click", closeEditModal);
  modalContainer.addEventListener("click", stopPropagation);
  closeModalBtn.addEventListener("click", closeEditModal);
  window.addEventListener("keydown", handleEscKey);
  nextModalBtn.addEventListener("click", handleSwitchModal);
  backModalBtn.addEventListener("click", handleSwitchModal);
};

const stopPropagation = (e) => {
  e.stopPropagation();
};

const handleEscKey = (e) => {
  if (e.key === "Escape" || e.key === "Esc") {
    closeEditModal();
  }
};

export const closeEditModal = () => {
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  resetModalState();

  modal.removeEventListener("click", closeEditModal);
  modalContainer.removeEventListener("click", stopPropagation);
  closeModalBtn.removeEventListener("click", closeEditModal);
  window.removeEventListener("keydown", handleEscKey);
  nextModalBtn.removeEventListener("click", handleSwitchModal);
  backModalBtn.removeEventListener("click", handleSwitchModal);
};

const handleSwitchModal = () => {
  const isFirstHidden = firstModal.classList.toggle("hidden");
  secondModal.classList.toggle("hidden");

  firstModal.inert = isFirstHidden;
  secondModal.inert = !isFirstHidden;

  modal.setAttribute(
    "aria-labelledby",
    isFirstHidden ? "modal-title-add" : "modal-title-gallery"
  );

  backModalBtn.style.visibility = isFirstHidden ? "visible" : "hidden";

  isFirstHidden ? checkFormValidity() : resetForm();
};
