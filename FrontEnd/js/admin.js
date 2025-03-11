const gallery = document.querySelector(".gallery");
const portfolio = document.querySelector("#portfolio");

// Handle admin mode
export default function adminMode() {
  document.body.classList.add("edit-body");

  const editMode = document.createElement("div");
  editMode.classList.add("edit-mode");
  editMode.innerHTML = `
    <i class="fa-solid fa-pen-to-square"></i>
    <span>Mode édition</span>
  `;
  document.body.prepend(editMode);

  const worksEdit = document.createElement("div");
  worksEdit.classList.add("works-edit");
  worksEdit.innerHTML = `
    <i class="fa-solid fa-pen-to-square"></i>
    <span>modifier</span>
  `;
  portfolio.insertBefore(worksEdit, gallery);
}
