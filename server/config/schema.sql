USE booking_management;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    generated_id VARCHAR(50) NOT NULL UNIQUE, -- e.g., pass123, driver101, admin1
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- hashed password
    role ENUM('passenger', 'driver', 'admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT *FROM users;

CREATE TABLE IF NOT EXISTS vehicles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vehicleId VARCHAR(10) NOT NULL UNIQUE,
  vehicleType VARCHAR(100) NOT NULL,
  vehicleNumber VARCHAR(50) NOT NULL UNIQUE,
  capacity INT NOT NULL,
  status ENUM('Available', 'Unavailable') DEFAULT 'Available'
);

SELECT *FROM vehicles;

CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  passID VARCHAR(20) NOT NULL,
  vehicleId VARCHAR(10) NOT NULL,
  place VARCHAR(100) NOT NULL,
  time VARCHAR(10) NOT NULL,
  reason TEXT NOT NULL,
  bookingTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE bookings ADD COLUMN status VARCHAR(20) DEFAULT 'Requested';
ALTER TABLE bookings ADD COLUMN driverID VARCHAR(255);



SELECT *FROM bookings;


DESCRIBE bookings;
DESCRIBE drivers;

CREATE TABLE drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    driver_id VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) NOT NULL,
    experience INT NOT NULL,
    status ENUM('on_duty', 'on_leave', 'suspended', 'terminated') DEFAULT 'on_duty',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
ALTER TABLE drivers MODIFY status ENUM('available', 'not_available', 'on_leave', 'suspended', 'terminated') DEFAULT 'available';

SELECT *FROM drivers;
SELECT *FROM users;
SELECT * FROM ASSIGNMENTS;
show columns from drivers;
DESCRIBE users;
DESCRIBE ASSIGNMENTS;

CREATE TABLE assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    driver_id VARCHAR(10) NOT NULL,
    vehicle_id VARCHAR(10) NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES drivers(driver_id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicleId)
);

select *from assignments;
describe assignments; 

USE booking_management;

CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('reminder', 'driver_message', 'arrival', 'passenger_message', 'system', 'waiting') NOT NULL,
  message TEXT NOT NULL,
  driver_id VARCHAR(10),
  passID VARCHAR(20),
  booking_id INT,
  isRead BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (driver_id) REFERENCES drivers(driver_id),
  FOREIGN KEY (passID) REFERENCES users(generated_id),
  FOREIGN KEY (booking_id) REFERENCES bookings(id)
);
ALTER TABLE notifications 
DROP FOREIGN KEY notifications_ibfk_1,
DROP FOREIGN KEY notifications_ibfk_2,
DROP FOREIGN KEY notifications_ibfk_3;


SELECT * FROM NOTIFICATIONS;
-- Check drivers table structure
DESCRIBE drivers;

-- Check bookings table structure  
DESCRIBE bookings;

-- Check vehicles table structure
DESCRIBE vehicles;
