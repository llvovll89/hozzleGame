// dom
const itemBox = document.querySelector(".item-box");
const modal = document.querySelector(".modal");
const container = document.querySelector(".container");
const wrap = document.querySelector(".wrap");
const mainBox = document.querySelector(".main-box");
const gameText = document.querySelector(".game-text");
const playTimer = document.querySelector(".play-time");
const gameOpen = document.querySelector(".gameOpen");

// btn
const startBtn = document.querySelector(".startBtn");
const restartBtn = document.querySelector(".resetBtn");

let puzzle = 16;

const dragged = {
  el: null,
  class: null,
  index: null,
};

let isPlaying = false;
let timer = null;
let time = 0;
let tileArr = [];

function checkStatus() {
  const curlist = [...itemBox.children];
  const unMatch = curlist.filter(
    (child, index) => Number(child.getAttribute("data-index")) !== index
  );
  if (unMatch.length === 0) {
    gameText.style.display = "block";
    isPlaying = false;
    clearInterval(timer);
  }
}

function init() {
  isPlaying = true;
  time = 0;
  itemBox.innerHTML = "";
  clearInterval(timer);
  container.classList.add("active");
  tileArr = createPuzze();
  tileArr.forEach((item2) => itemBox.appendChild(item2));
  itemBox.style.pointerEvents = "none";
  gameOpen.style.display = "none";
  mainBox.classList.add("active");
  setTimeout(openModal, 4000);
}

function openModal() {
  modal.classList.add("active");
  wrap.classList.add("active");
  container.classList.remove("active");
  mainBox.classList.add("active");
  shufStart();
}

function shufStart() {
  setTimeout(() => {
    modal.classList.remove("active");
    container.classList.add("active");
    wrap.classList.remove("active");
    timer = setInterval(() => {
      playTimer.innerText = `PLAY Time : ${time}`;
      time++;
    }, 1000);
    shuf(tileArr).forEach((item2) => itemBox.appendChild(item2));
    itemBox.style.pointerEvents = "auto";
    restartBtn.style.display = "block";
  }, 3000);
}

function createPuzze() {
  const tiles = [];
  Array(puzzle)
    .fill()
    .forEach((_, item) => {
      const li = document.createElement("li");
      li.setAttribute("data-index", `${item}`);
      li.setAttribute("draggable", "true");
      li.classList.add(`list${item}`);
      itemBox.appendChild(li);
      tiles.push(li);
    });
  return tiles;
}

function shuf(arr) {
  let index = arr.length - 1;
  while (index > 0) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [arr[index], arr[randomIndex]] = [arr[randomIndex], arr[index]];
    index--;
  }
  return arr;
}

// drag Event
itemBox.addEventListener("dragstart", (e) => {
  if (!isPlaying) return;
  const etarget = e.target;
  dragged.el = etarget;
  dragged.class = etarget.className;
  dragged.index = [...etarget.parentNode.children].indexOf(etarget);
});

itemBox.addEventListener("dragover", (e) => {
  e.preventDefault();
});

itemBox.addEventListener("drop", (e) => {
  if (!isPlaying) return;
  const etarget = e.target;

  let place;
  let last = false;

  if (etarget.className !== dragged.class) {
    if (dragged.el.nextSibling) {
      place = dragged.el.nextSibling;
    } else {
      place = dragged.el.previousSibling;
      last = true;
    }
    const dropIndex = [...etarget.parentNode.children].indexOf(etarget);
    dragged.index > dropIndex
      ? etarget.before(dragged.el)
      : etarget.after(dragged.el);
    last ? place.after(etarget) : place.before(etarget);
  }
  checkStatus();
});

startBtn.addEventListener("click", () => {
  init();
});

restartBtn.addEventListener("click", () => {
  window.location.reload();
});
