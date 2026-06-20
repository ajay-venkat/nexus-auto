import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Search, Mail, Phone, Calendar } from 'lucide-react';

const CustomerManagement = () => {
  const { customers } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="customer-mgmt">
      <div className="flex justify-between items-center mb-6">
        <h2>Customer Database</h2>
        <div className="search-wrapper" style={{ width: '300px', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '8px', display: 'flex' }}>
          <Search size={18} className="text-muted mr-2" />
          <input 
            type="text" 
            placeholder="Search customers..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%' }}
          />
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer Name</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Total Spending</th>
              <th>Last Visit</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(cust => (
              <tr key={cust.id}>
                <td className="text-muted">{cust.id}</td>
                <td className="font-semibold">{cust.name}</td>
                <td>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={14} className="text-accent" /> {cust.phone}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <Mail size={14} /> {cust.email}
                  </div>
                </td>
                <td className="font-bold text-green-400">${cust.totalSpending}</td>
                <td>
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <Calendar size={14} /> {cust.lastVisit}
                  </div>
                </td>
                <td>
                  <button className="action-btn">View Profile</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerManagement;
