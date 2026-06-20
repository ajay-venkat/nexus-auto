import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, Wrench, BarChart3, Users, History, LogOut, Bell } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import '../styles/admin.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pickups, activeVehicles } = useAppContext();

  useEffect(() => {
    const isAuth = localStorage.getItem('nexus_admin_auth');
    if (!isAuth) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('nexus_admin_auth');
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Overview' },
    { path: '/admin/live-service', icon: <Wrench size={20} />, label: 'Live Service' },
    { path: '/admin/revenue', icon: <BarChart3 size={20} />, label: 'Revenue Analytics' },
    { path: '/admin/customers', icon: <Users size={20} />, label: 'Customers' },
    { path: '/admin/history', icon: <History size={20} />, label: 'Service History' }
  ];

  const pendingPickups = pickups.filter(p => p.status === 'pending').length;
  const inService = activeVehicles.length;

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <Wrench className="text-accent" size={28} />
          <h2>NEXUS<span>ERP</span></h2>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`nav-item ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <div className="header-search">
            {/* Search can go here */}
            <h3>Professional Service Center</h3>
          </div>
          <div className="header-actions">
            <div className="notification-wrapper">
              <Bell size={24} />
              {pendingPickups > 0 && <span className="badge">{pendingPickups}</span>}
            </div>
            <div className="admin-profile">
              <div className="avatar">A</div>
              <div className="info">
                <span className="name">System Admin</span>
                <span className="role">Workshop Manager</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
