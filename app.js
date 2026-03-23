function createCard(drink) {
  const container = document.getElementById("container");

  const card = document.createElement("div");
  card.className = "card";

  const fav = document.createElement("div");
  fav.className = "fav";

  let favs = JSON.parse(localStorage.getItem("favs") || "[]");
  fav.innerHTML = favs.includes(drink.idDrink) ? "❤️" : "♡";

  fav.onclick = function () {
    let favs = JSON.parse(localStorage.getItem("favs") || "[]");

    if (favs.includes(drink.idDrink)) {
      favs = favs.filter(f => f !== drink.idDrink);
    } else {
      favs.push(drink.idDrink);
    }

    localStorage.setItem("favs", JSON.stringify(favs));
    location.reload();
  };

  const title = document.createElement("h3");
  title.textContent = drink.strDrink;

  const img = document.createElement("img");
  img.src = drink.strDrinkThumb;

  const rating = document.createElement("div");
  rating.className = "rating";

  let saved = localStorage.getItem("rating_" + drink.idDrink);
  rating.innerHTML = saved ? saved : "☆☆☆☆☆";

  rating.onclick = function (e) {
    let rect = this.getBoundingClientRect();
    let stars = Math.ceil((e.clientX - rect.left) / rect.width * 5);
    let value = "★★★★★".slice(0, stars) + "☆☆☆☆☆".slice(0, 5 - stars);

    this.innerHTML = value;
    localStorage.setItem("rating_" + drink.idDrink, value);
  };

  const btn = document.createElement("button");
  btn.textContent = "View";

  btn.onclick = function () {
    openModal(drink);
  };

  card.appendChild(fav);
  card.appendChild(img);
  card.appendChild(title);
  card.appendChild(rating);
  card.appendChild(btn);

  container.appendChild(card);
}

async function loadRandomCocktails() {
  const container = document.getElementById("container");
  container.innerHTML = "";

  document.getElementById("loading").style.display = "block";

  let drinksMap = new Map();

  while (drinksMap.size < 10) {
    let res = await fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php");
    let data = await res.json();

    let drink = data.drinks[0];
    drinksMap.set(drink.idDrink, drink);
  }

  document.getElementById("loading").style.display = "none";

  drinksMap.forEach(drink => {
    createCard(drink);
  });
}

function loadCocktails() {
  const search = document.getElementById("search").value;
  const container = document.getElementById("container");

  container.innerHTML = "";

  if (search === "") {
    loadRandomCocktails();
    return;
  }

  document.getElementById("loading").style.display = "block";

  fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + search)
    .then(res => res.json())
    .then(data => {
      document.getElementById("loading").style.display = "none";

      if (!data.drinks) {
        container.innerHTML = "<h3>No cocktails found</h3>";
        return;
      }

      data.drinks.forEach(drink => {
        createCard(drink);
      });
    });
}

function randomCocktail() {
  const container = document.getElementById("container");
  container.innerHTML = "";

  document.getElementById("loading").style.display = "block";

  fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
    .then(res => res.json())
    .then(data => {
      document.getElementById("loading").style.display = "none";
      createCard(data.drinks[0]);
    });
}

function openModal(drink) {
  document.getElementById("modalTitle").textContent = drink.strDrink;
  document.getElementById("modalImg").src = drink.strDrinkThumb;
  document.getElementById("modalText").textContent = drink.strInstructions;

  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// EVENTS
document.getElementById("search").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    loadCocktails();
  }
});

// INIT
loadRandomCocktails();

// PARTICLES
for (let i = 0; i < 40; i++) {
  let p = document.createElement("div");
  p.className = "particle";

  p.style.left = Math.random() * 100 + "vw";
  p.style.animationDuration = (5 + Math.random() * 10) + "s";

  document.body.appendChild(p);
}
