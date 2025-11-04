const answerOptions = document.querySelector(".answer-options");
const nextQuestionBtn = document.querySelector(".next-question-btn");
const questionStatus = document.querySelector(".question-status");

let curTopic = "programming";
let curQuestion = null;
let numOfQuestions = 10;
const questionIndexHistory = [];

// Function to get a random question from the current topic
const getRandomQuestion = () => {
    const topicQuestions = questions.find(tpc => tpc.topic.toLowerCase() === curTopic.toLowerCase()).questions || [];
    if(questionIndexHistory.length >= Math.min(topicQuestions.length, numOfQuestions)) {
        return console.log("All questions have been used.");
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
    questionStatus.innerHTML = `<b>${questionIndexHistory.length}</b> of <b>${numOfQuestions}</b> Questions `;
    
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