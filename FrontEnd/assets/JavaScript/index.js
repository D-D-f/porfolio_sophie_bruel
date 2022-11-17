const filtres = document.querySelector(".filtres");
const gallery = document.querySelector(".gallery");
const allProject = document.querySelector("#all");

// Création des balises figure qui contiennet les images et la légende
const createFigureElement = (project) => {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figCaption = document.createElement("figcaption");
  gallery.append(figure);
  figure.append(img, figCaption);
  img.setAttribute("crossorigin", "anonymous");
  img.src = project.imageUrl;
  figCaption.textContent = project.title;
};

// Création des filtres
const createFiltreElement = (arrayProject) => {
  const allCategory = [];

  arrayProject.map((category) => {
    if (!allCategory.includes(category.category.name)) {
      allCategory.push(category.category.name);
    }
  });

  allCategory.map((displayFiltre) => {
    let filtre = document.createElement("li");
    filtres.append(filtre);
    filtre.classList.add("filtre");
    filtre.textContent = displayFiltre;

    filtre.addEventListener("click", () => {
      let sort = sortCategory(arrayProject, filtre.textContent);
      gallery.innerHTML = "";
      displayHomeElement(sort);
    });
  });
};
// Trier les catégories selon la valeur de categoryFiltre
const sortCategory = (arrayProject, categoryFiltre) => {
  const sort = arrayProject.filter((category) => {
    return category.category.name === categoryFiltre;
  });
  return sort;
};

// Affiche tous les éléments sur la page principal
const displayHomeElement = (arrayProject) => {
  const element = arrayProject.map((project) => {
    return createFigureElement(project);
  });
  return element;
};

// La requête qui récupère les données depuis le serveur
const getData = async (url) => {
  try {
    const requete = await fetch(url, {
      method: "GET",
    });

    if (!requete.ok) {
      throw console.log("Un problème est survenu");
    } else {
      const data = await requete.json();
      displayHomeElement(data);
      createFiltreElement(data);

      allProject.addEventListener("click", () => {
        gallery.innerHTML = "";
        displayHomeElement(data);
      });
    }
  } catch (e) {
    alert(e);
  }
};

getData("http://localhost:5678/api/works");
