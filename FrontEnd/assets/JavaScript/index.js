const body = document.querySelector("body");
const filtres = document.querySelector(".filtres");
const gallery = document.querySelector(".gallery");
const allProject = document.querySelector("#all");
const login = document.querySelector("#login");
const edition = document.querySelectorAll(".modeEdition");
const modifProject = document.querySelector("#modifAjout");
const windowModale = document.querySelector(".modale");
const btnClosemodale = document.querySelector("#close");
const galleryModale = document.querySelector(".galleryModale");
const getToken = JSON.parse(localStorage.getItem("token"));

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
const getCategory = async () => {
  try {
    const requete = await fetch("http://localhost:5678/api/categories", {
      method: "GET",
    });

    if (!requete.ok) {
      throw "Un problème est survenu";
    } else {
      return await requete.json();
    }
  } catch (e) {
    console.log(e);
  }
};
const createFiltreElement = (arrayProject) => {
  const allCategory = getCategory();
  allCategory.then(async (response) => {
    response.map((category) => {
      let filtre = document.createElement("li");
      filtres.append(filtre);
      filtre.classList.add("filtre");
      filtre.textContent = category.name;

      filtre.addEventListener("click", () => {
        let sort = sortCategory(arrayProject, filtre.textContent);
        gallery.innerHTML = "";
        displayElement(sort);
      });
    });
  });
};
const sortCategory = (arrayProject, categoryFiltre) => {
  const sort = arrayProject.filter((category) => {
    return category.category.name === categoryFiltre;
  });
  return sort;
};
const displayElement = (arrayProject) => {
  const element = arrayProject.map((project, index) => {
    createFigureElement(project);
    console.log(project.id);
    createFigureModale(project.imageUrl, project);
  });
  return element;
};
const getData = async () => {
  try {
    const requete = await fetch("http://localhost:5678/api/works", {
      method: "GET",
    });

    if (!requete.ok) {
      throw console.log("Un problème est survenu");
    } else {
      const data = await requete.json();
      console.log(data);
      displayElement(data);
      createFiltreElement(data);

      allProject.addEventListener("click", () => {
        gallery.innerHTML = "";
        displayElement(data);
      });
    }
  } catch (e) {
    alert(e);
  }
};
const notScroll = () => {
  modifProject.addEventListener("click", () => {
    document.documentElement.style.overflow = "hidden";
  });
};
const modeEdition = () => {
  login.textContent = "logout";
  filtres.style.display = "none";
  for (let edit of edition) {
    edit.classList.remove("editionNone");
    edit.classList.add("editionBlock");
  }
  login.addEventListener("click", () => {
    localStorage.removeItem("token");
  });
  notScroll();

  modifProject.addEventListener("click", () => {
    modale();
  });
  btnClosemodale.addEventListener("click", () => {
    closeModale();
  });
};
const modeNotEdition = () => {
  login.textContent = "login";
  filtres.style.display = "flex";
  for (let edit of edition) {
    edit.classList.remove("editionBlock");
    edit.classList.add("editionNone");
  }
};
localStorage.getItem("token") ? modeEdition() : modeNotEdition();
const modale = () => {
  body.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
  windowModale.style.display = "block";
};
const closeModale = () => {
  windowModale.style.display = "none";
  body.style.backgroundColor = "#fffff9";
  document.documentElement.style.overflow = "visible";
};
const deleteProject = async (project) => {
  try {
    const requete = await fetch(
      `http://localhost:5678/api/works/${project.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken.token}`,
        },
      }
    );

    if (requete.ok) {
      const data = await requete.json();
    } else {
      throw "Une erreur est survenu";
    }
  } catch (e) {
    alert(e);
  }
};
const createFigureModale = (srcImg, project) => {
  let figure = document.createElement("figure");
  let span = document.createElement("span");
  let img = document.createElement("img");
  let figCaption = document.createElement("figcaption");
  galleryModale.append(figure);
  figure.append(span, img, figCaption);
  span.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  figCaption.textContent = "éditer";
  img.src = srcImg;
  img.classList.add("imgModale");
  span.classList.add("deleteProject");
  img.setAttribute("crossorigin", "anonymous");

  span.addEventListener("click", () => {
    deleteProject(project);
  });
};
getData();
