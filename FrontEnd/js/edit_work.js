import { addWork, removeWork } from "./api.js";
import { works, setWorks } from "./index.js";
import { closeEditModal } from "./admin.js";

const modalGallery = document.querySelector(".modal-gallery");
const selectCategory = document.querySelector("#select-category");
const imgInput = document.querySelector(".img-input");
const titleInput = document.querySelector("#edit-title");
const submitWorkBtn = document.querySelector("#submit-btn");
const newWorkForm = document.querySelector(".new-work-form");

export const displayExistantWorks = () => {
  modalGallery.innerHTML = "";

  works.forEach((work) => {
    const workImg = document.createElement("figure");
    workImg.setAttribute("id", `modal-${work.id}`);
    workImg.innerHTML = `
        <img src="${work.imageUrl}" alt="${work.title}" />
        <div class="icon-container">
        <i class="fa-solid fa-trash-can" id=${work.id}></i>
        </div>
      `;

    modalGallery.appendChild(workImg);

    const deleteIcon = workImg.querySelector("i");
    deleteIcon.addEventListener("click", deleteWork);
  });
};

const deleteWork = async (e) => {
  const workId = e.target.id;

  try {
    await removeWork(workId);
    const updatedWorks = works.filter((work) => work.id !== parseInt(workId));
    setWorks(updatedWorks);

    displayExistantWorks();
  } catch (error) {
    console.log("Erreur lors de la suppression :", error.message);
  }
};

export const checkFormValidity = () => {
  if (
    imgInput.files.length > 0 &&
    titleInput.value.trim() !== "" &&
    selectCategory.value !== ""
  ) {
    submitWorkBtn.classList.remove("invalid-form");
    hideError();
    newWorkForm.removeEventListener("submit", showError);
    newWorkForm.addEventListener("submit", submitWork);
  } else {
    submitWorkBtn.classList.add("invalid-form");
    newWorkForm.removeEventListener("submit", submitWork);
    newWorkForm.addEventListener("submit", showError);
  }
};

const showError = (e) => {
  e.preventDefault();
  let errorSpan = submitWorkBtn.previousElementSibling;

  if (!errorSpan || !errorSpan.classList.contains("error-message")) {
    errorSpan = document.createElement("span");
    errorSpan.classList.add("error-message");
    errorSpan.textContent = `Veuillez renseigner tous les champs`;
    submitWorkBtn.parentNode.insertBefore(errorSpan, submitWorkBtn);
  }
};

const hideError = () => {
  let errorSpan = submitWorkBtn.previousElementSibling;
  if (errorSpan && errorSpan.classList.contains("error-message")) {
    errorSpan.remove();
  }
};

export const submitWork = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("image", imgInput.files[0]);
  formData.append("title", titleInput.value);
  formData.append("category", selectCategory.value);

  try {
    const newWork = await addWork(formData);

    setWorks([...works, newWork]);
    displayExistantWorks();
    closeEditModal();
  } catch (error) {
    console.log("Erreur lors de l'envoi :", error.message);
  }
};
