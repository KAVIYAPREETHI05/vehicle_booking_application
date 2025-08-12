import React from "react";
import { useParams } from "react-router-dom";
//import "../../css/DriverDashboard.css";

const DriverDashboard = () => {
const { driverID } = useParams();
  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h2>Welcome Driver: {driverID}</h2>
        <p>This is your dashboard where you can manage your rides.</p>
      </div>
    </div>
  );
};

export default DriverDashboard;
