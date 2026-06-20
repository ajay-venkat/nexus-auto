import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../../components/ToastContext';
import { Settings, Check, Clock, Search, ChevronRight } from 'lucide-react';

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

const LiveServiceManagement = () => {
  const { activeVehicles, updateVehicleStatus, markServiceComplete } = useAppContext();
  const { addToast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const filteredVehicles = activeVehicles.filter(v => 
    v.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.bookingId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateStatus = (statusIndex) => {
    if (!selectedVehicle) return;
    
    if (statusIndex === 8) { // Delivered
      markServiceComplete(selectedVehicle.id);
      addToast('Service Completed', `${selectedVehicle.vehicleNo} has been marked as Delivered.`, 'success');
      setSelectedVehicle(null);
    } else {
      updateVehicleStatus(selectedVehicle.id, STAGES[statusIndex], statusIndex);
      addToast('Status Updated', `${selectedVehicle.vehicleNo} is now ${STAGES[statusIndex]}.`, 'info');
      // Update local state to reflect immediately in panel
      setSelectedVehicle(prev => ({...prev, currentStatus: STAGES[statusIndex], statusIndex}));
    }
  };

  return (
    <div className="live-service-mgmt">
      <div className="flex justify-between items-center mb-6">
        <h2>Live Service Management</h2>
        <div className="search-wrapper" style={{ width: '300px', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '8px', display: 'flex' }}>
          <Search size={18} className="text-muted mr-2" />
          <input 
            type="text" 
            placeholder="Search vehicles..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%' }}
          />
        </div>
      </div>

      <div className="details-grid" style={{ gridTemplateColumns: selectedVehicle ? '2fr 1fr' : '1fr' }}>
        {/* Table View */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Vehicle No.</th>
                <th>Service Type</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map(v => (
                <tr key={v.id} style={{ background: selectedVehicle?.id === v.id ? 'rgba(0, 240, 255, 0.1)' : 'transparent' }}>
                  <td>{v.bookingId}</td>
                  <td>{v.customerName}</td>
                  <td>{v.vehicleNo}</td>
                  <td>{v.serviceType}</td>
                  <td><span className="status-badge in-progress">{v.currentStatus}</span></td>
                  <td>
                    <div className="progress-bar-bg" style={{ height: '4px', width: '60px', margin: 0 }}>
                      <div className="progress-bar-fill" style={{ width: `${v.completionPercentage}%` }}></div>
                    </div>
                  </td>
                  <td>
                    <button className="action-btn" onClick={() => setSelectedVehicle(v)}>
                      Update
                    </button>
                  </td>
                </tr>
              ))}
              {filteredVehicles.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-muted">No vehicles found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Control Panel (Shows when a vehicle is selected) */}
        {selectedVehicle && (
          <div className="glass-card status-control-panel">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
              <h3>Control Panel</h3>
              <button className="text-muted hover:text-white" onClick={() => setSelectedVehicle(null)}>Close</button>
            </div>
            
            <div className="mb-6">
              <p className="text-lg font-bold text-accent">{selectedVehicle.vehicleNo}</p>
              <p className="text-sm text-muted">{selectedVehicle.customerName}</p>
            </div>

            <div className="stages-list flex flex-col gap-2">
              {STAGES.map((stage, index) => {
                const isCurrent = selectedVehicle.statusIndex === index;
                const isCompleted = selectedVehicle.statusIndex > index;
                return (
                  <button 
                    key={index}
                    onClick={() => handleUpdateStatus(index)}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      isCurrent ? 'bg-accent/20 border-accent text-white' : 
                      isCompleted ? 'bg-black/40 border-white/5 text-muted' : 
                      'bg-black/20 border-white/10 text-gray-300 hover:border-accent/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isCompleted ? <Check size={16} className="text-green-400" /> : 
                       isCurrent ? <Settings size={16} className="text-accent animate-spin" /> : 
                       <Clock size={16} />}
                      <span>{stage}</span>
                    </div>
                    {isCurrent && <span className="text-xs font-bold text-accent">CURRENT</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveServiceManagement;
