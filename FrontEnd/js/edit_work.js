import { addWork, removeWork, getCategories } from "./api.js";
import { works, setWorks } from "./index.js";
import { closeEditModal } from "./admin.js";

const modalGallery = document.querySelector(".modal-gallery");
const selectCategory = document.querySelector("#select-category");
const imgInput = document.querySelector(".img-input");
const titleInput = document.querySelector("#edit-title");
const submitWorkBtn = document.querySelector("#submit-btn");
const newWorkForm = document.querySelector(".new-work-form");
const previewImg = document.querySelector("#preview-img");
const imgUploadContent = document.querySelector(".img-upload-content");
const imgInputLabel = document.querySelector(".img-input-label");

let categories;
export const initModalState = () => {
  displayExistantWorks();
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

  works.forEach((work) => {
    const workImg = document.createElement("figure");
    workImg.setAttribute("id", `modal-${work.id}`);

    const imgElement = document.createElement("img");
    imgElement.src = work.imageUrl;
    imgElement.alt = work.title;

    const iconContainer = document.createElement("div");
    iconContainer.classList.add("icon-container");
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash-can");
    deleteIcon.setAttribute("id", work.id);

    workImg.appendChild(imgElement);
    workImg.appendChild(iconContainer);
    iconContainer.appendChild(deleteIcon);

    modalGallery.appendChild(workImg);

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

// Modale 2 -- Ajout projet

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

  const existingError = imgUploadContent.querySelector(".error-message");
  if (existingError) existingError.remove();

  if (file) {
    if (!allowedTypes.includes(file.type)) {
      previewImg.src = "";
      previewImg.style.visibility = "hidden";
      imgUploadContent.style.opacity = 1;
      imgInputLabel.classList.remove("preview-mode");

      const typeError = document.createElement("span");
      typeError.textContent =
        "Format invalide. Seuls les fichiers .png et .jpeg/.jpg sont acceptés.";
      typeError.classList.add("error-message");
      imgUploadContent.appendChild(typeError);

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
  newWorkForm.querySelectorAll(".error").forEach((error) => error.remove());
};

export const submitWork = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("image", imgInput.files[0]);
  formData.append("title", titleInput.value);
  formData.append("category", selectCategory.value);

  try {
    const newWork = await addWork(formData);
    const workCategory = categories.find(
      (cat) => cat.id === newWork.categoryId
    );

    setWorks([
      ...works,
      {
        ...newWork,
        category: { id: newWork.categoryId, name: workCategory?.name || "" },
      },
    ]);
    displayExistantWorks();
    closeEditModal();
  } catch (error) {
    console.log("Erreur lors de l'envoi :", error.message);
  }
};

export const resetForm = () => {
  const workFormErrors = document.querySelectorAll(
    ".new-work-form .error-message"
  );
  newWorkForm.reset();
  previewImg.style.visibility = "hidden";
  imgUploadContent.style.opacity = 1;
  imgInputLabel.classList.remove("preview-mode");
  if (workFormErrors) {
    workFormErrors.forEach((error) => error.remove());
  }
};
