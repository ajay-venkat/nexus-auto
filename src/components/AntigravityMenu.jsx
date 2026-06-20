import { Wrench, History, Truck, Bell, Calculator } from 'lucide-react';
import './AntigravityMenu.css';

const MENU_ITEMS = [
  { id: 'booking', label: 'Service Booking', icon: Wrench },
  { id: 'history', label: 'Vehicle History', icon: History },
  { id: 'pickup', label: 'Pickup Requests', icon: Truck, badgeKey: 'pickup' },
  { id: 'reminders', label: 'Service Reminders', icon: Bell, badgeKey: 'reminders' },
  { id: 'cost', label: 'Cost Estimates', icon: Calculator },
];

export default function AntigravityMenu({ onSelect, notificationCount, hasActivePickup }) {

  const handleClick = (id) => {
    console.log(`[NEXUS] Card clicked: "${id}" — navigating...`);
    onSelect(id);
  };

  return (
    <div className="antigravity-container">
      <div className="background-grid"></div>
      
      <div className="hero-text">
        <h1>NEXUS AUTO</h1>
        <p>The Future of Car Service</p>
      </div>

      <div className="cards-row">
        {MENU_ITEMS.map((item, i) => {
          const Icon = item.icon;
          
          let badgeContent = null;
          if (item.badgeKey === 'reminders' && notificationCount > 0) badgeContent = notificationCount;
          if (item.badgeKey === 'pickup' && hasActivePickup) badgeContent = '!';

          return (
            <div
              key={item.id}
              className="floating-menu-item glass-panel"
              style={{ animationDelay: `${i * 0.1}s` }}
              onClick={() => handleClick(item.id)}
            >
              {badgeContent && (
                <div className="card-badge">
                  {badgeContent}
                </div>
              )}
              <Icon className="menu-icon" size={28} />
              <span className="menu-label">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
