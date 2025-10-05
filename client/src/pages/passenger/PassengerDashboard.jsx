// import React, { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import { 
//   Chart as ChartJS, 
//   CategoryScale, 
//   LinearScale, 
//   BarElement, 
//   LineElement, 
//   PointElement, 
//   Title, 
//   Tooltip, 
//   Legend 
// } from 'chart.js';
// import { Bar, Line } from 'react-chartjs-2';
// import '../../css/PassengerDashboard.css';

// // Register ChartJS components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const PassengerDashboard = () => {
//   const { passengerID } = useParams();
//   const [counts, setCounts] = useState({
//     total: 0,
//     completed: 0,
//     rejected: 0,
//   });
//   const [timeFilter, setTimeFilter] = useState('week');
//   const [analyticsData, setAnalyticsData] = useState({
//     rides: [],
//     driverStats: [],
//     vehicleStats: [],
//     timelineData: []
//   });
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchRideStats();
//     fetchAnalytics(timeFilter);
//   }, [passengerID, timeFilter]);

//   const fetchRideStats = async () => {
//     try {
//       const res = await axios.get(`http://localhost:5000/api/bookings/counts/${passengerID}`);
//       setCounts(res.data);
//     } catch (error) {
//       console.error('Stats fetch failed:', error);
//     }
//   };

//   const fetchAnalytics = async (period) => {
//     try {
//       setLoading(true);
      
//       const [ridesRes, driversRes, vehiclesRes, timelineRes] = await Promise.all([
//         axios.get(`http://localhost:5000/api/bookings/analytics/rides/${passengerID}?period=${period}`),
//         axios.get(`http://localhost:5000/api/bookings/analytics/drivers/${passengerID}?period=${period}`),
//         axios.get(`http://localhost:5000/api/bookings/analytics/vehicles/${passengerID}?period=${period}`),
//         axios.get(`http://localhost:5000/api/bookings/analytics/timeline/${passengerID}?period=${period}`)
//       ]);

//       setAnalyticsData({
//         rides: ridesRes.data || [],
//         driverStats: driversRes.data || [],
//         vehicleStats: vehiclesRes.data || [],
//         timelineData: timelineRes.data || []
//       });
//     } catch (error) {
//       console.error('Analytics fetch failed:', error);
//       setAnalyticsData({
//         rides: [],
//         driverStats: [],
//         vehicleStats: [],
//         timelineData: []
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTimeFilterChange = (period) => {
//     setTimeFilter(period);
//   };

//   // Chart data for drivers
//   const driverChartData = {
//     labels: analyticsData.driverStats.map(driver => driver.name),
//     datasets: [
//       {
//         label: 'Rides by Driver',
//         data: analyticsData.driverStats.map(driver => driver.count),
//         backgroundColor: 'rgba(54, 162, 235, 0.8)',
//         borderColor: 'rgba(54, 162, 235, 1)',
//         borderWidth: 2,
//         borderRadius: 5,
//       },
//     ],
//   };

//   // Chart data for vehicles
//   const vehicleChartData = {
//     labels: analyticsData.vehicleStats.map(vehicle => vehicle.vehicleType),
//     datasets: [
//       {
//         label: 'Rides by Vehicle',
//         data: analyticsData.vehicleStats.map(vehicle => vehicle.count),
//         backgroundColor: 'rgba(255, 99, 132, 0.8)',
//         borderColor: 'rgba(255, 99, 132, 1)',
//         borderWidth: 2,
//         borderRadius: 5,
//       },
//     ],
//   };

//   // Timeline chart data
//   const timelineChartData = {
//     labels: analyticsData.timelineData.map(item => item.date),
//     datasets: [
//       {
//         label: 'Rides Over Time',
//         data: analyticsData.timelineData.map(item => item.count),
//         borderColor: 'rgba(75, 192, 192, 1)',
//         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//         tension: 0.4,
//         fill: true,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       title: {
//         display: true,
//         text: 'Ride Analytics',
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         ticks: {
//           stepSize: 1
//         }
//       },
//     },
//   };

//   const timelineOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         ticks: {
//           stepSize: 1
//         }
//       },
//     },
//   };

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-header">
//         <h1>Passenger Dashboard</h1>
//         <p>Analytics and ride statistics</p>
//       </div>

//       {/* Quick Stats Section */}
//       <div className="dashboard-grid">
//         <div className="card card-blue float">
//           <span>Total Rides</span>
//           <h2>{counts.total}</h2>
//         </div>
//         <div className="card card-green float">
//           <span>Completed</span>
//           <h2>{counts.completed}</h2>
//         </div>
//         <div className="card card-red float">
//           <span>Rejected</span>
//           <h2>{counts.rejected}</h2>
//         </div>
//       </div>

//       {/* Analytics Section */}
//       <div className="analytics-section">
//         {/* Time Filter */}
//         <div className="filter-section">
//           <h3>Ride Analytics</h3>
//           <div className="time-filters">
//             <button 
//               className={`time-filter-btn ${timeFilter === 'week' ? 'active' : ''}`}
//               onClick={() => handleTimeFilterChange('week')}
//             >
//               This Week
//             </button>
//             <button 
//               className={`time-filter-btn ${timeFilter === 'month' ? 'active' : ''}`}
//               onClick={() => handleTimeFilterChange('month')}
//             >
//               This Month
//             </button>
//             <button 
//               className={`time-filter-btn ${timeFilter === 'year' ? 'active' : ''}`}
//               onClick={() => handleTimeFilterChange('year')}
//             >
//               Last Year
//             </button>
//           </div>
//         </div>

//         {loading ? (
//           <div className="loading">Loading analytics...</div>
//         ) : (
//           <div className="analytics-content">
//             {/* Timeline Chart */}
//             {analyticsData.timelineData.length > 0 && (
//               <div className="chart-container full-width">
//                 <h4>Rides Timeline ({timeFilter})</h4>
//                 <Line data={timelineChartData} options={timelineOptions} />
//               </div>
//             )}

//             {/* Rides Table */}
//             <div className="table-section">
//               <h4>Recent Rides ({timeFilter})</h4>
//               <div className="table-container">
//                 <table className="analytics-table">
//                   <thead>
//                     <tr>
//                       <th>Date</th>
//                       <th>Place</th>
//                       <th>Time</th>
//                       <th>Driver</th>
//                       <th>Vehicle</th>
//                       <th>Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {analyticsData.rides.length > 0 ? (
//                       analyticsData.rides.map((ride, index) => (
//                         <tr key={index}>
//                           <td>{new Date(ride.bookingTime).toLocaleDateString()}</td>
//                           <td>{ride.place}</td>
//                           <td>{ride.time}</td>
//                           <td>{ride.driverName || 'N/A'}</td>
//                           <td>{ride.vehicleType || 'N/A'}</td>
//                           <td>
//                             <span className={`status-badge status-${ride.status}`}>
//                               {ride.status}
//                             </span>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="6" className="no-data">No rides found for selected period</td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Charts Section */}
//             <div className="charts-section">
//               {/* Driver Chart */}
//               {analyticsData.driverStats.length > 0 && (
//                 <div className="chart-container">
//                   <h4>Rides by Driver</h4>
//                   <Bar data={driverChartData} options={chartOptions} />
//                 </div>
//               )}

//               {/* Vehicle Chart */}
//               {analyticsData.vehicleStats.length > 0 && (
//                 <div className="chart-container">
//                   <h4>Rides by Vehicle Type</h4>
//                   <Bar data={vehicleChartData} options={chartOptions} />
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PassengerDashboard;

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../css/PassengerDashboard.css';

const PassengerDashboard = () => {
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

  const passID = localStorage.getItem('passID');
  const navigate = useNavigate();

  // Fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!passID) return;

    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [
        statusRes, 
        acceptedRes, 
        notificationsRes,
        todayRidesRes
      ] = await Promise.all([
        axios.get(`http://localhost:5000/api/bookings/status/${passID}`),
        axios.get(`http://localhost:5000/api/bookings/accepted-rides/${passID}`),
        axios.get(`http://localhost:5000/api/notifications/passenger/${passID}`),
        // Wrap today endpoint in try-catch to prevent complete failure
        axios.get(`http://localhost:5000/api/bookings/today-passenger/${passID}`).catch(err => {
          console.log('Today endpoint failed, using fallback');
          return { data: [] };
        })
      ]);

      // Calculate stats
      const pendingRequests = statusRes.data.filter(booking => 
        booking.status === 'Requested'
      ).length;
      
      const acceptedRides = statusRes.data.filter(booking => 
        booking.status === 'Accepted'
      ).length;
      
      const completedRides = statusRes.data.filter(booking => 
        booking.status === 'Completed'
      ).length;

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
        pendingRequests,
        acceptedRides,
        completedRides,
        unreadNotifications,
        todaysRides
      });

      // Set recent activities (combine recent notifications and bookings)
      const recentNotifs = notificationsRes.data
        .slice(0, 5)
        .map(notif => ({
          id: `notif-${notif.id}`,
          type: 'notification',
          message: notif.message,
          time: notif.created_at,
          icon: getNotificationIcon(notif.type)
        }));

      const recentBookings = statusRes.data
        .slice(0, 3)
        .map(booking => ({
          id: `booking-${booking.id}`,
          type: 'booking',
          message: `Booking to ${booking.place} - ${booking.status}`,
          time: booking.bookingTime,
          icon: getBookingIcon(booking.status)
        }));

      setRecentActivities([...recentNotifs, ...recentBookings].sort((a, b) => 
        new Date(b.time) - new Date(a.time)
      ).slice(0, 5));

      // Set upcoming rides (today's accepted rides)
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
  }, [passID]);

  useEffect(() => {
    if (passID) {
      fetchDashboardData();
      
      // Refresh data every 30 seconds
      const interval = setInterval(fetchDashboardData, 30000);
      return () => clearInterval(interval);
    }
  }, [passID, fetchDashboardData]);

  // Quick action handlers
  const handleQuickBook = () => {
    navigate('/passenger/book-vehicle');
  };

  const handleSendWaiting = () => {
    navigate('/passenger/contact');
  };

  const handleCheckStatus = () => {
    navigate('/passenger/request-status');
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

  if (!passID) {
    return (
      <div className="dashboard-layout">
        <div className="main-content">
          <div className="passenger-dashboard">
            <h2>Passenger Dashboard</h2>
            <p>Please log in as a passenger to view this page.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard-layout">
        <div className="main-content">
          <div className="passenger-dashboard">
            <div className="loading-spinner">Loading Dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <div className="main-content">
        <div className="passenger-dashboard">
          {/* Header */}
          <div className="dashboard-header">
            <h1>Passenger Dashboard</h1>
            <p>Welcome back! Here's your ride overview.</p>
          </div>

          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card" onClick={() => navigateTo('/passenger/request-status')}>
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <h3>{dashboardStats.pendingRequests}</h3>
                <p>Pending Requests</p>
              </div>
              {dashboardStats.pendingRequests > 0 && (
                <div className="stat-badge pending">{dashboardStats.pendingRequests}</div>
              )}
            </div>

            <div className="stat-card" onClick={() => navigateTo('/passenger/request-status')}>
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>{dashboardStats.acceptedRides}</h3>
                <p>Accepted Rides</p>
              </div>
            </div>

            <div className="stat-card" onClick={() => navigateTo('/passenger/request-status')}>
              <div className="stat-icon">🎉</div>
              <div className="stat-content">
                <h3>{dashboardStats.completedRides}</h3>
                <p>Completed Rides</p>
              </div>
            </div>

            <div className="stat-card" onClick={() => navigateTo('/passenger/contact')}>
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
                onClick={handleQuickBook}
              >
                <span className="action-icon">🚗</span>
                <span>Book New Ride</span>
                <small>Request a vehicle</small>
              </button>

              <button 
                className="action-btn secondary"
                onClick={handleSendWaiting}
                disabled={dashboardStats.acceptedRides === 0}
              >
                <span className="action-icon">📍</span>
                <span>Send Waiting Notice</span>
                <small>Notify driver</small>
              </button>

              <button 
                className="action-btn tertiary"
                onClick={handleCheckStatus}
              >
                <span className="action-icon">📊</span>
                <span>Check Ride Status</span>
                <small>View all bookings</small>
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
                  onClick={() => navigateTo('/passenger/request-status')}
                >
                  View All
                </button>
              </div>
              
              {upcomingRides.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🚗</div>
                  <p>No upcoming rides today</p>
                  <button 
                    className="action-link"
                    onClick={handleQuickBook}
                  >
                    Book a ride now
                  </button>
                </div>
              ) : (
                <div className="rides-list">
                  {upcomingRides.map(ride => (
                    <div key={ride.id} className="ride-item">
                      <div className="ride-icon">🚗</div>
                      <div className="ride-details">
                        <h4>Ride to {ride.place}</h4>
                        <p>Driver: {ride.driverID} • {formatTime(ride.time)}</p>
                        <span className={`status-badge ${ride.status?.toLowerCase()}`}>
                          {ride.status}
                        </span>
                      </div>
                      <div className="ride-time">
                        {formatTime(ride.time)}
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
                  onClick={() => navigateTo('/passenger/contact')}
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

// Helper function for booking status icons
const getBookingIcon = (status) => {
  switch (status) {
    case 'Requested': return '⏳';
    case 'Accepted': return '✅';
    case 'Completed': return '🎉';
    case 'Cancelled': return '❌';
    default: return '📋';
  }
};

export default PassengerDashboard;