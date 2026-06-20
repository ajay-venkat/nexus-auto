import { ArrowLeft, MapPin, Navigation, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: '#a0a0a0', icon: Clock },
  requested: { label: 'Driver Dispatched', color: 'var(--accent-color)', icon: Truck },
  in_transit: { label: 'In Transit', color: '#ffa500', icon: Navigation },
  completed: { label: 'Completed', color: '#00ff88', icon: CheckCircle },
};

export default function PickupRequest({ pickupsData, onRequest }) {
  const [formData, setFormData] = useState({ address: '', date: '', time: '', condition: '' });
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.address.trim()) { setError('Address is required'); return; }
    if (!formData.date) { setError('Date is required'); return; }
    if (!formData.time) { setError('Time is required'); return; }
    if (!formData.condition) { setError('Vehicle condition is required'); return; }
    setError('');
    console.log('[NEXUS] Pickup request submitted:', formData);
    onRequest(formData);
    setFormData({ address: '', date: '', time: '', condition: '' });
    setShowForm(false);
  };

  return (
    <div className="page-container">
      <div className="page-content-wrapper glass-panel" style={{ padding: '32px' }}>
        <div className="overlay-header">
          <h2>Pickup & Drop</h2>
          <Link to="/dashboard" className="back-btn"><ArrowLeft size={18} /> Back to Dashboard</Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
              {pickupsData.length} pickup request{pickupsData.length !== 1 ? 's' : ''} total
            </p>
            <button className="btn-primary" onClick={() => setShowForm(!showForm)} style={{ padding: '8px 16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              {showForm ? <><ArrowLeft size={16} /> Cancel</> : <><Navigation size={16} /> New Pickup</>}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} style={{ 
              display: 'flex', flexDirection: 'column', gap: '16px',
              background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px',
              border: '1px solid var(--accent-color)', animation: 'fadeInScale 0.3s ease'
            }}>
              <h4 style={{ margin: 0 }}>Request New Pickup</h4>
              {error && <div style={{ color: '#ff3c3c', padding: '8px 12px', background: 'rgba(255, 60, 60, 0.1)', border: '1px solid rgba(255, 60, 60, 0.5)', borderRadius: '8px', fontSize: '0.9rem' }}>{error}</div>}
              
              <div className="form-group">
                <label>Pickup Address</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <MapPin style={{ position: 'absolute', left: '12px', color: 'var(--accent-color)' }} size={20} />
                  <input 
                    type="text" className="form-control" placeholder="Enter your location..." 
                    style={{ width: '100%', paddingLeft: '40px' }}
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" className="form-control" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input type="time" className="form-control" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                </div>
              </div>

              <div className="form-group">
                <label>Vehicle Condition</label>
                <select className="form-control" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})}>
                  <option value="" disabled>Select Condition</option>
                  <option value="drivable">Drivable</option>
                  <option value="not_drivable">Not Drivable (Needs Towing)</option>
                </select>
              </div>

              <button type="submit" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                <Navigation size={20} /> Schedule Pickup
              </button>
            </form>
          )}

          {/* Pickup Requests List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pickupsData.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>No pickup requests yet. Click "New Pickup" to create one.</p>
            ) : pickupsData.map((pickup, i) => {
              const statusCfg = STATUS_CONFIG[pickup.status] || STATUS_CONFIG.pending;
              const StatusIcon = statusCfg.icon;
              return (
                <div key={pickup.id} style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  animation: `fadeInScale 0.3s ease forwards ${i * 0.05}s`,
                  opacity: 0
                }}>
                  <div style={{ 
                    padding: '12px', borderRadius: '50%',
                    background: `${statusCfg.color}22`
                  }}>
                    <StatusIcon size={24} color={statusCfg.color} />
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <MapPin size={14} color="var(--accent-color)" />
                      <strong>{pickup.address}</strong>
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {pickup.date} at {pickup.time} · {pickup.condition === 'not_drivable' ? 'Towing Required' : 'Drivable'}
                    </div>
                  </div>
                  <div style={{ 
                    padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold',
                    background: `${statusCfg.color}22`, color: statusCfg.color, border: `1px solid ${statusCfg.color}44`,
                    whiteSpace: 'nowrap'
                  }}>
                    {statusCfg.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
