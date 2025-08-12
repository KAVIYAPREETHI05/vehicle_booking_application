import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../css/tableStyle.css';

const CompletedRides = () => {
  const { driverID } = useParams(); // get driverID from route like /driver/:driverID/completed
  const [rides, setRides] = useState([]);

  useEffect(() => {
    if (driverID) {
      fetchCompletedRides();
    }
  }, [driverID]);

  const fetchCompletedRides = async () => {
    try {
      console.log('Fetching completed rides for driver:', driverID);
      const res = await axios.get(`http://localhost:5000/api/bookings/completed/${driverID}`);
      setRides(res.data);
    } catch (error) {
      console.error('Error fetching completed rides:', error);
    }
  };

  return (
    <div className="completed-rides-container">
      <div className="main-content">
        <div className="table-container">
          <h2>Completed Rides</h2>
          {rides.length === 0 ? (
            <p>No completed rides found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Passenger ID</th>
                  <th>Pickup</th>
                  <th>Time</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {rides.map((ride) => (
                  <tr key={ride.id}>
                    <td>{ride.id}</td>
                    <td>{ride.passID}</td>
                    <td>{ride.pickup}</td>
                    <td>{ride.time}</td>
                    <td>{ride.reason}</td>
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

export default CompletedRides;
