const gallery = document.querySelector(".gallery");
const portfolio = document.querySelector("#portfolio");
const modal = document.querySelector("#edit-modal");
const modalContainer = document.querySelector(".modal-container");
const modalGallery = document.querySelector(".modal-gallery");
const closeModalBtn = document.querySelector(".close-modal");
const backModalBtn = document.querySelector(".back-modal");
const nextModalBtn = document.querySelector(".next-modal-button");
const selectCategory = document.querySelector("#select-category");

let works;
let categories;

// Handle admin mode
export default function adminMode(existantWorks, existantCategories) {
  document.body.classList.add("edit-body");

  works = existantWorks;
  categories = [...existantCategories].filter(
    (category) => category !== "Tous"
  );

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
  displayExistantWorks();
  closeModalBtn.addEventListener("click", closeEditModal);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || e.key === "Esc") {
      closeEditModal();
    }
  });
  nextModalBtn.addEventListener("click", handleSwitchModal);

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    selectCategory.appendChild(option);
  });
};

const stopPropagation = (e) => {
  e.stopPropagation();
};

const closeEditModal = () => {
  if (!modal) return;
  modal.style.display = "none";
  modal.removeEventListener("click", closeEditModal);
  modalContainer.removeEventListener("click", stopPropagation);
  closeModalBtn.removeEventListener("click", closeEditModal);
  window.removeEventListener("keydown", closeEditModal);
  nextModalBtn.removeEventListener("click", handleSwitchModal);
};

const displayExistantWorks = () => {
  modalGallery.innerHTML = "";

  works.forEach((work) => {
    const workImg = document.createElement("figure");
    workImg.innerHTML = `
      <img src="${work.imageUrl}" alt="${work.title}" />
      <div class="icon-container">
      <i class="fa-solid fa-trash-can"></i>
      </div>
    `;

    modalGallery.appendChild(workImg);
  });
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
