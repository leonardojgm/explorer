// Seleção de elementos do DOM
const quizBox = document.querySelector(".question-container");
const optionList = document.querySelector(".answer-options");
const checkAnswerButton = document.querySelector("#check-answer");
const prevButton = document.querySelector("#prev-question"); // Seleciona o botão de voltar
const nextButton = document.querySelector("#next-question"); // Seleciona o botão de próxima pergunta
const endScreen = document.querySelector(".end-screen")
const initialScreenButton = document.querySelector("#initial-screen")
const header = document.querySelector("header")
const footer = document.querySelector(".lesson-footer")
const progressBar = document.querySelector(".progress-bar"); // Seleciona a barra de progresso
const progressBarContainer = document.querySelector(".progress-bar-container");
// Variáveis de controle
let questionCount = 0; // Contador de perguntas
let selectedAnswer = ""; // Armazena a resposta selecionada

// Verifica se existem perguntas e inicia a exibição da primeira
if (questions && questions.length > 0) {
  showQuestions(questionCount);
}

// Função para exibir a pergunta e opções
function showQuestions(index) {
  if (questions[index]) {
    const questionText = document.querySelector(".question p");
    questionText.textContent = `${questions[index].numb}. ${questions[index].question}`;

    // Gera as opções de resposta
    let optionTag = `
      <div class="option initial">${questions[index].options[0]}</div>
      <div class="option initial">${questions[index].options[1]}</div>
      <div class="option initial">${questions[index].options[2]}</div>
      <div class="option initial">${questions[index].options[3]}</div>
    `;
    optionList.innerHTML = optionTag;

    // Seleciona as opções e adiciona evento de clique
    const options = document.querySelectorAll(".option");
    options.forEach(option => {
      option.addEventListener("click", function() {
        options.forEach(option => option.classList.remove("selected")); // Remove seleção de todas as opções
        this.classList.add("selected"); // Adiciona classe 'selected' à opção clicada
        selectedAnswer = this.textContent; // Armazena a resposta selecionada
        checkAnswerButton.classList.add("active"); // Ativa o botão de verificar
      });
    });

    // Atualiza a barra de progresso e os botões de chevron
    updateProgressBar();
    updateChevronButtons(index);
  } else {
    console.error("Pergunta não encontrada para o índice: ", index);
  }
}

// Evento de clique para verificar a resposta
checkAnswerButton.addEventListener("click", checkAnswer);

// Função para verificar a resposta
function checkAnswer() {
  if (selectedAnswer) {
    const correctAnswer = questions[questionCount].correctAnswer; // Obtém a resposta correta
    const boxOption = document.querySelectorAll(".option"); // Seleciona todas as opções

    // Verifica se a resposta selecionada está correta
    if (selectedAnswer === correctAnswer) {
      boxOption.forEach(option => {
        if (option.textContent === correctAnswer) {
          option.classList.add("correct"); // Marca a opção correta
        }
      });

      // Atualiza o botão para indicar que a resposta está correta
      checkAnswerButton.classList.add("correct");
      checkAnswerButton.textContent = "Continue";
      checkAnswerButton.removeEventListener("click", checkAnswer);
      checkAnswerButton.addEventListener("click", nextQuestion); // Adiciona evento para a próxima pergunta
    } else {
      boxOption.forEach(option => {
        if (option.textContent === selectedAnswer) {
          option.classList.add("wrong"); // Marca a opção errada
        }
      });
      checkAnswerButton.classList.add("wrong");
      checkAnswerButton.textContent = "Try Again"; // Atualiza o botão para indicar que a resposta está errada
      
      // Prepara o botão para tentar novamente
      checkAnswerButton.removeEventListener("click", checkAnswer);
      checkAnswerButton.addEventListener("click", resetQuestion); // Reseta a pergunta para nova tentativa
    }
  }
}

// Função para ir para a próxima pergunta
function nextQuestion() {
  questionCount++; // Incrementa o contador de perguntas
  if (questionCount < questions.length) {
    showQuestions(questionCount); // Mostra a próxima pergunta
    checkAnswerButton.textContent = "Check"; // Reseta o texto do botão
    checkAnswerButton.classList.remove("correct"); // Remove estilo do botão
    checkAnswerButton.removeEventListener("click", nextQuestion);
    checkAnswerButton.addEventListener("click", checkAnswer); // Reativa o evento de verificação
    selectedAnswer = ""; // Limpa a resposta selecionada
  } else {
    quizBox.style.display = "none"
    footer.style.display = "none"
    endScreen.style.display = "block"
    prevButton.style.display = "none"
    nextButton.style.display = "none"
    progressBar.style.display = "none"
    progressBarContainer.style.display = "none"
  }
}

// Função para resetar a pergunta após uma tentativa errada
function resetQuestion() {
  const boxOption = document.querySelectorAll(".option");
  boxOption.forEach(option => {
    option.classList.remove("correct", "wrong", "selected"); // Remove estilos das opções
  });

  checkAnswerButton.classList.remove("correct", "wrong", "active"); // Reseta o botão
  checkAnswerButton.textContent = "Check"; // Reseta o texto do botão

  checkAnswerButton.removeEventListener("click", resetQuestion);
  
  // Reativa a verificação da resposta
  checkAnswerButton.addEventListener("click", checkAnswer); 

  selectedAnswer = ""; // Limpa a resposta selecionada
}

// Função para atualizar a barra de progresso
function updateProgressBar() {
  const totalQuestions = questions.length;
  const progressPercentage = ((questionCount + 1) / totalQuestions) * 100; // Calcula a porcentagem de progresso
  progressBar.style.width = `${progressPercentage}%`; // Atualiza a largura da barra de progresso
}

// Função para atualizar os ícones de chevron
function updateChevronButtons(index) {
  if (index === 0) {
    // Se for a primeira pergunta, desativar o botão de voltar
    prevButton.classList.add("disabled");
  } else {
    // Se não for a primeira pergunta, ativar o botão de voltar
    prevButton.classList.remove("disabled");
  }

  // Para todas as perguntas, o botão da direita deve estar ativado
  nextButton.classList.remove("disabled");
}

// Eventos de clique para os ícones de chevron
prevButton.addEventListener("click", function() {
  if (questionCount > 0) {
    questionCount--; // Decrementa o contador da pergunta
    showQuestions(questionCount); // Mostra a pergunta anterior
  }
});

nextButton.addEventListener("click", function() {
  if (questionCount < questions.length - 1) {
    questionCount++; // Incrementa o contador da pergunta
    showQuestions(questionCount); // Mostra a próxima pergunta
  }
});
