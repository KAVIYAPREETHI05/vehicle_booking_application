import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PassengerSidebar from './PassengerSidebar';
import DriverSidebar from './DriverSidebar';
import AdminSidebar from './AdminSidebar';

const MainLayout = () => {
  const location = useLocation();

  // Fix: Ensure accurate match for route prefixes
  const isPassenger = location.pathname.startsWith('/users/passenger');
  const isDriver = location.pathname.startsWith('/users/drivers');
  const isAdmin = location.pathname.startsWith('/admin');

  const renderSidebar = () => {
    if (isPassenger) return <PassengerSidebar />;
    if (isDriver) return <DriverSidebar />;
    if (isAdmin) return <AdminSidebar />;
    return null;
  };

  return (
    <div style={{ display: 'flex' }}>
      {renderSidebar()}
      <div style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
