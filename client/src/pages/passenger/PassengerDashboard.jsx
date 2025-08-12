import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../css/dashboardStyle.css';

const PassengerDashboard = () => {
  const { passengerID } = useParams();
  const [counts, setCounts] = useState({
    total: 0,
    completed: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetchRideStats();
  }, []);

  const fetchRideStats = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/bookings/counts/${passengerID}`);
      setCounts(res.data);
    } catch (error) {
      console.error('Stats fetch failed:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">
        <div className="card card-blue">
          <span>Total Rides</span>
          <h2>{counts.total}</h2>
        </div>
        <div className="card card-green">
          <span>Completed</span>
          <h2>{counts.completed}</h2>
        </div>
        <div className="card card-red">
          <span>Rejected</span>
          <h2>{counts.rejected}</h2>
        </div>
      </div>
    </div>
  );
};

export default PassengerDashboard;
