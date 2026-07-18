import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function PixarIntro({ onEnter }) {
  const canvasRef = useRef(null);
  const [flickerClass, setFlickerClass] = useState('');
  const [showSubText, setShowSubText] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050604, 0.05);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lathe Points Profile for Bulb Shape
    const points = [];
    const segments = 24;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * 2.2;
      const x = Math.sin(angle) * 0.9;
      const y = Math.cos(angle) * 0.9;
      points.push(new THREE.Vector2(x, y));
    }
    points.push(new THREE.Vector2(0.4, -0.9));
    points.push(new THREE.Vector2(0.35, -1.1));
    for (let j = 0; j < 4; j++) {
      const yPos = -1.1 - (j * 0.08);
      points.push(new THREE.Vector2(0.32, yPos));
      points.push(new THREE.Vector2(0.35, yPos - 0.04));
    }
    points.push(new THREE.Vector2(0.2, -1.5));
    points.push(new THREE.Vector2(0.0, -1.6));

    const latheGeometry = new THREE.LatheGeometry(points, 24);
    
    // Lightbulb Material (Hand-drawn solid body)
    const bulbMaterial = new THREE.MeshBasicMaterial({
      color: 0xf5f7f2, // flat off-white glass shell
      transparent: false,
    });
    
    // Clean vector outlines using EdgesGeometry
    const edges = new THREE.EdgesGeometry(latheGeometry, 15); // 15 degrees threshold for clean lines
    const outlineMaterial = new THREE.LineBasicMaterial({
      color: 0x000000,
      linewidth: 2,
    });

    const bulbMain = new THREE.Mesh(latheGeometry, bulbMaterial);
    const bulbOutline = new THREE.LineSegments(edges, outlineMaterial);

    const bulbGroup = new THREE.Group();
    bulbGroup.add(bulbMain);
    bulbGroup.add(bulbOutline);

    // Flat black thread base rings for screw cap detail
    const threadGeom = new THREE.TorusGeometry(0.35, 0.04, 8, 24);
    const threadMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const threads = [];
    for (let j = 0; j < 4; j++) {
      const thread = new THREE.Mesh(threadGeom, threadMat);
      thread.position.set(0, -1.05 - j * 0.1, 0);
      thread.rotation.x = Math.PI / 2;
      bulbGroup.add(thread);
      threads.push(thread);
    }

    // Filament inside (flat black solid line)
    const filamentPoints = [];
    for (let i = 0; i < 20; i++) {
      const t = i / 19;
      const angle = t * Math.PI * 3.5;
      const radius = 0.15 * (1 - t * 0.3);
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = -0.3 + t * 0.6;
      filamentPoints.push(new THREE.Vector3(x, y, z));
    }
    const filamentCurve = new THREE.CatmullRomCurve3(filamentPoints);
    const filamentGeom = new THREE.TubeGeometry(filamentCurve, 32, 0.02, 6, false);
    const filamentMat = new THREE.MeshBasicMaterial({
      color: 0x000000, // starts black
    });
    const filament = new THREE.Mesh(filamentGeom, filamentMat);
    bulbGroup.add(filament);

    // Position bulb offscreen to the right initially
    bulbGroup.position.set(6, 0, 0);
    scene.add(bulbGroup);

    // Ambient particles (Cyan theme)
    const particleCount = 60;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 8;
      particlePositions[i + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00f3ff, // Cyan theme
      size: 0.03,
      transparent: true,
      opacity: 0.25,
    });
    const starfield = new THREE.Points(particleGeometry, particleMat);
    scene.add(starfield);

    // Animation States & Timings
    let startTime = Date.now();
    let animationPhase = 'entrance'; // entrance -> look -> stomp -> flicker -> complete
    let phaseTime = 0;
    
    // Animation constants
    const targetX = -0.05; // Lands on top of the "i" position in "BiC"
    const targetY = 0.25;

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsed = (Date.now() - startTime) / 1000;

      // Soft rotation and float
      bulbGroup.rotation.y = Math.sin(elapsed * 2) * 0.1;

      if (animationPhase === 'entrance') {
        // Bulb hops in from X=6 to X=targetX
        const duration = 2.8; // 2.8 seconds
        const t = Math.min(elapsed / duration, 1);
        
        // Horizontal ease-out
        const currentX = 6 - (6 - targetX) * (1 - Math.pow(1 - t, 3));
        
        // Hopping vertical bounces (sin wave)
        const bounceCount = 4;
        const bounceHeight = 1.0;
        const currentY = targetY + Math.abs(Math.sin(t * Math.PI * bounceCount)) * bounceHeight * (1 - t);
        
        bulbGroup.position.set(currentX, currentY, 0);

        // Squash & stretch dynamics based on bounce
        const sineVal = Math.sin(t * Math.PI * bounceCount * 2);
        if (sineVal > 0) {
          // stretching up
          bulbGroup.scale.set(0.9, 1.15, 0.9);
          bulbGroup.rotation.z = -0.15 * (1 - t);
        } else {
          // squashing down
          bulbGroup.scale.set(1.1, 0.9, 1.1);
          bulbGroup.rotation.z = 0.05 * (1 - t);
        }

        if (t === 1) {
          animationPhase = 'look';
          phaseTime = elapsed;
          bulbGroup.scale.set(1.0, 1.0, 1.0);
          bulbGroup.rotation.z = 0;
        }
      }
      else if (animationPhase === 'look') {
        // Bulb tilts head looking around
        const t = elapsed - phaseTime;
        
        if (t < 0.6) {
          // Look left
          bulbGroup.rotation.y = -0.3;
          bulbGroup.rotation.x = 0.15;
        } else if (t < 1.2) {
          // Look right
          bulbGroup.rotation.y = 0.3;
          bulbGroup.rotation.x = -0.15;
        } else if (t < 1.8) {
          // Look down towards the placeholder
          bulbGroup.rotation.y = 0.05;
          bulbGroup.rotation.x = 0.45;
        } else {
          animationPhase = 'stomp';
          phaseTime = elapsed;
        }
      }
      else if (animationPhase === 'stomp') {
        // Jumps up, stomps down hard, squashes the letter/bulb
        const t = elapsed - phaseTime;
        
        if (t < 0.4) {
          // Squash down preparing to jump
          const prepT = t / 0.4;
          bulbGroup.scale.set(1.2, 0.75, 1.2);
          bulbGroup.position.y = targetY - prepT * 0.2;
        } else if (t < 0.8) {
          // Jump up high
          const jumpT = (t - 0.4) / 0.4;
          bulbGroup.scale.set(0.85, 1.25, 0.85);
          bulbGroup.position.y = (targetY - 0.2) + Math.sin(jumpT * Math.PI) * 1.5;
          // Look straight down
          bulbGroup.rotation.x = 0.4 - jumpT * 0.4;
        } else if (t < 1.0) {
          // Stomp down hard
          const landT = (t - 0.8) / 0.2;
          bulbGroup.position.y = (targetY + 0.2) - landT * 1.5;
          bulbGroup.scale.set(1.0, 1.1, 1.0);
        } else if (t < 1.3) {
          // Ultimate squish on landing
          const squishT = (t - 1.0) / 0.3;
          bulbGroup.position.y = targetY - 0.5; // squished position
          bulbGroup.scale.set(1.4, 0.4, 1.4);
        } else if (t < 1.6) {
          // Pop back to standard size
          const popT = (t - 1.3) / 0.3;
          bulbGroup.position.y = targetY;
          bulbGroup.scale.set(1.4 - popT * 0.4, 0.4 + popT * 0.6, 1.4 - popT * 0.4);
        } else {
          animationPhase = 'flicker';
          phaseTime = elapsed;
          setFlickerClass('horror-active');
        }
      }
      else if (animationPhase === 'flicker') {
        // Flicker intensity
        const t = elapsed - phaseTime;
        const flickerDuration = 1.4;
        
        if (t < flickerDuration) {
          const lit = Math.random() > 0.4;
          if (lit) {
            bulbMaterial.color.setHex(0x00f3ff); // Electric Cyan glow
            filamentMat.color.setHex(0xffffff);
          } else {
            bulbMaterial.color.setHex(0xf5f7f2); // Solid off-white
            filamentMat.color.setHex(0x000000); // Solid black
          }
        } else {
          // Solid light-up!
          bulbMaterial.color.setHex(0x00f3ff);
          filamentMat.color.setHex(0xffffff);
          setShowSubText(true);
          animationPhase = 'complete';
          phaseTime = elapsed;
        }
      }
      else if (animationPhase === 'complete') {
        // Camera zooms in close through the illuminated core
        const t = elapsed - phaseTime;
        if (t > 1.2) {
          camera.position.z -= 0.18;
          // When camera enters inside the bulb
          if (camera.position.z <= 0.5) {
            onEnter();
          }
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      latheGeometry.dispose();
      edges.dispose();
      bulbMaterial.dispose();
      outlineMaterial.dispose();
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
    <div className={`pixar-intro-container ${flickerClass}`}>
      <canvas className="pixar-canvas" ref={canvasRef} />

      {/* The large background logo container */}
      <div className="pixar-logo-layout">
        <h1 className="pixar-title">
          B<span className="pixar-i-placeholder"></span>C
        </h1>
        
        <p className={`pixar-sub ${showSubText ? 'visible' : ''}`}>
          BUSINESS INNOVATION COMMUNITY
        </p>
      </div>

      <div className="pixar-scanline" />
    </div>
  );
}
