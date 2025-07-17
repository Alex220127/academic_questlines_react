import React, { useEffect, useState } from 'react';
import '../styles/Question.css'; // Importa o CSS

const QuestionLayout = ({ questionData, handleQuestionSubmission }) => {
  // Estado para armazenar a alternativa selecionada pelo usuário
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  // Estado para saber se a questão já foi "enviada"
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (questionData && questionData.status === 'completed') {
      setSelectedAnswer(questionData.question.correct_answer);
      setSubmitted(true); // Se já está completada, a resposta já foi "enviada"
    }
  }, [questionData])

  // Validação básica para garantir que os dados da questão existem
  if (!questionData || !questionData.question || !questionData.question.alternatives) {
    return (
      <div className="question-container">
        <p className="question-error">Dados da questão não disponíveis ou incompletos.</p>
      </div>
    );
  }

  const { name, question } = questionData;
  const { title, alternatives, correct_answer } = question;

  // Função para lidar com a seleção de uma alternativa
  const handleOptionChange = (event) => {
    if (!submitted) { // Só permite mudar a seleção se ainda não foi enviado
      setSelectedAnswer(event.target.value);
    }
  };

  // Função para "enviar" a resposta (simulação)
  const handleSubmit = async () => {
    setSubmitted(true);

    if (selectedAnswer === correct_answer) {
      await handleQuestionSubmission()
    }
    // Aqui você adicionaria a lógica real de envio para um backend, etc.
    // Como solicitado, não há ações complexas nos botões por enquanto.
  };

  return (
    <div className="question-container">
      <h3 className="question-name">{name}</h3> {/* Título do questionário */}
      <p className="question-title">{title}</p> {/* Pergunta principal */}

      <div className="alternatives-list">
        {alternatives.map((alt, index) => {
          const optionNumber = String(index + 1); // Ex: "1", "2", "3", "4"
          const isCorrect = (submitted && optionNumber === correct_answer);
          const isWrongSelected = submitted && selectedAnswer === optionNumber && selectedAnswer !== correct_answer;

          return (
            <label
              key={index}
              className={`alternative-item
                ${isCorrect ? 'correct-answer' : ''}
                ${isWrongSelected ? 'wrong-answer' : ''}`}
            >
              <input
                type="radio"
                name="question-option" // Todos os rádios com o mesmo "name" para seleção única
                value={optionNumber}
                checked={selectedAnswer === optionNumber}
                onChange={handleOptionChange}
                disabled={submitted} // Desabilita os botões após o envio
              />
              <span className="alternative-text">{alt}</span>
            </label>
          );
        })}
      </div>

      <button
        className="question-submit-button"
        onClick={handleSubmit}
        // Desabilita o botão se já foi enviado ou se nenhuma alternativa foi selecionada
        disabled={submitted || selectedAnswer === null || questionData.status === 'completed'}
      >
        {submitted ? 'Resposta Enviada!' : 'Enviar Resposta'}
      </button>

      {/* Feedback de resposta (aparece apenas após o envio) */}
      {submitted && (
        <div className="feedback-message">
          {selectedAnswer === correct_answer ? (
            <p className="feedback-correct">✅ Parabéns! Resposta Correta!</p>
          ) : (
            <p className="feedback-wrong">❌ Resposta Incorreta. A resposta correta era: {correct_answer}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionLayout;
