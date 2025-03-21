import { addWork, removeWork, getCategories } from "./api.js";
import { works, setWorks, createGalleryFigure } from "./index.js";
import { closeEditModal } from "./admin.js";

const modalContainer = document.querySelector(".modal-container");
const modalGallery = document.querySelector(".modal-gallery");
const gallery = document.querySelector(".gallery");
const selectCategory = document.querySelector("#select-category");
const imgInput = document.querySelector(".img-input");
const titleInput = document.querySelector("#edit-title");
const submitWorkBtn = document.querySelector("#submit-btn");
const newWorkForm = document.querySelector(".new-work-form");
const previewImg = document.querySelector("#preview-img");
const imgUploadContent = document.querySelector(".img-upload-content");
const imgInputLabel = document.querySelector(".img-input-label");
const textInputContainer = document.querySelector(".text-input-container");

let categories;
export const initModalState = () => {
  if (!modalGallery.hasChildNodes()) {
    displayExistantWorks();
  }

  if (!categories || categories.length === 0) {
    fetchCategories();
  }
  imgInput.addEventListener("change", previewFile);
  imgInput.addEventListener("change", checkFormValidity);
  titleInput.addEventListener("input", checkFormValidity);
  selectCategory.addEventListener("change", checkFormValidity);
};

export const resetModalState = () => {
  resetForm();
  imgInput.removeEventListener("change", previewFile);
  imgInput.removeEventListener("change", checkFormValidity);
  titleInput.removeEventListener("input", checkFormValidity);
  selectCategory.removeEventListener("change", checkFormValidity);
};

// Modal 1 -- Galerie photo
export const displayExistantWorks = () => {
  modalGallery.innerHTML = "";

  if (!works || works.length === 0) {
    modalGallery.innerHTML = `<p class= "error-fetch-works">Aucun projet trouvé.</p>`;
    return;
  }

  works.forEach((work) => {
    createModalFigure(work);
  });
};

const createModalFigure = (work) => {
  const workImg = document.createElement("figure");
  workImg.dataset.id = work.id;

  const imgElement = document.createElement("img");
  imgElement.src = work.imageUrl;
  imgElement.alt = work.title;

  const iconContainer = document.createElement("button");
  iconContainer.classList.add("icon-container");

  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add("fa-solid", "fa-trash-can");
  deleteIcon.dataset.id = work.id;

  deleteIcon.addEventListener("click", deleteWork);

  iconContainer.appendChild(deleteIcon);
  workImg.append(imgElement, iconContainer);

  modalGallery.appendChild(workImg);
};

const deleteWork = async (e) => {
  const workId = e.target.dataset.id;

  try {
    await removeWork(workId);
    const updatedWorks = works.filter((work) => work.id !== parseInt(workId));
    setWorks(updatedWorks);

    gallery.querySelector(`figure[data-id="${workId}"]`)?.remove();
    modalGallery.querySelector(`figure[data-id="${workId}"]`)?.remove();
  } catch (error) {
    messageError("Erreur lors de la suppression du projet", modalGallery);
  }
};

// Modale 2 -- Ajout projet

const fetchCategories = async () => {
  try {
    categories = await getCategories();

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      selectCategory.appendChild(option);
    });
  } catch (error) {
    messageError("Impossible de charger les catégories", textInputContainer);
  }
};

export const checkFormValidity = () => {
  const isValid =
    imgInput.files.length > 0 &&
    titleInput.value.trim() !== "" &&
    selectCategory.value !== "";

  submitWorkBtn.classList.toggle("invalid-form", !isValid);
  newWorkForm.removeEventListener("submit", showError);
  newWorkForm.removeEventListener("submit", submitWork);

  if (isValid) clearError();

  newWorkForm.addEventListener("submit", isValid ? submitWork : showError);
};

const previewFile = () => {
  const file = imgInput.files[0];
  const allowedTypes = ["image/png", "image/jpeg"];

  imgUploadContent.querySelector(".error-message")?.remove();

  if (file) {
    if (!allowedTypes.includes(file.type)) {
      resetPreview();
      messageError(
        "Format invalide. Fichiers .png, .jpeg et .jpg acceptés",
        imgUploadContent
      );

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

export const submitWork = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("image", imgInput.files[0]);
  formData.append("title", titleInput.value);
  formData.append("category", selectCategory.value);

  try {
    let newWork = await addWork(formData);
    const workCategory = categories.find(
      (cat) => cat.id === newWork.categoryId
    );
    newWork = {
      ...newWork,
      category: { id: newWork.categoryId, name: workCategory?.name || "" },
    };
    setWorks([...works, newWork]);
    createGalleryFigure(newWork);
    createModalFigure(newWork);
    closeEditModal();
  } catch (error) {
    messageError("Erreur lors de l'envoi du projet", newWorkForm);
  }
};

// Mise à jour formulaire
export const resetForm = () => {
  clearError();
  newWorkForm.reset();
  resetPreview();
};

const resetPreview = () => {
  previewImg.src = "";
  previewImg.style.visibility = "hidden";
  imgUploadContent.style.opacity = 1;
  imgInputLabel.classList.remove("preview-mode");
};

//  Gestion erreurs

const showError = (e) => {
  e.preventDefault();
  messageError("Veuillez renseigner tous les champs", textInputContainer);
};

const messageError = (errorContent, input) => {
  clearError();
  const errorSpan = document.createElement("span");
  errorSpan.classList.add("error-message");
  errorSpan.textContent = errorContent;
  input.appendChild(errorSpan);
};

const clearError = () => {
  modalContainer
    .querySelectorAll(".error-message")
    .forEach((error) => error.remove());
};
