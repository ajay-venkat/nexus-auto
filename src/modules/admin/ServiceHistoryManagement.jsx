import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Search, Download, Trash2, Edit } from 'lucide-react';
import { useToast } from '../../components/ToastContext';

const ServiceHistoryManagement = () => {
  const { history, setHistory } = useAppContext();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = history.filter(h => 
    h.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
    h.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    setHistory(prev => prev.filter(h => h.id !== id));
    addToast('Record Deleted', `Service record ${id} removed.`, 'error');
  };

  const handleExport = () => {
    addToast('Export Started', 'Downloading service report as CSV...', 'info');
    // Mock export logic
  };

  return (
    <div className="service-history-mgmt">
      <div className="flex justify-between items-center mb-6">
        <h2>Service History Log</h2>
        <div className="flex gap-4">
          <div className="search-wrapper" style={{ width: '300px', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '8px', display: 'flex' }}>
            <Search size={18} className="text-muted mr-2" />
            <input 
              type="text" 
              placeholder="Search history..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%' }}
            />
          </div>
          <button className="btn-admin-primary flex items-center gap-2 px-4" onClick={handleExport} style={{ width: 'auto' }}>
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Record ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Vehicle No.</th>
              <th>Service</th>
              <th>Cost</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(record => (
              <tr key={record.id}>
                <td className="text-muted">{record.id}</td>
                <td>{record.date}</td>
                <td className="font-semibold">{record.customerName}</td>
                <td><span className="text-accent">{record.vehicleNo}</span></td>
                <td>{record.service}</td>
                <td className="font-bold text-green-400">${record.cost}</td>
                <td>
                  <div className="flex gap-2">
                    <button className="p-2 bg-white/5 hover:bg-accent/20 text-accent rounded transition"><Edit size={16} /></button>
                    <button className="p-2 bg-white/5 hover:bg-red-500/20 text-red-400 rounded transition" onClick={() => handleDelete(record.id)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceHistoryManagement;
