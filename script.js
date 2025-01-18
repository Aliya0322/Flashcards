const container = document.querySelector(".container");
const addQuestionCard = document.getElementById("add-question-card");
const cardButton = document.getElementById("save-btn");
const question = document.getElementById("question");
const answer = document.getElementById("answer");
const errorMessage = document.getElementById("error");
const addQuestion = document.getElementById("add-flashcard");
const closeBtn = document.getElementById("close-btn");
let editBool = false;


//Add question when user clicks 'Add Flashcard' button
addQuestion.addEventListener("click", () => {
  container.classList.add("hide");
  question.value = "";
  answer.value = "";
  addQuestionCard.classList.remove("hide");
});

//Hide Create flashcard Card
closeBtn.addEventListener(
  "click",
  (hideQuestion = () => {
    container.classList.remove("hide");
    addQuestionCard.classList.add("hide");
    if (editBool) {
      editBool = false;
      submitQuestion();
    }
  })
);

//Submit Question
cardButton.addEventListener(
  "click",
  (submitQuestion = () => {
    editBool = false;
    tempQuestion = question.value.trim();
    tempAnswer = answer.value.trim();
    if (!tempQuestion || !tempAnswer) {
      errorMessage.classList.remove("hide");
    } else {
      container.classList.remove("hide");
      errorMessage.classList.add("hide");
      viewlist();
      question.value = "";
      answer.value = "";
    }
  })
);

document.addEventListener("DOMContentLoaded", () => {
    const storedCards = JSON.parse(localStorage.getItem("flashcards")) || []; // Load data from localStorage
    if (Array.isArray(storedCards)) {
        storedCards.forEach((card) => createCard(card.question, card.answer)); // Restore flashcards
    }
});

let flashcards = []; // Array to store flashcards

// Save flashcards to localStorage
const saveFlashcards = () => {
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
};

// Add a new flashcard
const createCard = (questionText, answerText) => {
    const listCard = document.getElementsByClassName("card-list-container")[0];
    const div = document.createElement("div");
    div.classList.add("card");

    // Question
    div.innerHTML += `
    <p class="question-div">${questionText}</p>`;
    
    // Answer
    const displayAnswer = document.createElement("p");
    displayAnswer.classList.add("answer-div", "hide");
    displayAnswer.innerText = answerText;

    // Link to show/hide the answer
    const link = document.createElement("a");
    link.setAttribute("href", "#");
    link.setAttribute("class", "show-hide-btn");
    link.innerHTML = "Show/Hide";
    link.addEventListener("click", () => {
        displayAnswer.classList.toggle("hide");
    });

    div.appendChild(link);
    div.appendChild(displayAnswer);

    // Button container
    const buttonsCon = document.createElement("div");
    buttonsCon.classList.add("buttons-con");

    // Edit button
    const editButton = document.createElement("button");
    editButton.setAttribute("class", "edit");
    editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
    editButton.addEventListener("click", () => {
        editBool = true;
        modifyElement(editButton, true);
        addQuestionCard.classList.remove("hide");
        saveFlashcards();
    });
    buttonsCon.appendChild(editButton);

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "delete");
    deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    deleteButton.addEventListener("click", () => {
        modifyElement(deleteButton);
        saveFlashcards(); // Save after deletion
    });
    buttonsCon.appendChild(deleteButton);

    div.appendChild(buttonsCon);
    listCard.appendChild(div);
    hideQuestion();

    // Add to the array
    flashcards.push({ question: questionText, answer: answerText });
    saveFlashcards(); // Save data
};

// Delete or edit elements
const modifyElement = (element, edit = false) => {
    const parentDiv = element.parentElement.parentElement;
    const parentQuestion = parentDiv.querySelector(".question-div").innerText;

    if (edit) {
        const parentAns = parentDiv.querySelector(".answer-div").innerText;
        answer.value = parentAns;
        question.value = parentQuestion;
        disableButtons(true);
    }

    // Remove from DOM
    const index = flashcards.findIndex((card) => card.question === parentQuestion);
    if (index !== -1) flashcards.splice(index, 1); // Remove from the array
    parentDiv.remove();

    saveFlashcards(); // Save after deletion
};

// Disable edit buttons
const disableButtons = (value) => {
    const editButtons = document.getElementsByClassName("edit");
    Array.from(editButtons).forEach((button) => {
        button.disabled = value;
    });
};

// Add a new flashcard when the button is clicked
cardButton.addEventListener("click", () => {
    editBool = false;
    const tempQuestion = question.value.trim();
    const tempAnswer = answer.value.trim();

    if (!tempQuestion || !tempAnswer) {
        errorMessage.classList.remove("hide");
    } else {
        container.classList.remove("hide");
        errorMessage.classList.add("hide");
        createCard(tempQuestion, tempAnswer); // Create a new flashcard
        question.value = "";
        answer.value = "";
    }
});

// Hide the flashcard creation form
closeBtn.addEventListener("click", () => {
    container.classList.remove("hide");
    addQuestionCard.classList.add("hide");
    if (editBool) {
        editBool = false;
        cardButton.click();
    }
});



