const container = document.querySelector(".container");
const addQuestionCard = document.getElementById("add-question-card");
const cardButton = document.getElementById("save-btn");
const question = document.getElementById("question");
const answer = document.getElementById("answer");
const errorMessage = document.getElementById("error");
const addQuestion = document.getElementById("add-flashcard");
const closeBtn = document.getElementById("close-btn");

let flashcards = []; // Массив для хранения карточек
let editingIndex = null; // Индекс редактируемой карточки

// Загрузка карточек из localStorage при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  const storedCards = JSON.parse(localStorage.getItem("flashcards")) || [];
  if (Array.isArray(storedCards)) {
    flashcards = storedCards;
    flashcards.forEach((card, index) => createCard(card.question, card.answer, index));
  }
});

// Сохранение карточек в localStorage
const saveFlashcards = () => {
  localStorage.setItem("flashcards", JSON.stringify(flashcards));
};

// Отображение формы для создания новой карточки
addQuestion.addEventListener("click", () => {
  container.classList.add("hide");
  question.value = "";
  answer.value = "";
  addQuestionCard.classList.remove("hide");
  editingIndex = null; // Сбросим индекс редактируемой карточки
});

// Закрытие формы создания карточки
closeBtn.addEventListener("click", () => {
  container.classList.remove("hide");
  addQuestionCard.classList.add("hide");
});

// Функция для создания или обновления карточки
const createCard = (questionText, answerText, index = null) => {
  const listCard = document.querySelector(".card-list-container");
  const div = document.createElement("div");
  div.classList.add("card");

  // Вопрос
  const questionDiv = document.createElement("p");
  questionDiv.classList.add("question-div");
  questionDiv.innerText = questionText;
  div.appendChild(questionDiv);


  // Кнопка показать/скрыть ответ
  const toggleButton = document.createElement("a");
  toggleButton.href = "#";
  toggleButton.classList.add("show-hide-btn");
  toggleButton.innerText = "Show/Hide";
  toggleButton.addEventListener("click", () => {
    answerDiv.classList.toggle("hide");
  });


  div.appendChild(toggleButton);

  // Ответ
  const answerDiv = document.createElement("p");
  answerDiv.classList.add("answer-div", "hide");
  answerDiv.innerText = answerText;
  div.appendChild(answerDiv);

  // Контейнер для кнопок
  const buttonsCon = document.createElement("div");
  buttonsCon.classList.add("buttons-con");

  // Кнопка редактирования
  const editButton = document.createElement("button");
  editButton.classList.add("edit");
  editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
  editButton.addEventListener("click", () => {
    editingIndex = index; // Запоминаем индекс редактируемой карточки
    question.value = questionText;
    answer.value = answerText;
    container.classList.add("hide");
    addQuestionCard.classList.remove("hide");
  });
  buttonsCon.appendChild(editButton);

  // Кнопка удаления
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete");
  deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  deleteButton.addEventListener("click", () => {
    deleteCard(index, div);
  });
  buttonsCon.appendChild(deleteButton);

  div.appendChild(buttonsCon);
  listCard.appendChild(div);
};

// Удаление карточки
const deleteCard = (index, cardDiv) => {
  flashcards.splice(index, 1); // Удаляем карточку из массива
  saveFlashcards(); // Сохраняем изменения в localStorage
  cardDiv.remove(); // Удаляем карточку из DOM
};

// Добавление новой карточки или обновление существующей
cardButton.addEventListener("click", () => {
  const tempQuestion = question.value.trim();
  const tempAnswer = answer.value.trim();

  if (!tempQuestion || !tempAnswer) {
    errorMessage.classList.remove("hide");
  } else {
    errorMessage.classList.add("hide");
    if (editingIndex !== null) {
      // Обновление существующей карточки
      flashcards[editingIndex] = { question: tempQuestion, answer: tempAnswer };
      document.querySelector(".card-list-container").children[editingIndex].querySelector(".question-div").innerText = tempQuestion;
      document.querySelector(".card-list-container").children[editingIndex].querySelector(".answer-div").innerText = tempAnswer;
      saveFlashcards();
    } else {
      // Добавление новой карточки
      flashcards.push({ question: tempQuestion, answer: tempAnswer });
      createCard(tempQuestion, tempAnswer, flashcards.length - 1);
      saveFlashcards();
    }

    question.value = "";
    answer.value = "";
    addQuestionCard.classList.add("hide");
    container.classList.remove("hide");
    editingIndex = null; // Сбросим индекс редактируемой карточки
  }
});

