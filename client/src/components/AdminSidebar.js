// src/components/AdminSidebar.js
import { Link } from 'react-router-dom';
import '../css/sidebar.css';
const AdminSidebar = () => {
  return (
    <div className="sidebar">
      <h3>Admin Panel</h3>
      <ul>
        <li><Link to="/admin/dashboard">Dashboard</Link></li>
        <li><Link to="/admin/add-vehicle">Add Vehicle</Link></li>
        <li><Link to="/admin/assign-driver">Assign Driver</Link></li>
        <li><Link to="/admin/driver-management">Driver Management</Link></li>
        <li><Link to="/admin/vehicle-management">Vehicle Management</Link></li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
