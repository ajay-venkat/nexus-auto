import { ArrowLeft, CheckCircle, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SERVICE_COSTS = {
  'Routine Maintenance': 150,
  'Diagnostics': 89,
  'System Repair': 350,
  'Software/Hardware Upgrade': 200,
  'Oil Change': 65,
  'Brake Service': 280,
  'Tire Replacement': 400
};

export default function ServiceBooking({ onBook, bookingsData }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    customerName: '',
    vehicleNo: '',
    model: '', 
    serviceType: '', 
    date: '', 
    time: '',
    notes: '' 
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState(0);

  useEffect(() => {
    if (formData.serviceType && SERVICE_COSTS[formData.serviceType]) {
      setEstimatedCost(SERVICE_COSTS[formData.serviceType]);
    } else {
      setEstimatedCost(0);
    }
  }, [formData.serviceType]);

  const validate = () => {
    if (!formData.customerName.trim()) return "Pilot Name is required";
    if (!formData.vehicleNo.trim()) return "Registration ID is required";
    if (!formData.model.trim()) return "Chassis Model is required";
    if (!formData.serviceType) return "Please select a maintenance protocol";
    if (!formData.date) return "Please choose an engagement date";
    
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0,0,0,0);
    if (selectedDate < today) return "Engagement date cannot be in the past";
    
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('[NEXUS] Protocol initiated:', formData);
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    
    setError('');
    onBook(formData);
    setSuccess(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 2500);
  };

  return (
    <div className="page-container">
      <div className="page-content-wrapper glass-panel" style={{ padding: '40px', maxWidth: '900px' }}>
        <div className="overlay-header" style={{ borderBottomColor: 'rgba(0, 240, 255, 0.2)' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Zap size={28} color="var(--accent-color)" />
            Service Initialization
          </h2>
          <Link to="/dashboard" className="back-btn"><ArrowLeft size={18} /> Access Dashboard</Link>
        </div>
        
        {success ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '20px', animation: 'fadeInScale 0.5s forwards' }}>
            <div style={{ position: 'relative' }}>
              <CheckCircle size={80} color="var(--accent-color)" style={{ position: 'relative', zIndex: 2 }} />
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100px', height: '100px', background: 'var(--accent-glow)', filter: 'blur(30px)', zIndex: 1, borderRadius: '50%' }}></div>
            </div>
            <h3 style={{ color: 'var(--text-primary)', fontSize: '2rem', textShadow: '0 0 20px var(--accent-glow)' }}>Sequence Confirmed</h3>
            <p style={{ color: 'var(--accent-color)', letterSpacing: '2px', textTransform: 'uppercase' }}>Routing to central dashboard...</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
              <button 
                onClick={() => setShowHistory(false)}
                style={{
                  color: !showHistory ? 'var(--accent-color)' : 'var(--text-secondary)',
                  borderBottom: !showHistory ? '2px solid var(--accent-color)' : '2px solid transparent',
                  padding: '8px 16px',
                  fontWeight: !showHistory ? 'bold' : 'normal',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  textShadow: !showHistory ? '0 0 10px var(--accent-glow)' : 'none'
                }}
              >
                New Authorization
              </button>
              <button 
                onClick={() => setShowHistory(true)}
                style={{
                  color: showHistory ? 'var(--accent-color)' : 'var(--text-secondary)',
                  borderBottom: showHistory ? '2px solid var(--accent-color)' : '2px solid transparent',
                  padding: '8px 16px',
                  fontWeight: showHistory ? 'bold' : 'normal',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  textShadow: showHistory ? '0 0 10px var(--accent-glow)' : 'none'
                }}
              >
                Service Logs ({bookingsData?.length || 0})
              </button>
            </div>

            {showHistory ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px 0' }}>
                {(!bookingsData || bookingsData.length === 0) ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '60px', fontStyle: 'italic' }}>No service sequences found.</p>
                ) : bookingsData.map((b, i) => (
                  <div key={b.id} style={{
                    background: 'rgba(0, 240, 255, 0.03)',
                    border: '1px solid rgba(0, 240, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '20px 24px',
                    animation: `fadeInScale 0.4s ease forwards ${i * 0.1}s`,
                    opacity: 0,
                    boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                      <strong style={{ fontSize: '1.1rem', letterSpacing: '1px' }}>{b.customerName || 'Agent'}</strong>
                      <span style={{ color: 'var(--accent-color)', background: 'rgba(0, 240, 255, 0.1)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.9rem' }}>{b.date}</span>
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{ color: '#fff' }}>{b.vehicleNo || 'Unknown ID'}</span>
                      <span style={{ width: '4px', height: '4px', background: 'var(--accent-color)', borderRadius: '50%' }}></span>
                      <span>{b.model}</span>
                      <span style={{ width: '4px', height: '4px', background: 'var(--accent-color)', borderRadius: '50%' }}></span>
                      <span style={{ color: 'var(--accent-hover)' }}>{b.serviceType}</span>
                    </div>
                    {b.notes && <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '12px', padding: '8px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>Log: {b.notes}</div>}
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '10px 0' }}>
                <p style={{ color: 'var(--text-secondary)', letterSpacing: '1px' }}>Input vehicle parameters for maintenance sequence.</p>
                
                {error && <div style={{ color: '#ff3c3c', padding: '16px', background: 'rgba(255, 60, 60, 0.05)', border: '1px solid rgba(255, 60, 60, 0.3)', borderRadius: '12px', textShadow: '0 0 10px rgba(255,0,0,0.5)' }}>⚠️ {error}</div>}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div className="form-group">
                    <label>Pilot Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Enter designation..." 
                      value={formData.customerName}
                      onChange={e => setFormData({...formData, customerName: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Registration ID</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. NX-01-AB-1234" 
                      value={formData.vehicleNo}
                      onChange={e => setFormData({...formData, vehicleNo: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Chassis Model</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Tesla Model S, CyberTruck..." 
                    value={formData.model}
                    onChange={e => setFormData({...formData, model: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Protocol Selection</label>
                  <select 
                    className="form-control" 
                    value={formData.serviceType}
                    onChange={e => setFormData({...formData, serviceType: e.target.value})}
                    style={{ appearance: 'none', background: 'rgba(0,0,0,0.6) url("data:image/svg+xml;utf8,<svg fill=\'cyan\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/><path d=\'M0 0h24v24H0z\' fill=\'none\'/></svg>") no-repeat right 10px center' }}
                  >
                    <option value="" disabled>Select Maintenance Protocol</option>
                    <option value="Routine Maintenance">Routine Maintenance - $150</option>
                    <option value="Diagnostics">System Diagnostics - $89</option>
                    <option value="System Repair">Hardware Repair - $350</option>
                    <option value="Software/Hardware Upgrade">Software/Hardware Upgrade - $200</option>
                    <option value="Oil Change">Synthetic Fluid Change - $65</option>
                    <option value="Brake Service">Brake Calibration - $280</option>
                    <option value="Tire Replacement">Grav-Tire Replacement - $400</option>
                  </select>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div className="form-group">
                    <label>Engagement Date</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Engagement Time</label>
                    <input 
                      type="time" 
                      className="form-control" 
                      value={formData.time}
                      onChange={e => setFormData({...formData, time: e.target.value})}
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Additional Parameters</label>
                  <textarea 
                    className="form-control" 
                    placeholder="Specify anomalies, noises, or custom requests..."
                    rows={3}
                    style={{ resize: 'none' }}
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                  />
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginTop: '16px',
                  padding: '20px',
                  background: 'linear-gradient(90deg, rgba(0, 240, 255, 0.05), rgba(0, 0, 0, 0.5))',
                  border: '1px solid rgba(0, 240, 255, 0.1)',
                  borderRadius: '12px'
                }}>
                  <div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'block', marginBottom: '4px' }}>Estimated Protocol Cost</span>
                    <strong style={{ fontSize: '1.8rem', color: estimatedCost > 0 ? 'var(--accent-color)' : 'var(--text-secondary)', textShadow: estimatedCost > 0 ? '0 0 15px var(--accent-glow)' : 'none' }}>
                      ${estimatedCost.toFixed(2)}
                    </strong>
                  </div>
                  <button type="submit" className="btn-primary" style={{ padding: '16px 40px' }}>
                    Engage Sequence
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
