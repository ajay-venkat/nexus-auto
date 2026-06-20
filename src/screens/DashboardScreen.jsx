import DashboardHUD from '../components/DashboardHUD';
import AntigravityMenu from '../components/AntigravityMenu';
import { useNavigate } from 'react-router-dom';

export default function DashboardScreen({ totalBookings, remindersData, pickupsData }) {
  const navigate = useNavigate();

  const handleSelectModule = (id) => {
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
