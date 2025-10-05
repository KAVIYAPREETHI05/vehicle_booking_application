import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/notification.css';

const ContactPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [acceptedRides, setAcceptedRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState('');

  const passID = localStorage.getItem('passID');

  useEffect(() => {
    if (passID) {
      fetchNotifications();
      fetchAcceptedRides();
      setupRealTimeUpdates();
    }
  }, [passID]);

  const fetchNotifications = async () => {
    try {
      // Correct endpoint  
const res = await axios.get(`http://localhost:5000/api/notifications/passenger/${passID}`);
      setNotifications(res.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };
  

  const fetchAcceptedRides = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/bookings/accepted-rides/${passID}`);
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

const sendWaitingNotification = async (driverID, bookingId, place) => {
  try {
    // ✅ FIXED: Use the correct endpoint '/'
    await axios.post('http://localhost:5000/api/notifications/', {
      type: 'waiting',
      message: `Passenger is waiting at ${place}`,
      driver_id: driverID,
      passID: passID,
      booking_id: bookingId
    });
    alert('Waiting notification sent to driver!');
    fetchNotifications();
  } catch (error) {
    console.error('Error sending waiting notification:', error);
    alert('Failed to send waiting notification: ' + error.response?.data?.error);
  }
};

  const markNotificationAsRead = async (notificationId) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${notificationId}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/notifications/passenger/${passID}`);
      fetchNotifications();
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  // Check if waiting button should be enabled for a ride
  const isWaitingButtonEnabled = (rideTime) => {
    if (!rideTime) return false;
    
    try {
      const now = new Date();
      const [hours, minutes] = rideTime.split(':');
      
      if (!hours || !minutes) return false;
      
      const rideDateTime = new Date();
      rideDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      return now >= rideDateTime;
    } catch (error) {
      console.error('Error checking waiting button:', error);
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

  if (!passID) {
    return (
      <div className="notification-container">
        <div className="main-content">
          <div className="notification-page">
            <h2>Contact & Notifications</h2>
            <p>Please log in as a passenger to view this page.</p>
          </div>
        </div>
      </div>
    );
  }

  const selectedRideDetails = getSelectedRideDetails();

  return (
    <div className="notification-container">
      <div className="main-content">
        <div className="notification-page">
          <h2>Contact & Notifications</h2>
          
          {/* Quick Actions Section */}
          <div className="quick-actions-section">
            <h3>Send Waiting Notification</h3>
            <div className="ride-selector">
              <label>Select Your Ride:</label>
              <select 
                value={selectedRide} 
                onChange={(e) => setSelectedRide(e.target.value)}
              >
                <option value="">Choose your ride</option>
                {acceptedRides.map((ride) => (
                  <option key={ride.id} value={ride.id}>
                    {ride.place} - {formatTime(ride.time)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="action-buttons">
              <button
                className={`waiting-btn ${
                  selectedRideDetails && isWaitingButtonEnabled(selectedRideDetails.time) ? 'enabled' : 'disabled'
                }`}
                onClick={() => selectedRideDetails && sendWaitingNotification(
                  selectedRideDetails.driverID, 
                  selectedRideDetails.id,
                  selectedRideDetails.place
                )}
                disabled={!selectedRideDetails || !isWaitingButtonEnabled(selectedRideDetails.time)}
              >
                {selectedRideDetails ? (
                  isWaitingButtonEnabled(selectedRideDetails.time) ? 
                  '🚩 I am Waiting' : 
                  `Waiting (Available at ${formatTime(selectedRideDetails.time)})`
                ) : 'Select your ride first'}
              </button>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="notifications-section">
            <div className="section-header">
              <h3>Your Notifications</h3>
              <button 
                className="btn-clear"
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
                <span>You'll see driver messages here</span>
              </div>
            ) : (
              <div className="notifications-list">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`notification-card ${notification.isRead ? 'read' : 'unread'}`}
                    onClick={() => !notification.isRead && markNotificationAsRead(notification.id)}
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

export default ContactPage;