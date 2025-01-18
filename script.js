const container = document.querySelector(".container");
const addQuestionCard = document.getElementById("add-question-card");
const cardButton = document.getElementById("save-btn");
const question = document.getElementById("question");
const answer = document.getElementById("answer");
const errorMessage = document.getElementById("error");
const addQuestion = document.getElementById("add-flashcard");
const closeBtn = document.getElementById("close-btn");
let editIndex = null; // Индекс редактируемой карточки

let flashcards = []; // Массив для хранения карточек

// Загрузка карточек из localStorage при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  const storedCards = JSON.parse(localStorage.getItem("flashcards")) || [];
  if (Array.isArray(storedCards)) {
    flashcards = storedCards;
    flashcards.forEach((card) => createCard(card.question, card.answer));
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
  editIndex = null; // Сброс режима редактирования
});

// Закрытие формы создания карточки
closeBtn.addEventListener("click", () => {
  container.classList.remove("hide");
  addQuestionCard.classList.add("hide");
  editIndex = null; // Сброс режима редактирования
});

// Функция для создания карточки
const createCard = (questionText, answerText) => {
  const listCard = document.querySelector(".card-list-container");
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card");

  // Вопрос
  const questionDiv = document.createElement("p");
  questionDiv.classList.add("question-div");
  questionDiv.innerText = questionText;
  cardDiv.appendChild(questionDiv);

  // Кнопка показать/скрыть ответ
  const toggleButton = document.createElement("a");
  toggleButton.href = "#";
  toggleButton.classList.add("show-hide-btn");
  toggleButton.innerText = "Show/Hide";
  const answerDiv = document.createElement("p");
  answerDiv.classList.add("answer-div", "hide");
  answerDiv.innerText = answerText;
  
  toggleButton.addEventListener("click", () => {
    answerDiv.classList.toggle("hide");
  });
  
  cardDiv.appendChild(toggleButton);
  cardDiv.appendChild(answerDiv);

  // Контейнер для кнопок
  const buttonsCon = document.createElement("div");
  buttonsCon.classList.add("buttons-con");

  // Кнопка редактирования
  const editButton = document.createElement("button");
  editButton.classList.add("edit");
  editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
  editButton.addEventListener("click", () => {
    editIndex = flashcards.findIndex((card) => card.question === questionText);
    if (editIndex !== -1) {
      question.value = flashcards[editIndex].question;
      answer.value = flashcards[editIndex].answer;
      container.classList.add("hide");
      addQuestionCard.classList.remove("hide");
    }
  });
  buttonsCon.appendChild(editButton);

  // Кнопка удаления
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete");
  deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  deleteButton.addEventListener("click", () => {
    const index = flashcards.findIndex((card) => card.question === questionText);
    if (index !== -1) {
      flashcards.splice(index, 1); // Удаление из массива
      saveFlashcards(); // Сохранение изменений
      cardDiv.remove(); // Удаление из DOM
    }
  });
  buttonsCon.appendChild(deleteButton);

  cardDiv.appendChild(buttonsCon);
  listCard.appendChild(cardDiv);
};

// Добавление новой карточки или обновление существующей
cardButton.addEventListener("click", () => {
  const tempQuestion = question.value.trim();
  const tempAnswer = answer.value.trim();

  if (!tempQuestion || !tempAnswer) {
    errorMessage.classList.remove("hide");
  } else {
    errorMessage.classList.add("hide");
    if (editIndex !== null) {
      // Обновление существующей карточки
      flashcards[editIndex] = { question: tempQuestion, answer: tempAnswer };
      const listCard = document.querySelector(".card-list-container");
      const cardDiv = listCard.children[editIndex];
      cardDiv.querySelector(".question-div").innerText = tempQuestion;
      cardDiv.querySelector(".answer-div").innerText = tempAnswer;
      saveFlashcards();
    } else {
      // Добавление новой карточки
      flashcards.push({ question: tempQuestion, answer: tempAnswer });
      createCard(tempQuestion, tempAnswer);
      saveFlashcards();
    }
    question.value = "";
    answer.value = "";
    addQuestionCard.classList.add("hide");
    container.classList.remove("hide");
    editIndex = null; // Сброс режима редактирования
  }
});
