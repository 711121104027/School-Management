import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import schoolImg from "./assets/schoolimage.png";
import schoolImg1 from "./assets/schoolimage1.png";
import AddSchool from "./pages/AddSchool";
import ViewSchool from "./pages/ViewSchool";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="card">
        <img src={schoolImg} alt="Add School" className="school-img" />
        <button className="btn" onClick={() => navigate("/add-school")}>
          + Add School
        </button>
      </div>

      <div className="card1">
        <img src={schoolImg1} alt="View School" className="school-img" />
        <button className="btn" onClick={() => navigate("/view-school")}>
          View School
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/add-school" element={<AddSchool />} />
      <Route path="/view-school" element={<ViewSchool />} />
    </Routes>
  );
}

export default App;
