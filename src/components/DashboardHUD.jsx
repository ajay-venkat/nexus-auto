import { Wrench, Clock, Truck, FileText } from 'lucide-react';
import './DashboardHUD.css';

export default function DashboardHUD({ totalBookings, upcomingServices, activePickups, pendingReminders }) {
  return (
    <div className="hud-container">
      <div className="hud-stats-group">
        <div className="hud-stat-card">
          <FileText className="hud-stat-icon" size={32} color="var(--accent-color)" />
          <div className="hud-stat-value">{totalBookings}</div>
          <div className="hud-stat-label">Total Bookings</div>
        </div>
        <div className="hud-stat-card">
          <Wrench className="hud-stat-icon" size={32} color="var(--accent-color)" />
          <div className="hud-stat-value">{upcomingServices}</div>
          <div className="hud-stat-label">Upcoming Services</div>
        </div>
      </div>
      
      <div className="hud-stats-group">
        <div className="hud-stat-card">
          <Truck className="hud-stat-icon" size={32} color="var(--accent-color)" />
          <div className="hud-stat-value">{activePickups}</div>
          <div className="hud-stat-label">Active Pickups</div>
        </div>
        <div className="hud-stat-card">
          <Clock className="hud-stat-icon" size={32} color="var(--accent-color)" />
          <div className="hud-stat-value">{pendingReminders}</div>
          <div className="hud-stat-label">Pending Reminders</div>
        </div>
      </div>
    </div>
  );
}
