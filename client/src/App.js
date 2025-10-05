import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";

import MainLayout from "./components/MainLayout";

import PassengerDashboard from "./pages/passenger/PassengerDashboard";
import BookVehicle from "./pages/passenger/BookVehicle";
import RequestStatus from "./pages/passenger/RequestStatus";
import ContactSupport from "./pages/passenger/ContactPage";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AddVehicle from "./pages/admin/AddVehicle";
import AssignDriver from "./pages/admin/AssignDriver";
import DriverManagement from "./pages/admin/DriverManagement";
import VehicleManagement from "./pages/admin/VehicleManagement";

import DriverDashboard from "./pages/driver/DriverDashboard";
import CompletedRides from "./pages/driver/CompletedRides";
import RideRequest from "./pages/driver/RideRequests";
import AccepteRides from "./pages/driver/AcceptedRides";
import Notification from "./pages/driver/Notifications";

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default Route Redirect to Signup */}
          <Route path="/" element={<Navigate to="/signup" />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route element={<MainLayout />}>

           {/* Passenger Routes */}
          <Route path="/users/passenger/:passengerID/dashboard" element={<PassengerDashboard />} />
          <Route path="/users/passenger/:passengerID/book" element={<BookVehicle />} />
          <Route path="/users/passenger/:passengerID/status" element={<RequestStatus />} />
          <Route path="/users/passenger/:passengerID/support" element={<ContactSupport />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/add-vehicle" element={<AddVehicle />} />
          <Route path="/admin/assign-driver" element={<AssignDriver />} />
          <Route path="/admin/driver-management" element={<DriverManagement />} />
          <Route path="/admin/vehicle-management" element={<VehicleManagement />} />
          {/* Add other admin routes here */}

          {/* Driver Routes */}
          <Route path="/users/drivers/:driverID/dashboard" element={<DriverDashboard />} />
          <Route path="/users/drivers/:driverID/accepted" element={<AccepteRides />} />
          <Route path="/users/drivers/:driverID/Completed" element={<CompletedRides />} />
          <Route path="/users/drivers/request" element={<RideRequest />} />
          <Route path="/users/drivers/:driverID/notification" element={<Notification />} />

          {/* Add other driver routes here */}
          </Route>

        </Routes>
      </div>
    </Router>
  );
}

export default App;
