const answerOptions = document.querySelector(".answer-options");

let curTopic = "programming";

// Function to get a random question from the current topic
const getRandomQuestion = () => {
    const topicQuestions = questions.find(tpc => tpc.topic.toLowerCase() === curTopic.toLowerCase()).questions || [];

    const randomQuestion = topicQuestions[Math.floor(Math.random() * topicQuestions.length)];
    return randomQuestion;
}

const renderQuestion = () => {
    // Get a random question
    const curQuestion = getRandomQuestion();
    if(!curQuestion) return;

    // Display new question
    answerOptions.innerHTML = "";
    document.querySelector(".question-text").textContent = curQuestion.question;
    
    // Display answer options
    curQuestion.options.forEach(option => {
        const li = document.createElement("li");
        li.classList.add("answer-option");
        li.textContent = option;
        answerOptions.appendChild(li);
    })
}

renderQuestion();