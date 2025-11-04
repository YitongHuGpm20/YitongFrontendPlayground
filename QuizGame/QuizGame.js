const answerOptions = document.querySelector(".answer-options");
const nextQuestionBtn = document.querySelector(".next-question-btn");

let curTopic = "programming";
let curQuestion = null;

// Function to get a random question from the current topic
const getRandomQuestion = () => {
    const topicQuestions = questions.find(tpc => tpc.topic.toLowerCase() === curTopic.toLowerCase()).questions || [];

    const randomQuestion = topicQuestions[Math.floor(Math.random() * topicQuestions.length)];
    return randomQuestion;
}

// Highlight the correct answer
const highlightCorrectAnswer = () => {
    const correctOption = answerOptions.querySelectorAll('.answer-option')[curQuestion.correctAnswer];
    correctOption.classList.add('correct');
    const iconHTML = '<span class="material-symbols-outlined">check_circle</span>';
    correctOption.insertAdjacentHTML("beforeend", iconHTML);
}

// Handle answer selection
const handleAnswer = (selectedOption, selectedIndex) => {
    const isCorrect = curQuestion.correctAnswer === selectedIndex;
    selectedOption.classList.add(isCorrect ? 'correct' : 'incorrect');
    !isCorrect ? highlightCorrectAnswer() : "";

    // Insert icon to answer button based on correctness
    const iconHTML = '<span class="material-symbols-outlined">' + (isCorrect ? 'check_circle' : 'cancel') + '</span>';
    selectedOption.insertAdjacentHTML("beforeend", iconHTML);

    // Disable other options once an answer is selected
    answerOptions.querySelectorAll('.answer-option').forEach(option => option.style.pointerEvents = 'none');
    
    // Show Next Question button
    nextQuestionBtn.style.visibility = "visible";
}

const renderQuestion = () => {
    // Get a random question
    curQuestion = getRandomQuestion();
    if(!curQuestion) return;

    // Display new question
    answerOptions.innerHTML = "";
    nextQuestionBtn.style.visibility = "hidden";
    document.querySelector(".question-text").textContent = curQuestion.question;
    
    // Display answer options
    curQuestion.options.forEach((option, index) => {
        const li = document.createElement("li");
        li.classList.add("answer-option");
        li.textContent = option;
        answerOptions.appendChild(li);

        //
        li.addEventListener("click", () => handleAnswer(li, index));
    })
}

renderQuestion();

// Click Next-Question Button to load a new question
nextQuestionBtn.addEventListener("click", renderQuestion);