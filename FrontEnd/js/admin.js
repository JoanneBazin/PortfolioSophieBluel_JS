import { displayExistantWorks, checkFormValidity } from "./edit_work.js";
import { getCategories } from "./api.js";

const gallery = document.querySelector(".gallery");
const portfolio = document.querySelector("#portfolio");
const modal = document.querySelector("#edit-modal");
const modalContainer = document.querySelector(".modal-container");
const closeModalBtn = document.querySelector(".close-modal");
const backModalBtn = document.querySelector(".back-modal");
const nextModalBtn = document.querySelector(".next-modal-button");
const selectCategory = document.querySelector("#select-category");
const imgInput = document.querySelector(".img-input");
const titleInput = document.querySelector("#edit-title");
const previewImg = document.querySelector("#preview-img");
const imgUploadContent = document.querySelector(".img-upload-content");
const newWorkForm = document.querySelector(".new-work-form");
const firstModal = document.querySelector(".first-modal");
const secondModal = document.querySelector(".second-modal");
const imgInputLabel = document.querySelector(".img-input-label");

let works;
let categories;

// Handle admin mode
export default function adminMode(existantWorks) {
  document.body.classList.add("edit-body");

  works = existantWorks;

  const editMode = document.createElement("div");
  editMode.classList.add("edit-mode");
  editMode.innerHTML = `
    <i class="fa-solid fa-pen-to-square"></i>
    <span>Mode édition</span>
  `;
  document.body.prepend(editMode);

  const worksEdit = document.createElement("button");
  worksEdit.classList.add("works-edit");
  worksEdit.innerHTML = `
    <i class="fa-solid fa-pen-to-square"></i>
    <span>modifier</span>
  `;
  portfolio.insertBefore(worksEdit, gallery);

  worksEdit.addEventListener("click", openEditModal);
}

const openEditModal = async () => {
  modal.style.display = null;
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

  displayExistantWorks(works);
  if (categories === undefined) {
    fetchCategories();
  }

  imgInput.addEventListener("change", previewFile);
  imgInput.addEventListener("change", checkFormValidity);
  titleInput.addEventListener("input", checkFormValidity);
  selectCategory.addEventListener("change", checkFormValidity);
};

const stopPropagation = (e) => {
  e.stopPropagation();
};

export const closeEditModal = () => {
  const workFormErrors = document.querySelectorAll(
    ".new-work-form .error-message"
  );
  if (!modal) return;
  modal.style.display = "none";
  newWorkForm.reset();
  previewImg.style.visibility = "hidden";
  imgUploadContent.style.opacity = 1;
  imgInputLabel.classList.remove("preview-mode");
  if (workFormErrors) {
    workFormErrors.forEach((error) => error.remove());
  }
  modal.removeEventListener("click", closeEditModal);
  modalContainer.removeEventListener("click", stopPropagation);
  closeModalBtn.removeEventListener("click", closeEditModal);
  window.removeEventListener("keydown", closeEditModal);
  nextModalBtn.removeEventListener("click", handleSwitchModal);
  backModalBtn.removeEventListener("click", handleSwitchModal);
  imgInput.removeEventListener("change", previewFile);
  imgInput.removeEventListener("change", checkFormValidity);
  titleInput.removeEventListener("input", checkFormValidity);
  selectCategory.removeEventListener("change", checkFormValidity);
};

const handleSwitchModal = () => {
  const workFormErrors = document.querySelectorAll(
    ".new-work-form .error-message"
  );
  firstModal.classList.toggle("hidden");
  secondModal.classList.toggle("hidden");

  if (firstModal.classList.contains("hidden")) {
    backModalBtn.style.visibility = "visible";
    checkFormValidity();
  } else {
    backModalBtn.style.visibility = "hidden";
    newWorkForm.reset();
    previewImg.style.visibility = "hidden";
    imgUploadContent.style.opacity = 1;
    imgInputLabel.classList.remove("preview-mode");
    if (workFormErrors) {
      workFormErrors.forEach((error) => error.remove());
    }
  }
};

const fetchCategories = async () => {
  categories = await getCategories();

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    selectCategory.appendChild(option);
  });
};

const previewFile = () => {
  const file = imgInput.files[0];
  const allowedTypes = ["image/png", "image/jpeg"];

  if (file) {
    if (!allowedTypes.includes(file.type)) {
      let typeError = imgUploadContent.lastElementChild;

      if (!typeError || !typeError.classList.contains("error-message")) {
        typeError = document.createElement("span");
        typeError.textContent =
          "Format invalide. Seuls les fichiers .png et .jpeg/.jpg sont acceptés.";
        typeError.classList.add("error-message");
        imgUploadContent.appendChild(typeError);
      }

      imgInput.value = "";

      return;
    }
    const reader = new FileReader();

    reader.onload = (e) => {
      previewImg.src = e.target.result;
      previewImg.style.visibility = "visible";
      imgUploadContent.style.opacity = 0;
      imgInputLabel.classList.add("preview-mode");
    };

    reader.readAsDataURL(file);
  }
};
