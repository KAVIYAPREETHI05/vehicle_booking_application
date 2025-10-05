import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";

export default function AssignDriver() {
  const [assignments, setAssignments] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    driver_id: "",
    vehicle_id: "",
    from_time: "",
    to_time: ""
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch drivers and vehicles
  const fetchDropdownData = async () => {
    try {
      setLoading(true);
      console.log("Fetching drivers and vehicles...");
      
      // ✅ UPDATED: Use admin assignment endpoints
      const driverRes = await axios.get("http://localhost:5000/api/admin/assignments/drivers");
      const vehicleRes = await axios.get("http://localhost:5000/api/admin/assignments/vehicles");
      
      console.log('Available Drivers:', driverRes.data);
      console.log('Available Vehicles:', vehicleRes.data);
      
      setDrivers(driverRes.data);
      setVehicles(vehicleRes.data);
    } catch (error) {
      console.error("Error fetching dropdown data", error);
      alert("Failed to load drivers or vehicles. Please check if backend is running.");
      setDrivers([]);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch assignments
  const fetchAssignments = async () => {
    try {
      console.log("Fetching assignments...");
      
      // ✅ UPDATED: Use admin assignments endpoint
      const res = await axios.get("http://localhost:5000/api/admin/assignments");
      console.log('Assignments:', res.data);
      setAssignments(res.data);
    } catch (error) {
      console.error("Error fetching assignments", error);
      alert("Failed to load assignments.");
      setAssignments([]);
    }
  };

  // Timer updater - UPDATED to use end_time
  useEffect(() => {
    const interval = setInterval(() => {
      setAssignments(prev =>
        prev.map(item => {
          const now = dayjs();
          const endTime = dayjs(item.end_time); // ✅ Use end_time
          const remaining = endTime.diff(now, "second");
          return { ...item, remaining };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchDropdownData();
    fetchAssignments();
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log("Submitting assignment:", formData);
      
      // ✅ UPDATED: Use admin assignments endpoint
      await axios.post("http://localhost:5000/api/admin/assignments", formData);
      alert("Driver assigned successfully!");
      setIsModalOpen(false);
      setFormData({
        driver_id: "",
        vehicle_id: "",
        from_time: "",
        to_time: ""
      });
      fetchAssignments();
      fetchDropdownData(); // refresh availability
    } catch (error) {
      console.error("Error assigning driver", error);
      alert(error.response?.data?.error || "Error assigning driver");
    } finally {
      setLoading(false);
    }
  };

  const formatRemainingTime = seconds => {
    if (seconds <= 0) return "Expired";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm("Are you sure you want to remove this assignment?")) return;
    
    try {
      // ✅ UPDATED: Use admin assignments endpoint
      await axios.delete(`http://localhost:5000/api/admin/assignments/${assignmentId}`);
      alert("Assignment removed successfully!");
      fetchAssignments();
      fetchDropdownData(); // refresh availability
    } catch (error) {
      console.error("Error deleting assignment:", error);
      alert(error.response?.data?.error || "Error removing assignment");
    }
  };

  // Set minimum datetime for from_time (current time)
  const getCurrentDateTime = () => {
    return dayjs().format('YYYY-MM-DDTHH:mm');
  };

  return (
    <div className="main-content">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>Driver Assignment</h1>
        <button
          style={{ 
            padding: "10px 20px", 
            background: "#0066cc", 
            color: "#fff", 
            border: "none", 
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px"
          }}
          onClick={() => setIsModalOpen(true)}
          disabled={loading}
        >
          {loading ? "Loading..." : "Assign Driver"}
        </button>
      </div>

      {/* Stats Summary */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
        gap: "15px", 
        marginBottom: "30px" 
      }}>
        <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px", textAlign: "center" }}>
          <h3 style={{ margin: "0 0 5px 0", color: "#333" }}>Available Drivers</h3>
          <p style={{ margin: "0", fontSize: "24px", fontWeight: "bold", color: "#28a745" }}>{drivers.length}</p>
        </div>
        <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px", textAlign: "center" }}>
          <h3 style={{ margin: "0 0 5px 0", color: "#333" }}>Available Vehicles</h3>
          <p style={{ margin: "0", fontSize: "24px", fontWeight: "bold", color: "#28a745" }}>{vehicles.length}</p>
        </div>
        <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px", textAlign: "center" }}>
          <h3 style={{ margin: "0 0 5px 0", color: "#333" }}>Active Assignments</h3>
          <p style={{ margin: "0", fontSize: "24px", fontWeight: "bold", color: "#007bff" }}>{assignments.length}</p>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <h2>Current Assignments</h2>
        
        {assignments.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
            <p>No active assignments found.</p>
            <p>Click "Assign Driver" to create a new assignment.</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <th style={{ padding: "12px", border: "1px solid #ddd", textAlign: "left" }}>Driver ID</th>
                <th style={{ padding: "12px", border: "1px solid #ddd", textAlign: "left" }}>Driver Name</th>
                <th style={{ padding: "12px", border: "1px solid #ddd", textAlign: "left" }}>Vehicle ID</th>
                <th style={{ padding: "12px", border: "1px solid #ddd", textAlign: "left" }}>Vehicle Number</th>
                <th style={{ padding: "12px", border: "1px solid #ddd", textAlign: "left" }}>Start Time</th>
                <th style={{ padding: "12px", border: "1px solid #ddd", textAlign: "left" }}>End Time</th>
                <th style={{ padding: "12px", border: "1px solid #ddd", textAlign: "left" }}>Remaining Time</th>
                <th style={{ padding: "12px", border: "1px solid #ddd", textAlign: "left" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "12px" }}>{a.driver_id}</td>
                  <td style={{ padding: "12px" }}>{a.driver_name}</td>
                  <td style={{ padding: "12px" }}>{a.vehicle_id}</td>
                  <td style={{ padding: "12px" }}>{a.vehicle_number}</td>
                  <td style={{ padding: "12px" }}>{dayjs(a.start_time).format("YYYY-MM-DD HH:mm")}</td>
                  <td style={{ padding: "12px" }}>{dayjs(a.end_time).format("YYYY-MM-DD HH:mm")}</td>
                  <td style={{ 
                    padding: "12px", 
                    fontWeight: "bold",
                    color: a.remaining <= 0 ? "#dc3545" : a.remaining <= 3600 ? "#ffc107" : "#28a745"
                  }}>
                    {formatRemainingTime(a.remaining)}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <button
                      style={{
                        padding: "6px 12px",
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}
                      onClick={() => handleDeleteAssignment(a.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "white",
            padding: "30px",
            borderRadius: "12px",
            width: "90%",
            maxWidth: "500px",
            maxHeight: "90vh",
            overflow: "auto"
          }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              marginBottom: "20px"
            }}>
              <h2 style={{ margin: 0 }}>Assign Driver to Vehicle</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#666"
                }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Driver</label>
                <select 
                  name="driver_id" 
                  value={formData.driver_id} 
                  onChange={handleChange} 
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "16px"
                  }}
                >
                  <option value="">Select Driver</option>
                  {drivers.map(d => (
                    <option key={d.driver_id} value={d.driver_id}>
                      {d.driver_id} - {d.name} ({d.status})
                    </option>
                  ))}
                </select>
                {drivers.length === 0 && (
                  <p style={{ color: "#dc3545", fontSize: "14px", margin: "5px 0 0 0" }}>
                    No available drivers found. Please add drivers first.
                  </p>
                )}
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Vehicle</label>
                <select 
                  name="vehicle_id" 
                  value={formData.vehicle_id} 
                  onChange={handleChange} 
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "16px"
                  }}
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map(v => (
                    <option key={v.vehicleId} value={v.vehicleId}>
                      {v.vehicleId} - {v.vehicleNumber} ({v.vehicleType})
                    </option>
                  ))}
                </select>
                {vehicles.length === 0 && (
                  <p style={{ color: "#dc3545", fontSize: "14px", margin: "5px 0 0 0" }}>
                    No available vehicles found. Please add vehicles first.
                  </p>
                )}
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Start Time</label>
                <input 
                  type="datetime-local" 
                  name="from_time" 
                  value={formData.from_time} 
                  onChange={handleChange} 
                  required
                  min={getCurrentDateTime()}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "16px"
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>End Time</label>
                <input 
                  type="datetime-local" 
                  name="to_time" 
                  value={formData.to_time} 
                  onChange={handleChange} 
                  required
                  min={formData.from_time || getCurrentDateTime()}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "16px"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: "10px 20px",
                    background: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "16px"
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading || drivers.length === 0 || vehicles.length === 0}
                  style={{
                    padding: "10px 20px",
                    background: loading ? "#6c757d" : "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontSize: "16px",
                    opacity: loading ? 0.6 : 1
                  }}
                >
                  {loading ? "Assigning..." : "Assign Driver"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}