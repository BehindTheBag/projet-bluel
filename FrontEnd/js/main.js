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
  }
}

// Appelle au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  loadWorks();
  loadCategories();
  filterByCategory('all');
  adminLogged();
});



