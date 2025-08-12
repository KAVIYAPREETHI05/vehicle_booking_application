import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../css/auth.css";
const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "passenger",
  });
  const [generatedId, setGeneratedId] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    return email.endsWith("@bitsathy.ac.in");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      alert("Only @bitsathy.ac.in email addresses are allowed.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", formData);
      setGeneratedId(res.data.generatedId);
      alert(`User created! ID: ${res.data.generatedId}`);
      setFormData({ email: "", password: "", role: "passenger" });
    } catch (err) {
      alert("Signup failed: " + err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="auth-container">
      <h2>Admin - Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="BITS Email"
          required
          onChange={handleChange}
          value={formData.email}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
          value={formData.password}
        />
        <select name="role" onChange={handleChange} value={formData.role}>
          <option value="passenger">Passenger</option>
          <option value="driver">Driver</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Signup</button>
      </form>
      {generatedId && (
        <p>
          Generated ID: <strong>{generatedId}</strong>
        </p>
      )}
      <p className="auth-link">
        Already have an account?{" "}
        <span style={{ color: "blue", cursor: "pointer" }} onClick={() => navigate("/login")}>
          Login
        </span>
      </p>
    </div>
  );
};

export default SignupPage;
