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
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "vehicleId" && !/^\d*$/.test(value)) return; // Only numbers
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({...errors, [name]: ""});
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.vehicleId.trim()) newErrors.vehicleId = "Vehicle ID is required";
    if (!formData.vehicleType.trim()) newErrors.vehicleType = "Vehicle Type is required";
    if (!formData.vehicleNumber.trim()) newErrors.vehicleNumber = "Vehicle Number is required";
    if (!formData.capacity) newErrors.capacity = "Please select capacity";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
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
      alert("Failed to add vehicle. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Add Vehicle</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="vehicleId">Vehicle ID</label>
          <input
            type="text"
            id="vehicleId"
            name="vehicleId"
            value={formData.vehicleId}
            onChange={handleChange}
            className={errors.vehicleId ? "error" : ""}
            required
          />
          {errors.vehicleId && <span className="error-message">{errors.vehicleId}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="vehicleType">Vehicle Type</label>
          <input
            type="text"
            id="vehicleType"
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            className={errors.vehicleType ? "error" : ""}
            required
          />
          {errors.vehicleType && <span className="error-message">{errors.vehicleType}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="vehicleNumber">Vehicle Number</label>
          <input
            type="text"
            id="vehicleNumber"
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleChange}
            className={errors.vehicleNumber ? "error" : ""}
            required
          />
          {errors.vehicleNumber && <span className="error-message">{errors.vehicleNumber}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="capacity">Capacity</label>
          <select 
            id="capacity"
            name="capacity" 
            value={formData.capacity} 
            onChange={handleChange} 
            className={errors.capacity ? "error" : ""}
            required
          >
            <option value="">Select Capacity</option>
            {[...Array(20)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i === 0 ? "person" : "people"}
              </option>
            ))}
          </select>
          {errors.capacity && <span className="error-message">{errors.capacity}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select 
            id="status"
            name="status" 
            value={formData.status} 
            onChange={handleChange}
          >
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding Vehicle..." : "Add Vehicle"}
        </button>
      </form>
    </div>
  );
};

export default AddVehicle;