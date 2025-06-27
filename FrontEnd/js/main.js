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
function modeAppear() {
  const container = document.createElement("div");
  container.className = "edit-title"; // 
  container.innerHTML = `
    <i class="fa-solid fa-pen-to-square"></i>
    <p class="js-modal" href="#modal1" style="cursor: pointer">Mode édition</p>
  `;
  return container; 
}



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


    loginLink.addEventListener("click", function (e) {
        e.preventDefault();                 
        sessionStorage.removeItem("userToken");  // Supprime le token
        window.location.href = "login.html";     // Redirige vers la page login
      });
    


const filters = document.querySelector(".filters");
if (filters) {
  filters.style.display = "none";
}

const portfolioH2 = document.querySelector('#portfolio h2');
    if (portfolioH2) {
      portfolioH2.insertAdjacentElement('afterend', modeAppear());
    }

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
}


// Changement Couleur 
function updateConfirmBtnColor() {
  const title = document.getElementById("title");
  const file = document.getElementById("file");
  const category = document.getElementById("category");
  const confirmBtn = document.querySelector(".confirm-button");

  const allFilled = title.value && file.files.length > 0 && category.value;

  if (allFilled) {
    confirmBtn.style.backgroundColor = "#1D6154";
    confirmBtn.style.border = "1px solid #1D6154";
  } else {
    confirmBtn.style.backgroundColor = "#A7A7A7";
    confirmBtn.style.border = "1px solid #A7A7A7";
  }
}





// MODALE 2 

const openModal2 = function (e) {
  e.preventDefault();

  const modal1 = document.querySelector("#modal1");
  const modal2 = document.querySelector("#modal2");
  if (!modal2) return;

  // Fermer modal 
  modal1.style.display = "none";
  modal1.setAttribute("aria-hidden", "true");
  modal1.removeAttribute("aria-modal");

  // Ouvrir modal2
  modal = modal2;
  focusables = Array.from(modal.querySelectorAll(focusableSelector));
  if (focusables.length > 0) focusables[0].focus();
  modal.style.display = "block";
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");
  modal.addEventListener("click", closeModal);
  modal.querySelectorAll(".js-modal-close").forEach(btn => btn.addEventListener("click", closeModal));
  modal.querySelector(".js-modal-back")?.addEventListener("click", backToModal1); // link
  modal.querySelector(".js-modal-stop")?.addEventListener("click", stopPropagation);
  document.getElementById("title").addEventListener("input", updateConfirmBtnColor); // Color Switch
  document.getElementById("file").addEventListener("change", updateConfirmBtnColor);
  document.getElementById("category").addEventListener("change", updateConfirmBtnColor);
};



// Transition Modale

const backToModal1 = function (e) {
  e.preventDefault();

  const modal1 = document.querySelector("#modal1");
  const modal2 = document.querySelector("#modal2");

  // Fermer modal2
  modal2.style.display = "none";
  modal2.setAttribute("aria-hidden", "true");
  modal2.removeAttribute("aria-modal");

  // Ouvrir modal1
  modal = modal1;
  focusables = Array.from(modal.querySelectorAll(focusableSelector));
  if (focusables.length > 0) focusables[0].focus();
  modal.style.display = "flex"; // bien centré
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");

  // Appliquer les bons écouteurs
  modal.addEventListener("click", closeModal);
  modal.querySelectorAll(".js-modal-close").forEach(btn => btn.addEventListener("click", closeModal));
  modal.querySelector(".js-modal-back")?.addEventListener("click", backToModal1); // link
  modal.querySelector(".js-modal-stop")?.addEventListener("click", stopPropagation);
  
  
  
};


// Prévisualitation & autres

const fileInput = document.getElementById('file');
const preview = document.getElementById('upload-preview');

if (fileInput && preview) {
  fileInput.addEventListener('change', function () {
    const file = this.files[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();

      reader.onload = function () {
        preview.innerHTML = ''; // Efface l’ancienne image s’il y en a une
        const img = document.createElement('img');
        img.src = reader.result;
        img.alt = 'Prévisualisation';
        img.style.maxWidth = '100%';
        img.style.borderRadius = '8px';
        preview.appendChild(img);

      document.querySelector('.icon-upload').style.display = 'none';
      document.querySelector('.picture-upload').style.display = 'none';
      document.querySelector('.upload-info').style.display = 'none';
    };

      

      reader.readAsDataURL(file);
    }
  });
}

// Requête fetch POST MODALE 2

const form = document.querySelector("#modal2-content form");

if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const token = sessionStorage.getItem("userToken");
    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const file = document.getElementById("file").files[0];

    if (!file || !title || !category) {
      alert("Tous les champs doivent être remplis.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("category", category);

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const newWork = await response.json();

      // Ajoute dans la galerie et dans la modale
      addFigure(newWork);

      // Réinitialise le formulaire et la preview
      form.reset();
      preview.innerHTML = "";
      document.querySelector('.icon-upload').style.display = '';
      document.querySelector('.picture-upload').style.display = '';
      document.querySelector('.upload-info').style.display = '';

      // Retour à la modale 1
      closeModal(e); // ancien back 

    } catch (error) {
      console.error("Erreur ajout:", error);
      alert("Échec de l'envoi de l'image.");
    }
  });
}




// Appelle au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  loadWorks();
  loadCategories();
  filterByCategory('all');
  });




