// /src/pages/admin/DriverManagement.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/formStyle.css";
import "../../css/tableStyle.css";

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    status: "available",
  });

  // Initial form state for reset
  const initialFormState = {
    name: "",
    email: "",
    phone: "",
    experience: "",
    status: "available",
  };

  // Fetch drivers on component mount
  useEffect(() => {
    fetchDrivers();
  }, []);


const fetchDrivers = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/drivers");
    console.log("API Response:", res.data); // <-- Check what this actually is
    setDrivers(res.data);
  } catch (err) {
    console.error("Error fetching drivers:", err);
    setDrivers([]); // fallback to empty array
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" && !/^\d*$/.test(value)) return; // Only numbers for phone
    if (name === "experience" && !/^\d*$/.test(value)) return; // Only numbers for experience
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const response = await axios.post("http://localhost:5000/api/drivers", {
        ...formData,
        experience: parseInt(formData.experience) || 0 // Ensure number with fallback
      });
      
      alert(`Driver added! ID: ${response.data.driver_id}`);
      setIsModalOpen(false);
      setFormData(initialFormState);
      fetchDrivers();
    } catch (error) {
      console.error("Error adding driver:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleStatusChange = async (driver_id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/drivers/${driver_id}/status`, {
        status: newStatus,
      });
      fetchDrivers();
    } catch (error) {
      console.error("Error updating driver status:", error);
      alert(`Failed to update status: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeleteDriver = async (driver_id) => {
    if (!window.confirm("Are you sure you want to delete this driver?")) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/drivers/${driver_id}`);
      alert("Driver deleted successfully");
      fetchDrivers();
    } catch (error) {
      console.error("Error deleting driver:", error);
      alert(`Error deleting driver: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="dashboard-layout">
      <div className="main-content">
        <div className="table-container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>Driver Management</h2>
            <button
              className="add-button"
              onClick={() => setIsModalOpen(true)}
              style={{
                backgroundColor: "#0066cc",
                color: "white",
                padding: "10px 15px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              + Add Driver
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Driver ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Experience (years)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
{Array.isArray(drivers) && drivers.map(driver => (
                <tr key={driver.driver_id}>
                  <td>{driver.driver_id}</td>
                  <td>{driver.name}</td>
                  <td>{driver.email}</td>
                  <td>{driver.phone}</td>
                  <td>{driver.experience}</td>
                  <td>
                    <select
                      value={driver.status}
                      onChange={(e) => handleStatusChange(driver.driver_id, e.target.value)}
                      className="status-select"
                    >
                      <option value="on_duty">Available</option>
                      <option value="on_duty">Unavailable</option>
                      <option value="on_leave">On Leave</option>
                      <option value="suspended">Suspended</option>
                      <option value="terminated">Terminated</option>
                    </select>
                  </td>
                  <td>
                    <button
                      style={{
                        backgroundColor: "#ff4d4f",
                        color: "white",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        border: "none",
                        cursor: "pointer",
                      }}
                      onClick={() => {  console.log('Deleting driver with id:', driver.driver_id); handleDeleteDriver(driver.driver_id)}}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Driver Modal */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="form-container">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2>Add New Driver</h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "20px",
                      cursor: "pointer",
                      color: "#666",
                    }}
                  >
                    ×
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    minLength="2"
                  />

                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    maxLength="10"
                    minLength="10"
                    pattern="\d{10}"
                  />

                  <label>Experience (years)</label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                    min="0"
                    max="50"
                  />

                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="on_duty">On Duty</option>
                    <option value="on_leave">On Leave</option>
                    <option value="suspended">Suspended</option>
                    <option value="terminated">Terminated</option>
                  </select>

                  <button type="submit">Add Driver</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverManagement;