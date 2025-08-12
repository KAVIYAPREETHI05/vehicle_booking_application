import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/tableStyle.css'; // Adjust path if needed

const RideRequests = () => {
  const [rideRequests, setRideRequests] = useState([]);

  useEffect(() => {
    fetchRideRequests();
  }, []);

  const fetchRideRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bookings/requested');
      setRideRequests(res.data);
    } catch (error) {
      console.error('Error fetching ride requests:', error);
    }
  };
const driverID = localStorage.getItem('driverID');

const handleAccept = async (bookingId) => {
  const confirm = window.confirm('Accept this ride?');
  if (!confirm) return;

  try {
    await axios.put(`http://localhost:5000/api/bookings/accept/${bookingId}`, {
      driverID, // ✅ send driverID in body
    });
    fetchRideRequests(); // Refresh list
  } catch (error) {
    console.error('Error accepting ride:', error);
    alert(error.response?.data?.error || 'Failed to accept ride');
  }
};


  return (
     <div className="dashboard-layout">
      <div className="main-content">
    <div className="table-container">
      <h2>Ride Requests</h2>
      {rideRequests.length === 0 ? (
        <p>No ride requests found.</p>
      ) : (
        <table className="ride-table">
          <thead>
            <tr>
              <th>Passenger ID</th>
              <th>Pickup</th>
              <th>Time</th>
              <th>Reason</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rideRequests.map((ride) => (
              <tr key={ride.id}>
                <td>{ride.passID}</td>
                <td>{ride.pickup}</td>
                <td>{ride.time}</td>
                <td>{ride.reason}</td>
                <td>
                  <button
                    className="accept-button"
                    onClick={() => handleAccept(ride.id)}
                  >
                    Accept
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </div>
    </div>
  );
};

export default RideRequests;
