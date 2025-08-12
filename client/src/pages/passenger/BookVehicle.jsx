import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import "../../css/formStyle.css";

const BookVehicle = () => {
  const { passengerID } = useParams();
  
  const [vehicleList, setVehicleList] = useState([]);
  const [formData, setFormData] = useState({
    vehicleId: "",
    place: "",
    hour: "",
    minute: "",
    reason: "",
  });

  const places = [
    "main block", "sf", "research park", "mech", "ib front", "ib back",
    "as front", "as back", "gate b", "gate c", "girls hostel", "boys hostel",
    "cricket ground", "parking"
  ];

  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const minutes = ["00", "15", "30", "45"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const passengerID = localStorage.getItem("passID");
  const time = `${formData.hour}:${formData.minute}`;

  if (!passengerID || !formData.vehicleId || !formData.place || !formData.hour || !formData.minute || !formData.reason) {
    alert("All fields are required");
    return;
  }

  const bookingPayload = {
    vehicleId: formData.vehicleId,
    place: formData.place,
    time: time,
    reason: formData.reason,
    passID: passengerID,
  };

  console.log("Booking payload:", bookingPayload);

  try {
    await axios.post("http://localhost:5000/api/bookings/book", bookingPayload);
    alert("Vehicle booked successfully!");
    setFormData({
      vehicleId: "",
      place: "",
      hour: "",
      minute: "",
      reason: "",
    });
  } catch (err) {
    console.error("Booking error:", err.response?.data || err.message);
    alert(err.response?.data?.error || "Booking failed.");
  }
};


  useEffect(() => {
    const fetchAvailableVehicles = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/vehicles/available");
        setVehicleList(res.data);
      } catch (err) {
        console.error("Failed to fetch vehicles", err);
      }
    };
    fetchAvailableVehicles();
  }, []);

  return (
    <div className="form-container">
      <h2>Book Vehicle</h2>
      <form onSubmit={handleSubmit}>
        <label>Vehicle ID</label>
        <select name="vehicleId" value={formData.vehicleId} onChange={handleChange} required>
          <option value="">Select Vehicle</option>
          {vehicleList.map((vehicle) => (
            <option key={vehicle.vehicleId} value={vehicle.vehicleId}>
              {vehicle.vehicleId}
            </option>
          ))}
        </select>

        <label>Pickup Place</label>
        <select name="place" value={formData.place} onChange={handleChange} required>
          <option value="">Select Place</option>
          {places.map((place) => (
            <option key={place} value={place}>
              {place}
            </option>
          ))}
        </select>

        <label>Time</label>
        <div style={{ display: "flex", gap: "10px" }}>
          <select name="hour" value={formData.hour} onChange={handleChange} required>
            <option value="">Hour</option>
            {hours.map((hr) => (
              <option key={hr} value={hr}>
                {hr}
              </option>
            ))}
          </select>

          <select name="minute" value={formData.minute} onChange={handleChange} required>
            <option value="">Minute</option>
            {minutes.map((min) => (
              <option key={min} value={min}>
                {min}
              </option>
            ))}
          </select>
        </div>

        <label>Reason</label>
        <textarea name="reason" value={formData.reason} onChange={handleChange} required />

        <button type="submit">Book</button>
      </form>
    </div>
  );
};

export default BookVehicle;
