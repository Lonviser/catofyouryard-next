/* ******************** */
/* PAGINATION */
/* ******************** */

let arrSize = 8;
let randomArr = [];
let arrNumber = 6;
let randomArrByEight = [];
let totalArr = [];

function setRandomArrByEight() {
  for (let i = 0; i < arrNumber; i++) {
    let randomArr = [];
    do {
      const sliceFive = totalArr.slice(-5);
      const randomNumber = Math.floor(Math.random() * 8);
      if (!randomArr.includes(randomNumber) && !sliceFive.includes(randomNumber)) {
        randomArr.push(randomNumber);
        totalArr.push(randomNumber);      
      }
    } while (randomArr.length < arrSize);
    randomArrByEight.push(randomArr);
  }
}
setRandomArrByEight();

function spliceArrIntoChunks(arr, chunkSize) {
  let myArr = Array.from(arr);
  const res = [];
  while (myArr.length > 0) {
      const chunk = myArr.splice(0, chunkSize);
      res.push(chunk);
  }
  return res;
}

let arrByEight = spliceArrIntoChunks(totalArr, 8);
let arrBySix = spliceArrIntoChunks(totalArr, 6);
let arrByThree = spliceArrIntoChunks(totalArr, 3);

console.log(arrByEight);
console.log(arrBySix);
console.log(arrByThree);



function setCards(cardsArr) {
  for (let i = 0; i < pageLimit; i++) {
    let card = document.createElement("div");
    card.classList.add("card");
    card.id = `${cardsArr[i]}`;
    const petNumber = cardsArr[i];
    function createCard(data) {
      card.innerHTML = `
          <div class="card-img card-img-${petNumber}"></div>
          <div class="card-info">
            <div class="card-name">${data[petNumber].name}</div>
            <div class="card-btn">
              <a class="link-common card-link" href="#">Learn more</a>
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
      createCard(data);
    })
    cardsContainer.appendChild(card);
  }
}

function setCardsResize(cardsArr) {
  if (cardsContainer.length < pageLimit) {
    for (let i = cardsContainer.length; i < pageLimit; i++) {
      let card = document.createElement("div");
      card.classList.add("card");
      card.id = `${cardsArr[i]}`;
      const petNumber = cardsArr[i];
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
      cardsContainer.appendChild(card);
    }
  }
}

const cardsContainer = document.querySelector("#cards-container");
const cardsNavigation = document.querySelector("#cards-navigation");
const currentArrow = document.querySelector("#current-arrow");
const nextArrow = document.querySelector("#next-arrow");
const lastArrow = document.querySelector("#last-arrow");
const prevArrow = document.querySelector("#prev-arrow");
const firstArrow = document.querySelector("#first-arrow");

let pageLimit;
let pageCount;
let currentPage;
let pageNumber;
let currentArr;


if (document.documentElement.clientWidth >= 1280) {
  pageLimit = 8;
  pageCount = 6;
  currentArr = arrByEight;
} else if (document.documentElement.clientWidth >= 625 && document.documentElement.clientWidth <= 1279) {
  pageLimit = 6;
  pageCount = 8;
  currentArr = arrBySix;
} else if (document.documentElement.clientWidth <= 624) {
  pageLimit = 3;
  pageCount = 16;
  currentArr = arrByThree;
}

window.addEventListener('resize', function(event) {
  if (document.documentElement.clientWidth >= 1280) {
    pageLimit = 8;
    pageCount = 6;
    currentArr = arrByEight;
    pageNumber = 1;
    currentPage = 0;
    setPageNumber(1);
    setCurrentPage(0);
  } else if (document.documentElement.clientWidth >= 625) {
    pageLimit = 6;
    pageCount = 8;
    currentArr = arrBySix;
    pageNumber = 1;
    currentPage = 0;
    setPageNumber(1);
    setCurrentPage(0);
  } else if (document.documentElement.clientWidth <= 624) {
    pageLimit = 3;
    pageCount = 16;
    currentArr = arrByThree;
    pageNumber = 1;
    currentPage = 0;
    setPageNumber(1);
    setCurrentPage(0);
  }
}, true);

const setPageNumber = (pageNum) => {
  pageNumber = pageNum;
  currentArrow.innerHTML = pageNumber;
  if (pageNumber === 1) {
    prevArrow.classList.add("inactive");
    firstArrow.classList.add("inactive");
    nextArrow.classList.remove("inactive");
    lastArrow.classList.remove("inactive");
    nextArrow.classList.add("normal");
    lastArrow.classList.add("normal");
    prevArrow.classList.remove("normal");
    firstArrow.classList.remove("normal");
  } else if (pageNumber === pageCount) {
    nextArrow.classList.add("inactive");
    lastArrow.classList.add("inactive");
    prevArrow.classList.remove("inactive");
    firstArrow.classList.remove("inactive");
    prevArrow.classList.add("normal");
    firstArrow.classList.add("normal");
    nextArrow.classList.remove("normal");
    lastArrow.classList.remove("normal");
  } else if (pageNumber > 1 || pageNumber < pageCount) {
    prevArrow.classList.add("normal");
    prevArrow.classList.remove("inactive");
    firstArrow.classList.add("normal");
    firstArrow.classList.remove("inactive");
    nextArrow.classList.add("normal");
    nextArrow.classList.remove("inactive");
    lastArrow.classList.add("normal");
    lastArrow.classList.remove("inactive");
  }
};

const setCurrentPage = (currentNum) => {
  currentPage = currentNum;
  cardsContainer.innerHTML = "";
  setCards(currentArr[currentPage]);
};

setPageNumber(1);
setCurrentPage(0);

function clickPrevArrow() {
  setPageNumber(pageNumber - 1);
  setCurrentPage(currentPage - 1);
};

function clickFirstArrow() {
  setPageNumber(1);
  setCurrentPage(0);
};

function clickNextArrow() {
  setPageNumber(pageNumber + 1);
  setCurrentPage(currentPage + 1);
};

function clickLastArrow() {
  setPageNumber(pageCount);
  setCurrentPage(pageCount - 1);
};

prevArrow.addEventListener("click", clickPrevArrow);
firstArrow.addEventListener("click", clickFirstArrow);
nextArrow.addEventListener("click", clickNextArrow);
lastArrow.addEventListener("click", clickLastArrow);


