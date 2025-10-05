// import React, { useState, useEffect } from 'react';
// import '../../css/dashboardStyle.css';

// const AdminDashboard = () => {
//   const [stats, setStats] = useState({
//     totalVehicles: 0,
//     availableVehicles: 0,
//     unavailableVehicles: 0,
//     totalDrivers: 0,
//     availableDrivers: 0,
//     onLeaveDrivers: 0,
//     terminatedDrivers: 0,
//     suspendedDrivers: 0,
//     totalUsers: 0,
//     activeRides: 0
//   });

//   const [vehicleSearch, setVehicleSearch] = useState('');
//   const [vehicleStatusFilter, setVehicleStatusFilter] = useState('all');
//   const [driverSearch, setDriverSearch] = useState('');
//   const [driverStatusFilter, setDriverStatusFilter] = useState('all');
//   const [vehicles, setVehicles] = useState([]);
//   const [drivers, setDrivers] = useState([]);

//   // Fetch dashboard stats from your API
//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         // Replace with your actual API endpoint
// const response = await fetch('http://localhost:5000/api/admin/dashboard-stats');
// const data = await response.json();
//         setStats(data);
//       } catch (error) {
//         console.error('Error fetching dashboard stats:', error);
//       }
//     };

//     fetchStats();
//   }, []);

//   // Fetch vehicles from your API
//   useEffect(() => {
//     const fetchVehicles = async () => {
//       try {
//         // Replace with your actual API endpoint
// const response = await fetch('http://localhost:5000/api/admin/vehicles');
//         const data = await response.json();
//         setVehicles(data);
//       } catch (error) {
//         console.error('Error fetching vehicles:', error);
//       }
//     };

//     fetchVehicles();
//   }, []);

//   // Fetch drivers from your API
//   useEffect(() => {
//     const fetchDrivers = async () => {
//       try {
//         // Replace with your actual API endpoint
// const response = await fetch('http://localhost:5000/api/admin/drivers');
//         const data = await response.json();
//         setDrivers(data);
//       } catch (error) {
//         console.error('Error fetching drivers:', error);
//       }
//     };

//     fetchDrivers();
//   }, []);

//   // Filter vehicles based on search and status
//   const filteredVehicles = vehicles.filter(vehicle => {
//     const matchesSearch = vehicle.id.toLowerCase().includes(vehicleSearch.toLowerCase()) || 
//                          vehicle.type.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
//                          vehicle.location.toLowerCase().includes(vehicleSearch.toLowerCase());
//     const matchesStatus = vehicleStatusFilter === 'all' || vehicle.status === vehicleStatusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   // Filter drivers based on search and status
//   const filteredDrivers = drivers.filter(driver => {
//     const matchesSearch = driver.id.toLowerCase().includes(driverSearch.toLowerCase()) || 
//                          driver.name.toLowerCase().includes(driverSearch.toLowerCase()) ||
//                          driver.email.toLowerCase().includes(driverSearch.toLowerCase());
//     const matchesStatus = driverStatusFilter === 'all' || driver.status === driverStatusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   return (
//     <div className="admin-dashboard">
//       <h1>Admin Dashboard</h1>
      
//       {/* Statistics Overview */}
//       <div className="stats-grid">
//         <div className="stat-card">
//           <h3>Total Vehicles</h3>
//           <p className="stat-number">{stats.totalVehicles}</p>
//           <div className="stat-details">
//             <span className="available">{stats.availableVehicles} Available</span>
//             <span className="unavailable">{stats.unavailableVehicles} Unavailable</span>
//           </div>
//         </div>
        
//         <div className="stat-card">
//           <h3>Total Drivers</h3>
//           <p className="stat-number">{stats.totalDrivers}</p>
//           <div className="stat-details">
//             <span className="available">{stats.availableDrivers} Available</span>
//             <span className="on-leave">{stats.onLeaveDrivers} On Leave</span>
//             <span className="suspended">{stats.suspendedDrivers} Suspended</span>
//             <span className="terminated">{stats.terminatedDrivers} Terminated</span>
//           </div>
//         </div>
        
//         <div className="stat-card">
//           <h3>Total Users</h3>
//           <p className="stat-number">{stats.totalUsers}</p>
//         </div>
        
//         <div className="stat-card">
//           <h3>Active Rides</h3>
//           <p className="stat-number">{stats.activeRides}</p>
//         </div>
//       </div>

//       {/* Vehicle Management Section */}
//       <div className="management-section">
//         <h2>Vehicle Management</h2>
//         <div className="search-filters">
//           <input
//             type="text"
//             placeholder="Search vehicles by ID, type, or location..."
//             value={vehicleSearch}
//             onChange={(e) => setVehicleSearch(e.target.value)}
//             className="search-input"
//           />
//           <select 
//             value={vehicleStatusFilter} 
//             onChange={(e) => setVehicleStatusFilter(e.target.value)}
//             className="filter-select"
//           >
//             <option value="all">All Status</option>
//             <option value="Available">Available</option>
//             <option value="Unavailable">Unavailable</option>
//             <option value="Maintenance">Maintenance</option>
//           </select>
//         </div>
        
//         <div className="table-container">
//           <table className="data-table">
//             <thead>
//               <tr>
//                 <th>Vehicle ID</th>
//                 <th>Type</th>
//                 <th>Capacity</th>
//                 <th>Status</th>
//                 <th>Location</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredVehicles.map(vehicle => (
//                 <tr key={vehicle.id}>
//                   <td>{vehicle.id}</td>
//                   <td>{vehicle.type}</td>
//                   <td>{vehicle.capacity}</td>
//                   <td>
//                     <span className={`status-badge ${vehicle.status.toLowerCase()}`}>
//                       {vehicle.status}
//                     </span>
//                   </td>
//                   <td>{vehicle.location}</td>
//                   <td>
//                     <button className="btn-edit">Edit</button>
//                     <button className="btn-delete">Delete</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Driver Management Section */}
//       <div className="management-section">
//         <h2>Driver Management</h2>
//         <div className="search-filters">
//           <input
//             type="text"
//             placeholder="Search drivers by ID, name, or email..."
//             value={driverSearch}
//             onChange={(e) => setDriverSearch(e.target.value)}
//             className="search-input"
//           />
//           <select 
//             value={driverStatusFilter} 
//             onChange={(e) => setDriverStatusFilter(e.target.value)}
//             className="filter-select"
//           >
//             <option value="all">All Status</option>
//             <option value="Available">Available</option>
//             <option value="On Leave">On Leave</option>
//             <option value="Suspended">Suspended</option>
//             <option value="Terminated">Terminated</option>
//           </select>
//         </div>
        
//         <div className="table-container">
//           <table className="data-table">
//             <thead>
//               <tr>
//                 <th>Driver ID</th>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Phone</th>
//                 <th>Experience</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredDrivers.map(driver => (
//                 <tr key={driver.id}>
//                   <td>{driver.id}</td>
//                   <td>{driver.name}</td>
//                   <td>{driver.email}</td>
//                   <td>{driver.phone}</td>
//                   <td>{driver.experience} years</td>
//                   <td>
//                     <span className={`status-badge ${driver.status.toLowerCase().replace(' ', '-')}`}>
//                       {driver.status}
//                     </span>
//                   </td>
//                   <td>
//                     <button className="btn-edit">Edit</button>
//                     <button className="btn-delete">Delete</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../css/AdminDashboard.css';

const AdminDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalRides: 0,
    todayRides: 0,
    pendingRequests: 0,
    activeDrivers: 0,
    availableVehicles: 0,
    totalRevenue: 0
  });
  
  const [performanceData, setPerformanceData] = useState({
    weeklyRides: [],
    monthlyRides: [],
    driverPerformance: [],
    passengerActivity: [],
    rideTrends: []
  });
  
  const [timeFrame, setTimeFrame] = useState('today'); // today, weekly, monthly
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);

  const navigate = useNavigate();

  // Fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [
        statsRes,
        weeklyRes,
        monthlyRes,
        driversRes,
        vehiclesRes,
        performanceRes
      ] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/dashboard-stats'),
        axios.get('http://localhost:5000/api/admin/rides-weekly'),
        axios.get('http://localhost:5000/api/admin/rides-monthly'),
        axios.get('http://localhost:5000/api/drivers'),
        axios.get('http://localhost:5000/api/vehicles/list'),
        axios.get('http://localhost:5000/api/admin/performance-metrics')
      ]);

      // Calculate stats
      const activeDrivers = driversRes.data.filter(driver => 
        driver.status === 'available' || driver.status === 'on_duty'
      ).length;
      
      const availableVehicles = vehiclesRes.data.filter(vehicle => 
        vehicle.status === 'Available'
      ).length;

      setDashboardStats({
        totalRides: statsRes.data.totalRides || 0,
        todayRides: statsRes.data.todayRides || 0,
        pendingRequests: statsRes.data.pendingRequests || 0,
        activeDrivers,
        availableVehicles,
        totalRevenue: statsRes.data.totalRevenue || 0
      });

      // Set performance data
      setPerformanceData({
        weeklyRides: weeklyRes.data,
        monthlyRides: monthlyRes.data,
        driverPerformance: performanceRes.data.driverPerformance || [],
        passengerActivity: performanceRes.data.passengerActivity || [],
        rideTrends: performanceRes.data.rideTrends || []
      });

      // Prepare chart data
      prepareChartData(weeklyRes.data, monthlyRes.data);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Prepare chart data for visualization
  const prepareChartData = (weeklyData, monthlyData) => {
    const weeklyChart = {
      labels: weeklyData.map(item => item.day),
      datasets: [
        {
          label: 'Rides This Week',
          data: weeklyData.map(item => item.count),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2
        }
      ]
    };

    const monthlyChart = {
      labels: monthlyData.map(item => item.month),
      datasets: [
        {
          label: 'Rides This Year',
          data: monthlyData.map(item => item.count),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2
        }
      ]
    };

    setChartData({
      weekly: weeklyChart,
      monthly: monthlyChart
    });
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Refresh data every 2 minutes
    const interval = setInterval(fetchDashboardData, 120000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Navigation handlers
  const navigateTo = (path) => {
    navigate(path);
  };

  // Format numbers with commas
  const formatNumber = (num) => {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || '0';
  };

  // Calculate percentage change
  const calculateChange = (current, previous) => {
    if (!previous) return { value: 100, isPositive: true };
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change >= 0
    };
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <div className="main-content">
          <div className="admin-dashboard">
            <div className="loading-spinner">Loading Admin Dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <div className="main-content">
        <div className="admin-dashboard">
          {/* Header */}
          <div className="dashboard-header">
            <h1>Admin Dashboard</h1>
            <p>Complete overview of your transportation system</p>
            <div className="time-frame-selector">
              <button 
                className={timeFrame === 'today' ? 'active' : ''}
                onClick={() => setTimeFrame('today')}
              >
                Today
              </button>
              <button 
                className={timeFrame === 'weekly' ? 'active' : ''}
                onClick={() => setTimeFrame('weekly')}
              >
                This Week
              </button>
              <button 
                className={timeFrame === 'monthly' ? 'active' : ''}
                onClick={() => setTimeFrame('monthly')}
              >
                This Month
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="metrics-grid">
            <div className="metric-card primary">
              <div className="metric-icon">🚗</div>
              <div className="metric-content">
                <h3>{formatNumber(dashboardStats.totalRides)}</h3>
                <p>Total Rides</p>
                <span className="metric-change positive">
                  +12% from last month
                </span>
              </div>
            </div>

            <div className="metric-card success">
              <div className="metric-icon">📅</div>
              <div className="metric-content">
                <h3>{formatNumber(dashboardStats.todayRides)}</h3>
                <p>Today's Rides</p>
                <span className="metric-change positive">
                  +5% from yesterday
                </span>
              </div>
            </div>

            <div className="metric-card warning">
              <div className="metric-icon">⏳</div>
              <div className="metric-content">
                <h3>{formatNumber(dashboardStats.pendingRequests)}</h3>
                <p>Pending Requests</p>
                <span className="metric-change negative">
                  -3% from yesterday
                </span>
              </div>
            </div>

            <div className="metric-card info">
              <div className="metric-icon">👨‍✈️</div>
              <div className="metric-content">
                <h3>{formatNumber(dashboardStats.activeDrivers)}</h3>
                <p>Active Drivers</p>
                <span className="metric-change positive">
                  +2 new this week
                </span>
              </div>
            </div>

            <div className="metric-card secondary">
              <div className="metric-icon">🚙</div>
              <div className="metric-content">
                <h3>{formatNumber(dashboardStats.availableVehicles)}</h3>
                <p>Available Vehicles</p>
                <span className="metric-change positive">
                  85% utilization
                </span>
              </div>
            </div>

            <div className="metric-card revenue">
              <div className="metric-icon">💰</div>
              <div className="metric-content">
                <h3>${formatNumber(dashboardStats.totalRevenue)}</h3>
                <p>Total Revenue</p>
                <span className="metric-change positive">
                  +15% from last month
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-section">
            <h2>Quick Management</h2>
            <div className="actions-grid">
              <button 
                className="action-btn"
                onClick={() => navigateTo('/admin/add-vehicle')}
              >
                <span className="action-icon">➕</span>
                <span>Add Vehicle</span>
              </button>

              <button 
                className="action-btn"
                onClick={() => navigateTo('/admin/assign-driver')}
              >
                <span className="action-icon">👨‍✈️</span>
                <span>Assign Driver</span>
              </button>

              <button 
                className="action-btn"
                onClick={() => navigateTo('/admin/driver-management')}
              >
                <span className="action-icon">📊</span>
                <span>Manage Drivers</span>
              </button>

              <button 
                className="action-btn"
                onClick={() => navigateTo('/admin/vehicle-management')}
              >
                <span className="action-icon">🚗</span>
                <span>Manage Vehicles</span>
              </button>
            </div>
          </div>

          <div className="dashboard-content">
            {/* Performance Analytics */}
            <div className="analytics-section">
              <div className="section-header">
                <h2>Performance Analytics</h2>
                <div className="analytics-tabs">
                  <button className="tab-active">Ride Trends</button>
                  <button>Driver Performance</button>
                  <button>Revenue Analysis</button>
                </div>
              </div>
              
              <div className="analytics-grid">
                <div className="analytics-card">
                  <h3>Ride Completion Rate</h3>
                  <div className="completion-rate">
                    <div className="rate-circle">
                      <span className="rate-value">94%</span>
                    </div>
                    <div className="rate-details">
                      <p><strong>1,247</strong> completed rides</p>
                      <p><strong>78</strong> pending completion</p>
                    </div>
                  </div>
                </div>

                <div className="analytics-card">
                  <h3>Average Response Time</h3>
                  <div className="response-time">
                    <span className="time-value">4.2</span>
                    <span className="time-unit">minutes</span>
                  </div>
                  <div className="time-trend">
                    <span className="trend positive">↓ 0.8min from last week</span>
                  </div>
                </div>

                <div className="analytics-card">
                  <h3>Peak Hours</h3>
                  <div className="peak-hours">
                    <div className="peak-time">
                      <span className="time">8:00 - 10:00 AM</span>
                      <span className="count">247 rides</span>
                    </div>
                    <div className="peak-time">
                      <span className="time">4:00 - 6:00 PM</span>
                      <span className="count">198 rides</span>
                    </div>
                    <div className="peak-time">
                      <span className="time">12:00 - 2:00 PM</span>
                      <span className="count">156 rides</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity & Top Performers */}
            <div className="side-panels">
              {/* Top Drivers */}
              <div className="side-panel">
                <div className="panel-header">
                  <h3>Top Performing Drivers</h3>
                  <button className="view-all">View All</button>
                </div>
                <div className="drivers-list">
                  {performanceData.driverPerformance.slice(0, 5).map((driver, index) => (
                    <div key={driver.driver_id} className="driver-item">
                      <div className="driver-rank">{index + 1}</div>
                      <div className="driver-info">
                        <h4>{driver.name}</h4>
                        <p>{driver.completed_rides} rides • {driver.rating}⭐</p>
                      </div>
                      <div className="driver-stats">
                        <span className="stat-badge success">{driver.completion_rate}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Alerts */}
              <div className="side-panel">
                <div className="panel-header">
                  <h3>System Alerts</h3>
                  <span className="alert-count">3</span>
                </div>
                <div className="alerts-list">
                  <div className="alert-item warning">
                    <div className="alert-icon">⚠️</div>
                    <div className="alert-content">
                      <p>2 vehicles due for maintenance</p>
                      <small>15 minutes ago</small>
                    </div>
                  </div>
                  <div className="alert-item info">
                    <div className="alert-icon">ℹ️</div>
                    <div className="alert-content">
                      <p>Peak hours approaching</p>
                      <small>1 hour ago</small>
                    </div>
                  </div>
                  <div className="alert-item success">
                    <div className="alert-icon">✅</div>
                    <div className="alert-content">
                      <p>System performance optimal</p>
                      <small>2 hours ago</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Statistics */}
          <div className="statistics-section">
            <h2>Detailed Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Ride Distribution</h3>
                <div className="distribution-list">
                  <div className="distribution-item">
                    <span className="label">Completed</span>
                    <span className="value">1,247 (78%)</span>
                  </div>
                  <div className="distribution-item">
                    <span className="label">In Progress</span>
                    <span className="value">156 (10%)</span>
                  </div>
                  <div className="distribution-item">
                    <span className="label">Pending</span>
                    <span className="value">89 (6%)</span>
                  </div>
                  <div className="distribution-item">
                    <span className="label">Cancelled</span>
                    <span className="value">78 (5%)</span>
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <h3>Vehicle Utilization</h3>
                <div className="utilization-list">
                  <div className="utilization-item">
                    <span className="label">Available</span>
                    <span className="value">18 vehicles</span>
                  </div>
                  <div className="utilization-item">
                    <span className="label">In Use</span>
                    <span className="value">12 vehicles</span>
                  </div>
                  <div className="utilization-item">
                    <span className="label">Maintenance</span>
                    <span className="value">2 vehicles</span>
                  </div>
                  <div className="utilization-item">
                    <span className="label">Utilization Rate</span>
                    <span className="value success">85%</span>
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <h3>Driver Status</h3>
                <div className="status-list">
                  <div className="status-item">
                    <span className="label">Available</span>
                    <span className="value">15 drivers</span>
                  </div>
                  <div className="status-item">
                    <span className="label">On Duty</span>
                    <span className="value">8 drivers</span>
                  </div>
                  <div className="status-item">
                    <span className="label">On Leave</span>
                    <span className="value">3 drivers</span>
                  </div>
                  <div className="status-item">
                    <span className="label">Offline</span>
                    <span className="value">4 drivers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;