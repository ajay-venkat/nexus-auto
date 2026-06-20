import { ArrowLeft, CheckCircle, Search, Filter, Clock } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

export default function VehicleHistory({ historyData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredHistory = useMemo(() => {
    return historyData.filter(item => {
      const matchesSearch = 
        item.service.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (item.parts && item.parts.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.vehicle && item.vehicle.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.vehicleNo && item.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [historyData, searchTerm, filterStatus]);

  const totalCost = filteredHistory.reduce((sum, item) => sum + item.cost, 0);

  return (
    <div className="page-container">
      <div className="page-content-wrapper glass-panel" style={{ padding: '32px' }}>
        <div className="overlay-header">
          <h2>Vehicle History</h2>
          <Link to="/dashboard" className="back-btn"><ArrowLeft size={18} /> Back to Dashboard</Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Stats bar */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ padding: '12px 20px', background: 'rgba(0, 240, 255, 0.1)', border: '1px solid var(--accent-color)', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>{filteredHistory.length}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Records</div>
            </div>
            <div style={{ padding: '12px 20px', background: 'rgba(0, 240, 255, 0.1)', border: '1px solid var(--accent-color)', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>${totalCost}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Spent</div>
            </div>
          </div>

          {/* Search and filter */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ position: 'relative', flexGrow: 1 }}>
              <Search style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-secondary)' }} size={20} />
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search services, parts, or vehicles..." 
                style={{ width: '100%', paddingLeft: '40px' }}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div style={{ position: 'relative', minWidth: '150px' }}>
              <Filter style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-secondary)' }} size={20} />
              <select 
                className="form-control" 
                style={{ width: '100%', paddingLeft: '40px' }}
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {filteredHistory.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>No history records found matching your criteria.</p>
          ) : (
            <div className="history-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredHistory.map((item, i) => (
                <div key={item.id} className="history-card" style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  animation: `fadeInScale 0.4s ease forwards ${i * 0.05}s`,
                  opacity: 0,
                  transition: 'transform 0.2s',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    {item.status === 'completed' 
                      ? <CheckCircle color="var(--accent-color)" size={24} style={{ marginTop: '4px' }} />
                      : <Clock color="#a0a0a0" size={24} style={{ marginTop: '4px' }} />
                    }
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '1.2rem' }}>{item.service}</h4>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>
                        {item.date} · <span style={{ color: item.status === 'completed' ? 'var(--accent-color)' : '#a0a0a0', textTransform: 'capitalize' }}>{item.status}</span>
                      </div>
                      {(item.vehicle || item.vehicleNo) && (
                        <div style={{ fontSize: '0.85rem', color: '#bbb', marginBottom: '6px' }}>
                          {item.vehicle} {item.vehicleNo ? `(${item.vehicleNo})` : ''}
                        </div>
                      )}
                      {item.parts && (
                        <div style={{ fontSize: '0.85rem', color: '#ccc', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '6px' }}>
                          <strong>Parts/Repairs:</strong> {item.parts}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>${item.cost}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
