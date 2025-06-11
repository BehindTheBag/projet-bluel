const fetch = require("node-fetch");
const fs = require("fs");
const FormData = require("form-data");
const path = require("path");

const token = "TON_TOKEN_ICI"; // remplace par ton token JWT valide

const works = [
  {
    title: "Abajour Tahina",
    imagePath: "images/abajour-tahina1669847418065.png",
    category: 1,
  },
  {
    title: "Appart Moderne",
    imagePath: "images/appart-moderne.jpg",
    category: 2,
  },
  {
    title: "Canapé Vert",
    imagePath: "images/canape-vert.jpg",
    category: 1,
  },
  {
    title: "Chambre Cosy",
    imagePath: "images/chambre-cosy.jpg",
    category: 2,
  },
];

async function uploadWork(work) {
  const form = new FormData();
  form.append("title", work.title);
  form.append("image", fs.createReadStream(path.resolve(__dirname, work.imagePath)));
  form.append("category", work.category);

  const response = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  if (!response.ok) {
    console.error(`Erreur pour "${work.title}":`, response.status);
  } else {
    console.log(`✅ Ajouté : ${work.title}`);
  }
}

async function resetGallery() {
  for (const work of works) {
    await uploadWork(work);
  }
}

resetGallery();
