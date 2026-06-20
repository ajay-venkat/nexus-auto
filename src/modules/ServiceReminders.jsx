import { ArrowLeft, Bell, AlertCircle, Check, Trash2, Edit2, Plus, Clock, CheckCircle } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

export default function ServiceReminders({ remindersData, onAdd, onComplete, onEdit, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [newReminder, setNewReminder] = useState({ title: '', due: '', vehicle: '' });
  const [activeTab, setActiveTab] = useState('all');

  const handleEditClick = (reminder) => {
    setEditingId(reminder.id);
    setEditFormData({ title: reminder.title, due: reminder.due, urgent: reminder.urgent });
  };

  const saveEdit = (id) => {
    console.log('[NEXUS] Reminder edited:', id, editFormData);
    onEdit(id, editFormData);
    setEditingId(null);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newReminder.title || !newReminder.due) return;
    console.log('[NEXUS] New reminder added:', newReminder);
    onAdd(newReminder);
    setNewReminder({ title: '', due: '', vehicle: '' });
    setIsAdding(false);
  };

  const today = new Date().toISOString().split('T')[0];

  const categorized = useMemo(() => {
    const overdue = remindersData.filter(r => r.due < today);
    const upcoming = remindersData.filter(r => r.due >= today);
    return { overdue, upcoming };
  }, [remindersData, today]);

  const displayedReminders = activeTab === 'overdue' 
    ? categorized.overdue 
    : activeTab === 'upcoming' 
    ? categorized.upcoming 
    : remindersData;

  return (
    <div className="page-container">
      <div className="page-content-wrapper glass-panel" style={{ padding: '32px' }}>
        <div className="overlay-header">
          <h2>Service Reminders</h2>
          <Link to="/dashboard" className="back-btn"><ArrowLeft size={18} /> Back to Dashboard</Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Stats bar */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={() => setActiveTab('all')} style={{
              padding: '10px 16px', borderRadius: '8px', flex: 1, textAlign: 'center', minWidth: '120px',
              background: activeTab === 'all' ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${activeTab === 'all' ? 'var(--accent-color)' : 'var(--glass-border)'}`,
              color: 'var(--text-primary)'
            }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>{remindersData.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>All Active</div>
            </button>
            <button onClick={() => setActiveTab('overdue')} style={{
              padding: '10px 16px', borderRadius: '8px', flex: 1, textAlign: 'center', minWidth: '120px',
              background: activeTab === 'overdue' ? 'rgba(255, 60, 60, 0.15)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${activeTab === 'overdue' ? '#ff3c3c' : 'var(--glass-border)'}`,
              color: 'var(--text-primary)'
            }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#ff3c3c' }}>{categorized.overdue.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Overdue</div>
            </button>
            <button onClick={() => setActiveTab('upcoming')} style={{
              padding: '10px 16px', borderRadius: '8px', flex: 1, textAlign: 'center', minWidth: '120px',
              background: activeTab === 'upcoming' ? 'rgba(0, 255, 136, 0.15)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${activeTab === 'upcoming' ? '#00ff88' : 'var(--glass-border)'}`,
              color: 'var(--text-primary)'
            }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#00ff88' }}>{categorized.upcoming.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Upcoming</div>
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-primary" onClick={() => setIsAdding(!isAdding)} style={{ padding: '8px 16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              {isAdding ? <><ArrowLeft size={16} /> Cancel</> : <><Plus size={16} /> New Reminder</>}
            </button>
          </div>

          {isAdding && (
            <form onSubmit={handleAdd} style={{ 
              background: 'rgba(255,255,255,0.05)', 
              padding: '20px', 
              borderRadius: '12px', 
              border: '1px solid var(--accent-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              animation: 'fadeInScale 0.3s ease'
            }}>
              <h4 style={{ margin: 0 }}>Add New Reminder</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <input className="form-control" placeholder="Service Name (e.g. Tire Rotation)" value={newReminder.title} onChange={e => setNewReminder({...newReminder, title: e.target.value})} required />
                <input type="date" className="form-control" value={newReminder.due} onChange={e => setNewReminder({...newReminder, due: e.target.value})} required />
              </div>
              <input className="form-control" placeholder="Vehicle (optional, e.g. Tesla Model S)" value={newReminder.vehicle} onChange={e => setNewReminder({...newReminder, vehicle: e.target.value})} />
              <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>Save Reminder</button>
            </form>
          )}
          
          {displayedReminders.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
              {activeTab === 'overdue' ? 'No overdue reminders! 🎉' : activeTab === 'upcoming' ? 'No upcoming reminders.' : 'No reminders yet. Click "New Reminder" to create one.'}
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {displayedReminders.map((reminder) => {
                const isOverdue = reminder.due < today;
                return (
                  <div key={reminder.id} style={{
                    background: isOverdue ? 'rgba(255, 60, 60, 0.1)' : reminder.urgent ? 'rgba(255, 165, 0, 0.1)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${isOverdue ? 'rgba(255, 60, 60, 0.5)' : reminder.urgent ? 'rgba(255, 165, 0, 0.5)' : 'var(--glass-border)'}`,
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    boxShadow: isOverdue ? '0 0 20px rgba(255, 60, 60, 0.2)' : 'none'
                  }}>
                    <div style={{ 
                      background: isOverdue ? 'rgba(255,60,60,0.2)' : 'rgba(255,255,255,0.1)',
                      padding: '12px',
                      borderRadius: '50%'
                    }}>
                      {isOverdue ? <AlertCircle color="#ff3c3c" /> : <Bell color="var(--accent-color)" />}
                    </div>
                    
                    {editingId === reminder.id ? (
                      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                         <input className="form-control" value={editFormData.title} onChange={e => setEditFormData({...editFormData, title: e.target.value})} />
                         <input type="date" className="form-control" value={editFormData.due} onChange={e => setEditFormData({...editFormData, due: e.target.value})} />
                      </div>
                    ) : (
                      <div style={{ flexGrow: 1 }}>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: isOverdue ? '#ff3c3c' : 'white' }}>
                          {reminder.title}
                        </h4>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                          Due: {reminder.due} 
                          {isOverdue && <span style={{ color: '#ff3c3c', marginLeft: '8px', fontWeight: 'bold' }}>OVERDUE</span>}
                          {reminder.vehicle ? ` · ${reminder.vehicle}` : ''}
                        </div>
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      {editingId === reminder.id ? (
                        <button className="btn-primary" onClick={() => saveEdit(reminder.id)} style={{ padding: '8px 12px', fontSize: '0.9rem' }}>Save</button>
                      ) : (
                        <>
                          <button style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '8px', borderRadius: '8px' }} onClick={() => handleEditClick(reminder)} title="Edit">
                            <Edit2 size={16} />
                          </button>
                          <button style={{ background: 'rgba(255,60,60,0.2)', color: '#ff3c3c', padding: '8px', borderRadius: '8px' }} onClick={() => { console.log('[NEXUS] Reminder deleted:', reminder.id); onDelete(reminder.id); }} title="Delete">
                            <Trash2 size={16} />
                          </button>
                          <button 
                            className="btn-primary" 
                            onClick={() => { console.log('[NEXUS] Service completed:', reminder.title); onComplete(reminder); }}
                            style={{ padding: '8px 12px', fontSize: '0.9rem' }}
                            title="Mark Complete"
                          >
                            <Check size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
