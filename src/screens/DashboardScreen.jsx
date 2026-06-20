import DashboardHUD from '../components/DashboardHUD';
import AntigravityMenu from '../components/AntigravityMenu';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

export default function DashboardScreen({ totalBookings, remindersData, pickupsData }) {
  const navigate = useNavigate();

  const handleSelectModule = (id) => {
    if (id === 'track-search') {
      const trackingId = window.prompt("Enter your Booking ID or Vehicle No:");
      if (trackingId && trackingId.trim()) {
        navigate(`/track/${encodeURIComponent(trackingId.trim())}`);
      }
      return;
    }
    console.log(`[NEXUS] Dashboard routing to: /${id}`);
    try {
      navigate(`/${id}`);
    } catch (err) {
      console.error(`[NEXUS] Navigation failed for /${id}:`, err);
      alert(`Navigation error: ${err.message}`);
    }
  };

  const activePickups = pickupsData ? pickupsData.filter(p => p.status === 'requested' || p.status === 'in_transit').length : 0;

  return (
    <>
      <button 
        onClick={() => navigate('/admin/login')}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#fff',
          padding: '8px 16px',
          borderRadius: '20px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backdropFilter: 'blur(10px)'
        }}
      >
        <LogIn size={18} /> Admin Login
      </button>

      <DashboardHUD 
        totalBookings={totalBookings}
        upcomingServices={remindersData.length}
        activePickups={activePickups}
        pendingReminders={remindersData.filter(r => r.urgent).length}
      />
      <AntigravityMenu 
        onSelect={handleSelectModule} 
        notificationCount={remindersData.length}
        hasActivePickup={activePickups > 0}
      />
    </>
  );
}
