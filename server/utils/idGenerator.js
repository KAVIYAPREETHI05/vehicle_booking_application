let adminCount = 100;
let driverCount = 100;
let passCount = 100;

const generateId = (role) => {
  if (role === 'admin') return `admin${adminCount++}`;
  if (role === 'driver') return `driver${driverCount++}`;
  if (role === 'passenger') return `pass${passCount++}`;
  return null;
};

module.exports = generateId;
