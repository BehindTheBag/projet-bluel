//Fonction pour charger les travaux depuis l'API

async function loadWorks() {
  const url = "http://localhost:5678/api/works";
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Response status: ${response.status}`);
    const json = await response.json();
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
  figure.id = `gallery-figure-${data.id}`;
  figure.innerHTML = `
    <img src="${data.imageUrl}" alt="${data.title}">
    <figcaption>${data.title}</figcaption>
  `;
  gallery.append(figure);

  // addFigure type 2 (côté modal)
  const modalGallery = document.querySelector(".modal-gallery");
  if (modalGallery) { 
    const modalFigure = document.createElement("figure");
    modalFigure.dataset.category = data.categoryId;
    modalFigure.id = `modal-figure-${data.id}`;
    modalFigure.innerHTML = `
      <img src="${data.imageUrl}" alt="${data.title}">
      <button class="delete-work" data-id="${data.id}">
        <i class="fa-solid fa-trash-can overlay-icon"></i>
      </button>
    `;
    modalGallery.append(modalFigure);

    // Écouteur de clic pour supprimer
    const deleteButton = modalFigure.querySelector(".delete-work");
    deleteButton.addEventListener("click", () => deleteWork(data.id));
  }
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
    editTrigger.classList.add('js-modal');
    editTrigger.setAttribute('href', '#modal1');
    editTrigger.style.cursor = 'pointer';

    const loginLink = document.querySelector('a[href="login.html"]');
    if (loginLink) loginLink.textContent = 'Logout';
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

// Suppression d'un élément de la galerie (trashicon)
async function deleteWork(id) {
  const url = `http://localhost:5678/api/works/${id}`;
  const token = sessionStorage.getItem("userToken");

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur suppression (status ${response.status})`);
    }

    const modalFigure = document.getElementById(`modal-figure-${id}`);
    const galleryFigure = document.getElementById(`gallery-figure-${id}`);
    
    if (modalFigure) modalFigure.remove();
    if (galleryFigure) galleryFigure.remove();

  } catch (error) {
    console.error(error.message);
  }
}

// Ouvrir Modal 2
const addingButton = document.querySelector(".adding-button.js-open-modal2");

if (addingButton) {
  addingButton.addEventListener("click", function (e) {
    e.preventDefault();
    openModal2(e);
  });
} else {
  console.log("Le bouton Ajouter une photo est introuvable");
}

// MODALE 2 

function openModal2(e) {
  e.preventDefault();

  // Cacher modal1 si visible
  const modal1 = document.querySelector("#modal1");
  if (modal1 && modal1.style.display !== "none") {
    modal1.style.display = "none";
    modal1.setAttribute("aria-hidden", "true");
    modal1.removeAttribute("aria-modal");
  }

  modal2 = document.querySelector("#modal2");
  if (!modal2) {
    console.error("Modal #modal2 introuvable");
    return;
  }
  modal2.style.display = "block";
  modal2.removeAttribute("aria-hidden");
  modal2.setAttribute("aria-modal", "true");

  modal2.addEventListener("click", closeModal2);
  modal2.querySelectorAll(".js-modal-close").forEach(btn => btn.addEventListener("click", closeModal2));
  const modalContent = modal2.querySelector(".js-modal-stop");
  if (modalContent) modalContent.addEventListener("click", e => e.stopPropagation());
}


function closeModal2(e) {
  if (!modal2) return;
  e.preventDefault();
  modal2.style.display = "none";
  modal2.setAttribute("aria-hidden", "true");
  modal2.removeAttribute("aria-modal");

  modal2.removeEventListener("click", closeModal2);

  const closeButtons = modal2.querySelectorAll(".js-modal-close");
  closeButtons.forEach(btn => btn.removeEventListener("click", closeModal2));

  const modalContent = modal2.querySelector(".js-modal-stop");
  if (modalContent) modalContent.removeEventListener("click", e => e.stopPropagation());

  function openModal2(e) {
    e.preventDefault();
    document.getElementById("modal2").classList.add("active");
}

function closeModal2(e) {
    e.preventDefault();
    document.getElementById("modal2").classList.remove("active");
}

console.log("Modal2 element:", document.getElementById("modal2"));
console.log("Modal2 computed display:", window.getComputedStyle(document.getElementById("modal2")).display);


}



// Appelle au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  loadWorks();
  loadCategories();
  filterByCategory('all');
  adminLogged();
  const addingButton = document.getElementById("adding-button");
if (addingButton) {
  addingButton.addEventListener("click", openModal2);
}
});


