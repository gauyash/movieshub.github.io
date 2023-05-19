let id;
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

async function getMostPopular() {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
  const data = await fetchApi(url);
  displayMostPopular(data.results);
}

getMostPopular();

let displayMostPopular = (data) => {
  let showsRow = document.querySelector(".shows__row");
  let featuredPoster = document.querySelector(".featured-poster");
  let watchMovie = document.querySelector(".watch-movie");
  data.forEach((items) => {
    let img = document.createElement("img");
    img.src = `${imageUrl}${items.poster_path}`;
    img.classList.add("shows__col");
    showsRow.append(img);
    featuredPoster.src = `${imageUrl}${data[0].backdrop_path}`;

    watchMovie.innerHTML = `
        <h2 class="movie-title big__heading">${data[0].title}</h2>

                                
        <div class="about-details">
        <span class="year">${data[0].release_date.split("-")[0]}</span>
        <span class="rating"><ion-icon name="star"></ion-icon>${data[0].vote_average.toFixed(
          1
        )}</span>
        </div>  
  
        <div class="overview">
            <p>${data[0].overview}</p>
        </div>

        <button class="watch-btn" onmousedown="show_details(${
          data[0].id
        })"><a href="movie_details_page.html">Watch Now</a></button>

        `;

    img.addEventListener("click", () => {
      const{title,vote_average,overview,release_date}=items;

      watchMovie.innerHTML = `
            <h2 class="movie-title big__heading">${title}</h2>

                                    
            <div class="about-details">
            <span class="year">${release_date.split("-")[0]}</span>
            <span class="rating"><ion-icon name="star"></ion-icon>${vote_average.toFixed(
              1
            )}</span>
            </div>  
      
            <div class="overview">
                <p>${overview}</p>
            </div>

            <button class="watch-btn" onmousedown="show_details(${
              items.id
            })"><a href="movie_details_page.html">Watch Now</a></button>
    
            `;
      featuredPoster.src = `${imageUrl}${items.backdrop_path}`;
    });
  });
};

function show_details(index) {
  localStorage.setItem("id", index);
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

// WEEKLY TRENDING MOVIES

async function getTrendingMovies() {
  const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`;
  const data = await fetchApi(url);
  displayTrendingMovies(data.results);
}

getTrendingMovies();

function displayTrendingMovies(data) {
  let slider = document.querySelector(".slider--trending");
  displayMovies(data,slider);
}

// UPCOMING MOVIES

async function getUpcomingMovies() {
  const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`;
  const data = await fetchApi(url);
  displayUpcomingMovies(data.results);
}

getUpcomingMovies();

function displayUpcomingMovies(data) {
  let slider = document.querySelector(".slider--upcoming");
  displayMovies(data,slider);
}

// TOP RATED MOVIES

async function getTopRatedMovies() {
  const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`;
  const data = await fetchApi(url);
  displayTopRatedMovies(data.results);
}

getTopRatedMovies();

function displayTopRatedMovies(data) {
  let slider = document.querySelector(".slider--top");
  displayMovies(data,slider);
}

// DISPLAYING MOVIES IN SLIDERS

function displayMovies(data, slider) {
  data.forEach((items) => {
    let a = document.createElement("a");
    a.href = "movie_details_page.html";
    a.classList.add("slider__box");
    let img = document.createElement("img");
    img.loading="lazy";
    img.src = `${imageUrl}${items.poster_path}`;
    a.append(img);
    slider.append(a);

    a.addEventListener("mousedown", () => {
      localStorage.setItem("id", items.id);
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

handleSearch();

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
    } else if (itemsPerScreen == 2) {
      limit = 9;
    }

    if (sliderIndex != limit) {
      slider.style.setProperty("--slider-index", sliderIndex + 1);
    }
  });
});
