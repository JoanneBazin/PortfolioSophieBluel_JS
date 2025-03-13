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
  nextModalBtn.addEventListener("click", handleSwitchModal);

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
  if (!modal) return;
  modal.style.display = "none";
  modal.removeEventListener("click", closeEditModal);
  modalContainer.removeEventListener("click", stopPropagation);
  closeModalBtn.removeEventListener("click", closeEditModal);
  window.removeEventListener("keydown", closeEditModal);
  nextModalBtn.removeEventListener("click", handleSwitchModal);
  imgInput.removeEventListener("change", previewFile);
  imgInput.removeEventListener("change", checkFormValidity);
  titleInput.removeEventListener("input", checkFormValidity);
  selectCategory.removeEventListener("change", checkFormValidity);
};

const handleSwitchModal = () => {
  const firstModal = document.querySelector(".first-modal");
  const secondModal = document.querySelector(".second-modal");

  firstModal.classList.toggle("hidden");
  secondModal.classList.toggle("hidden");
  if (firstModal.classList.contains("hidden")) {
    backModalBtn.style.visibility = "visible";
    backModalBtn.addEventListener("click", handleSwitchModal);
  } else {
    backModalBtn.style.visibility = "hidden";
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

  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      previewImg.src = e.target.result;
      previewImg.style.display = "block";
      imgUploadContent.style.display = "none";
    };

    reader.readAsDataURL(file);
  }
};
