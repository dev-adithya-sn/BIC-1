import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function InnovationCore({ onEnter }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [nodes, setNodes] = useState([
    { label: 'IDEATE', pos3d: new THREE.Vector3(-1.8, 1.2, 0.5), pos2d: { x: 0, y: 0 }, color: '#00f3ff' },
    { label: 'BUILD', pos3d: new THREE.Vector3(2.0, 0.8, -0.8), pos2d: { x: 0, y: 0 }, color: '#b500ff' },
    { label: 'LAUNCH', pos3d: new THREE.Vector3(-1.2, -1.4, -0.2), pos2d: { x: 0, y: 0 }, color: '#ffe600' },
    { label: 'BUSINESS', pos3d: new THREE.Vector3(1.5, -1.0, 0.6), pos2d: { x: 0, y: 0 }, color: '#00f3ff' },
    { label: 'COMMUNITY', pos3d: new THREE.Vector3(0.2, 1.6, -0.5), pos2d: { x: 0, y: 0 }, color: '#b500ff' }
  ]);
  const [isWarping, setIsWarping] = useState(false);
  const [diagnosticText, setDiagnosticText] = useState('SYS // CONNECTING TO NETWORK...');

  useEffect(() => {
    if (!canvasRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050508, 0.04);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 9);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Core Reactor (Central sphere with double shell)
    const coreGeometry = new THREE.SphereGeometry(1.0, 32, 32);
    const coreMatInner = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      transparent: true,
      opacity: 0.85
    });
    const coreMatOuter = new THREE.MeshBasicMaterial({
      color: 0xb500ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });

    const coreMeshInner = new THREE.Mesh(coreGeometry, coreMatInner);
    const coreMeshOuter = new THREE.Mesh(coreGeometry, coreMatOuter);
    coreMeshOuter.scale.setScalar(1.2);

    const coreGroup = new THREE.Group();
    coreGroup.add(coreMeshInner);
    coreGroup.add(coreMeshOuter);
    scene.add(coreGroup);

    // Add glowing halo rings around core
    const ringGeom = new THREE.RingGeometry(1.6, 1.65, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
    });
    const rings = [];
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.rotation.x = Math.random() * Math.PI;
      ring.rotation.y = Math.random() * Math.PI;
      scene.add(ring);
      rings.push(ring);
    }

    // Constellation / Particle Network
    const particleCount = 250;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Shell distribution
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 2.2 + Math.random() * 2.5;

      positions[i] = r * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = r * Math.cos(phi);

      velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.005
      ));
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00f3ff,
      size: 0.04,
      transparent: true,
      opacity: 0.6
    });
    const networkParticles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(networkParticles);

    // Interactive connection lines mesh
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00f3ff,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending
    });
    
    // Mouse interaction variables
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    let cursorVector = new THREE.Vector3();

    const handleMouseMove = (event) => {
      mouseX = (event.clientX - width / 2) / 180;
      mouseY = (event.clientY - height / 2) / 180;

      // Project mouse into 3D space coordinate
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      cursorVector.set(x * 3.5, y * 3.5, 1.5);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Transition status triggers
    let triggerWarp = false;
    let warpSpeed = 0.0;

    const executeWarp = () => {
      triggerWarp = true;
      setIsWarping(true);
      setDiagnosticText('SYS // STABILIZING CORE REACTOR...');
    };

    // Expose warp function to window or click
    const handleCanvasClick = () => {
      executeWarp();
    };
    window.addEventListener('click', handleCanvasClick);

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Parallax effect on camera
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;
      camera.position.x = targetX;
      camera.position.y = -targetY;
      camera.lookAt(scene.position);

      // Rotate core & halos
      coreGroup.rotation.y += 0.005;
      coreGroup.rotation.x += 0.003;
      rings.forEach((ring, index) => {
        ring.rotation.z += 0.002 * (index + 1);
        ring.rotation.y += 0.001 * (index + 1);
      });

      // Update particle positions
      const posArr = networkParticles.geometry.attributes.position.array;
      const linesPoints = [];

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Move particles slightly
        if (!triggerWarp) {
          posArr[i3] += velocities[i].x;
          posArr[i3 + 1] += velocities[i].y;
          posArr[i3 + 2] += velocities[i].z;

          // Boundary check (keep them clustered)
          const pVec = new THREE.Vector3(posArr[i3], posArr[i3 + 1], posArr[i3 + 2]);
          if (pVec.length() > 5.5) {
            velocities[i].multiplyScalar(-1);
          }

          // Dynamic line connections between cursor and particles
          const distToCursor = pVec.distanceTo(cursorVector);
          if (distToCursor < 2.0) {
            linesPoints.push(pVec.x, pVec.y, pVec.z);
            linesPoints.push(cursorVector.x, cursorVector.y, cursorVector.z);
          }
        } else {
          // Warp Speed: pull particles into core or stretch them
          const pVec = new THREE.Vector3(posArr[i3], posArr[i3 + 1], posArr[i3 + 2]);
          pVec.normalize().multiplyScalar(5.5 - warpSpeed * 5.0);
          posArr[i3] = pVec.x;
          posArr[i3 + 1] = pVec.y;
          posArr[i3 + 2] = pVec.z;
        }
      }
      networkParticles.geometry.attributes.position.needsUpdate = true;

      // Render connecting lines
      const lineGeom = new THREE.BufferGeometry();
      lineGeom.setAttribute('position', new THREE.Float32BufferAttribute(linesPoints, 3));
      const activeLines = new THREE.LineSegments(lineGeom, lineMaterial);
      scene.add(activeLines);

      // Handle HTML overlay tag projection
      const projectedNodes = nodes.map((node) => {
        const vector = node.pos3d.clone();
        
        // Orbit overlay nodes slightly
        if (!triggerWarp) {
          vector.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.002);
          node.pos3d.copy(vector);
        }

        vector.project(camera);
        const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-(vector.y * 0.5) + 0.5) * window.innerHeight;
        return { ...node, pos2d: { x, y } };
      });
      setNodes(projectedNodes);

      // Zoom transition when clicked
      if (triggerWarp) {
        warpSpeed += 0.02;
        camera.position.z -= 0.15;
        camera.fov -= 0.5;
        camera.updateProjectionMatrix();

        // Screen flash transition
        if (camera.position.z <= 0.8) {
          onEnter();
          triggerWarp = false;
        }
      }

      renderer.render(scene, camera);
      scene.remove(activeLines);
      lineGeom.dispose();
    };

    animate();

    // Diagnostics simulation
    const diagInterval = setInterval(() => {
      const logs = [
        'SYS // CONSTRUCTING NODE GRAPH...',
        'SYS // CALIBRATING PARALLAX FIELDS...',
        'SYS // NEURAL MESH ACTIVE.',
        'SYS // CLICK CORE TO INITIALIZE COGNITION'
      ];
      setDiagnosticText(logs[Math.floor(Math.random() * logs.length)]);
    }, 3000);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleCanvasClick);
      clearInterval(diagInterval);
      coreGeometry.dispose();
      coreMatInner.dispose();
      coreMatOuter.dispose();
      ringGeom.dispose();
      ringMat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`reactor-container ${isWarping ? 'warp-active' : ''}`} ref={containerRef}>
      <canvas className="reactor-canvas" ref={canvasRef} />

      {/* HTML Projection Labels */}
      <div className="reactor-labels">
        {nodes.map((node, index) => (
          <div
            key={index}
            className="reactor-label"
            style={{
              left: `${node.pos2d.x}px`,
              top: `${node.pos2d.y}px`,
              borderColor: node.color,
              boxShadow: `0 0 10px ${node.color}55`
            }}
          >
            <span className="label-dot" style={{ backgroundColor: node.color }} />
            {node.label}
          </div>
        ))}
      </div>

      {/* Futuristic HUD overlay */}
      <div className="reactor-hud">
        <div className="hud-corner top-left">
          <span>BIC_REACTOR // VER: 2.0.6</span>
          <span>ESTABLISHED // 18-07-26</span>
        </div>
        <div className="hud-corner top-right">
          <span>COGNITIVE_NODES // 0x05_ACTIVE</span>
          <span>LASER_PARALLAX // ONLINE</span>
        </div>
        <div className="hud-center">
          <div className="hud-status-badge">{diagnosticText}</div>
        </div>
        <div className="hud-bottom">
          <span>CLICK ANYWHERE TO INITIALIZE CORE & CONNECT</span>
        </div>
      </div>

      {/* Volumetric glow mask overlay */}
      <div className="reactor-glow-mask" />
    </div>
  );
}
