"use strict";

const baseUrl = "http://localhost:3000/courses/";

const listCoursesButton = document.querySelector("#listCourses");
const spinner = document.querySelector("#spinner");
const courses = document.querySelector(".courses-list");

/*Lab2 */

const addButton = document.querySelector("#addNewCourse");
const addCourseView = document.querySelector("#addCourse-container");
const saveButton = document.querySelector("#save");
const cancelButton = document.querySelector("#cancel");
const id = document.querySelector("#id");
const courseNumber = document.querySelector("#courseNumber");
const title = document.querySelector("#title");
const image = document.querySelector("#imageName");
const length = document.querySelector("#length");
const category = document.querySelector("#category");
const description = document.querySelector("#description");
const modalDialog = document.querySelector(".modal");
const closeModal = document.querySelector(".close-modal");
const overlay = document.querySelector(".overlay");
const cartModalDialog = document.querySelector(".cart-modal");
const cartCloseModal = document.querySelector(".cart-close-modal");
const cartIcon = document.querySelector("#cart");
const shoppingCartContent = document.querySelectorAll("tbody");
const checkOutButton = document.querySelector("#checkout");
const lastmodalDialog = document.querySelector(".last-modal");
const lastcloseModal = document.querySelector(".last-close-modal");
const submenu = document.querySelector(".submenu");
const submenuCloseButton = document.querySelector("#submenu-close");

let shoppingCartCourse = [];
console.log(shoppingCartCourse);

function createList(courseLists) {
  spinner.classList.add("hidden");

  courseLists.forEach((course) => {
    courses.insertAdjacentHTML(
      "beforeend",
      `
          <div class="course">
          <a  href="course-details.html?courseId=${course.id}">
            <img id="${course.id}" src="/content/img/${course.imageName}" alt="${course.title} " />
            <p>${course.title} ${course.length}hr</p> 
            </a>  
            <button onclick="openModal(${course.id})"  class=" btn btn-primary add-to-cart" id="add-to-cart${course.id}">Add To Cart</button>                
          </div>  
        `
    );
  });
  return courseLists;
}

async function loadCourses() {
  spinner.classList.remove("hidden");
  const url = `${baseUrl}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}

loadCourses()
  .then((data) => createList(data))
  .then((courses) => {
    courses.forEach((course) => {
      let selectedCourse = {};
      let name = course.title;
      let image = course.imageName;
      let duration = course.length;

      selectedCourse["title"] = name;
      selectedCourse["image"] = image;
      selectedCourse["duration"] = duration;

      document
        .querySelector(`#add-to-cart${course.id}`)
        .addEventListener("click", () => {
          let selectedId = course.id;

          if (shoppingCartCourse.indexOf(selectedCourse) == -1) {
            shoppingCartCourse.push(selectedCourse);
            addCourseToCart(selectedCourse, selectedId);
          }
        });
    });
  })
  .catch((err) => console.log(err));

const addCourseToCart = (course, courseId) => {
  course["id"] = courseId;
  //console.log(courseId);
  let tableRow = document.createElement("tr");
  let tableData = document.createElement("td");
  tableRow.insertAdjacentHTML(
    "beforeend",
    `
       <td><img src=/content/img/${course.image} width="100%"/></td>
       <td>${course.title}</td>
       <td>${course.duration}</td>
       <td>
          <a href="#" onclick="deleteRow(${course.id})" class="remove" title="Remove from cart" id="${course.id}">&times</a>
      </td>
       `
  );

  shoppingCartContent[0].appendChild(tableRow);
};

class AddCourse {
  constructor(
    id,
    courseNumber,
    title,
    imageName,
    description,
    length,
    category
  ) {
    this.id = id;
    this.courseNumber = courseNumber;
    this.title = title;
    this.imageName = imageName;
    this.description = description;
    this.length = length;
    this.category = category;
  }
}

async function AddNewCourse() {
  const course = new AddCourse(
    id.value,
    courseNumber.value,
    title.value,
    image.value,
    description.value,
    length.value,
    category.value
  );

  const response = await fetch(`${baseUrl}`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(course),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }
  console.log(response);
  return response.json();
}

addButton.addEventListener("click", (e) => {
  e.preventDefault();
  addCourseView.classList.remove("hidden");

  overlay.classList.remove("hidden");
  modalDialog.classList.remove("hidden");
});

saveButton.addEventListener("click", (e) => {
  e.preventDefault();

  AddNewCourse()
    .then((data) => {
      console.log(data);
      loadCourses().then((data) => createListTry(data));
    })
    .catch((err) => console.log(err));

  courses.classList.remove("hidden");
  addCourseView.classList.add("hidden");
  overlay.classList.add("hidden");
  modalDialog.classList.add("hidden");
});

cancelButton.addEventListener("click", (e) => {
  e.preventDefault();
  modalDialog.classList.add("hidden");
  overlay.classList.add("hidden");
});

const openModal = (course) => {
  const info = document.querySelector(".modal-container");

  info.innerHTML = `       
        <p>${course}${course.title} was added to your basket</p>      
      <div class="modal-buttons">
        <button id="continue" class=" btn btn-primary " type="button">Continue shopping</button>        
        <button type="button" class="btn btn-primary" id="view-cart">View Cart</button>     
      </div>
      `;
  const continueButton = document.querySelector("#continue");
  continueButton.addEventListener("click", quitModal);
  const viewCartButton = document.querySelector("#view-cart");

  viewCartButton.addEventListener("click", () => {
    submenu.classList.remove("hidden");
    overlay.classList.remove("hidden");
  });
  overlay.classList.remove("hidden");
  cartModalDialog.classList.remove("hidden");
};

const quitModal = () => {
  cartModalDialog.classList.add("hidden");
  modalDialog.classList.add("hidden");
  overlay.classList.add("hidden");
};

cartModalDialog.addEventListener("click", quitModal);
closeModal.addEventListener("click", quitModal);
overlay.addEventListener("click", () => {
  quitModal();
  lastmodalDialog.classList.add("hidden");
  submenu.classList.add("hidden");
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    if (
      !modalDialog.classList.contains("hidden") ||
      !cartModalDialog.classList.contains("hidden")
    ) {
      quitModal();
    }
  }
});

function checkoutClicked() {
  if (shoppingCartCourse.length < 1) {
    submenu.classList.add("hidden");
    overlay.classList.add("hidden");
    return;
  }

  const info = document.querySelector(".last-modal-container");
  info.innerHTML = `       
          <p>Thank you for your order.</p>  
        `;
  overlay.classList.remove("hidden");
  lastmodalDialog.classList.remove("hidden");
  submenu.classList.add("hidden");

  while (shoppingCartContent[0].hasChildNodes()) {
    shoppingCartContent[0].removeChild(shoppingCartContent[0].firstChild);
  }
}

checkOutButton.addEventListener("click", checkoutClicked);

lastcloseModal.addEventListener("click", () => {
  lastmodalDialog.classList.add("hidden");
  overlay.classList.add("hidden");
});

function deleteRow(courseId) {
  shoppingCartCourse.pop(courseId);
  const item = document.getElementById(courseId);
  const row = item.parentNode.parentNode;
  shoppingCartContent[0].removeChild(row);
}

cartIcon.addEventListener("click", () => {
  submenu.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

submenuCloseButton.addEventListener("click", () => {
  submenu.classList.add("hidden");
  overlay.classList.add("hidden");
});
