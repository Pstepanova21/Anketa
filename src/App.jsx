import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Form from "./components/Form/Form";

function App() {
  const [formAnswers, setFormAnswers] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/form");
  }, [navigate]);

  const handleSelectForm = (formAnswers) => {
    setFormAnswers(formAnswers);
  };

  const sendDataToBackend = async () => {
    const formData = new FormData();

    Object.entries(formAnswers).forEach(([key, value]) => {
      formData.set(key, value);
    });

    try {
      const response = await fetch("https://shv-back.itc-hub.ru/api/v1/form", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
          navigate("/form");
        }, 2000);
      } else {
        console.error("Error sending data to backend:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending data to backend:", error);
    }
    localStorage.removeItem("answersForm");
  };

  return (
    <div>
      <Routes>
        <Route
          path="/form"
          element={
            <Form
              sendDataToBackend={sendDataToBackend}
              handleSelectForm={handleSelectForm}
            />
          }
        />
      </Routes>
      {showSuccessMessage && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            padding: "20px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "20px",
            border: "2px solid black",
            zIndex: 10,
            color: "black",
            fontSize: "30px",
            textAlign: "center",
          }}
        >
          Ваша анкета сохранена
        </div>
      )}
    </div>
  );
}

export default App;
