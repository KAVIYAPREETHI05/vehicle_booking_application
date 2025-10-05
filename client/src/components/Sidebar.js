import React, { useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import "../css/sidebar.css";

const Sidebar = ({ role = "" }) => {
  const { passengerID, driverID } = useParams();
  const id = passengerID || driverID;
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Get current pathname to highlight active links
  const currentPath = location.pathname;

  // Utility to check if link is active
  const isActive = (path) => currentPath === path ? "active-link" : "";

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        ☰
      </button>
      
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <h3>{role.toUpperCase()} MENU</h3>
        <ul>
          {role === "passenger" && (
            <>
              <li>
                <Link className={isActive(`/users/passenger/${id}/dashboard`)} to={`/users/passenger/${id}/dashboard`}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link className={isActive(`/users/passenger/${id}/book`)} to={`/users/passenger/${id}/book`}>
                  Book Vehicle
                </Link>
              </li>
              <li>
                <Link className={isActive(`/users/passenger/${id}/status`)} to={`/users/passenger/${id}/status`}>
                  Request Status
                </Link>
              </li>
              <li>
                <Link className={isActive(`/users/passenger/${id}/support`)} to={`/users/passenger/${id}/support`}>
                  Contact Support
                </Link>
              </li>
            </>
          )}

          {role === "driver" && (
            <>
              <li>
                <Link className={isActive(`/users/drivers/${id}/dashboard`)} to={`/users/drivers/${id}/dashboard`}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link className={isActive(`/users/drivers/request`)} to={`/users/drivers/request`}>
                  Ride Requests
                </Link>
              </li>
              <li>
                <Link className={isActive(`/users/drivers/${id}/accepted`)} to={`/users/drivers/${id}/accepted`}>
                  Accepted Rides
                </Link>
              </li>
              <li>
                <Link className={isActive(`/users/drivers/${id}/completed`)} to={`/users/drivers/${id}/completed`}>
                  Completed Rides
                </Link>
              </li>
            </>
          )}

          {role === "admin" && (
            <>
              <li>
                <Link className={isActive(`/admin/dashboard`)} to="/admin/dashboard">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link className={isActive(`/admin/add-vehicle`)} to="/admin/add-vehicle">
                  Add Vehicle
                </Link>
              </li>
              <li>
                <Link className={isActive(`/admin/assign-driver`)} to="/admin/assign-driver">
                  Assign Driver
                </Link>
              </li>
              <li>
                <Link className={isActive(`/admin/driver-management`)} to="/admin/driver-management">
                  Driver Management
                </Link>
              </li>
              <li>
                <Link className={isActive(`/admin/vehicle-management`)} to="/admin/vehicle-management">
                  Vehicle Management
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
      
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </>
  );
};

export default Sidebar;