const baseUrl = "http://localhost:3000/courses/";

const listCoursesButton = document.querySelector("#listCourses");
//const spinner = document.querySelector("#spinner");
const courses = document.querySelector(".courses-list");
const shoppingCartContent = document.querySelector("#cart-content tbody");
const checkOutButton = document.querySelector("#checkout");
const lastmodalDialog = document.querySelector(".last-modal");
const lastcloseModal = document.querySelector(".last-close-modal");
const overlay = document.querySelector(".overlay");
const cartItems = document.querySelectorAll("tbody");

function createList(courseLists) {
  //spinner.classList.add("hidden");

  courseLists.forEach((course) => {
    const stringifiedObj = JSON.stringify(course);

    courses.insertAdjacentHTML(
      "beforeend",
      `
          <div class="course">
          <a  href="course-details.html?courseId=${course.id}">
            <img id="${course.id}" src="/content/img/${course.imageName}" alt="${course.title} " />
            <p>${course.title} ${course.length}hr</p> 
            </a>  
            <button  class=" btn btn-primary add-to-cart" id="add-to-cart${course.id}">Add To Cart</button>                
          </div>  
        `
    );
  });
  return courseLists;
}
//onclick="openModal(${course.id})"

async function loadCourses() {
  //spinner.classList.remove("hidden");
  const url = `${baseUrl}`;
  const response = await fetch(url);
  //console.log(response);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}

loadCourses()
  .then((data) => createList(data))
  .then((courses) => {
    //console.log(courses);

    courses.forEach((course) => {
      let selectedCourse = {};
      let name = course.title;
      let image = course.imageName;
      let duration = course.length;

      selectedCourse["title"] = name;
      selectedCourse["image"] = image;
      selectedCourse["duration"] = duration;

      //console.log(document.querySelector(`#add-to-cart${course.id}`))
      document
        .querySelector(`#add-to-cart${course.id}`)
        .addEventListener("click", () => {
          let selectedId = course.id;
          console.log(selectedId);

          if (shoppingCartCourse.indexOf(selectedCourse) == -1) {
            shoppingCartCourse.push(selectedCourse);
            addCourseToCart(selectedCourse, selectedId);
          }
        });
    });
  })
  .catch((err) => console.log(err));

let shoppingCartCourse = [];

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

  cartItems[0].appendChild(tableRow);
};

checkOutButton.addEventListener("click", checkoutClicked);

function checkoutClicked() {
  event.preventDefault();
  if (shoppingCartCourse.length < 1) return;

  const info = document.querySelector(".modal-container");
  info.innerHTML = `       
          <p>Thank you for your order.</p>  
        `;
  overlay.classList.remove("hidden");
  lastmodalDialog.classList.remove("hidden");

  while (cartItems[0].hasChildNodes()) {
    cartItems[0].removeChild(cartItems[0].firstChild);
  }
}

const quitlastModal = () => {
  event.preventDefault();
  lastmodalDialog.classList.add("hidden");
  overlay.classList.add("hidden");
};

lastcloseModal.addEventListener("click", quitlastModal);

function deleteRow(courseId) {
  const item = document.getElementById(courseId);
  const row = item.parentNode.parentNode;
  cartItems[0].removeChild(row);
  shoppingCartCourse.splice(courseId, 1);
}
