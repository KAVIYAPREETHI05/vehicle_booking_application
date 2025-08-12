import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../css/tableStyle.css';

const AcceptedRides = () => {
  const { driverID: paramID } = useParams();  // from route if exists
  const driverID = localStorage.getItem('driverID') || paramID;
  const [acceptedRides, setAcceptedRides] = useState([]);

  useEffect(() => {
    if (driverID) {
      fetchAcceptedRides();
    } else {
      console.error('No driverID found');
    }
  }, [driverID]);

  const fetchAcceptedRides = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/bookings/accepted/${driverID}`);
      setAcceptedRides(res.data);
    } catch (error) {
      console.error('Error fetching accepted rides:', error);
    }
  };

  // const handleComplete = async (bookingId) => {
  //   const confirm = window.confirm('Mark this ride as completed?');
  //   if (!confirm) return;

  //   try {
  //     await axios.put(`http://localhost:5000/api/bookings/complete/${bookingId}`);
  //     fetchAcceptedRides(); // Refresh list
  //   } catch (error) {
  //     console.error('Error marking complete:', error);
  //     alert(error.response?.data?.error || 'Failed to complete ride');
  //   }
  // };
const markAsCompleted = async (bookingId) => {
  try {
    await axios.put(`http://localhost:5000/api/bookings/complete/${bookingId}`);
    fetchAcceptedRides(); // refresh list
  } catch (error) {
    console.error('Error completing ride:', error);
  }
};


  return (
    <div className="ride-requests">
        <div className="main-content">
    <div className="table-container">
      <h2>Accepted Rides</h2>
      {acceptedRides.length === 0 ? (
        <p>No accepted rides found.</p>
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
            {acceptedRides.map((ride) => (
              <tr key={ride.id}>
                <td>{ride.passID}</td>
                <td>{ride.pickup}</td>
                <td>{ride.time}</td>
                <td>{ride.reason}</td>
                <td>
                  <button onClick={() => markAsCompleted(ride.id)} className="complete-btn">
  Mark as Completed
</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </div></div>
  );
};

export default AcceptedRides;
