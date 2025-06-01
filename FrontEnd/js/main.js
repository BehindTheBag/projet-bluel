//Fonction pour charger les travaux depuis l'API

async function loadWorks() {
  const url = "http://localhost:5678/api/works";
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Response status: ${response.status}`);
    const json = await response.json(); // chaque JSON appelle la fonction addFigure
    json.forEach(item => addFigure(item));
  } catch (error) {
    console.error(error.message);
  }
}

// Création et ajout d'un élément figure à la galerie 
function addFigure(data) {
  const gallery = document.querySelector(".gallery");
  const figure = document.createElement("figure");
  figure.dataset.category = data.categoryId;
  figure.innerHTML = `
    <img src="${data.imageUrl}" alt="${data.title}">
    <figcaption>${data.title}</figcaption>
  `;
  gallery.append(figure);
}

// Charge les catégories depuis l'API
async function loadCategories() {
  const url = "http://localhost:5678/api/categories";
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Response status: ${response.status}`);
    const json = await response.json();
    addFilters(json);
  } catch (error) {
    console.error(error.message);
  }
}

// Ajoute les boutons filtre pour chaque catégorie
function addFilters(categories) {
  const filtersContainer = document.querySelector('.filters');
  const existingButtons = Array.from(filtersContainer.children);
  
  categories.forEach(category => {
    if (!existingButtons.some(btn => btn.dataset.category === category.id.toString())) {
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      btn.textContent = category.name;
      btn.dataset.category = category.id;
      filtersContainer.appendChild(btn);
    }
  });
  
  filterButtons();
}

// event listener en fonction des boutons 
function filterButtons() {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(button => {
    button.addEventListener('click', function() {
      buttons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      filterByCategory(this.dataset.category);
    });
  });
}

function filterByCategory(categoryId) {
  const figures = document.querySelectorAll('.gallery figure');
  for (const figure of figures) {
    if (categoryId === 'all' || figure.dataset.category === categoryId) {
      figure.style.display = 'block';
    } else {
      figure.style.display = 'none';
    }
  }
}

// Apparition du mode Edit 
function adminLogged() {
  const token = sessionStorage.getItem("userToken");

  if (token) {
const editAppear = document.createElement("div");
  editAppear.className = "edit";
  editAppear.innerHTML = `
    <i class="fa-solid fa-pen-to-square"></i>
    <p>Mode édition</p>
  `;
  document.body.prepend(editAppear);

  const editTrigger = editAppear.querySelector('p');
  editTrigger.classList.add('js-modal'); // Active le système existant
  editTrigger.setAttribute('href', '#modal1'); // Lie à la modale
  editTrigger.style.cursor = 'pointer'; 
}
}


adminLogged();

// MODALE
let modal = null;
const focusableSelector = "button, a, input, textarea";
let focusables = [];

const openModal = function (e) {
  e.preventDefault();
  modal = document.querySelector(e.target.getAttribute("href"));
  focusables = Array.from(modal.querySelectorAll(focusableSelector));
  focusables[0].focus();
  modal.style.display = null;
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");
  modal.addEventListener("click", closeModal);
  modal
    .querySelectorAll(".js-modal-close")
    .forEach((e) => e.addEventListener("click", closeModal));

  modal
    .querySelector(".js-modal-stop")
    .addEventListener("click", stopPropagation);
};

const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-close")
    .removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .removeEventListener("click", stopPropagation);
  modal = null;
};

const stopPropagation = function (e) {
  e.stopPropagation();
};

const focusInModal = function (e) {
  e.preventDefault();
  let index = focusables.findIndex((f) => f === modal.querySelector(":focus"));
  if (e.shiftKey === true) {
    index--;
  } else {
    index++;
  }
  if (index >= focusables.length) {
    index = 0;
  }
  if (index < 0) {
    index = focusables.length - 1;
  }
  focusables[index].focus();
};

window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
  if (e.key === "Tab" && modal !== null) {
    focusInModal(e);
  }
});

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});




// Appelle au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  loadWorks();
  loadCategories();
  filterByCategory('all');
  adminLogged();
});



