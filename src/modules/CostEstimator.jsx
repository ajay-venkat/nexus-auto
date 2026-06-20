import { useState, useMemo } from 'react';
import { ArrowLeft, Calculator } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const DATA = {
  vehicles: ['Tesla Model S', 'Tesla Model 3', 'Rivian R1T', 'Ford Mustang Mach-E', 'Generic ICE SUV'],
  categories: {
    'Routine Maintenance': [
      { id: 'rm1', name: 'Oil Change', price: 85 },
      { id: 'rm2', name: 'General Service', price: 150 },
      { id: 'rm3', name: 'Cabin Air Filter', price: 45 },
      { id: 'rm4', name: 'Fluid Top-up', price: 60 }
    ],
    'Repairs': [
      { id: 'r1', name: 'Brake Service', price: 250 },
      { id: 'r2', name: 'Engine Check', price: 180 },
      { id: 'r3', name: 'Suspension Adjustment', price: 400 },
      { id: 'r4', name: 'Cooling System Fix', price: 350 }
    ],
    'Replacements': [
      { id: 'rp1', name: 'Tire Replacement', price: 320 },
      { id: 'rp2', name: 'Battery Replacement', price: 950 },
      { id: 'rp3', name: 'Brake Pad Replacement', price: 280 }
    ],
    'Upgrades': [
      { id: 'u1', name: 'Software AutoPilot Unlock', price: 2000 },
      { id: 'u2', name: 'Performance Motors Tune', price: 800 },
      { id: 'u3', name: 'Premium Ceramic Coating', price: 600 }
    ]
  }
};

export default function CostEstimator({ onGenerate }) {
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState('');
  const [category, setCategory] = useState('');
  const [selectedRepairs, setSelectedRepairs] = useState({});

  const availableRepairs = category ? DATA.categories[category] : [];

  const toggleRepair = (repair) => {
    console.log(`[NEXUS] Toggling repair: ${repair.name} ($${repair.price})`);
    setSelectedRepairs(prev => {
      const next = { ...prev };
      if (next[repair.id]) delete next[repair.id];
      else next[repair.id] = repair;
      return next;
    });
  };

  const total = useMemo(() => {
    let sum = 0;
    Object.values(selectedRepairs).forEach(r => sum += r.price);
    if (vehicle && vehicle.includes('Tesla')) sum += 50; 
    return sum;
  }, [selectedRepairs, vehicle]);

  const handleSave = () => {
    console.log('[NEXUS] Estimate saved: $' + total);
    const repairsStr = Object.values(selectedRepairs).map(r => r.name).join(', ') + (vehicle && vehicle.includes('Tesla') ? ', Tesla Surcharge' : '');
    onGenerate(total, repairsStr);
    navigate('/history');
  };

  return (
    <div className="page-container">
      <div className="page-content-wrapper glass-panel" style={{ padding: '32px' }}>
        <div className="overlay-header">
          <h2>Cost Estimator</h2>
          <Link to="/dashboard" className="back-btn"><ArrowLeft size={18} /> Back to Dashboard</Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Vehicle Type</label>
              <select className="form-control" value={vehicle} onChange={e => setVehicle(e.target.value)}>
                <option value="" disabled>Select Vehicle</option>
                {DATA.vehicles.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Service Category</label>
              <select className="form-control" value={category} onChange={e => {
                setCategory(e.target.value);
                setSelectedRepairs({});
              }} disabled={!vehicle}>
                <option value="" disabled>Select Category</option>
                {Object.keys(DATA.categories).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {category && (
            <div className="form-group">
              <label>Available Services (click to select)</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                {availableRepairs.map(repair => {
                  const isSelected = !!selectedRepairs[repair.id];
                  return (
                    <div 
                      key={repair.id} 
                      onClick={() => toggleRepair(repair)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: `1px solid ${isSelected ? 'var(--accent-color)' : 'var(--glass-border)'}`,
                        background: isSelected ? 'rgba(0, 240, 255, 0.1)' : 'rgba(255,255,255,0.05)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <h5 style={{ margin: '0 0 4px 0' }}>{repair.name}</h5>
                      <div style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>${repair.price}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ 
            marginTop: 'auto', 
            padding: '24px', 
            background: 'rgba(0,0,0,0.5)', 
            borderRadius: '12px',
            border: '1px solid var(--accent-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <h3 style={{ margin: 0, color: 'var(--text-primary)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>Estimate Breakdown</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Object.keys(selectedRepairs).length === 0 && !vehicle?.includes('Tesla') && (
                <div style={{ color: 'var(--text-secondary)', padding: '8px 0' }}>Select a vehicle and services above to see your estimate.</div>
              )}
              {vehicle && vehicle.includes('Tesla') && (
                 <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                   <span>Premium Vehicle Surcharge</span>
                   <span>$50</span>
                 </div>
              )}
              {Object.values(selectedRepairs).map(r => (
                 <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                   <span>{r.name}</span>
                   <span>${r.price}</span>
                 </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--glass-border)' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Total Estimated</span>
              <span style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--accent-color)', textShadow: '0 0 10px var(--accent-glow)' }}>
                ${total}
              </span>
            </div>
            
            <button className="btn-primary" disabled={total === 0} onClick={handleSave} style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calculator size={18} /> Save Estimate
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
