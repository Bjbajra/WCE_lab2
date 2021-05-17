"use strict";
const baseUrl = "http://localhost:3000/courses/";

const heading = document.querySelector("#heading h2");
const image = document.querySelector("#heading img");
const courseNumber = document.querySelector("#courseNumber");
const duration = document.querySelector("#duration");
const category = document.querySelector("#category");
const description = document.querySelector("#description p");
/*lab2*/
/*const modalDialog = document.querySelector(".modal");
const closeModal = document.querySelector(".close-modal");
const overlay = document.querySelector(".overlay");
const addButton = document.querySelector(".add-cart");*/

let course = null;
let courseId = 1;

const urlParams = new URLSearchParams(location.search);

for (let [key, value] of urlParams) {
  if (key === "courseId") courseId = value;
}

async function getList() {
  const url = `${baseUrl}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

getList().then((data) => {
  
  course = data.find((course) => course.id == courseId);
  heading.innerText = `${course.title}`;
  image.setAttribute("src", `/content/img/${course.imageName}`);
  courseNumber.innerHTML += ` ${course.courseNumber}`;
  duration.innerText += ` ${course.length}hr`;
  category.innerText += ` ${course.category}`;
  description.innerText += `${course.description}`;
});

/*const openModal = function () {
  const info = document.querySelector(".modal-container");
  info.innerHTML = `       
        <p>${course.title} was added to your basket</p>      
      <div class="modal-buttons">
        <button id="continue" class=" btn btn-primary " type="button">Continue shopping</button>        
        <button type="button" class="btn btn-primary "><a href="shoppingCart.html">View cart</a></button>     
      </div>
      `;
  const continueButton = document.querySelector("#continue");
  continueButton.addEventListener("click", quitModal);
  overlay.classList.remove("hidden");
  modalDialog.classList.remove("hidden");
};

addButton.addEventListener("click", openModal);

const quitModal = () => {
  modalDialog.classList.add("hidden");
  overlay.classList.add("hidden");
};

closeModal.addEventListener("click", quitModal);

overlay.addEventListener("click", quitModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    if (!modalDialog.classList.contains("hidden")) {
      quitModal();
    }
  }
});*/
