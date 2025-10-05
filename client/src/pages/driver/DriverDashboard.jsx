// import React from "react";
// import { useParams } from "react-router-dom";
// //import "../../css/DriverDashboard.css";

// const DriverDashboard = () => {
// const { driverID } = useParams();
//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-content">
//         <h2>Welcome Driver: {driverID}</h2>
//         <p>This is your dashboard where you can manage your rides.</p>
//       </div>
//     </div>
//   );
// };

// export default DriverDashboard;

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// // import '../../css/DriverManagement.css';
// // import '../../css/abc.css';

// const DriverDashboard = () => {
//     const { driverID } = useParams();
//     const navigate = useNavigate();
//     const [loading, setLoading] = useState(true);
//     const [activeTab, setActiveTab] = useState('accepted');
//     const [acceptedRides, setAcceptedRides] = useState([]);
//     const [completedRides, setCompletedRides] = useState([]);
//     const [rideRequests, setRideRequests] = useState([]);
//     const [notifications, setNotifications] = useState([]);
//     const [driverInfo, setDriverInfo] = useState(null);

//     // Base URL for backend API
//     const API_BASE = 'http://localhost:5000/api';

//     useEffect(() => {
//         fetchDriverInfo();
//         fetchAcceptedRides();
//     }, [driverID]);

//     // Fetch basic driver info
//     const fetchDriverInfo = async () => {
//         try {
//             const response = await axios.get(`${API_BASE}/drivers/${driverID}`);
//             setDriverInfo(response.data);
//         } catch (error) {
//             console.error('Error fetching driver info:', error);
//         }
//     };

//     // Fetch accepted rides
//     const fetchAcceptedRides = async () => {
//         try {
//             setLoading(true);
//             const response = await axios.get(`${API_BASE}/drivers/${driverID}/bookings?status=Assigned`);
//             setAcceptedRides(response.data);
//         } catch (error) {
//             console.error('Error fetching accepted rides:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Fetch completed rides
//     const fetchCompletedRides = async () => {
//         try {
//             const response = await axios.get(`${API_BASE}/drivers/${driverID}/bookings?status=Completed`);
//             setCompletedRides(response.data);
//         } catch (error) {
//             console.error('Error fetching completed rides:', error);
//         }
//     };

//     // Fetch ride requests
//     const fetchRideRequests = async () => {
//         try {
//             const response = await axios.get(`${API_BASE}/bookings?status=Requested`);
//             setRideRequests(response.data);
//         } catch (error) {
//             console.error('Error fetching ride requests:', error);
//         }
//     };

//     // Fetch notifications
//     const fetchNotifications = async () => {
//         try {
//             const response = await axios.get(`${API_BASE}/notifications/driver/${driverID}`);
//             setNotifications(response.data);
//         } catch (error) {
//             console.error('Error fetching notifications:', error);
//         }
//     };

//     // Update booking status
//     const updateBookingStatus = async (bookingId, newStatus) => {
//         try {
//             await axios.put(`${API_BASE}/drivers/${driverID}/bookings/${bookingId}/status`, {
//                 status: newStatus
//             });
            
//             // Refresh the current tab data
//             if (activeTab === 'accepted') fetchAcceptedRides();
//             if (activeTab === 'completed') fetchCompletedRides();
//             if (activeTab === 'requests') fetchRideRequests();
            
//             alert('Status updated successfully');
//         } catch (error) {
//             console.error('Error updating booking status:', error);
//             alert('Error updating status');
//         }
//     };

//     // Update driver status
//     const updateDriverStatus = async (newStatus) => {
//         try {
//             await axios.put(`${API_BASE}/drivers/${driverID}/status`, {
//                 status: newStatus
//             });
//             fetchDriverInfo();
//             alert('Driver status updated successfully');
//         } catch (error) {
//             console.error('Error updating driver status:', error);
//             alert('Error updating driver status');
//         }
//     };

//     // Mark notification as read
//     const markNotificationAsRead = async (notificationId) => {
//         try {
//             await axios.put(`${API_BASE}/notifications/${notificationId}/read`);
//             fetchNotifications();
//         } catch (error) {
//             console.error('Error marking notification as read:', error);
//         }
//     };

//     // Handle tab change
//     const handleTabChange = (tab) => {
//         setActiveTab(tab);
//         if (tab === 'accepted') fetchAcceptedRides();
//         if (tab === 'completed') fetchCompletedRides();
//         if (tab === 'requests') fetchRideRequests();
//         if (tab === 'notifications') fetchNotifications();
//     };

//     if (loading) {
//         return (
//             <div className="driver-dashboard loading">
//                 <div className="spinner">Loading...</div>
//             </div>
//         );
//     }

//     return (
//         <div className="driver-dashboard">
//             {/* Header */}
//             <header className="dashboard-header">
//                 <div className="header-content">
//                     <h1>Driver Dashboard</h1>
//                     <div className="driver-info">
//                         <span>Welcome, {driverInfo?.name || 'Driver'} ({driverID})</span>
//                         <div className="status-selector">
//                             <label>Status: </label>
//                             <select 
//                                 value={driverInfo?.status || 'available'} 
//                                 onChange={(e) => updateDriverStatus(e.target.value)}
//                                 className="status-dropdown"
//                             >
//                                 <option value="available">Available</option>
//                                 <option value="not_available">Not Available</option>
//                                 <option value="on_leave">On Leave</option>
//                                 <option value="suspended">Suspended</option>
//                                 <option value="terminated">Terminated</option>
//                             </select>
//                         </div>
//                     </div>
//                 </div>
//             </header>

//             {/* Stats Overview */}
//             <div className="stats-grid">
//                 <div className="stat-card">
//                     <h3>Accepted Rides</h3>
//                     <p className="stat-number">{acceptedRides.length}</p>
//                 </div>
//                 <div className="stat-card">
//                     <h3>Completed Rides</h3>
//                     <p className="stat-number">{completedRides.length}</p>
//                 </div>
//                 <div className="stat-card">
//                     <h3>Pending Requests</h3>
//                     <p className="stat-number">{rideRequests.length}</p>
//                 </div>
//                 <div className="stat-card">
//                     <h3>Notifications</h3>
//                     <p className="stat-number">{notifications.length}</p>
//                 </div>
//             </div>

//             {/* Navigation Tabs */}
//             <div className="tabs">
//                 <button 
//                     className={activeTab === 'accepted' ? 'active' : ''}
//                     onClick={() => handleTabChange('accepted')}
//                 >
//                     Accepted Rides ({acceptedRides.length})
//                 </button>
//                 <button 
//                     className={activeTab === 'completed' ? 'active' : ''}
//                     onClick={() => handleTabChange('completed')}
//                 >
//                     Completed Rides ({completedRides.length})
//                 </button>
//                 <button 
//                     className={activeTab === 'requests' ? 'active' : ''}
//                     onClick={() => handleTabChange('requests')}
//                 >
//                     Ride Requests ({rideRequests.length})
//                 </button>
//                 <button 
//                     className={activeTab === 'notifications' ? 'active' : ''}
//                     onClick={() => handleTabChange('notifications')}
//                 >
//                     Notifications ({notifications.length})
//                 </button>
//             </div>

//             {/* Tab Content */}
//             <div className="tab-content">
//                 {/* Accepted Rides Tab */}
//                 {activeTab === 'accepted' && (
//                     <div className="rides-tab">
//                         <h3>Your Accepted Rides</h3>
//                         {acceptedRides.length === 0 ? (
//                             <div className="empty-state">
//                                 <p>No accepted rides</p>
//                             </div>
//                         ) : (
//                             <div className="rides-list">
//                                 {acceptedRides.map(ride => (
//                                     <div key={ride.id} className="ride-card">
//                                         <div className="ride-info">
//                                             <h4>Booking #{ride.id}</h4>
//                                             <p><strong>Passenger:</strong> {ride.passenger_email}</p>
//                                             <p><strong>From:</strong> {ride.place}</p>
//                                             <p><strong>Time:</strong> {ride.time}</p>
//                                             <p><strong>Reason:</strong> {ride.reason}</p>
//                                             <p><strong>Status:</strong> 
//                                                 <span className={`status-badge ${ride.status.toLowerCase().replace(' ', '-')}`}>
//                                                     {ride.status}
//                                                 </span>
//                                             </p>
//                                         </div>
//                                         <div className="ride-actions">
//                                             <select 
//                                                 value={ride.status}
//                                                 onChange={(e) => updateBookingStatus(ride.id, e.target.value)}
//                                                 className="status-select"
//                                             >
//                                                 <option value="Assigned">Assigned</option>
//                                                 <option value="In Progress">In Progress</option>
//                                                 <option value="Completed">Completed</option>
//                                                 <option value="Cancelled">Cancelled</option>
//                                             </select>
//                                             <button 
//                                                 className="btn-sm success"
//                                                 onClick={() => updateBookingStatus(ride.id, 'Completed')}
//                                             >
//                                                 Mark Complete
//                                             </button>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 )}

//                 {/* Completed Rides Tab */}
//                 {activeTab === 'completed' && (
//                     <div className="rides-tab">
//                         <h3>Completed Rides</h3>
//                         {completedRides.length === 0 ? (
//                             <div className="empty-state">
//                                 <p>No completed rides yet</p>
//                             </div>
//                         ) : (
//                             <div className="rides-list">
//                                 {completedRides.map(ride => (
//                                     <div key={ride.id} className="ride-card completed">
//                                         <div className="ride-info">
//                                             <h4>Booking #{ride.id}</h4>
//                                             <p><strong>Passenger:</strong> {ride.passenger_email}</p>
//                                             <p><strong>From:</strong> {ride.place}</p>
//                                             <p><strong>Time:</strong> {ride.time}</p>
//                                             <p><strong>Completed:</strong> {new Date(ride.updated_at || ride.bookingTime).toLocaleString()}</p>
//                                         </div>
//                                         <div className="ride-status">
//                                             <span className="status-badge completed">Completed</span>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 )}

//                 {/* Ride Requests Tab */}
//                 {activeTab === 'requests' && (
//                     <div className="rides-tab">
//                         <h3>New Ride Requests</h3>
//                         {rideRequests.length === 0 ? (
//                             <div className="empty-state">
//                                 <p>No new ride requests</p>
//                             </div>
//                         ) : (
//                             <div className="rides-list">
//                                 {rideRequests.map(ride => (
//                                     <div key={ride.id} className="ride-card request">
//                                         <div className="ride-info">
//                                             <h4>Booking #{ride.id}</h4>
//                                             <p><strong>Passenger:</strong> {ride.passenger_email}</p>
//                                             <p><strong>From:</strong> {ride.place}</p>
//                                             <p><strong>Time:</strong> {ride.time}</p>
//                                             <p><strong>Reason:</strong> {ride.reason}</p>
//                                             <p><strong>Vehicle Needed:</strong> {ride.vehicleType}</p>
//                                         </div>
//                                         <div className="ride-actions">
//                                             <button 
//                                                 className="btn-sm success"
//                                                 onClick={() => updateBookingStatus(ride.id, 'Assigned')}
//                                             >
//                                                 Accept Ride
//                                             </button>
//                                             <button 
//                                                 className="btn-sm danger"
//                                                 onClick={() => updateBookingStatus(ride.id, 'Cancelled')}
//                                             >
//                                                 Decline
//                                             </button>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 )}

//                 {/* Notifications Tab */}
//                 {activeTab === 'notifications' && (
//                     <div className="notifications-tab">
//                         <div className="notifications-header">
//                             <h3>Notifications</h3>
//                             <button className="refresh-btn" onClick={fetchNotifications}>
//                                 Refresh
//                             </button>
//                         </div>
//                         {notifications.length === 0 ? (
//                             <div className="empty-state">
//                                 <p>No notifications</p>
//                             </div>
//                         ) : (
//                             <div className="notifications-list">
//                                 {notifications.map(notification => (
//                                     <div 
//                                         key={notification.id} 
//                                         className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
//                                         onClick={() => markNotificationAsRead(notification.id)}
//                                     >
//                                         <div className="notification-type">
//                                             {notification.type}
//                                         </div>
//                                         <div className="notification-message">
//                                             {notification.message}
//                                         </div>
//                                         <div className="notification-time">
//                                             {new Date(notification.created_at).toLocaleString()}
//                                         </div>
//                                         {!notification.isRead && (
//                                             <div className="unread-indicator">New</div>
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default DriverDashboard;

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../css/DriverDashboard.css';

const DriverDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    pendingRequests: 0,
    acceptedRides: 0,
    completedRides: 0,
    unreadNotifications: 0,
    todaysRides: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingRides, setUpcomingRides] = useState([]);
  const [loading, setLoading] = useState(true);

  const driverID = localStorage.getItem('driverID');
  const navigate = useNavigate();

  // Fetch all dashboard data
const fetchDashboardData = useCallback(async () => {
  if (!driverID) return;

  try {
    setLoading(true);
    
    // Fetch all data with error handling for each request
    const requests = [
      axios.get('http://localhost:5000/api/bookings/requested'),
      axios.get(`http://localhost:5000/api/bookings/accepted/${driverID}`),
      axios.get(`http://localhost:5000/api/bookings/completed/${driverID}`),
      axios.get(`http://localhost:5000/api/notifications/driver/${driverID}`),
      // Wrap today endpoint in try-catch to prevent complete failure
      axios.get(`http://localhost:5000/api/bookings/today/${driverID}`).catch(err => {
        console.log('Today endpoint failed, using fallback');
        return { data: [] }; // Return empty array if endpoint fails
      })
    ];

    const [
      requestsRes, 
      acceptedRes, 
      completedRes, 
      notificationsRes,
      todayRidesRes
    ] = await Promise.all(requests);

    // Calculate stats with fallback for today's rides
    const unreadNotifications = notificationsRes.data.filter(n => !n.isRead).length;
    
    // Use today endpoint data if available, otherwise calculate from accepted rides
    let todaysRides;
    if (todayRidesRes.data && todayRidesRes.data.length >= 0) {
      todaysRides = todayRidesRes.data.length;
    } else {
      // Fallback: calculate from accepted rides using bookingTime
      const today = new Date().toISOString().split('T')[0];
      todaysRides = acceptedRes.data.filter(ride => {
        const rideDate = ride.bookingTime ? ride.bookingTime.split('T')[0] : null;
        return rideDate === today;
      }).length;
    }

    setDashboardStats({
      pendingRequests: requestsRes.data.length,
      acceptedRides: acceptedRes.data.length,
      completedRides: completedRes.data.length,
      unreadNotifications,
      todaysRides
    });

    // Set recent activities
    const recentNotifs = notificationsRes.data
      .slice(0, 5)
      .map(notif => ({
        id: `notif-${notif.id}`,
        type: 'notification',
        message: notif.message,
        time: notif.created_at,
        icon: getNotificationIcon(notif.type)
      }));

    const recentRides = acceptedRes.data
      .slice(0, 3)
      .map(ride => ({
        id: `ride-${ride.id}`,
        type: 'ride',
        message: `Ride with ${ride.passID} to ${ride.place}`,
        time: ride.bookingTime,
        icon: '🚗'
      }));

    setRecentActivities([...recentNotifs, ...recentRides].sort((a, b) => 
      new Date(b.time) - new Date(a.time)
    ).slice(0, 5));

    // Set upcoming rides - use today endpoint data or fallback to accepted rides
    let upcomingRidesData;
    if (todayRidesRes.data && todayRidesRes.data.length > 0) {
      upcomingRidesData = todayRidesRes.data.slice(0, 3);
    } else {
      // Fallback: use today's accepted rides
      const today = new Date().toISOString().split('T')[0];
      upcomingRidesData = acceptedRes.data.filter(ride => {
        const rideDate = ride.bookingTime ? ride.bookingTime.split('T')[0] : null;
        return rideDate === today;
      }).slice(0, 3);
    }
    
    setUpcomingRides(upcomingRidesData);

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  } finally {
    setLoading(false);
  }
}, [driverID]);

  useEffect(() => {
    if (driverID) {
      fetchDashboardData();
      
      // Refresh data every 30 seconds
      const interval = setInterval(fetchDashboardData, 30000);
      return () => clearInterval(interval);
    }
  }, [driverID, fetchDashboardData]);

  // Quick action handlers
  const handleQuickAccept = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bookings/requested');
      if (res.data.length > 0) {
        const latestRequest = res.data[0];
        const confirm = window.confirm(`Accept ride from ${latestRequest.passID}?`);
        
        if (confirm) {
          await axios.put(`http://localhost:5000/api/bookings/accept/${latestRequest.id}`, {
            driverID,
          });
          alert('Ride accepted successfully!');
          fetchDashboardData();
        }
      } else {
        alert('No pending ride requests');
      }
    } catch (error) {
      console.error('Error accepting ride:', error);
      alert('Failed to accept ride');
    }
  };

  const handleSendArrival = () => {
    navigate('/driver/notifications');
  };

  // Navigation handlers
  const navigateTo = (path) => {
    navigate(path);
  };

  // Format time
  const formatTime = (timeString) => {
    if (!timeString) return '';
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return timeString;
    }
  };

  if (!driverID) {
    return (
      <div className="dashboard-layout">
        <div className="main-content">
          <div className="driver-dashboard">
            <h2>Driver Dashboard</h2>
            <p>Please log in as a driver to view this page.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard-layout">
        <div className="main-content">
          <div className="driver-dashboard">
            <div className="loading-spinner">Loading Dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <div className="main-content">
        <div className="driver-dashboard">
          {/* Header */}
          <div className="dashboard-header">
            <h1>Driver Dashboard</h1>
            <p>Welcome back! Here's your driving overview.</p>
          </div>

          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card" onClick={() => navigateTo('/driver/ride-requests')}>
              <div className="stat-icon">📋</div>
              <div className="stat-content">
                <h3>{dashboardStats.pendingRequests}</h3>
                <p>Pending Requests</p>
              </div>
              <div className="stat-badge new">{dashboardStats.pendingRequests} new</div>
            </div>

            <div className="stat-card" onClick={() => navigateTo('/driver/accepted-rides')}>
              <div className="stat-icon">🚗</div>
              <div className="stat-content">
                <h3>{dashboardStats.acceptedRides}</h3>
                <p>Accepted Rides</p>
              </div>
            </div>

            <div className="stat-card" onClick={() => navigateTo('/driver/completed-rides')}>
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>{dashboardStats.completedRides}</h3>
                <p>Completed Rides</p>
              </div>
            </div>

            <div className="stat-card" onClick={() => navigateTo('/driver/notifications')}>
              <div className="stat-icon">🔔</div>
              <div className="stat-content">
                <h3>{dashboardStats.unreadNotifications}</h3>
                <p>Unread Notifications</p>
              </div>
              {dashboardStats.unreadNotifications > 0 && (
                <div className="stat-badge alert">{dashboardStats.unreadNotifications}</div>
              )}
            </div>

            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <h3>{dashboardStats.todaysRides}</h3>
                <p>Today's Rides</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-section">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <button 
                className="action-btn primary"
                onClick={handleQuickAccept}
                disabled={dashboardStats.pendingRequests === 0}
              >
                <span className="action-icon">✅</span>
                <span>Accept Latest Request</span>
                <small>{dashboardStats.pendingRequests} available</small>
              </button>

              <button 
                className="action-btn secondary"
                onClick={handleSendArrival}
                disabled={dashboardStats.acceptedRides === 0}
              >
                <span className="action-icon">📍</span>
                <span>Send Arrival Notice</span>
                <small>Notify passengers</small>
              </button>

              <button 
                className="action-btn tertiary"
                onClick={() => navigateTo('/driver/accepted-rides')}
              >
                <span className="action-icon">📝</span>
                <span>Mark Rides Complete</span>
                <small>Update status</small>
              </button>
            </div>
          </div>

          <div className="dashboard-content">
            {/* Upcoming Rides */}
            <div className="content-section">
              <div className="section-header">
                <h2>Upcoming Rides Today</h2>
                <button 
                  className="view-all-btn"
                  onClick={() => navigateTo('/driver/accepted-rides')}
                >
                  View All
                </button>
              </div>
              
              {upcomingRides.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🚗</div>
                  <p>No upcoming rides today</p>
                </div>
              ) : (
                <div className="rides-list">
                  {upcomingRides.map(ride => (
                    <div key={ride.id} className="ride-item">
                      <div className="ride-icon">🚗</div>
                      <div className="ride-details">
                        <h4>Ride with {ride.passID}</h4>
                        <p>{ride.pickup} • {formatTime(ride.time)}</p>
                      </div>
                      <div className="ride-status">
                        <span className="status-badge accepted">Scheduled</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="content-section">
              <div className="section-header">
                <h2>Recent Activity</h2>
                <button 
                  className="view-all-btn"
                  onClick={() => navigateTo('/driver/notifications')}
                >
                  View All
                </button>
              </div>
              
              {recentActivities.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <p>No recent activity</p>
                </div>
              ) : (
                <div className="activity-list">
                  {recentActivities.map(activity => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-icon">{activity.icon}</div>
                      <div className="activity-content">
                        <p>{activity.message}</p>
                        <small>{new Date(activity.time).toLocaleString()}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function for notification icons
const getNotificationIcon = (type) => {
  switch (type) {
    case 'system': return '⚡';
    case 'driver_message': return '👨‍✈️';
    case 'arrival': return '🚗';
    case 'waiting': return '⏱️';
    case 'passenger_message': return '💬';
    case 'reminder': return '⏰';
    default: return '🔔';
  }
};

export default DriverDashboard;