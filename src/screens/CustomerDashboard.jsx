import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, User, CarFront, Wrench, Clock, CheckCircle2, DollarSign, History } from 'lucide-react';
import '../styles/public.css';

const STAGES = [
  'Booking Confirmed',
  'Vehicle Received',
  'Inspection Started',
  'Service In Progress',
  'Parts Replacement',
  'Quality Check',
  'Washing & Cleaning',
  'Ready for Delivery',
  'Delivered'
];

const CustomerDashboard = () => {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const { activeVehicles, history, completed } = useAppContext();
  
  const [vehicleData, setVehicleData] = useState(null);
  const [serviceHistory, setServiceHistory] = useState([]);

  useEffect(() => {
    // 1. Check active vehicles
    let found = activeVehicles.find(v => v.bookingId === identifier || v.vehicleNo === identifier);
    
    // 2. Check recently completed
    if (!found) {
      found = completed.find(v => v.bookingId === identifier || v.vehicleNo === identifier);
    }
    
    // 3. Fallback (search in general history if only vehicle no provided)
    if (!found && identifier.includes('-')) {
      const histRecord = history.find(h => h.vehicleNo === identifier);
      if (histRecord) {
        found = {
          ...histRecord,
          statusIndex: 8, // Delivered
          currentStatus: 'Delivered',
          completionPercentage: 100,
          technician: histRecord.technician || 'Unknown',
          estimatedCost: histRecord.cost,
          finalCost: histRecord.cost,
        };
      }
    }

    if (found) {
      setVehicleData(found);
      // Find history for this customer or vehicle
      const custHistory = history.filter(h => h.customerId === found.customerId || h.vehicleNo === found.vehicleNo);
      setServiceHistory(custHistory.slice(0, 5)); // Last 5
    }
  }, [identifier, activeVehicles, completed, history]);

  if (!vehicleData) {
    return (
      <div className="portal-main flex-center">
        <div className="glass-card text-center">
          <h2>No Record Found</h2>
          <p>We couldn't find any active service or booking with ID: <strong>{identifier}</strong></p>
          <button className="btn-primary mt-4" onClick={() => navigate('/')}>Return Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-dashboard">
      <header className="dashboard-header">
        <button className="back-btn" onClick={() => navigate('/')}><ArrowLeft size={20} /> Back</button>
        <div className="header-titles">
          <h1>Vehicle Status Tracker</h1>
          <p>Real-time updates for {vehicleData.vehicleNo}</p>
        </div>
      </header>

      <main className="dashboard-content">
        
        {/* Timeline Tracker */}
        <section className="glass-card tracking-section">
          <h2>Service Progress</h2>
          <div className="progress-container">
            <div className="progress-bar-bg">
              <motion.div 
                className="progress-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${vehicleData.completionPercentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
            
            <div className="timeline-stages">
              {STAGES.map((stage, index) => {
                const isActive = index === vehicleData.statusIndex;
                const isCompleted = index < vehicleData.statusIndex;
                return (
                  <div key={index} className={`timeline-stage ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                    <div className="stage-dot">
                      {isCompleted && <CheckCircle2 size={16} />}
                    </div>
                    <span className="stage-label">{stage}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="completion-stats">
            <div className="stat-box">
              <span>Status</span>
              <h3>{vehicleData.currentStatus}</h3>
            </div>
            <div className="stat-box">
              <span>Completion</span>
              <h3>{vehicleData.completionPercentage}%</h3>
            </div>
            <div className="stat-box">
              <span>Est. Completion</span>
              <h3>{vehicleData.estimatedCompletionTime ? new Date(vehicleData.estimatedCompletionTime).toLocaleString() : 'N/A'}</h3>
            </div>
          </div>
        </section>

        <div className="details-grid">
          {/* Vehicle & Service Info */}
          <section className="glass-card details-section">
            <h2><CarFront className="icon" /> Service Details</h2>
            <div className="info-list">
              <div className="info-item">
                <span className="label">Customer Name</span>
                <span className="value">{vehicleData.customerName}</span>
              </div>
              <div className="info-item">
                <span className="label">Vehicle</span>
                <span className="value">{vehicleData.vehicle}</span>
              </div>
              <div className="info-item">
                <span className="label">Registration No.</span>
                <span className="value">{vehicleData.vehicleNo}</span>
              </div>
              <div className="info-item">
                <span className="label">Service Type</span>
                <span className="value">{vehicleData.serviceType || vehicleData.service}</span>
              </div>
              <div className="info-item">
                <span className="label">Assigned Technician</span>
                <span className="value">{vehicleData.technician}</span>
              </div>
            </div>
          </section>

          {/* Cost Info */}
          <section className="glass-card cost-section">
            <h2><DollarSign className="icon" /> Cost Summary</h2>
            <div className="cost-breakdown">
              <div className="cost-item">
                <span>Estimated Cost</span>
                <span className="amount">${vehicleData.estimatedCost}</span>
              </div>
              {vehicleData.finalCost > 0 && (
                <div className="cost-item final">
                  <span>Final Cost</span>
                  <span className="amount">${vehicleData.finalCost}</span>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Service History */}
        {serviceHistory.length > 0 && (
          <section className="glass-card history-section mt-4">
            <h2><History className="icon" /> Previous Service History</h2>
            <div className="history-table-wrap">
              <table className="nexus-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Service</th>
                    <th>Parts Replaced</th>
                    <th>Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceHistory.map(record => (
                    <tr key={record.id}>
                      <td>{record.date}</td>
                      <td>{record.service}</td>
                      <td>{record.parts}</td>
                      <td>${record.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default CustomerDashboard;
