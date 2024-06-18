import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Form from "./components/Form/Form";

function App() {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/form");
  }, [navigate]);

  const sendDataToBackend = async (formAnswers) => {
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
          element={<Form sendDataToBackend={sendDataToBackend} />}
        />
      </Routes>
      {showSuccessMessage && (
        <div className="success-message">Ваша анкета сохранена</div>
      )}
    </div>
  );
}

export default App;
