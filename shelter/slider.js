/* ******************** */
/* SLIDER */
/* ******************** */

const ARROW_LEFT = document.querySelector("#arrow-left");
const ARROW_RIGHT = document.querySelector("#arrow-right");
const SLIDER = document.querySelector("#slider");
const SLIDER_PREV = document.querySelector("#slider-prev");
const SLIDER_CURRENT = document.querySelector("#slider-current");
const SLIDER_NEXT = document.querySelector("#slider-next");

let cardsNumber = 3;
let prevCardsArr = [];
let currentCardsArr = [];
let nextCardsArr = [];

const setCurrentCardsArr = () => {
  do {
    const randomNumber = Math.floor(Math.random() * 8);
    if (!currentCardsArr.includes(randomNumber)) {
      currentCardsArr.push(randomNumber);
    }
  } while (currentCardsArr.length < cardsNumber);
}
setCurrentCardsArr();

const setPrevCardsArr = () => {
  do {
    const randomNumber = Math.floor(Math.random() * 8);
    if (!prevCardsArr.includes(randomNumber) && !currentCardsArr.includes(randomNumber)) {
      prevCardsArr.push(randomNumber);
    }
  } while (prevCardsArr.length < cardsNumber);
}
setPrevCardsArr();

const setNextCardsArr = () => {
  do {
    const randomNumber = Math.floor(Math.random() * 8);
    if (!nextCardsArr.includes(randomNumber) && !currentCardsArr.includes(randomNumber)) {
      nextCardsArr.push(randomNumber);
    }
  } while (nextCardsArr.length < cardsNumber);
}
setNextCardsArr();

console.log(prevCardsArr, currentCardsArr, nextCardsArr);

function setCardsSlider(cardSlider, cardArr) {
  for (let i = 0; i < cardsNumber; i++) {
    let card = document.createElement("div");
    card.classList.add("card");
    card.id = `${cardArr[i]}`;
    const petNumber = cardArr[i];
    function createCard(data) {
      card.innerHTML = `
          <div class="card-img card-img-${petNumber}"></div>
          <div class="card-info">
            <div class="card-name">${data[petNumber].name}</div>
            <div class="card-btn link-common card-link">Learn more</div>
          </div>
      `
    }
    function getData(url, cb) {
      fetch(url)
        .then(response => response.json())
        .then(result => cb(result));
    }
    getData("./pets.json", (data) => {
      createCard(data);
    })
    cardSlider.appendChild(card);
  }
}

setCardsSlider(SLIDER_PREV, prevCardsArr);
setCardsSlider(SLIDER_CURRENT, currentCardsArr);
setCardsSlider(SLIDER_NEXT, nextCardsArr);

const slideLeft = () => {
  SLIDER.classList.add("move-left");
  ARROW_LEFT.removeEventListener("click", slideLeft);
  ARROW_RIGHT.removeEventListener("click", slideRight);
}
const slideRight = () => {
  SLIDER.classList.add("move-right");
  ARROW_LEFT.removeEventListener("click", slideLeft);
  ARROW_RIGHT.removeEventListener("click", slideRight);
}

ARROW_LEFT.addEventListener("click", slideLeft);
ARROW_RIGHT.addEventListener("click", slideRight);

SLIDER.addEventListener("animationend", (event) => {
  let sliderChangable;
  if (event.animationName === "slide-left") {
    SLIDER.classList.remove("move-left");
    sliderChangable = SLIDER_PREV;
    document.querySelector("#slider-current").innerHTML = SLIDER_PREV.innerHTML;
    nextCardsArr = currentCardsArr;
    SLIDER_NEXT.innerHTML = "";
    setCardsSlider(SLIDER_NEXT, nextCardsArr);
    currentCardsArr = prevCardsArr;
    prevCardsArr = [];
    setPrevCardsArr();
    sliderChangable.innerHTML = "";
    setCardsSlider(sliderChangable, prevCardsArr);

    console.log(prevCardsArr, currentCardsArr, nextCardsArr);
  } else {
    SLIDER.classList.remove("move-right");
    sliderChangable = SLIDER_NEXT;
    document.querySelector("#slider-current").innerHTML = SLIDER_NEXT.innerHTML;
    prevCardsArr = currentCardsArr;
    SLIDER_PREV.innerHTML = "";
    setCardsSlider(SLIDER_PREV, prevCardsArr);
    currentCardsArr = nextCardsArr;
    nextCardsArr = [];
    setNextCardsArr();
    sliderChangable.innerHTML = "";
    setCardsSlider(sliderChangable, nextCardsArr);

    console.log(prevCardsArr, currentCardsArr, nextCardsArr);
  }
  ARROW_LEFT.addEventListener("click", slideLeft);
  ARROW_RIGHT.addEventListener("click", slideRight);
})
