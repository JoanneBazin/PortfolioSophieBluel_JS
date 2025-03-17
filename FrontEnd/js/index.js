import { isAdmin, updateNavButton } from "./auth.js";
import { getWorks } from "./api.js";

const gallery = document.querySelector(".gallery");
const portfolio = document.querySelector("#portfolio");
const categories = new Set(["Tous"]);

export let works = [];

export const setWorks = (newWorks) => {
  works = newWorks;
  displayWorks(works);
};

const initPortfolio = async () => {
  await fetchWorks();
  updateNavButton();

  if (isAdmin()) {
    handleAdminMode();
  } else {
    setupCategories();
  }
};

const fetchWorks = async () => {
  try {
    const data = await getWorks();
    setWorks(data);
  } catch (error) {
    console.log("Erreur de chargement : ", error);
  }
};

const displayWorks = (works) => {
  gallery.innerHTML = "";
  works.forEach((work) => {
    const workElement = document.createElement("figure");
    workElement.setAttribute("id", `gallery-${work.id}`);
    workElement.setAttribute("data-category", work.category.name);

    const imgElement = document.createElement("img");
    imgElement.src = work.imageUrl;
    imgElement.alt = work.title;

    const captionElement = document.createElement("figcaption");
    captionElement.textContent = work.title;

    workElement.appendChild(imgElement);
    workElement.appendChild(captionElement);

    gallery.appendChild(workElement);
  });
};

const setupCategories = () => {
  works.forEach((work) => {
    categories.add(work.category.name);
  });

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
    button.classList.toggle("active-filter", button.textContent === category);
  });

  const allFigures = document.querySelectorAll(".gallery figure");
  allFigures.forEach((figure) => {
    const figureCategory = figure.getAttribute("data-category");

    if (category === "Tous" || figureCategory === category) {
      figure.style.display = null;
    } else {
      figure.style.display = "none";
    }
  });
};

const handleAdminMode = () => {
  import("./admin.js").then((module) => module.default());
};

initPortfolio();
