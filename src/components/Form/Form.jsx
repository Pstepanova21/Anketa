import React, { useState } from "react";
import "./Form.css";

const Form = ({ initialQuestions = [], sendDataToBackend }) => {
  const [questions, setQuestions] = useState(
    initialQuestions.map((question) => ({
      ...question,
      answer: "",
    }))
  );
  const [editingMode, setEditingMode] = useState(true);

  const updateQuestion = (id, key, value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === id ? { ...question, [key]: value } : question
      )
    );
  };

  const updateOptionText = (questionId, optionId, text) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.map((option) =>
                option.id === optionId ? { ...option, text } : option
              ),
            }
          : question
      )
    );
  };

  const addQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      {
        id: prevQuestions.length + 1,
        questionText: "",
        answerType: "",
        answer: "",
        options: [],
      },
    ]);
  };

  const removeQuestion = (id) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((question) => question.id !== id)
    );
  };

  const addOption = (questionId) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: [
                ...question.options,
                { id: question.options.length + 1, text: "" },
              ],
            }
          : question
      )
    );
  };

  const removeOption = (questionId, optionId) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.filter(
                (option) => option.id !== optionId
              ),
            }
          : question
      )
    );
  };

  const saveForm = () => {
    sendDataToBackend(questions);
    setEditingMode(false);
  };

  const renderAnswerField = (question) => {
    switch (question.answerType) {
      case "textarea":
        return (
          <textarea
            value={question.answer}
            onChange={(e) =>
              updateQuestion(question.id, "answer", e.target.value)
            }
            rows={4}
            className={`question-textarea ${question.answer && "filled"}`}
            disabled={editingMode}
          />
        );
      case "range":
        return (
          <div className="slider-container">
            <input
              type="range"
              min="1"
              max="10"
              value={question.answer || "1"}
              onChange={(e) =>
                updateQuestion(question.id, "answer", e.target.value)
              }
              className={`slider ${question.answer && "filled"}`}
              disabled={editingMode}
            />
            <span className="slider-value">{question.answer || "1"}</span>
          </div>
        );
      case "checkboxes":
        return (
          <div>
            {question.options.map((option, index) => (
              <div key={option.id} className="option-container">
                <input
                  type="checkbox"
                  checked={question.answer.includes(option.id)}
                  onChange={(e) =>
                    updateQuestion(
                      question.id,
                      "answer",
                      e.target.checked
                        ? [...question.answer, option.id]
                        : question.answer.filter((id) => id !== option.id)
                    )
                  }
                  className="option-checkbox"
                  disabled={editingMode}
                />
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) =>
                    updateOptionText(question.id, option.id, e.target.value)
                  }
                  placeholder={`Вариант ответа ${index + 1}`}
                  className={`option-input ${option.text && "filled"}`}
                  disabled={!editingMode}
                />
                {editingMode && (
                  <button
                    type="button"
                    onClick={() => removeOption(question.id, option.id)}
                    className="small-button"
                  >
                    Удалить
                  </button>
                )}
              </div>
            ))}
            {editingMode && (
              <button
                type="button"
                onClick={() => addOption(question.id)}
                className="small-button"
              >
                Добавить вариант ответа
              </button>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="Form">
      <form className="anketa">
        <h2 className="p">Ответь на вопросы ниже</h2>

        {questions.map((question) => (
          <div key={question.id} className="question-container">
            <input
              type="text"
              value={question.questionText}
              onChange={(e) =>
                updateQuestion(question.id, "questionText", e.target.value)
              }
              placeholder="Введите вопрос"
              className={`question-input ${question.questionText && "filled"}`}
              disabled={!editingMode}
            />
            {editingMode && (
              <select
                value={question.answerType}
                onChange={(e) =>
                  updateQuestion(question.id, "answerType", e.target.value)
                }
                className="question-select"
              >
                <option value="">Выберите тип ответа</option>
                <option value="textarea">Текстовое поле</option>
                <option value="range">Оценка (от 1 до 10)</option>
                <option value="checkboxes">Чекбоксы</option>
              </select>
            )}
            {renderAnswerField(question)}
            {editingMode && (
              <button
                type="button"
                onClick={() => removeQuestion(question.id)}
                className="remove-question-button"
              >
                Удалить вопрос
              </button>
            )}
          </div>
        ))}

        {editingMode ? (
          <>
            <button
              type="button"
              onClick={addQuestion}
              className="add-question-button"
            >
              Добавить вопрос
            </button>
            <button type="button" onClick={saveForm} className="submit-button">
              Сохранить
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setEditingMode(true)}
            className="submit-button"
          >
            Изменить
          </button>
        )}
      </form>
    </div>
  );
};

export default Form;
