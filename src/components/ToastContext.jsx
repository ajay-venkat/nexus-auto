import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import './Toast.css';

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((title, message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    
    // Auto remove
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => 
      prev.map(t => t.id === id ? { ...t, isClosing: true } : t)
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter(t => t.id !== id));
    }, 400); // Wait for animation
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => {
          let Icon = Info;
          let color = '#0066ff';
          if (toast.type === 'success') {
            Icon = CheckCircle;
            color = 'var(--accent-color)';
          } else if (toast.type === 'error') {
            Icon = AlertCircle;
            color = '#ff3c3c';
          }

          return (
            <div key={toast.id} className={`toast toast-${toast.type} ${toast.isClosing ? 'closing' : ''}`}>
              <Icon color={color} size={24} />
              <div className="toast-content">
                <h4>{toast.title}</h4>
                <p>{toast.message}</p>
              </div>
              <button className="toast-close" onClick={() => removeToast(toast.id)}>
                <X size={18} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
