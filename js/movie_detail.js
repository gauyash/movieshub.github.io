const imageUrl = "https://image.tmdb.org/t/p/w1280";
const apiKey = "51403d27c0ea2c2be0c829509139f07d";

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

let id;

// !GET CAST

let indexNo;

async function getMovieCast() {
  id = localStorage.getItem("id");
  const url = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}&language=en-US`;
  const data = await fetchApi(url);
  displayMovieCast(data);
}

getMovieCast();

async function displayMovieCast(data) {
  let textBoxMid = document.querySelector(".text-box-mid");
  let castList = "";
  let director = "";
  if (data.cast.length >= 21) {
    for (let i = 0; i <= 21; i++) {
      castList += data.cast[i].name;
      castList += ", ";
    }
  } else {
    for (let i = 0; i < data.cast.length; i++) {
      castList += data.cast[i].name;
      castList += ", ";
    }
  }
  castList = castList.slice(0, -2);

  director = data.crew[1].name;

  textBoxMid.innerHTML = `
        <p>Starring</p>
        <p class="actors-list">${castList}</p>
        <p>Directed By</p>
        <p class="director-list">${director}</p>`;
}

async function getMovieVideos() {
  id = localStorage.getItem("id");
  const url = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=en-US`;
  const data = await fetchApi(url);
  displayMovieVideos(data);
}

getMovieVideos();

async function displayMovieVideos(data) {
  let trailerRow = document.querySelector(".trailer-row");
  let arr = data.results.filter((items) => {
    return items.official == true;
  });

  arr.forEach((items, index) => {
    let trailerCol = document.createElement("div");

    trailerCol.classList.add("trailer-col");
    trailerCol.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${items.key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
    trailerRow.append(trailerCol);
  });
}

async function getMovieDetails() {
  id = localStorage.getItem("id");
  const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`;
  const data = await fetchApi(url);
  displayMovieDetails(data);
}

getMovieDetails();

function displayMovieDetails(data) {
  let textBoxUpper = document.querySelector(".text-box-upper");
  let imgBoxOuter = document.querySelector(".img-box");
  let imgBox = document.querySelector(".img-box img");
  let genresList = data.genres.map((g) => {
    return `${g.name}`;
  });
  genresList = genresList.join(", ");

  imgBox.src = imageUrl + data.poster_path;
  imgBoxOuter.style.setProperty(
    "--movie-bg",
    `url(${imageUrl}${data.backdrop_path})`
  );
  textBoxUpper.innerHTML = `             
    <h2 class="primary__heading">${data.title}</h2>

                                    
    <div class="about-details">
    <span class="rating"><ion-icon name="star"></ion-icon>${data.vote_average.toFixed(
      1
    )}</span>
    <span class="length">${data.runtime}m</span>
    <span class="year">${data.release_date.split("-")[0]}</span>
    </div>  

    <div class="genre-details">
        <p>${genresList}</p>
    </div>

    <div class="overview">
        <p>${data.overview}</p>
    </div>`;
}

// SIMILAR MOVIES

async function getSimilarMovies() {
  id = localStorage.getItem("id");
  const url = `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${apiKey}&language=en-US&page=1`;
  const data = await fetchApi(url);
  displaySimilarMovies(data.results);
}

getSimilarMovies();

function displaySimilarMovies(data) {
  let sliderSimilar = document.querySelector(".slider--similar");

  data.forEach((items) => {
    let img = document.createElement("img");
    let a = document.createElement("a");
    a.href = "movie_details_page.html";
    a.classList.add("slider__box");
    img.src = `${imageUrl}${items.poster_path}`;
    a.append(img);
    sliderSimilar.append(a);

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

// Handle search functionality
function handleSearch() {
  let search = document.querySelectorAll("#search-text");
  let searchBtn = document.querySelectorAll(".search-btn");

  searchBtn.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      localStorage.setItem("searchName", search[index].value);
    });
  });

  search.forEach((input, index) => {
    input.addEventListener("change", () => {
      localStorage.setItem("searchName", input.value);
    });
  });
}

handleSearch()

// Toggle aside menu
function toggleMenu() {
  let menuIcon = document.querySelector(".menu i");
  let aside = document.querySelector("aside");

  menuIcon.addEventListener("click", () => {
    aside.classList.toggle("active");
    if (menuIcon.classList.contains("fa-bars")) {
      menuIcon.classList.replace("fa-bars", "fa-xmark");
    } else {
      menuIcon.classList.replace("fa-xmark", "fa-bars");
    }
  });
}

toggleMenu();


// SLIDER BUTTONS

let limit;
let btnRight = document.querySelectorAll(".btn--right");
let btnLeft = document.querySelectorAll(".btn--left");

let sliders = document.querySelectorAll(".slider");

btnLeft.forEach((items, index) => {
  items.addEventListener("click", () => {
    let slider = sliders[index];
    const sliderIndex = parseInt(
      getComputedStyle(slider).getPropertyValue("--slider-index")
    );
    if (sliderIndex != 0) {
      slider.style.setProperty("--slider-index", sliderIndex - 1);
    }
  });
});

btnRight.forEach((items, index) => {
  items.addEventListener("click", () => {
    let slider = sliders[index];
    let itemsPerScreen = parseInt(
      getComputedStyle(slider).getPropertyValue("--items-per-screen")
    );
    const sliderIndex = parseInt(
      getComputedStyle(slider).getPropertyValue("--slider-index")
    );

    if (itemsPerScreen == 5) {
      limit = 3;
    } else if (itemsPerScreen == 4) {
      limit = 4;
    } else if (itemsPerScreen == 3) {
      limit = 6;
    }

    if (sliderIndex != limit) {
      slider.style.setProperty("--slider-index", sliderIndex + 1);
    }
  });
});
