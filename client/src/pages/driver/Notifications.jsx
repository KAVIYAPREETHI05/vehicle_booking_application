import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/notification.css';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [acceptedRides, setAcceptedRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState('');

  const driverID = localStorage.getItem('driverID');

  useEffect(() => {
    if (driverID) {
      fetchNotifications();
      fetchAcceptedRides();
      setupRealTimeUpdates();
    }
  }, [driverID]);

//   const fetchNotifications = async () => {
//     try {
//       // Correct endpoint
// const res = await axios.get(`http://localhost:5000/api/notifications/driver/${driverID}`);
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//     }
//   };

const fetchNotifications = async () => {
  try {
    // ❌ This is incomplete - you're not setting the notifications state
    const res = await axios.get(`http://localhost:5000/api/notifications/driver/${driverID}`);
    
    // ✅ Add this line to actually set the notifications
    setNotifications(res.data);
    
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
};

  const fetchAcceptedRides = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/bookings/accepted-rides-driver/${driverID}`);
      setAcceptedRides(res.data);
    } catch (error) {
      console.error('Error fetching accepted rides:', error);
    }
  };

  const setupRealTimeUpdates = () => {
    const interval = setInterval(() => {
      fetchNotifications();
      fetchAcceptedRides();
    }, 10000);
    return () => clearInterval(interval);
  };

  const sendArrivalNotification = async (passID, bookingId, place) => {
    try {
      await axios.post('http://localhost:5000/api/notifications/', {
        type: 'arrival',
        message: `Driver has arrived at ${place}`,
        driver_id: driverID,
        passID: passID,
        booking_id: bookingId
      });
      alert(`Arrival notification sent to passenger!`);
      fetchNotifications();
    } catch (error) {
      console.error('Error sending arrival notification:', error);
      alert('Failed to send arrival notification');
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${notificationId}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/notifications/driver/${driverID}`);
      fetchNotifications();
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  // Check if arrived button should be enabled for a ride
  const isArrivedButtonEnabled = (rideTime) => {
    if (!rideTime) return false;
    
    try {
      const now = new Date();
      const [hours, minutes] = rideTime.split(':');
      
      if (!hours || !minutes) return false;
      
      const rideDateTime = new Date();
      rideDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      return now >= rideDateTime;
    } catch (error) {
      console.error('Error checking arrived button:', error);
      return false;
    }
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return 'Time not set';
    
    try {
      const [hours, minutes] = timeString.split(':');
      
      if (!hours || !minutes) return 'Invalid time';
      
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid time';
    }
  };

  // Get selected ride details
  const getSelectedRideDetails = () => {
    if (!selectedRide) return null;
    return acceptedRides.find(ride => ride.id === parseInt(selectedRide));
  };

  if (!driverID) {
    return (
      <div className="dashboard-layout">
        <div className="main-content">
          <div className="notification-container">
            <h2>Notifications</h2>
            <p>Please log in as a driver to view this page.</p>
          </div>
        </div>
      </div>
    );
  }

  const selectedRideDetails = getSelectedRideDetails();

  return (
    <div className="dashboard-layout">
      <div className="main-content">
        <div className="notification-container">
          <h2>Driver Notifications</h2>
          
          {/* Quick Actions Section */}
          <div className="quick-actions-section">
            <h3>Send Arrival Notification</h3>
            <div className="ride-selector">
              <label>Select Ride:</label>
              <select 
                value={selectedRide} 
                onChange={(e) => setSelectedRide(e.target.value)}
              >
                <option value="">Choose a ride</option>
                {acceptedRides.map((ride) => (
                  <option key={ride.id} value={ride.id}>
                    {ride.passID} - {ride.place} ({formatTime(ride.time)})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="action-buttons">
              <button 
                className={`arrived-btn ${
                  selectedRideDetails && isArrivedButtonEnabled(selectedRideDetails.time) ? 'enabled' : 'disabled'
                }`}
                onClick={() => selectedRideDetails && sendArrivalNotification(
                  selectedRideDetails.passID, 
                  selectedRideDetails.id, 
                  selectedRideDetails.place
                )}
                disabled={!selectedRideDetails || !isArrivedButtonEnabled(selectedRideDetails.time)}
              >
                {selectedRideDetails ? (
                  isArrivedButtonEnabled(selectedRideDetails.time) ? 
                  '🚗 I Have Arrived' : 
                  `Arrived (Available at ${formatTime(selectedRideDetails.time)})`
                ) : 'Select a ride first'}
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="notifications-section">
            <div className="notifications-header">
              <h3>Your Notifications</h3>
              <button 
                className="clear-all-btn"
                onClick={clearAllNotifications}
                disabled={notifications.length === 0}
              >
                Clear All
              </button>
            </div>
            
            {notifications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔔</div>
                <p>No notifications yet</p>
                <span>You'll see passenger messages here</span>
              </div>
            ) : (
              <div className="notifications-list">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${notification.isRead ? 'read' : 'unread'} ${notification.type}`}
                    onClick={() => !notification.isRead && markAsRead(notification.id)}
                  >
                    <div className="notification-icon">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="notification-content">
                      <p className="notification-message">{notification.message}</p>
                      <div className="notification-meta">
                        <span className="notification-time">
                          {new Date(notification.created_at).toLocaleString()}
                        </span>
                        <span className={`notification-tag ${notification.type}`}>
                          {notification.type}
                        </span>
                      </div>
                    </div>
                    {!notification.isRead && (
                      <div className="unread-indicator"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get icons for different notification types
const getNotificationIcon = (type) => {
  switch (type) {
    case 'system':
      return '⚡';
    case 'driver_message':
      return '👨‍✈️';
    case 'arrival':
      return '🚗';
    case 'waiting':
      return '⏱️';
    case 'passenger_message':
      return '💬';
    case 'reminder':
      return '⏰';
    default:
      return '🔔';
  }
};

export default NotificationPage;