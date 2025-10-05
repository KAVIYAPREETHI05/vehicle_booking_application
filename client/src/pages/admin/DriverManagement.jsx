// /src/pages/admin/DriverManagement.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/DriverManagement.css"; // Import the scoped CSS

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
  const [loading, setLoading] = useState(false);

  const initialFormState = {
    name: "",
    email: "",
    phone: "",
    experience: "",
    status: "available",
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/drivers");
      setDrivers(res.data);
    } catch (err) {
      console.error("Error fetching drivers:", err);
      alert(`Failed to load drivers: ${err.message}`);
      setDrivers([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" && !/^\d*$/.test(value)) return;
    if (name === "experience" && !/^\d*$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const driverData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        experience: parseInt(formData.experience) || 0,
        status: formData.status
      };

      const response = await axios.post(
        "http://localhost:5000/api/drivers", 
        driverData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      alert(`Driver added successfully! ID: ${response.data.driverId}`);
      setIsModalOpen(false);
      setFormData(initialFormState);
      fetchDrivers();
      
    } catch (error) {
      console.error("Error adding driver:", error);
      let errorMessage = "Failed to add driver";
      
      if (error.response) {
        errorMessage = error.response.data?.message || error.response.data?.error || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response from server. Check if backend is running.";
      } else {
        errorMessage = error.message;
      }
      
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(initialFormState);
  };

  return (
      <div className="main-content">
        <div className="table-container">
          <div className="table-header">
            <h2>Driver Management</h2>
            <button
              className="add-driver-btn"
              onClick={handleOpenModal}
            >
              + Add Driver
            </button>
          </div>

          <table className="drivers-table">
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
              {Array.isArray(drivers) && drivers.length > 0 ? (
                drivers.map(driver => (
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
                        className="driver-status-select"
                      >
                        <option value="available">Available</option>
                        <option value="unavailable">Unavailable</option>
                        <option value="on_leave">On Leave</option>
                        <option value="suspended">Suspended</option>
                        <option value="terminated">Terminated</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="driver-delete-btn"
                        onClick={() => handleDeleteDriver(driver.driver_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="driver-empty-state">
                    No drivers found. Click "Add Driver" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add Driver Modal */}
        {isModalOpen && (
          <div className="driver-modal-overlay" onClick={handleCloseModal}>
            <div className="driver-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="driver-form-container">
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  marginBottom: "20px"
                }}>
                  <h2 style={{ margin: 0 }}>Add New Driver</h2>
                  <button
                    onClick={handleCloseModal}
                    className="driver-modal-close"
                  >
                    ×
                  </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="driver-form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      minLength="2"
                      placeholder="Enter driver's full name"
                      disabled={loading}
                    />
                  </div>

                  <div className="driver-form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter email address"
                      disabled={loading}
                    />
                  </div>

                  <div className="driver-form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      maxLength="10"
                      minLength="10"
                      pattern="\d{10}"
                      placeholder="Enter 10-digit phone number"
                      disabled={loading}
                    />
                  </div>

                  <div className="driver-form-group">
                    <label htmlFor="experience">Experience (years) *</label>
                    <input
                      type="number"
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      required
                      min="0"
                      max="50"
                      placeholder="Enter years of experience"
                      disabled={loading}
                    />
                  </div>

                  <div className="driver-form-group">
                    <label htmlFor="status">Status *</label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    >
                      <option value="available">Available</option>
                      <option value="unavailable">Unavailable</option>
                      <option value="on_leave">On Leave</option>
                      <option value="suspended">Suspended</option>
                      <option value="terminated">Terminated</option>
                    </select>
                  </div>

                  <div className="driver-form-actions">
                    <button 
                      type="button" 
                      onClick={handleCloseModal}
                      className="driver-btn-secondary"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="driver-btn-primary"
                      disabled={loading}
                    >
                      {loading ? "Adding..." : "Add Driver"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default DriverManagement;