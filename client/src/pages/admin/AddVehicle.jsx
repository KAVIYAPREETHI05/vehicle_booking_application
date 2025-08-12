// /src/pages/admin/AddVehicle.js
import React, { useState } from "react";
import axios from "axios";
import "../../css/formStyle.css";

const AddVehicle = () => {
  const [formData, setFormData] = useState({
    vehicleId: "",
    vehicleType: "",
    vehicleNumber: "",
    capacity: "",
    status: "Available",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "vehicleId" && !/^\d*$/.test(value)) return; // Only numbers
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/vehicles/add", formData);
      alert("Vehicle added successfully!");
      setFormData({
        vehicleId: "",
        vehicleType: "",
        vehicleNumber: "",
        capacity: "",
        status: "Available",
      });
    } catch (error) {
      console.error("Error adding vehicle:", error);
      alert("Failed to add vehicle.");
    }
  };

  return (
    <div className="form-container">
      <h2>Add Vehicle</h2>
      <form onSubmit={handleSubmit}>
        <label>Vehicle ID</label>
        <input
          type="text"
          name="vehicleId"
          value={formData.vehicleId}
          onChange={handleChange}
          required
        />

        <label>Vehicle Type</label>
        <input
          type="text"
          name="vehicleType"
          value={formData.vehicleType}
          onChange={handleChange}
          required
        />

        <label>Vehicle Number</label>
        <input
          type="text"
          name="vehicleNumber"
          value={formData.vehicleNumber}
          onChange={handleChange}
          required
        />

        <label>Capacity</label>
        <select name="capacity" value={formData.capacity} onChange={handleChange} required>
          <option value="">Select Capacity</option>
          {[...Array(20)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>

        <label>Status</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="Available">Available</option>
          <option value="Unavailable">Unavailable</option>
        </select>

        <button type="submit">Add Vehicle</button>
      </form>
    </div>
  );
};

export default AddVehicle;
