import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Original Components
import LandingPage from './components/LandingPage';
import DashboardScreen from './screens/DashboardScreen';
import ServiceBooking from './modules/ServiceBooking';
import CostEstimator from './modules/CostEstimator';
import VehicleHistory from './modules/VehicleHistory';
import PickupRequest from './modules/PickupRequest';
import ServiceReminders from './modules/ServiceReminders';
import { useToast, ToastProvider } from './components/ToastContext';

// Admin Components & Context
import { AppProvider } from './context/AppContext';
import CustomerDashboard from './screens/CustomerDashboard';
import AdminLogin from './screens/AdminLogin';
import AdminLayout from './screens/AdminLayout';
import AdminOverview from './modules/admin/AdminOverview';
import LiveServiceManagement from './modules/admin/LiveServiceManagement';
import RevenueAnalytics from './modules/admin/RevenueAnalytics';
import CustomerManagement from './modules/admin/CustomerManagement';
import ServiceHistoryManagement from './modules/admin/ServiceHistoryManagement';

// --- INITIAL DATA ---
const INITIAL_HISTORY = [
  { id: 1, date: '2026-05-12', service: 'Full System Diagnostic', parts: 'Diagnostics Port Array', status: 'completed', cost: 120, vehicle: 'Tesla Model S', vehicleNo: 'KA-01-AB-1234' },
  { id: 2, date: '2026-03-18', service: 'Battery Optimization', parts: 'Coolant lines, Node #4', status: 'completed', cost: 350, vehicle: 'Tesla Model 3', vehicleNo: 'KA-02-CD-5678' },
  { id: 3, date: '2026-01-20', service: 'Sensor Alignment', parts: 'LIDAR Array, Proximity Sensors', status: 'completed', cost: 95, vehicle: 'Rivian R1T', vehicleNo: 'MH-12-EF-9012' },
  { id: 4, date: '2025-12-10', service: 'Synthetic Oil Change', parts: 'Filter, 5W-30 Oil', status: 'completed', cost: 85, vehicle: 'Ford Mustang Mach-E', vehicleNo: 'DL-04-GH-3456' },
  { id: 5, date: '2025-09-05', service: 'Brake Pad Replacement', parts: 'Ceramic Pads, Rotors', status: 'completed', cost: 450, vehicle: 'Tesla Model S', vehicleNo: 'KA-01-AB-1234' }
];

const INITIAL_REMINDERS = [
  { id: 101, title: 'Brake Pad Inspection', due: '2026-07-01', urgent: true, vehicle: 'Tesla Model S' },
  { id: 102, title: 'Annual Diagnostic', due: '2026-09-15', urgent: false, vehicle: 'Rivian R1T' }
];

const INITIAL_PICKUPS = [
  { id: 201, address: '42 Marine Drive, Mumbai', date: '2026-06-20', time: '09:00', condition: 'drivable', status: 'completed', requestedAt: Date.now() - 86400000 * 3 },
  { id: 202, address: '15 MG Road, Bangalore', date: '2026-06-22', time: '10:30', condition: 'not_drivable', status: 'completed', requestedAt: Date.now() - 86400000 * 2 }
];

const INITIAL_BOOKINGS = [
  { id: 301, customerName: 'Arjun Mehta', vehicleNo: 'KA-01-AB-1234', model: 'Tesla Model S', serviceType: 'Routine Maintenance', date: '2026-07-05 10:00', notes: 'Check suspension noise' }
];

function AppContent() {
  const { addToast } = useToast();

  // Global State (Database Simulator with localStorage persistence)
  const [historyData, setHistoryData] = useState(() => {
    const saved = localStorage.getItem('carDemo_history');
    return saved ? JSON.parse(saved) : INITIAL_HISTORY;
  });

  const [remindersData, setRemindersData] = useState(() => {
    const saved = localStorage.getItem('carDemo_reminders');
    return saved ? JSON.parse(saved) : INITIAL_REMINDERS;
  });

  const [pickupsData, setPickupsData] = useState(() => {
    const saved = localStorage.getItem('carDemo_pickups');
    return saved ? JSON.parse(saved) : INITIAL_PICKUPS;
  });

  const [bookingsData, setBookingsData] = useState(() => {
    const saved = localStorage.getItem('carDemo_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [totalBookings, setTotalBookings] = useState(() => {
    const saved = localStorage.getItem('carDemo_bookingsCount');
    return saved ? parseInt(saved) : INITIAL_HISTORY.length + INITIAL_BOOKINGS.length;
  });

  // Persist State
  useEffect(() => { localStorage.setItem('carDemo_history', JSON.stringify(historyData)); }, [historyData]);
  useEffect(() => { localStorage.setItem('carDemo_reminders', JSON.stringify(remindersData)); }, [remindersData]);
  useEffect(() => { localStorage.setItem('carDemo_pickups', JSON.stringify(pickupsData)); }, [pickupsData]);
  useEffect(() => { localStorage.setItem('carDemo_bookings', JSON.stringify(bookingsData)); }, [bookingsData]);
  useEffect(() => { localStorage.setItem('carDemo_bookingsCount', totalBookings.toString()); }, [totalBookings]);

  // Global Actions
  const addBooking = (bookingData) => {
    const newBooking = {
      id: Date.now(),
      ...bookingData,
      date: `${bookingData.date} ${bookingData.time || ''}`.trim()
    };
    setBookingsData(prev => [newBooking, ...prev]);

    const newReminder = {
      id: Date.now() + 1,
      title: bookingData.serviceType,
      due: bookingData.date,
      urgent: false,
      notes: bookingData.notes,
      vehicle: bookingData.model
    };
    setRemindersData(prev => [newReminder, ...prev]);
    setTotalBookings(prev => prev + 1);
    addToast('Booking Confirmed', `Successfully scheduled for ${bookingData.date}`, 'success');
  };

  const completeService = (reminder) => {
    setRemindersData(prev => prev.filter(r => r.id !== reminder.id));
    
    const newHistoryEntry = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      service: reminder.title,
      parts: 'Routine Checks',
      status: 'completed',
      cost: Math.floor(Math.random() * 200) + 50,
      vehicle: reminder.vehicle || 'Unknown',
      vehicleNo: 'N/A'
    };
    setHistoryData(prev => [newHistoryEntry, ...prev]);
    addToast('Service Completed', `${reminder.title} added to vehicle history.`, 'success');
  };

  const addReminder = (reminder) => {
    const newReminder = {
      id: Date.now(),
      ...reminder,
      urgent: false
    };
    setRemindersData(prev => [newReminder, ...prev]);
    addToast('Reminder Added', `Added ${reminder.title}`, 'success');
  };

  const editReminder = (id, updatedData) => {
    setRemindersData(prev => prev.map(r => r.id === id ? { ...r, ...updatedData } : r));
    addToast('Reminder Updated', 'The reminder has been successfully saved.', 'info');
  };

  const deleteReminder = (id) => {
    setRemindersData(prev => prev.filter(r => r.id !== id));
    addToast('Reminder Deleted', 'The reminder was removed from your schedule.', 'error');
  };

  const requestPickup = (data) => {
    const newPickup = {
      id: Date.now(),
      ...data,
      requestedAt: Date.now(),
      status: 'requested'
    };
    setPickupsData(prev => [newPickup, ...prev]);
    addToast('Driver Dispatched', `Pickup requested for ${data.address}`, 'success');
  };

  const generateEstimate = (total, repairsStr) => {
    addToast('Estimate Generated', `Total estimated cost: $${total}`, 'info');
    
    const newHistoryEntry = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      service: 'Custom Estimate',
      parts: repairsStr,
      status: 'pending',
      cost: total,
      vehicle: 'Estimate',
      vehicleNo: 'N/A'
    };
    setHistoryData(prev => [newHistoryEntry, ...prev]);
  };

  // Landing page redirect helper component
  const LandingRedirect = () => {
    const navigate = useNavigate();
    return <LandingPage onEnter={() => navigate('/dashboard')} />;
  };

  return (
    <Routes>
      <Route path="/" element={<LandingRedirect />} />
      <Route path="/dashboard" element={
        <DashboardScreen 
          totalBookings={totalBookings} 
          remindersData={remindersData} 
          pickupsData={pickupsData}
        />
      } />
      <Route path="/booking" element={<ServiceBooking onBook={addBooking} bookingsData={bookingsData} />} />
      <Route path="/history" element={<VehicleHistory historyData={historyData} />} />
      <Route path="/cost" element={<CostEstimator onGenerate={generateEstimate} />} />
      <Route path="/pickup" element={<PickupRequest pickupsData={pickupsData} onRequest={requestPickup} />} />
      <Route path="/reminders" element={
        <ServiceReminders 
          remindersData={remindersData} 
          onAdd={addReminder}
          onComplete={completeService}
          onEdit={editReminder}
          onDelete={deleteReminder}
        />
      } />

      {/* TRACKING PORTAL */}
      <Route path="/track/:identifier" element={<CustomerDashboard />} />
      <Route path="/track" element={<Navigate to="/dashboard" replace />} />

      {/* ADMIN ROUTES */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminOverview />} />
        <Route path="live-service" element={<LiveServiceManagement />} />
        <Route path="revenue" element={<RevenueAnalytics />} />
        <Route path="customers" element={<CustomerManagement />} />
        <Route path="history" element={<ServiceHistoryManagement />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
