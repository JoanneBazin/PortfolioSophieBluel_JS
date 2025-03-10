const gallery = document.querySelector(".gallery");
const portfolio = document.querySelector("#portfolio");
const categories = new Set(["Tous"]);
let works = [];

const fetchWorks = async () => {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    works = await response.json();

    works.forEach((work) => {
      categories.add(work.category.name);
    });

    displayWorks(works);
    fetchCategories();
  } catch (error) {
    console.log(error);
  }
};

const displayWorks = (works) => {
  gallery.innerHTML = "";
  works.forEach((work) => {
    const workElement = document.createElement("figure");
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

fetchWorks();
