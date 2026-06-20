import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '../components/ToastContext';
import { useAppContext } from '../context/AppContext';
import { Car, Wrench, MapPin, Search, LogIn, Calendar, Calculator, CheckCircle } from 'lucide-react';
import '../styles/public.css';

const PublicPortal = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { setPickups, pickups, setHistory } = useAppContext();
  
  const [trackingId, setTrackingId] = useState('');
  
  // Cost Estimator State
  const [estimateVehicle, setEstimateVehicle] = useState('Tesla Model S');
  const [estimateService, setEstimateService] = useState('Routine Maintenance');
  const [estimateTotal, setEstimateTotal] = useState(0);

  // Booking State
  const [bookingData, setBookingData] = useState({ name: '', vehicle: '', date: '', service: 'Routine Maintenance' });
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Pickup State
  const [pickupData, setPickupData] = useState({ address: '', date: '', time: '', condition: 'drivable' });

  const handleTrack = (e) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      addToast('Error', 'Please enter a Booking ID or Vehicle Number', 'error');
      return;
    }
    navigate(`/track/${encodeURIComponent(trackingId)}`);
  };

  const handleEstimate = () => {
    const basePrices = {
      'Routine Maintenance': 150,
      'Diagnostics': 80,
      'System Repair': 400,
      'Battery Service': 600,
    };
    const multiplier = estimateVehicle.includes('Tesla') || estimateVehicle.includes('Rivian') ? 1.5 : 1;
    const total = basePrices[estimateService] * multiplier;
    setEstimateTotal(total);
    addToast('Estimate Calculated', `Estimated cost: $${total}`, 'info');
  };

  const handleBooking = (e) => {
    e.preventDefault();
    const newId = `BKG${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingSuccess(newId);
    addToast('Booking Confirmed', `Your Booking ID is ${newId}`, 'success');
  };

  const handlePickup = (e) => {
    e.preventDefault();
    const newPickup = {
      id: `PKP${Date.now()}`,
      customerName: 'Guest User',
      ...pickupData,
      status: 'pending',
      requestedAt: Date.now()
    };
    setPickups([newPickup, ...pickups]);
    addToast('Pickup Requested', 'Our driver will contact you shortly.', 'success');
    setPickupData({ address: '', date: '', time: '', condition: 'drivable' });
  };

  return (
    <div className="public-portal">
      {/* Header / Landing Section */}
      <header className="portal-header">
        <div className="header-top">
          <div className="logo-area">
            <Wrench className="logo-icon" />
            <span className="logo-text">NEXUS AUTO</span>
          </div>
          <button className="admin-login-btn" onClick={() => navigate('/admin/login')}>
            <LogIn size={18} /> Admin Login
          </button>
        </div>
        
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1>Next-Gen Auto Service</h1>
          <p>Transparent. Efficient. Advanced.</p>
          
          <form className="tracking-form" onSubmit={handleTrack}>
            <div className="search-wrapper">
              <Search className="search-icon" />
              <input 
                type="text" 
                placeholder="Enter Booking ID or Vehicle No. to Track..."
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
              />
              <button type="submit" className="track-btn">Track Vehicle</button>
            </div>
          </form>
        </motion.div>

        <div className="hero-background">
          <div className="glow-orb orb-1"></div>
          <div className="glow-orb orb-2"></div>
        </div>
      </header>

      {/* Main Content Areas */}
      <main className="portal-main">
        <div className="services-grid">
          
          {/* Booking Section */}
          <motion.section 
            className="glass-card"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="card-header">
              <Calendar className="card-icon" />
              <h2>Book a Service</h2>
            </div>
            {bookingSuccess ? (
              <div className="success-state">
                <CheckCircle className="success-icon" size={48} />
                <h3>Booking Confirmed!</h3>
                <p>Your Booking ID: <strong>{bookingSuccess}</strong></p>
                <button className="btn-secondary" onClick={() => setBookingSuccess(null)}>Book Another</button>
              </div>
            ) : (
              <form className="service-form" onSubmit={handleBooking}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" required value={bookingData.name} onChange={e => setBookingData({...bookingData, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Vehicle Model / No.</label>
                  <input type="text" required value={bookingData.vehicle} onChange={e => setBookingData({...bookingData, vehicle: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Preferred Date</label>
                  <input type="date" required value={bookingData.date} onChange={e => setBookingData({...bookingData, date: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Service Type</label>
                  <select value={bookingData.service} onChange={e => setBookingData({...bookingData, service: e.target.value})}>
                    <option>Routine Maintenance</option>
                    <option>Diagnostics</option>
                    <option>System Repair</option>
                    <option>Battery Service</option>
                  </select>
                </div>
                <button type="submit" className="btn-primary w-full">Confirm Booking</button>
              </form>
            )}
          </motion.section>

          {/* Cost Estimator */}
          <motion.section 
            className="glass-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="card-header">
              <Calculator className="card-icon" />
              <h2>Cost Estimator</h2>
            </div>
            <div className="service-form">
              <div className="form-group">
                <label>Select Vehicle</label>
                <select value={estimateVehicle} onChange={e => setEstimateVehicle(e.target.value)}>
                  <option>Tesla Model S</option>
                  <option>Tesla Model 3</option>
                  <option>Rivian R1T</option>
                  <option>Honda City</option>
                  <option>Generic ICE SUV</option>
                </select>
              </div>
              <div className="form-group">
                <label>Service Type</label>
                <select value={estimateService} onChange={e => setEstimateService(e.target.value)}>
                  <option>Routine Maintenance</option>
                  <option>Diagnostics</option>
                  <option>System Repair</option>
                  <option>Battery Service</option>
                </select>
              </div>
              <button onClick={handleEstimate} className="btn-secondary w-full">Calculate Estimate</button>
              
              {estimateTotal > 0 && (
                <div className="estimate-result">
                  <span>Estimated Cost:</span>
                  <h3>${estimateTotal}</h3>
                </div>
              )}
            </div>
          </motion.section>

          {/* Pickup Request */}
          <motion.section 
            className="glass-card"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="card-header">
              <MapPin className="card-icon" />
              <h2>Request Pickup</h2>
            </div>
            <form className="service-form" onSubmit={handlePickup}>
              <div className="form-group">
                <label>Pickup Location</label>
                <textarea required rows="2" value={pickupData.address} onChange={e => setPickupData({...pickupData, address: e.target.value})}></textarea>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" required value={pickupData.date} onChange={e => setPickupData({...pickupData, date: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input type="time" required value={pickupData.time} onChange={e => setPickupData({...pickupData, time: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Vehicle Condition</label>
                <select value={pickupData.condition} onChange={e => setPickupData({...pickupData, condition: e.target.value})}>
                  <option value="drivable">Drivable</option>
                  <option value="not_drivable">Not Drivable (Requires Towing)</option>
                </select>
              </div>
              <button type="submit" className="btn-primary w-full">Request Pickup</button>
            </form>
          </motion.section>

        </div>
      </main>
    </div>
  );
};

export default PublicPortal;
