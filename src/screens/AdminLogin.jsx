import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '../components/ToastContext';
import { ShieldCheck, Lock, User } from 'lucide-react';
import '../styles/admin.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      addToast('Login Successful', 'Welcome to Nexus Auto Admin', 'success');
      localStorage.setItem('nexus_admin_auth', 'true');
      navigate('/admin/dashboard');
    } else {
      addToast('Access Denied', 'Invalid username or password', 'error');
    }
  };

  return (
    <div className="admin-login-wrapper">
      <motion.div 
        className="login-card glass-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="login-header">
          <ShieldCheck size={48} className="text-accent" />
          <h2>Admin Portal</h2>
          <p>Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <User className="input-icon" />
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <Lock className="input-icon" />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-admin-primary">
            Authenticate
          </button>
        </form>
        
        <div className="demo-credentials">
          <p>Demo Credentials:</p>
          <code>admin / admin123</code>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
