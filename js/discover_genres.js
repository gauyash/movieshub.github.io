const imageUrl = "https://image.tmdb.org/t/p/w1280";
const apiKey = "51403d27c0ea2c2be0c829509139f07d";

let idName;
let genreId;

async function fetchApi(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching data:", error);
    throw error;
  }
}

async function getGenreDiscover() {
  genreId = localStorage.getItem("genreId");
  idName = localStorage.getItem("idName");
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=51403d27c0ea2c2be0c829509139f07d&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${genreId}&with_watch_monetization_types=flatrate`;
  const data = await fetchApi(url);
  displayGenreDiscover(data.results);
}

getGenreDiscover();

function displayGenreDiscover(data) {
  let discoverRow = document.querySelector(".discover-row");
  let genreTitle = document.querySelector(".genre-title");
  genreTitle.textContent = `Discover ${idName}`;
  data.forEach((items) => {
    let discoverCol = document.createElement("div");
    discoverCol.classList.add("discover-col");
    discoverRow.append(discoverCol);

    let a = document.createElement("a");
    a.href = "movie_details_page.html";
    discoverCol.append(a);

    let img = document.createElement("img");
    img.classList.add("discover-img");
    img.src = `${imageUrl}${items.poster_path}`;
    a.append(img);

    a.addEventListener("click", () => {
      localStorage.setItem("id", items.id);
    });
  });
}

async function getGenreList() {
  const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;
  const data = await fetchApi(url);
  displayGenreList(data.genres);
}

getGenreList();

function displayGenreList(data) {
  let menuBar = document.querySelector(".menu-bar");
  data.forEach((items) => {
    let li = document.createElement("li");
    let a = document.createElement("a");
    a.classList.add("menu-link");
    a.textContent = items.name;
    a.href = "discover_genres.html";
    li.append(a);
    menuBar.append(li);
    a.addEventListener("mousedown", () => {
      localStorage.setItem("genreId", items.id);
      localStorage.setItem("idName", items.name);
    });
  });
}


let search = document.querySelectorAll("#search-text");

let searchBar = document.querySelectorAll(".search-bar");
let searchbtn = document.querySelectorAll(".search-btn");

searchbtn.forEach((items, index) => {
  items.addEventListener("click", () => {
    localStorage.setItem("id", search[index].value);
  });
});

search.forEach((items, index) => {
  items.addEventListener("change", () => {
    localStorage.setItem("id", items.value);
  });
});

let menuIcon = document.querySelector(".menu i");
let aside = document.querySelector("aside");

menuIcon.addEventListener("click", () => {
  aside.classList.toggle("active");
  if (menuIcon.classList[1] == "fa-bars") {
    menuIcon.classList.replace("fa-bars", "fa-xmark");
  } else {
    menuIcon.classList.replace("fa-xmark", "fa-bars");
  }
});
