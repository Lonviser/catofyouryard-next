/* ******************** */
/* BURGER MENU */
/* ******************** */

const burgerMenu = document.querySelector(".burger-menu");
const navContainer = document.querySelector(".nav-container");
const overlay = document.querySelector(".overlay");
const body = document.querySelector("body");

burgerMenu.addEventListener("click", () => {
  burgerMenu.classList.toggle("active");
  navContainer.classList.toggle("active");
  overlay.classList.toggle("visible");
  body.classList.toggle("no-scroll");
});

document.querySelectorAll(".nav-link").forEach((elem) =>
  elem.addEventListener("click", () => {
    burgerMenu.classList.remove("active");
    navContainer.classList.remove("active");
    overlay.classList.remove("visible");
    body.classList.remove("no-scroll");
  })
);

document.addEventListener("click", function(event) {
  if (!burgerMenu.contains(event.target)) {
    burgerMenu.classList.remove("active");
    navContainer.classList.remove("active");
    overlay.classList.remove("visible");
    body.classList.remove("no-scroll");
  }
});



/* ******************** */
/* POPUP (MODAL WINDOW) */
/* ******************** */

const card = document.querySelector(".card");
const petsPopup = document.querySelector(".pets-popup");

let openPopupCards = document.querySelectorAll(".card");

function setCardsPopup(cardNumber) {
  let popupCard = document.createElement("div");
  popupCard.classList.add("popup");
  let popupContainer = document.createElement("div");
  popupContainer.classList.add("popup-container");
  popupCard.appendChild(popupContainer);
  const petNumber = cardNumber;

  function createPopup(data) {
    popupContainer.innerHTML = `
      <div class="popup-btn">
        <div class="popup-icon"></div>
      </div>
      <div class="popup-content">
        <div class="popup-img popup-img-${petNumber}"></div>
        <div class="popup-info">
          <div class="popup-title">${data[petNumber].name}</div>
          <div class="popup-subtitle">${data[petNumber].type} - ${data[petNumber].breed}</div>
          <div class="popup-description">${data[petNumber].description}</div>
          <ul class="popup-list">
            <li><strong>Age: </strong>${data[petNumber].age}</li>
            <li><strong>Inoculations: </strong>${data[petNumber].inoculations}</li>
            <li><strong>Diseases: </strong>${data[petNumber].diseases}</li>
            <li><strong>Parasites: </strong>${data[petNumber].parasites}</li>
          </ul>
        </div>
      </div>
    `
  }
  function getData(url, cb) {
    fetch(url)
      .then(response => response.json())
      .then(result => cb(result));
  }
  getData("./pets.json", (data) => {
    createPopup(data);
  })
  petsPopup.appendChild(popupCard);
}

document.addEventListener("click", (cardClickEvent) => {
  if (cardClickEvent.target.parentElement.classList[0] === "card") {
    cardClickEvent.preventDefault();
    let cardNumber = cardClickEvent.target.parentElement.id;
    petsPopup.innerHTML = "";
    setCardsPopup(cardNumber);
    document.querySelector(".popup").classList.add("active");
    document.querySelector(".popup-container").classList.add("active");
    body.classList.add("popup-no-scroll");
  }
})

document.addEventListener("click", (event) => {
  if (event.target === document.querySelector(".popup-btn")) {
    document.querySelector(".popup").classList.remove("active");
    document.querySelector(".popup-container").classList.remove("active");
    body.classList.remove("popup-no-scroll");
  }
})

document.addEventListener("click", (event) => {
  if (event.target === document.querySelector(".popup")) {
    document.querySelector(".popup").classList.remove("active");
    document.querySelector(".popup-container").classList.remove("active");
    body.classList.remove("popup-no-scroll");
  }
})

document.addEventListener("click", (event) => {
  if (event.target === document.querySelector(".popup-icon")) {
    document.querySelector(".popup").classList.remove("active");
    document.querySelector(".popup-container").classList.remove("active");
    body.classList.remove("popup-no-scroll");
  }
})
