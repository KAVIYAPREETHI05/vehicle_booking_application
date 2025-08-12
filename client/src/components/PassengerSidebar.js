// src/components/PassengerSidebar.js
import { Link, useParams } from 'react-router-dom';
import '../css/sidebar.css';
const PassengerSidebar = () => {
  const { passengerID } = useParams();

  return (
    <div className="sidebar">
      <h3>Passenger Panel</h3>
      <ul>
        <li><Link to={`/users/passenger/${passengerID}/dashboard`}>Dashboard</Link></li>
        <li><Link to={`/users/passenger/${passengerID}/book`}>Book Vehicle</Link></li>
        <li><Link to={`/users/passenger/${passengerID}/status`}>Request Status</Link></li>
        <li><Link to={`/users/passenger/${passengerID}/support`}>Contact Support</Link></li>
      </ul>
    </div>
  );
};

export default PassengerSidebar;
