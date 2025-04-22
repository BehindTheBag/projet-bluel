async function loadWorks() {
  const url = "http://localhost:5678/api/works";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();

    json.forEach(item => {
      addFigure(item);  }
    );

    console.log(json);
  } catch (error) {
    console.error(error.message);
  }
}

function addFigure(data) { 
  const gallery = document.querySelector(".gallery");
  const figure = document.createElement("figure");
  figure.innerHTML = `
    <img src="${data.imageUrl}" alt="${data.title}">
    <figcaption>${data.title}</figcaption>
  `;
  gallery.append(figure);
}

loadWorks();