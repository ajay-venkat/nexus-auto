import { useState, useEffect } from 'react';
import carImage from '../assets/realistic_neon_car.png';
import './LandingPage.css';

export default function LandingPage({ onEnter }) {
  const [exiting, setExiting] = useState(false);
  const [lines, setLines] = useState([]);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate random speed lines
    const newLines = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      animationDuration: `${0.1 + Math.random() * 0.3}s`,
      animationDelay: `${Math.random() * 0.5}s`,
      opacity: Math.random() * 0.5 + 0.2
    }));
    setLines(newLines);

    // Generate floating particles
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDuration: `${2 + Math.random() * 3}s`,
      animationDelay: `${Math.random() * 2}s`
    }));
    setParticles(newParticles);

    // Auto trigger sequence
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => {
        onEnter();
      }, 1500); // Wait for the massive zoom/warp transition
    }, 4000); // 4 seconds of driving animation before warp

    return () => clearTimeout(timer);
  }, [onEnter]);

  return (
    <div className={`landing-container ${exiting ? 'exiting' : ''}`}>
      <div className="speed-lines">
        {lines.map(line => (
          <div 
            key={line.id} 
            className="horizontal-line" 
            style={{ 
              top: line.top, 
              animationDuration: line.animationDuration,
              animationDelay: line.animationDelay,
              opacity: line.opacity
            }} 
          />
        ))}
      </div>

      <div className="particles-container">
        {particles.map(p => (
          <div 
            key={p.id} 
            className="particle" 
            style={{ 
              left: p.left,
              top: p.top,
              animationDuration: p.animationDuration,
              animationDelay: p.animationDelay
            }} 
          />
        ))}
      </div>

      <div className="landing-header cinematic-text">
        <h1>NEXUS AUTO</h1>
        <p>Prepare for the future</p>
      </div>

      <div className="scene-3d">
        <div className="road-grid"></div>
        <div className="ambient-glow"></div>
      </div>

      <div className="car-wrapper">
        <img src={carImage} alt="Futuristic Car" className="realistic-car" />
        <div className="car-underglow"></div>
      </div>
    </div>
  );
}
