let quiz;

function showResults() {
    if (quiz.checkAnswers()) {
        let quizScorePercent = quiz.result.scorePercentFormatted; // The unformatted percentage is a decimal in range 0 - 1
        let quizResultElement = document.getElementById('quiz-result');
        quizResultElement.style.display = 'block';
        document.getElementById('quiz-score').innerHTML = quiz.result.score.toString();
        document.getElementById('quiz-max-score').innerHTML = quiz.result.totalQuestions.toString();
        document.getElementById('quiz-percent').innerHTML = quizScorePercent.toString();


        if (quizScorePercent >= 75) quizResultElement.style.backgroundColor = '#4caf50';
        else if (quizScorePercent >= 50) quizResultElement.style.backgroundColor = '#ffc107';
        else if (quizScorePercent >= 25) quizResultElement.style.backgroundColor = '#ff9800';
        else if (quizScorePercent >= 0) quizResultElement.style.backgroundColor = '#f44336';


        quiz.highlightResults(handleAnswers);
    }
}


function handleAnswers(quiz, question, no, correct) {
    if (!correct) {
        let answers = question.getElementsByTagName('input');
        for (let i = 0; i < answers.length; i++) {
            if (answers[i].type === "checkbox" || answers[i].type === "radio"){
                // If the current input element is part of the correct answer, highlight it
                if (quiz.answers[no].indexOf(answers[i].value) > -1) {
                    answers[i].parentNode.classList.add(Quiz.Classes.CORRECT);
                }
            } else {

                let correctAnswer = document.createElement('span');
                correctAnswer.classList.add(Quiz.Classes.CORRECT);
                correctAnswer.classList.add(Quiz.Classes.TEMP);
                correctAnswer.innerHTML = quiz.answers[no];
                correctAnswer.style.marginLeft = '10px';
                answers[i].parentNode.insertBefore(correctAnswer, answers[i].nextSibling);
            }
        }
    }
}



window.onload = function() {
    quiz = new Quiz('quiz', [
        'script',
        'b',
        'a',

    ]);
};

