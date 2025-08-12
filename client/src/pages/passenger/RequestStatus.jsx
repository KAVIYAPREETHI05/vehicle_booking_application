import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/tableStyle.css';
import { useParams } from 'react-router-dom';

const RequestStatusPage = () => {
  const { passengerID } = useParams();
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');


  useEffect(() => {
    fetchBookingStatus();
  }, []);

  const fetchBookingStatus = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/bookings/status/${passengerID}`);
      setBookings(res.data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  };

const handleCancel = async (bookingId) => {
  const confirmCancel = window.confirm('Are you sure you want to cancel this booking?');
  if (!confirmCancel) return;

  try {
    await axios.put(`http://localhost:5000/api/bookings/cancel/${bookingId}`);
    fetchBookingStatus(); // Refresh the booking data after cancellation
  } catch (error) {
    console.error('Cancel failed:', error);
    alert(error.response?.data?.error || 'Cancellation failed');
  }
};



  return (
    <div className="dashboard-layout">
      <div className="main-content">
    <div className="table-container">
      <h2>Your Vehicle Booking Status</h2>
      
      <table>
        <thead>
          <tr>
            <th>Vehicle ID</th>
            <th>Place</th>
            <th>Time</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Cancel</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 ? (
            <tr><td colSpan="6">No bookings found</td></tr>
          ) : (
            bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.vehicleId}</td>
                <td>{booking.place}</td>
                <td>{booking.time}</td>
                <td>{booking.reason}</td>
                <td>
                  <span
                    style={{
                      color: booking.status === 'Accepted' ? 'green' : 'orange',
                      fontWeight: 'bold'
                    }}
                  >
                    {booking.status}
                  </span>
                </td>
                <td>
                  {booking.status === 'Requested' && (
                    <button
                      style={{
                        backgroundColor: 'red',
                        color: 'white',
                        padding: '5px 10px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleCancel(booking.id)}
                      disabled={booking.status !== 'Requested'}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>
      </div>
    </div>
  );
};

export default RequestStatusPage;
