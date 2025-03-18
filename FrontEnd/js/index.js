import { isAdmin, updateNavButton } from "./auth.js";
import { getWorks } from "./api.js";

const gallery = document.querySelector(".gallery");
const portfolio = document.querySelector("#portfolio");

export let works = [];

export const setWorks = (newWorks, updateAll = false) => {
  works = newWorks;
  if (updateAll) displayWorks(works);
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
    setWorks(data, true);
  } catch (error) {
    console.log("Erreur de chargement : ", error);

    gallery.innerHTML = `<p class= "error-fetch-works">Impossible de charger les projets.<br> Veuillez réessayer ultérieurement.</p>`;
  }
};

const displayWorks = (works) => {
  gallery.innerHTML = "";
  works.forEach((work) => {
    createGalleryFigure(work);
  });
};

export const createGalleryFigure = (work) => {
  const workElement = document.createElement("figure");
  workElement.dataset.id = work.id;
  workElement.dataset.category = work.category.name;

  const imgElement = document.createElement("img");
  imgElement.src = work.imageUrl;
  imgElement.alt = work.title;

  const captionElement = document.createElement("figcaption");
  captionElement.textContent = work.title;

  workElement.append(imgElement, captionElement);

  gallery.appendChild(workElement);
};

const setupCategories = () => {
  const categories = new Set(["Tous"]);

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
    figure.classList.toggle(
      "hidden",
      !(
        category === "Tous" || figure.getAttribute("data-category") === category
      )
    );
  });
};

const handleAdminMode = () => {
  import("./admin.js")
    .then((module) => module.default())
    .catch((error) =>
      console.log("Erreur lors du chargement du mode admin : ", error)
    );
};

initPortfolio();
