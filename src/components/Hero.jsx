import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Hero({ onNavigate }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const width = canvasRef.current.clientWidth || 500;
    const height = canvasRef.current.clientHeight || 500;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights (required for MeshPhysicalMaterial refraction)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00dfd8, 4, 15);
    pointLight1.position.set(-3, 3, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff007a, 4, 15);
    pointLight2.position.set(3, -3, 3);
    scene.add(pointLight2);

    const bulbLight = new THREE.PointLight(0x7928ca, 6, 8);
    bulbLight.position.set(0, 0.2, 0);
    scene.add(bulbLight);

    // Generate Lightbulb shape profile
    const points = [];
    const segments = 32;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * 2.2;
      const x = Math.sin(angle) * 0.95;
      const y = Math.cos(angle) * 0.95;
      points.push(new THREE.Vector2(x, y));
    }
    // Cap connector points
    points.push(new THREE.Vector2(0.42, -0.95));
    points.push(new THREE.Vector2(0.38, -1.2));
    points.push(new THREE.Vector2(0.0, -1.35));

    const latheGeometry = new THREE.LatheGeometry(points, 32);

    // Premium physical glass material with high refraction/transmission
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.05,
      roughness: 0.08,
      transmission: 0.95, // high transparency
      ior: 1.5, // index of refraction
      thickness: 1.5, // physical glass thickness
      specularIntensity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 1.0
    });

    const bulbMesh = new THREE.Mesh(latheGeometry, glassMaterial);
    
    const bulbGroup = new THREE.Group();
    bulbGroup.add(bulbMesh);

    // Screw cap threads (metallic base rings)
    const threadGeom = new THREE.TorusGeometry(0.4, 0.05, 12, 32);
    const threadMat = new THREE.MeshStandardMaterial({
      color: 0x2e2f3d,
      metalness: 0.9,
      roughness: 0.2
    });
    for (let j = 0; j < 3; j++) {
      const thread = new THREE.Mesh(threadGeom, threadMat);
      thread.position.set(0, -1.05 - j * 0.08, 0);
      thread.rotation.x = Math.PI / 2;
      bulbGroup.add(thread);
    }

    // Glowing Neon Filament (cyan / purple emissive)
    const filamentPoints = [];
    for (let i = 0; i < 24; i++) {
      const t = i / 23;
      const angle = t * Math.PI * 3.8;
      const radius = 0.18 * (1 - t * 0.4);
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = -0.3 + t * 0.7;
      filamentPoints.push(new THREE.Vector3(x, y, z));
    }
    const filamentCurve = new THREE.CatmullRomCurve3(filamentPoints);
    const filamentGeom = new THREE.TubeGeometry(filamentCurve, 48, 0.022, 8, false);
    const filamentMat = new THREE.MeshBasicMaterial({
      color: 0x00dfd8, // Emissive Cyan
    });
    const filament = new THREE.Mesh(filamentGeom, filamentMat);
    bulbGroup.add(filament);

    scene.add(bulbGroup);

    // Floating particles inside and around
    const particleCount = 45;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 4;
      positions[i + 1] = (Math.random() - 0.5) * 4;
      positions[i + 2] = (Math.random() - 0.5) * 4;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xff007a, // Neon Pink particles
      size: 0.045,
      transparent: true,
      opacity: 0.5
    });
    const starfield = new THREE.Points(particleGeometry, particleMat);
    scene.add(starfield);

    // Interaction variables
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    const handleMouseMove = (event) => {
      const rect = canvasRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mouseX = (event.clientX - cx) / 250;
      mouseY = (event.clientY - cy) / 250;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!canvasRef.current) return;
      const w = canvasRef.current.clientWidth;
      const h = canvasRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth damp rotation and drift
      targetX += (mouseX - targetX) * 0.06;
      targetY += (mouseY - targetY) * 0.06;

      bulbGroup.rotation.y = targetX * 1.5;
      bulbGroup.rotation.x = -targetY * 1.5 + Math.sin(Date.now() * 0.001) * 0.1;
      
      // Idle float animation
      bulbGroup.position.y = Math.sin(Date.now() * 0.0015) * 0.12;

      // Color pulsing filament and particles
      const pulse = 0.5 + Math.sin(Date.now() * 0.003) * 0.5;
      filamentMat.color.setHSL(0.5 + pulse * 0.3, 1.0, 0.5);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      latheGeometry.dispose();
      glassMaterial.dispose();
      threadGeom.dispose();
      threadMat.dispose();
      filamentGeom.dispose();
      filamentMat.dispose();
      particleGeometry.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section className="hero-split-container">
      {/* 3D Glassmorphic Bulb Left Panel */}
      <div className="hero-visual-panel">
        <canvas className="hero-3d-canvas" ref={canvasRef} />
        <div className="hero-visual-radial" />
      </div>

      {/* Frosted Glassmorphic Copy Right Panel */}
      <div className="hero-text-panel">
        <div className="glass-card">
          <div className="card-spark">💡</div>
          
          <div className="card-brand">
            <span className="brand-badge">VIT CHENNAI</span>
            <h1 className="brand-title">BiC</h1>
            <p className="brand-subtitle">Business Innovation Community</p>
          </div>

          <div className="divider-line" />

          <p className="card-lede">
            The catalyst for builders, creators, and future founders. We bridge the gap 
            between bold business strategies and deep technical execution.
          </p>

          <div className="card-features">
            <div className="feature-item">
              <span className="feature-bullet cyan">✦</span>
              <span><strong>DeFy Hackathon</strong> — Flagship 24h innovation sprint</span>
            </div>
            <div className="feature-item">
              <span className="feature-bullet purple">✦</span>
              <span><strong>TechnoVIT Events</strong> — Workshops, tech exhibits & talks</span>
            </div>
            <div className="feature-item">
              <span className="feature-bullet pink">✦</span>
              <span><strong>Builder Cohorts</strong> — Weekly project squads & AMAs</span>
            </div>
          </div>

          <div className="card-actions">
            <button className="btn btn-acid" onClick={() => onNavigate('defy')}>
              Explore DeFy
            </button>
            <button className="btn btn-ghost" onClick={() => onNavigate('events')}>
              Upcoming Meets
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
