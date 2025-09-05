import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../ViewSchool.css";

const API_URL = import.meta.env.VITE_API_URL;
function ViewSchool() {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await fetch(`${API_URL}/get-schools`);
      const data = await res.json();

      const updatedData = data.map((s) => ({
        ...s,
        image_url: s.image
          ? `${API_URL}/schoolImages/${s.image}`
          : null,
      }));
      setSchools(updatedData);
    })();
  }, []);

  const placeholder = "https://via.placeholder.com/150?text=No+Image";

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this school?")) return;

    try {
      const response = await fetch(`${API_URL}/delete-school/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSchools(schools.filter((s) => s.id !== id));
      } else {
        alert("Failed to delete school");
      }
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  return (
    <div className="view-school-container">
      <div className="top-buttons">
        <button className="back-btn" onClick={() => navigate("/")}>
          Back
        </button>
        <button className="add-btn" onClick={() => navigate("/add-school")}>
          + Add School
        </button>
      </div>

      <div className="school-list">
        {schools.map((s) => (
          <div key={s.id} className="school-card">
            <img
              src={s.image_url || placeholder}
              alt={s.name}
              className="school-img"
            />
            <div className="school-details">
              <p className="schoolname"><strong></strong> {s.name}</p>
              <p><strong>Location:</strong> {s.address}, {s.city}</p>
              <p><strong>State:</strong> {s.state}</p>
            </div>

            <button className="delete-btn" onClick={() => handleDelete(s.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewSchool;
