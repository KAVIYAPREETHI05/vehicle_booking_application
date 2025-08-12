import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "../../css/auth.css";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    id: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", loginData);
    alert("Login successful!");

    const { token, user } = res.data;

    localStorage.setItem("token", token);

    // ✅ Store ID based on role
    if (user.role === "passenger") {
      localStorage.setItem("passID", user.generated_id);
      navigate(`/users/passenger/${user.generated_id}/dashboard`);
    } else if (user.role === "driver") {
      localStorage.setItem("driverID", user.generated_id); // ✅ STORE DRIVER ID
      navigate(`/users/drivers/${user.generated_id}/dashboard`);
    } else if (user.role === "admin") {
      navigate(`/admin/dashboard`);
    } else {
      alert("Invalid user role.");
    }

  } catch (err) {
    alert("Login failed: " + (err.response?.data?.message || "Server error"));
  }
};



  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="id"
          placeholder="Student ID or Driver ID"
          required
          onChange={handleChange}
          value={loginData.id}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
          value={loginData.password}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
