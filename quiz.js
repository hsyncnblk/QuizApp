const apiUrl = 'https://jsonplaceholder.typicode.com/posts';
let questions = [];
let currentQuestionIndex = 0;
let timer;
let answerAllowed = false;
let answers = []; 
let timeLeftDisplay = document.getElementById('timer'); 

async function fetchQuestions() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    questions = data.slice(0, 10).map((item, index) => ({
      question: `Soru ${index + 1}: ${item.title}`,
      options: generateOptions(item.body),
      correctOption: 'A', 
    }));
    displayQuestion();
  } catch (error) {
    console.error('Sorular alınırken hata oluştu:', error);
  }
}

function generateOptions(text) {
  const words = text.split(' ');
  return {
    A: words[0] || 'A seçeneği',
    B: words[1] || 'B seçeneği',
    C: words[2] || 'C seçeneği',
    D: words[3] || 'D seçeneği',
  };
}

function displayQuestion() {
  if (currentQuestionIndex >= questions.length) {
    displayResults();
    return;
  }

  const question = questions[currentQuestionIndex];
  document.getElementById('question').innerText = question.question;
  document.getElementById('optionA').innerText = question.options.A;
  document.getElementById('optionB').innerText = question.options.B;
  document.getElementById('optionC').innerText = question.options.C;
  document.getElementById('optionD').innerText = question.options.D;

  answerAllowed = false;
  startTimer();
}

function startTimer() {
  let timeLeft = 30;
  let timerInterval = 100 / timeLeft;
  document.getElementById('timer-bar').style.width = '100%';
  timeLeftDisplay.innerText = `Süre: ${timeLeft} saniye`;
  timer = setInterval(() => {
    timeLeft--;
    timeLeftDisplay.innerText = `Süre: ${timeLeft} saniye`;
    document.getElementById('timer-bar').style.width = `${timeLeft * timerInterval}%`;
    if (timeLeft === 20) {
      answerAllowed = true;
    } else if (timeLeft <= 0) {
      clearInterval(timer);
      nextQuestion();
    }
  }, 1000);
}

function handleAnswer(option) {
  if (!answerAllowed) return;

  const question = questions[currentQuestionIndex];
  const isCorrect = option === question.correctOption;
  answers.push({
    question: question.question,
    selectedOption: option,
    isCorrect: isCorrect,
  });
  
  nextQuestion();
}

function nextQuestion() {
  clearInterval(timer);
  currentQuestionIndex++;
  displayQuestion();
}

function displayResults() {
  const resultsContainer = document.getElementById('quiz-container');
  resultsContainer.innerHTML = '<h2>Sonuçlar</h2>';

  const table = document.createElement('table');
  table.innerHTML = `
    <tr>
      <th>Soru</th>
      <th>Seçilen Yanıt</th>
      <th>Doğru/Yanlış</th>
    </tr>
  `;

  answers.forEach(answer => {
    const row = document.createElement('tr');
    row.className = answer.isCorrect ? 'result-correct' : 'result-incorrect';
    row.innerHTML = `
      <td>${answer.question}</td>
      <td>${answer.selectedOption}</td>
      <td>${answer.isCorrect ? 'Doğru' : 'Yanlış'}</td>
    `;
    table.appendChild(row);
  });

  resultsContainer.appendChild(table);
}

document.getElementById('optionA').onclick = () => handleAnswer('A');
document.getElementById('optionB').onclick = () => handleAnswer('B');
document.getElementById('optionC').onclick = () => handleAnswer('C');
document.getElementById('optionD').onclick = () => handleAnswer('D');
document.getElementById('next-btn').onclick = nextQuestion;

fetchQuestions();
