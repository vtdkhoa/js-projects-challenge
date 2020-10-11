const quizData = [
  {
    question: 'What are the colours of the rainbow ?',
    a: '4 colours',
    b: '5 colours',
    c: '6 colours',
    d: '7 colours',
    correct: 'd'
  },
  {
    question: 'What is classification in biology the Chicken belong to ?',
    a: 'Mammals',
    b: 'Birds',
    c: 'Amphibians',
    d: 'Reptiles',
    correct: 'b'
  },
  {
    question: 'How many planets in the solor system ?',
    a: '8 planets',
    b: '9 planets',
    c: '10 planets',
    d: '11 planets',
    correct: 'a'
  },
  {
    question: 'Which soccer team is the World Cup Champion ?',
    a: 'Belgium',
    b: 'Germany',
    c: 'France',
    d: 'Spain',
    correct: 'c'
  }
]

const quiz = document.querySelector('#quiz')
const answerElement = document.querySelectorAll('.answer')
const questionElement = document.querySelector('#question')
const firstQuiz = document.querySelector('#first-question')
const secondQuiz = document.querySelector('#second-question')
const thirdQuiz = document.querySelector('#third-question')
const fourthQuiz = document.querySelector('#fourth-question')
const submit = document.querySelector('#submit')

let currentQuiz = 0
let score = 0

loadQuiz()

function loadQuiz() {
  deleteAnswer()

  const currentQuizData = quizData[currentQuiz]

  questionElement.innerHTML = currentQuizData.question
  firstQuiz.innerHTML = currentQuizData.a
  secondQuiz.innerHTML = currentQuizData.b
  thirdQuiz.innerHTML = currentQuizData.c
  fourthQuiz.innerHTML = currentQuizData.d
}

function getSelected() {
  let answer

  answerElement.forEach(a => {
    if (a.checked) {
      answer = a.id
    }
  })

  return answer
}

function deleteAnswer() {
  answerElement.forEach(a => {
    a.checked = false
  })
}

submit.addEventListener('click', () => {
  // check the answer
  const answer = getSelected()

  if (answer) {
    if (answer === quizData[currentQuiz].correct) {
      score+=1
    }
    currentQuiz++

    if (currentQuiz < quizData.length) {
      loadQuiz()
    } else {
      quiz.innerHTML = `
        <h2>You answered correctly at ${score}/${quizData.length} questions.</h2>
        <button onclick="location.reload()">Reload</button>
      `
    }
  }
})