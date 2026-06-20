import { createContext, useState, useEffect, useContext } from 'react';
import { initializeMockData } from '../data/mockDataSeeder';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Initialize on mount
  useEffect(() => {
    initializeMockData();
  }, []);

  const [customers, setCustomers] = useState(() => JSON.parse(localStorage.getItem('nexus_customers')) || []);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('nexus_history')) || []);
  const [activeVehicles, setActiveVehicles] = useState(() => JSON.parse(localStorage.getItem('nexus_active_vehicles')) || []);
  const [completed, setCompleted] = useState(() => JSON.parse(localStorage.getItem('nexus_completed')) || []);
  const [pickups, setPickups] = useState(() => JSON.parse(localStorage.getItem('nexus_pickups')) || []);
  const [kpis, setKpis] = useState(() => JSON.parse(localStorage.getItem('nexus_kpis')) || {});

  // Sync to local storage
  useEffect(() => { localStorage.setItem('nexus_customers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('nexus_history', JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem('nexus_active_vehicles', JSON.stringify(activeVehicles)); }, [activeVehicles]);
  useEffect(() => { localStorage.setItem('nexus_completed', JSON.stringify(completed)); }, [completed]);
  useEffect(() => { localStorage.setItem('nexus_pickups', JSON.stringify(pickups)); }, [pickups]);
  useEffect(() => { localStorage.setItem('nexus_kpis', JSON.stringify(kpis)); }, [kpis]);

  const updateVehicleStatus = (id, newStatus, newStatusIndex) => {
    setActiveVehicles(prev => prev.map(v => 
      v.id === id ? { 
        ...v, 
        currentStatus: newStatus, 
        statusIndex: newStatusIndex, 
        completionPercentage: Math.floor((newStatusIndex / 8) * 100) 
      } : v
    ));
  };

  const markServiceComplete = (id) => {
    setActiveVehicles(prev => {
      const vehicle = prev.find(v => v.id === id);
      if (vehicle) {
        const completedRecord = {
          ...vehicle,
          currentStatus: 'Delivered',
          statusIndex: 8,
          completionPercentage: 100,
          completedDate: new Date().toISOString()
        };
        setCompleted(c => [completedRecord, ...c]);
        
        // Update KPIs
        setKpis(k => ({
          ...k,
          vehiclesInService: Math.max(0, k.vehiclesInService - 1),
          completedServicesToday: k.completedServicesToday + 1,
          pendingDeliveries: Math.max(0, k.pendingDeliveries - 1)
        }));
      }
      return prev.filter(v => v.id !== id);
    });
  };

  return (
    <AppContext.Provider value={{
      customers, setCustomers,
      history, setHistory,
      activeVehicles, setActiveVehicles,
      completed, setCompleted,
      pickups, setPickups,
      kpis, setKpis,
      updateVehicleStatus,
      markServiceComplete
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
