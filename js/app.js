const courses = document.querySelector("#courses-list"),
  shoppingCartContent = document.querySelector("#cart-content tbody"),
  clearCartBtn = document.querySelector("#clear-cart");

// Listeners

attachEventListeners();

function attachEventListeners() {
  // Когда добавляются новые курсы
  courses.addEventListener("click", buyCourse);

  // Когда нажата кнопка удаления
  shoppingCartContent.addEventListener("click", removeCourse);

  // Кнопка очистить корзину
  clearCartBtn.addEventListener("click", clearCart);

  // Чтение документа
  document.addEventListener("DOMContentLoaded", getFromLocalStorage);
}

// Functions

function buyCourse(event) {
  // Используйте делегирование, чтобы найти добавленный курс
  if (event.target.classList.contains("add-to-cart")) {
    // Прочитать стоимость курса
    const course = event.target.parentElement.parentElement;

    // Прочитать значение
    getCourseInfo(course);
  }
}
// Читает информацию в формате Html выбранного курса
function getCourseInfo(course) {
  // Создать объект с данными курса
  const courseInfo = {
    image: course.querySelector("img").src,
    title: course.querySelector("h4").textContent,
    price: course.querySelector(".price span").textContent,
    id: course.querySelector("a").getAttribute("data-id"),
  };
  // Вставить в карту покупок
  addIntoCard(courseInfo);
}
// Отображение выбранного курса в карточке покупок

function addIntoCard(course) {
  // Создать  <tr>
  const row = document.createElement("tr");

  // Создайте шаблон
  row.innerHTML = `
    <tr>
      <td>
        <img src="${course.image}" width=100>
      </td>
      <td>${course.title}></td>
      <td>${course.price}</td>
      <td>
          <a href="#" class="remove" data-id="${course.id}">X</a>
      </td>
    </tr>
  `;
  // Добавить в корзину
  shoppingCartContent.appendChild(row);

  // Добавить курс в хранилище
  saveIntoStorage(course);
}
// Добавить курсы в локальное хранилище

function saveIntoStorage(course) {
  let courses = getCoursesFromStorage();

  // добавить курсы в массив
  courses.push(course);
  // поскольку хранилище сохраняет только строки, нам нужно преобразовать JSON в String
  localStorage.setItem("courses", JSON.stringify(courses));
}

// Достать содержимое из хранилища
function getCoursesFromStorage() {
  let courses;

  // если что-то существует в хранилище, мы получаем значение, в противном случае создаем пустой массив
  if (localStorage.getItem("courses") === null) {
    courses = [];
  } else {
    courses = JSON.parse(localStorage.getItem("courses"));
  }
  return courses;
}

// удалить курс из DOM
function removeCourse(event) {
  let course, courseId;
  if (event.target.classList.contains("remove")) {
    event.target.parentElement.parentElement.remove();
    course = event.target.parentElement.parentElement;
    courseId = course.querySelector("a").getAttribute("data-id");
  }

  // удалить из локального хранилища
  removeCourseLocalStorage(courseId);
}

//удалить из локального хранилища
function removeCourseLocalStorage(id) {
  //получить данные локального хранилища
  let coursesLS = getCoursesFromStorage();

  //пройтись по массиву и найти индекс для удаления
  coursesLS.forEach(function (courseLS, index) {
    if (courseLS.id === id) {
      coursesLS.splice(index, 1);
    }
  });

  // Добавьте остальную часть массива
  localStorage.setItem("courses", JSON.stringify(coursesLS));
}

// Очищает корзину
function clearCart() {
  // shoppingCartContent.innerHTML = '';

  while (shoppingCartContent.firstChild) {
    shoppingCartContent.removeChild(shoppingCartContent.firstChild);
  }

  // Очищение хранилища
  clearLocalStorage();
}
// Очищает все локальное хранилище
function clearLocalStorage() {
  localStorage.clear();
}
// Загружается, когда документ готов, и распечатывает курсы в корзину.

function getFromLocalStorage() {
  let coursesLS = getCoursesFromStorage();

  // ПЕРЕЙТИ по курсам и распечатайте их в корзине
  coursesLS.forEach(function (course) {
    // Создать <tr>
    const row = document.createElement("tr");
    // Создайте шаблон
    row.innerHTML = `
      <tr>
        <td>
          <img src="${course.image}" width=100>
        </td>
        <td>${course.title}></td>
        <td>${course.price}</td>
        <td>
            <a href="#" class="remove" data-id="${course.id}">X</a>
        </td>
      </tr>
    `;

    // Добавить в корзину
    shoppingCartContent.appendChild(row);
  });
}
