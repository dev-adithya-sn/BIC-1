import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function LandingPage({ onEnter }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isEntering, setIsEntering] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);

  // Terminal boot animation simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setBootProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 120);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Three.js Setup
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050604, 0.015);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Add starfield/particles background
    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 20;
      particlePositions[i + 1] = (Math.random() - 0.5) * 20;
      particlePositions[i + 2] = (Math.random() - 0.5) * 20;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xc3ff4d,
      size: 0.03,
      transparent: true,
      opacity: 0.4,
    });
    const starfield = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(starfield);

    // Add minor ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    // Mouse Parallax Effect
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX - width / 2) / 100;
      mouseY = (event.clientY - height / 2) / 100;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smoothly interpolate camera position based on mouse
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;
      camera.position.x = targetX * 0.8;
      camera.position.y = -targetY * 0.8;
      camera.lookAt(scene.position);

      // Rotate background stars
      starfield.rotation.y -= 0.0005;

      renderer.render(scene, camera);
    };

    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  const handleEnterClick = () => {
    if (bootProgress < 100) return;
    setIsEntering(true);
    // Let fade-out animation play before loading home page
    setTimeout(() => {
      onEnter();
    }, 850);
  };

  return (
    <div 
      className={`landing-container ${isEntering ? 'fade-out' : ''}`} 
      ref={containerRef}
    >
      <canvas className="landing-canvas" ref={canvasRef} />

      {/* Futuristic HUD interface */}
      <div className="landing-hud">
        <div className="hud-line top-left">
          <span>SYS_INIT // SYSTEM: ONLINE</span>
          <span>LOCATION // VIT_CHENNAI</span>
        </div>
        <div className="hud-line top-right">
          <span>COGNITIVE_NODE // 0xBIC</span>
          <span>SPEED // 115MS</span>
        </div>
        <div className="hud-line bottom-left">
          <span>SECURE_SHELL // DEV_MODE</span>
          <span>BUILD // 2026_REVAMP</span>
        </div>
        <div className="hud-line bottom-right">
          <span>COHORT // '26_ACTIVE</span>
          <span>TARGET // INNOVATION</span>
        </div>
      </div>

      <div className="landing-content">
        <div className="landing-brand">
          <span className="landing-spark">✦</span>
          <h1>BUSINESS INNOVATION COMMUNITY</h1>
          <p className="landing-subtitle">CONNECTING BUILDERS · LAUNCHING IDEAS</p>
        </div>

        {/* Diagonal Loader Line */}
        <div className="landing-loader-container">
          <div className="landing-loader-track">
            <div 
              className="landing-loader-bar" 
              style={{ width: `${bootProgress}%` }}
            />
          </div>
          <span className="loader-percentage">
            {bootProgress < 100 ? `COMPILING CORE: ${bootProgress}%` : 'COMPILATION COMPLETE'}
          </span>
        </div>

        {/* Enter/Build trigger */}
        <button 
          className={`btn-build ${bootProgress < 100 ? 'disabled' : ''}`}
          disabled={bootProgress < 100}
          onClick={handleEnterClick}
        >
          <div className="btn-build-bg" />
          <span className="btn-build-text">INITIATE BUILD</span>
          <span className="btn-build-sub">ENTER HOME PLATFORM</span>
        </button>
      </div>
    </div>
  );
}
