import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Car, Wrench, CheckCircle, Truck, DollarSign, Activity } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const AdminOverview = () => {
  const { kpis, activeVehicles } = useAppContext();
  const counterRefs = useRef([]);

  useEffect(() => {
    counterRefs.current.forEach((ref, index) => {
      if (ref) {
        const targetValue = parseInt(ref.getAttribute('data-target'), 10);
        gsap.to(ref, {
          innerHTML: targetValue,
          duration: 2,
          ease: 'power3.out',
          snap: { innerHTML: 1 },
          onUpdate: function() {
            if (ref.getAttribute('data-currency')) {
              ref.innerHTML = '$' + Number(ref.innerHTML).toLocaleString();
            } else {
              ref.innerHTML = Number(ref.innerHTML).toLocaleString();
            }
          }
        });
      }
    });
  }, [kpis]);

  const kpiCards = [
    { title: 'Total Vehicles Today', value: kpis.totalVehiclesToday || 0, icon: <Car size={24} />, color: '#00f0ff' },
    { title: 'Vehicles In Service', value: kpis.vehiclesInService || 0, icon: <Wrench size={24} />, color: '#ffaa00' },
    { title: 'Completed Services', value: kpis.completedServicesToday || 0, icon: <CheckCircle size={24} />, color: '#00ff88' },
    { title: 'Pending Deliveries', value: kpis.pendingDeliveries || 0, icon: <Truck size={24} />, color: '#ff4444' },
    { title: 'Revenue Today', value: kpis.revenueToday || 0, icon: <DollarSign size={24} />, color: '#00f0ff', isCurrency: true },
    { title: 'Cust. Satisfaction', value: kpis.customerSatisfaction || 0, icon: <Activity size={24} />, color: '#00ff88', suffix: '%' }
  ];

  return (
    <div className="admin-overview">
      <h2 className="mb-4">Workshop Overview</h2>
      
      {/* KPI Grid */}
      <div className="kpi-grid">
        {kpiCards.map((card, idx) => (
          <motion.div 
            key={idx} 
            className="kpi-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="kpi-icon" style={{ color: card.color, background: `${card.color}20` }}>
              {card.icon}
            </div>
            <div className="kpi-info">
              <span>{card.title}</span>
              <h3>
                <span 
                  ref={el => counterRefs.current[idx] = el} 
                  data-target={card.value}
                  data-currency={card.isCurrency ? 'true' : ''}
                >
                  0
                </span>
                {card.suffix}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Workshop Floor View */}
      <h2 className="mb-4 mt-8">Active Workshop Floor</h2>
      <div className="services-grid">
        {activeVehicles.slice(0, 6).map((vehicle, idx) => (
          <motion.div 
            key={vehicle.id} 
            className="glass-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="card-header">
              <h2 style={{ fontSize: '1.2rem' }}>{vehicle.vehicleNo}</h2>
              <span className="status-badge in-progress">{vehicle.currentStatus}</span>
            </div>
            <div className="mb-3">
              <p className="text-muted text-sm">{vehicle.vehicle}</p>
              <p className="font-semibold">{vehicle.serviceType}</p>
            </div>
            <div className="progress-bar-bg" style={{ height: '6px', marginBottom: '10px' }}>
              <div 
                className="progress-bar-fill" 
                style={{ width: `${vehicle.completionPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-muted">
              <span>Tech: {vehicle.technician}</span>
              <span>{vehicle.completionPercentage}%</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminOverview;
