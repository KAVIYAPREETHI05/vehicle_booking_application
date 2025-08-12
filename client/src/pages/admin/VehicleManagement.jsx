import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../css/tableStyle.css";

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/vehicles/list");
      setVehicles(res.data);
    } catch (error) {
      console.error("Failed to fetch vehicles", error);
    }
  };

  const handleStatusChange = async (vehicleId, newStatus) => {
    try {
      await axios.put("http://localhost:5000/api/vehicles/update-status", {
        vehicleId,
        status: newStatus,
      });
      fetchVehicles();
    } catch (error) {
      console.error("Status update failed", error);
    }
  };

  return (
    <div className="dashboard-layout">
      <div className="main-content">
        <div className="table-container">
          <h2>Vehicle Management</h2>
          <table>
            <thead>
              <tr>
                <th>Vehicle ID</th>
                <th>Type</th>
                <th>Number</th>
                <th>Capacity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.vehicleId}>
                  <td>{vehicle.vehicleId}</td>
                  <td>{vehicle.vehicleType}</td>
                  <td>{vehicle.vehicleNumber}</td>
                  <td>{vehicle.capacity}</td>
                  <td>
                    <select
                      value={vehicle.status}
                      onChange={(e) =>
                        handleStatusChange(vehicle.vehicleId, e.target.value)
                      }
                    >
                      <option value="Available">Available</option>
                      <option value="Unavailable">Unavailable</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VehicleManagement;
