// Import questions data
const configContainer = document.querySelector(".config-container");
const startBtn = configContainer.querySelector(".start-btn");

const quizContainer = document.querySelector(".quiz-container");
const answerOptions = document.querySelector(".answer-options");
const nextQuestionBtn = document.querySelector(".next-question-btn");
const questionStatus = document.querySelector(".question-status");
const timerDisplay = document.querySelector(".timer-duration");

const resultContainer = document.querySelector(".result-container");
const restartBtn = document.querySelector(".restart-btn");

// Set initial variables
let curTopic = "programming";
let curQuestion = null;
let numOfQuestions = 5;
const questionIndexHistory = [];
const QUIZ_TIME_LIMIT = 15; // seconds
let curTime = QUIZ_TIME_LIMIT;
let timer = null;
let correctAnswersCount = 0;

// Reset timer for new question
const resetTimer = () => {
    clearInterval(timer);
    curTime = QUIZ_TIME_LIMIT;
    timerDisplay.textContent = `${curTime}s`;
}

// Start the countdown timer for current question
const startTimer = () => {
    timer = setInterval(() => {
        curTime--;
        timerDisplay.textContent = `${curTime}s`;

        if(curTime <= 0) {
            clearInterval(timer);
            highlightCorrectAnswer();
            nextQuestionBtn.style.visibility = "visible";
            quizContainer.querySelector(".quiz-timer").style.background = "#c31402";
            answerOptions.querySelectorAll('.answer-option').forEach(option => option.style.pointerEvents = 'none');
        }
    }, 1000);
}

// Show quiz result and hide quiz container
const showQuizResult = () => {
    quizContainer.style.display = "none";
    resultContainer.style.display = "block";
    const resultText = `You answered <b>${correctAnswersCount}</b> out of <b>${numOfQuestions}</b> questions correctly. Great efforts!`;
    resultContainer.querySelector(".result-message").innerHTML = resultText;
}

// Function to get a random question from the current topic
const getRandomQuestion = () => {
    const topicQuestions = questions.find(tpc => tpc.topic.toLowerCase() === curTopic.toLowerCase()).questions || [];
    
    // Check if all questions have been used
    if(questionIndexHistory.length >= Math.min(topicQuestions.length, numOfQuestions)) {
        return showQuizResult();
    } 

    // Update used questions history
    const availableQuestions = topicQuestions.filter((_, index) => !questionIndexHistory.includes(index));
    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    questionIndexHistory.push(topicQuestions.indexOf(randomQuestion));
    
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
    // Stop the timer
    clearInterval(timer);

    // Check if the selected answer is correct
    const isCorrect = curQuestion.correctAnswer === selectedIndex;
    selectedOption.classList.add(isCorrect ? 'correct' : 'incorrect');
    !isCorrect ? highlightCorrectAnswer() : correctAnswersCount++;

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

    resetTimer();
    startTimer();

    // Display new question
    answerOptions.innerHTML = "";
    nextQuestionBtn.style.visibility = "hidden";
    quizContainer.querySelector(".quiz-timer").style.background = "#32313c";
    document.querySelector(".question-text").textContent = curQuestion.question;
    questionStatus.innerHTML = `<b>${questionIndexHistory.length}</b> of <b>${numOfQuestions}</b> Questions `;
    
    // Display answer options
    curQuestion.options.forEach((option, index) => {
        const li = document.createElement("li");
        li.classList.add("answer-option");
        li.textContent = option;
        answerOptions.appendChild(li);

        // Click answer option
        li.addEventListener("click", () => handleAnswer(li, index));
    })
}

// Start the quiz
const startQuiz = () => {
    configContainer.style.display = "none";
    quizContainer.style.display = "block";

    // Get selected topic and number of questions
    curTopic = configContainer.querySelector(".topic-option.active").textContent;
    numOfQuestions = parseInt(configContainer.querySelector(".question-option.active").textContent);
    
    renderQuestion();
}

// Restart the quiz
const restartQuiz = () => {
    resetTimer();
    correctAnswersCount = 0;
    questionIndexHistory.length = 0;
    resultContainer.style.display = "none";
    configContainer.style.display = "block";
}

// EXECUTION STARTS HERE

// Highlight selected topic and question type
document.querySelectorAll(".topic-option, .question-option").forEach(option => {
    option.addEventListener("click", () => {
        option.parentNode.querySelector(".active").classList.remove("active");
        option.classList.add("active");
    });
});

// Click Next-Question Button to load a new question
startBtn.addEventListener("click", startQuiz);
nextQuestionBtn.addEventListener("click", renderQuestion);
restartBtn.addEventListener("click", restartQuiz);
