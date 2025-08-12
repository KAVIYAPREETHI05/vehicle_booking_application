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

  // Fetch drivers and vehicles
  const fetchDropdownData = async () => {
    try {
      const driverRes = await axios.get("http://localhost:5000/api/assignments/drivers?status=on_duty");
      const vehicleRes = await axios.get("http://localhost:5000/api/assignments/vehicles?status=Available");
      setDrivers(driverRes.data);
      setVehicles(vehicleRes.data);
    } catch (error) {
      console.error("Error fetching dropdown data", error);
    }
  };

  // Fetch assignments
  const fetchAssignments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/assignments");
      setAssignments(res.data);
    } catch (error) {
      console.error("Error fetching assignments", error);
    }
  };

  // Timer updater
  useEffect(() => {
    const interval = setInterval(() => {
      setAssignments(prev =>
        prev.map(item => {
          const now = dayjs();
          const toTime = dayjs(item.to_time);
          const remaining = toTime.diff(now, "second");
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
      await axios.post("http://localhost:5000/api/assignments", formData);
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
      alert(error.response?.data?.message || "Error assigning driver");
    }
  };

  const formatRemainingTime = seconds => {
    if (seconds <= 0) return "Expired";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div className="main-content">
      {/* Button */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          style={{ padding: "10px 20px", background: "#0066cc", color: "#fff", border: "none", borderRadius: "8px" }}
          onClick={() => setIsModalOpen(true)}
        >
          Assign Driver
        </button>
      </div>

      {/* Table */}
      <div className="table-container">
        <h2>Assigned Drivers</h2>
        <table>
          <thead>
            <tr>
              <th>Driver ID</th>
              <th>Driver Name</th>
              <th>Vehicle ID</th>
              <th>Vehicle Number</th>
              <th>From Time</th>
              <th>To Time</th>
              <th>Remaining Time</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a, idx) => (
              <tr key={idx}>
                <td>{a.driver_id}</td>
                <td>{a.driver_name}</td>
                <td>{a.vehicle_id}</td>
                <td>{a.vehicle_number}</td>
                <td>{dayjs(a.from_time).format("YYYY-MM-DD HH:mm")}</td>
                <td>{dayjs(a.to_time).format("YYYY-MM-DD HH:mm")}</td>
                <td>{formatRemainingTime(a.remaining)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="form-container">
              <h2>Assign Driver to Vehicle</h2>
              <form onSubmit={handleSubmit}>
                <label>Driver</label>
                <select name="driver_id" value={formData.driver_id} onChange={handleChange} required>
                  <option value="">Select Driver</option>
                  {drivers.map(d => (
                    <option key={d.driver_id} value={d.driver_id}>
                      {d.driver_id} - {d.name}
                    </option>
                  ))}
                </select>

                <label>Vehicle</label>
                <select name="vehicle_id" value={formData.vehicle_id} onChange={handleChange} required>
                  <option value="">Select Vehicle</option>
                  {vehicles.map(v => (
                    <option key={v.vehicleId} value={v.vehicleId}>
                      {v.vehicleId} - {v.vehicleNumber}
                    </option>
                  ))}
                </select>

                <label>From Time</label>
                <input type="datetime-local" name="from_time" value={formData.from_time} onChange={handleChange} required />

                <label>To Time</label>
                <input type="datetime-local" name="to_time" value={formData.to_time} onChange={handleChange} required />

                <button type="submit">Assign</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
