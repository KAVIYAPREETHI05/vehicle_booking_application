// src/components/DriverSidebar.js
import { Link, useParams } from 'react-router-dom';
import '../css/sidebar.css';

const DriverSidebar = () => {
 const driverID = localStorage.getItem('driverID');
  return (
    <div className="sidebar">
      <h3>Driver Panel</h3>
      <ul>
        <li><Link to={`/users/drivers/${driverID}/dashboard`}>Dashboard</Link></li>
        <li><Link to={`/users/drivers/request`}>Ride Requests</Link></li>
        <li><Link to={`/users/drivers/${driverID}/accepted`}>Accepted Rides</Link></li>
        <li><Link to={`/users/drivers/${driverID}/completed`}>Completed Rides</Link></li>
      </ul>
    </div>
  );
};

export default DriverSidebar;
