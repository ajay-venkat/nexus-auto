export const generateMockData = () => {
  // Helpers
  const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
  
  const firstNames = ['Arjun', 'Priya', 'Rahul', 'Sneha', 'Vikram', 'Neha', 'Rohan', 'Aisha', 'Karan', 'Pooja', 'Amit', 'Anjali', 'Sameer', 'Riya', 'Aditya', 'Meera', 'Kunal', 'Simran', 'Varun', 'Nisha', 'Tariq', 'Zara', 'Siddharth', 'Ishita', 'Manish'];
  const lastNames = ['Mehta', 'Sharma', 'Verma', 'Patel', 'Joshi', 'Singh', 'Kumar', 'Gupta', 'Das', 'Roy', 'Chawla', 'Bose', 'Nair', 'Menon', 'Rao', 'Iyer', 'Pillai', 'Reddy', 'Chowdhury', 'Deshmukh'];
  const vehicleModels = ['Tesla Model S', 'Tesla Model 3', 'Rivian R1T', 'Ford Mustang Mach-E', 'Hyundai Ioniq 5', 'Kia EV6', 'Porsche Taycan', 'Audi e-tron', 'BMW i4', 'Honda City', 'Toyota Fortuner', 'Maruti Swift', 'Hyundai Creta', 'Mahindra XUV700', 'Tata Nexon'];
  const services = ['Full System Diagnostic', 'Battery Optimization', 'Sensor Alignment', 'Synthetic Oil Change', 'Brake Pad Replacement', 'Tire Rotation & Balance', 'AC System Recharge', 'Suspension Overhaul', 'Software Update & Calibration', 'Transmission Fluid Change', 'Wheel Alignment', 'Engine Tuning', 'Detailing & Wash'];
  const partsList = ['Diagnostics Port Array', 'Coolant lines, Node #4', 'LIDAR Array', 'Filter, 5W-30 Oil', 'Ceramic Pads, Rotors', '4x Alloy Tires', 'R-134a Refrigerant', 'Struts, Control Arms', 'ECU Module Flash', 'CVT Fluid, Filter Kit'];
  const statuses = ['Booking Confirmed', 'Vehicle Received', 'Inspection Started', 'Service In Progress', 'Parts Replacement', 'Quality Check', 'Washing & Cleaning', 'Ready for Delivery', 'Delivered'];
  const techs = ['Rajesh K.', 'Amit S.', 'Manoj D.', 'Suresh V.', 'Vikash P.', 'John D.', 'Prakash R.'];

  // 1. Generate 50 Customers
  const customers = Array.from({ length: 50 }, (_, i) => ({
    id: `CUST${1000 + i}`,
    name: `${randomItem(firstNames)} ${randomItem(lastNames)}`,
    phone: `+91 98${randomInt(10000000, 99999999)}`,
    email: `customer${i}@example.com`,
    totalSpending: randomInt(100, 5000),
    lastVisit: randomDate(new Date(2025, 0, 1), new Date()).toISOString().split('T')[0],
  }));

  // 2. Generate 100 Service History Records (Completed)
  const serviceHistory = Array.from({ length: 100 }, (_, i) => {
    const cust = randomItem(customers);
    return {
      id: `SH${10000 + i}`,
      customerId: cust.id,
      customerName: cust.name,
      date: randomDate(new Date(2024, 0, 1), new Date(2026, 5, 1)).toISOString().split('T')[0],
      service: randomItem(services),
      parts: randomItem(partsList),
      status: 'Delivered',
      cost: randomInt(50, 1200),
      vehicle: randomItem(vehicleModels),
      vehicleNo: `KA-${randomInt(1, 10).toString().padStart(2, '0')}-${String.fromCharCode(65+randomInt(0,25))}${String.fromCharCode(65+randomInt(0,25))}-${randomInt(1000, 9999)}`,
      technician: randomItem(techs)
    };
  });

  // 3. Generate 30 Active Vehicles (in service right now)
  const activeVehicles = Array.from({ length: 30 }, (_, i) => {
    const cust = randomItem(customers);
    const statusIndex = randomInt(0, 7); // Exclude Delivered for active
    return {
      id: `ACT${20000 + i}`,
      bookingId: `BKG${50000 + i}`,
      customerId: cust.id,
      customerName: cust.name,
      vehicle: randomItem(vehicleModels),
      vehicleNo: `MH-${randomInt(1, 10).toString().padStart(2, '0')}-${String.fromCharCode(65+randomInt(0,25))}${String.fromCharCode(65+randomInt(0,25))}-${randomInt(1000, 9999)}`,
      serviceType: randomItem(services),
      technician: randomItem(techs),
      currentStatus: statuses[statusIndex],
      statusIndex: statusIndex,
      estimatedCost: randomInt(100, 800),
      finalCost: 0,
      completionPercentage: Math.floor((statusIndex / 8) * 100),
      estimatedCompletionTime: new Date(Date.now() + randomInt(1, 48) * 3600000).toISOString(),
      notes: 'Routine service.'
    };
  });

  // 4. Generate 20 Completed Services (recent)
  const recentCompleted = Array.from({ length: 20 }, (_, i) => {
    const cust = randomItem(customers);
    return {
      id: `CMP${30000 + i}`,
      bookingId: `BKG${60000 + i}`,
      customerId: cust.id,
      customerName: cust.name,
      vehicle: randomItem(vehicleModels),
      vehicleNo: `DL-${randomInt(1, 10).toString().padStart(2, '0')}-${String.fromCharCode(65+randomInt(0,25))}${String.fromCharCode(65+randomInt(0,25))}-${randomInt(1000, 9999)}`,
      serviceType: randomItem(services),
      technician: randomItem(techs),
      currentStatus: 'Delivered',
      statusIndex: 8,
      estimatedCost: randomInt(100, 800),
      finalCost: randomInt(100, 850),
      completionPercentage: 100,
      completedDate: randomDate(new Date(2026, 4, 1), new Date()).toISOString(),
    };
  });

  // 5. Generate 15 Pickup Requests
  const pickups = Array.from({ length: 15 }, (_, i) => {
    const cust = randomItem(customers);
    return {
      id: `PKP${40000 + i}`,
      customerName: cust.name,
      address: `${randomInt(1, 100)} Random St, City`,
      date: randomDate(new Date(2026, 5, 20), new Date(2026, 6, 20)).toISOString().split('T')[0],
      time: `${randomInt(9, 17).toString().padStart(2, '0')}:00`,
      condition: randomItem(['drivable', 'not_drivable']),
      status: randomItem(['pending', 'assigned', 'in_transit', 'completed']),
      requestedAt: Date.now() - randomInt(0, 86400000 * 5)
    };
  });

  // KPI Data
  const kpiData = {
    totalVehiclesToday: randomInt(40, 80),
    vehiclesInService: activeVehicles.length,
    completedServicesToday: randomInt(10, 25),
    pendingDeliveries: randomInt(5, 15),
    revenueToday: randomInt(2000, 10000),
    revenueThisMonth: randomInt(50000, 150000),
    customerSatisfaction: 98
  };

  return { customers, serviceHistory, activeVehicles, recentCompleted, pickups, kpiData };
};

export const initializeMockData = () => {
  if (!localStorage.getItem('nexus_initialized')) {
    const data = generateMockData();
    localStorage.setItem('nexus_customers', JSON.stringify(data.customers));
    localStorage.setItem('nexus_history', JSON.stringify(data.serviceHistory));
    localStorage.setItem('nexus_active_vehicles', JSON.stringify(data.activeVehicles));
    localStorage.setItem('nexus_completed', JSON.stringify(data.recentCompleted));
    localStorage.setItem('nexus_pickups', JSON.stringify(data.pickups));
    localStorage.setItem('nexus_kpis', JSON.stringify(data.kpiData));
    localStorage.setItem('nexus_initialized', 'true');
  }
};
