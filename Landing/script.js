"use strict";

const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

///////////////////////////////////////
// Button Smooth Scrolling
btnScrollTo.addEventListener("click", function (e) {
  const s1coords = section1.getBoundingClientRect();
  section1.scrollIntoView({ behavior: "smooth" });
});

//////////////////////////////////////////////////
// Page Navigrion

// 1. Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();
  // Matching Strategy
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

/////////////////////////////////////////////////
////////////////////////////////////////////////

/*

const header = document.querySelector(".header");

// Creating and inserting elements
const message = document.createElement("div");
message.classList.add("cookie-message");
//message.textContent =
//  "We use cookies for improved functionality and analytics.";
message.innerHTML = `We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>`;

//header.prepend(message);
header.append(message);
//header.append(message.cloneNode(true));

document
  .querySelector(".btn--close-cookie")
  .addEventListener("click", function () {
    message.remove();
  });

// styles
message.style.backgroundColor = "#37383d";
message.style.width = "120%";

console.log(message.style.color);
console.log(message.style.backgroundColor);
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + "px";

//document.documentElement.style.setProperty("--color-primary", "orangered");

// Attributes
const logo = document.querySelector(".nav__logo");
logo.alt = "Beautiful minimalist logo";

const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");

btnScrollTo.addEventListener("click", function (e) {
  const s1coords = section1.getBoundingClientRect();
  // Scrolling
  //window.scrollTo(
  //  s1coords.left + window.pageXOffset,
  //  s1coords.top + window.pageYOffset
  //);
  //window.scrollTo({
  //  left: s1coords.left + window.pageXOffset,
  //  top: s1coords.top + window.pageYOffset,
  //  behavior: "smooth",
  //});
  section1.scrollIntoView({ behavior: "smooth" });
});

//rgb(255,255,255)
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

document.querySelector(".nav__link").addEventListener("click", function (e) {
  this.style.backgroundColor = randomColor();
});

document.querySelector(".nav__links").addEventListener("click", function (e) {
  this.style.backgroundColor = randomColor();
});

document.querySelector(".nav").addEventListener("click", function (e) {
  this.style.backgroundColor = randomColor();
});
*/
