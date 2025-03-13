import { isAdmin, updateNavButton } from "./auth.js";
import { getWorks } from "./api.js";

const gallery = document.querySelector(".gallery");
const portfolio = document.querySelector("#portfolio");
const categories = new Set(["Tous"]);
// let works = [];
export let works = [];

export const setWorks = (newWorks) => {
  works = newWorks;
  displayWorks(works);
};

const fetchWorks = async () => {
  try {
    // works = await getWorks();
    // displayWorks(works);
    const data = await getWorks();
    setWorks(data);
  } catch (error) {
    console.log(error);
  }

  updateNavButton();

  if (isAdmin()) {
    getAdminMode();
  } else {
    works.forEach((work) => {
      categories.add(work.category.name);
    });

    fetchCategories();
  }
};

const displayWorks = (works) => {
  gallery.innerHTML = "";
  works.forEach((work) => {
    const workElement = document.createElement("figure");
    workElement.setAttribute("id", `gallery-${work.id}`);
    workElement.innerHTML = `
        <img src="${work.imageUrl}" alt="${work.title}" />
        <figcaption>${work.title}</figcaption>
        `;

    gallery.appendChild(workElement);
  });
};

const fetchCategories = () => {
  const filtersContainer = document.createElement("div");
  filtersContainer.classList.add("filters-container");

  categories.forEach((category) => {
    const filterButton = document.createElement("button");
    filterButton.textContent = category;
    if (category === "Tous") {
      filterButton.classList.add("active-filter");
    }
    filterButton.addEventListener("click", () => filterWorks(category));
    filtersContainer.appendChild(filterButton);
  });

  portfolio.insertBefore(filtersContainer, gallery);
};

const filterWorks = (category) => {
  const filterButtons = document.querySelectorAll(".filters-container button");
  filterButtons.forEach((button) => {
    button.classList.remove("active-filter");
    if (button.textContent === category) {
      button.classList.add("active-filter");
    }
  });

  if (category === "Tous") {
    displayWorks(works);
  } else {
    const filteredWorks = works.filter(
      (work) => work.category.name === category
    );
    displayWorks(filteredWorks);
  }
};

const getAdminMode = () => {
  import("./admin.js").then((module) => module.default(works));
};

fetchWorks();
