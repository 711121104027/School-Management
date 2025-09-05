import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../AddSchool.css";

function AddSchool() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    contact: "",
    email_id: "",
  });
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onFile = (f) => {
    if (f && f[0]) setFile(f[0]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    onFile(e.dataTransfer.files);
  };

  const handleSubmit = async () => {
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("address", form.address);
    fd.append("city", form.city);
    fd.append("state", form.state);
    fd.append("contact", form.contact);
    fd.append("email_id", form.email_id);
    if (file) fd.append("image", file);

    const res = await fetch("http://127.0.0.1:5000/add-school", {
      method: "POST",
      body: fd,
    });

    if (res.ok) navigate("/view-school");
    else alert("Upload failed");
  };

  return (
    <div className="form-container">
      <form className="school-form" onDragEnter={handleDrag} onSubmit={(e)=>e.preventDefault()}>
        <label>Enter School Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter school name here"
          value={form.name}
          onChange={onChange}
        />

        <label>Address</label>
        <input
          type="text"
          name="address"
          placeholder="Enter address here"
          value={form.address}
          onChange={onChange}
        />

        <div className="row">
          <div className="col">
            <label>City</label>
            <input
              type="text"
              name="city"
              placeholder="Enter city"
              value={form.city}
              onChange={onChange}
            />
          </div>

          <div className="col">
            <label>State</label>
            <select name="state" value={form.state} onChange={onChange} defaultValue="">
              <option value="" disabled>
                select your state
              </option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Arunachal Pradesh">Arunachal Pradesh</option>
              <option value="Assam">Assam</option>
              <option value="Bihar">Bihar</option>
              <option value="Chhattisgarh">Chhattisgarh</option>
              <option value="Goa">Goa</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Haryana">Haryana</option>
              <option value="Himachal Pradesh">Himachal Pradesh</option>
              <option value="Jharkhand">Jharkhand</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Kerala">Kerala</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Manipur">Manipur</option>
              <option value="Meghalaya">Meghalaya</option>
              <option value="Mizoram">Mizoram</option>
              <option value="Nagaland">Nagaland</option>
              <option value="Odisha">Odisha</option>
              <option value="Punjab">Punjab</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Sikkim">Sikkim</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Telangana">Telangana</option>
              <option value="Tripura">Tripura</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Uttarakhand">Uttarakhand</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
              <option value="Chandigarh">Chandigarh</option>
              <option value="Dadra and Nagar Haveli and Daman and Diu">
                Dadra and Nagar Haveli and Daman and Diu
              </option>
              <option value="Delhi">Delhi</option>
              <option value="Jammu and Kashmir">Jammu and Kashmir</option>
              <option value="Ladakh">Ladakh</option>
              <option value="Lakshadweep">Lakshadweep</option>
              <option value="Puducherry">Puducherry</option>
            </select>
          </div>
        </div>

        <label>Contact Number</label>
        <input
          type="text"
          name="contact"
          placeholder="Enter contact number"
          value={form.contact}
          onChange={onChange}
        />

        <label>Enter School E-Mail ID</label>
        <input
          type="email"
          name="email_id"
          placeholder="Enter email"
          value={form.email_id}
          onChange={onChange}
        />

        <label>Add School Image</label>
        <div
          className={`upload-box ${dragActive ? "active" : ""}`}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          <div className="upload-content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#999999"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 16l-4-4-4 4" />
              <path d="M12 12v9" />
              <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 104 16.3" />
            </svg>
            <p>Drag and drop the image or Upload through files</p>
          </div>
          <input
            ref={fileRef}
            type="file"
            className="file-input"
            accept="image/*"
            onChange={(e) => onFile(e.target.files)}
          />
        </div>

        <div className="button-row">
          <button type="button" className="btn back-btn" onClick={() => navigate("/")}>
            Back
          </button>
          <button type="button" className="btn upload-btn" onClick={handleSubmit}>
            Upload details
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddSchool;
