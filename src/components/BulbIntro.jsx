import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export default function BulbIntro({ onEnter }) {
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState('idle'); // idle | flicker | lit
  const pulledRef = useRef(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const W = window.innerWidth;
    const H = window.innerHeight;

    // ── SCENE ────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020203);

    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.set(0, -1.5, 10);
    camera.lookAt(0, -1.5, 0);

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ── LIGHTS ───────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x221508, 4));

    const topSpot = new THREE.SpotLight(0xfff4cc, 5, 30, Math.PI * 0.15, 0.5);
    topSpot.position.set(0, 10, 3);
    topSpot.target.position.set(0, 0, 0);
    scene.add(topSpot, topSpot.target);

    const rimLeft  = new THREE.PointLight(0xffaa44, 3.5, 18);
    rimLeft.position.set(-5, 1, 2);
    scene.add(rimLeft);

    const rimRight = new THREE.PointLight(0x8855ff, 2.5, 14);
    rimRight.position.set(5, -2, 2);
    scene.add(rimRight);

    const bulbLight = new THREE.PointLight(0xf5a623, 0, 14);
    scene.add(bulbLight);

    // ── PHYSICS ──────────────────────────────────────────
    const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -10, 0) });

    const anchorBody = new CANNON.Body({ mass: 0 });
    anchorBody.position.set(0, 5.5, 0);
    world.addBody(anchorBody);

    const bulbBody = new CANNON.Body({
      mass: 2,
      shape: new CANNON.Sphere(0.7),
      linearDamping: 0.25,
      angularDamping: 0.98,
    });
    bulbBody.position.set(0, 2.2, 0);
    world.addBody(bulbBody);
    world.addConstraint(new CANNON.DistanceConstraint(anchorBody, bulbBody, 3.3));

    // ── BULB SHAPE ───────────────────────────────────────
    const pts = [];
    for (let i = 0; i <= 32; i++) {
      const a = (i / 32) * 2.28;
      pts.push(new THREE.Vector2(Math.sin(a) * 1.08, Math.cos(a) * 1.08));
    }
    pts.push(new THREE.Vector2(0.48, -1.08));
    pts.push(new THREE.Vector2(0.44, -1.32));
    for (let j = 0; j < 5; j++) {
      const yy = -1.32 - j * 0.1;
      pts.push(new THREE.Vector2(0.40, yy));
      pts.push(new THREE.Vector2(0.43, yy - 0.05));
    }
    pts.push(new THREE.Vector2(0.22, -1.86));
    pts.push(new THREE.Vector2(0.0,  -1.95));

    const latheGeo = new THREE.LatheGeometry(pts, 40);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xf8e8a0,
      emissive: 0x201000,
      emissiveIntensity: 0.4,
      metalness: 0.0,
      roughness: 0.05,
      transmission: 0.55,
      ior: 1.5,
      thickness: 0.9,
      specularIntensity: 2.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      transparent: true,
      opacity: 1.0,
    });
    const bulbMesh = new THREE.Mesh(latheGeo, glassMat);

    // Inner warm fill
    const innerGeo = new THREE.SphereGeometry(0.7, 20, 20);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0x5a2c00, transparent: true, opacity: 0.9 });
    const innerGlow = new THREE.Mesh(innerGeo, innerMat);

    // Filament
    const filPts = [];
    for (let i = 0; i < 22; i++) {
      const t = i / 21;
      const a = t * Math.PI * 4.5;
      const r = 0.16 * (1 - t * 0.4);
      filPts.push(new THREE.Vector3(Math.cos(a) * r, -0.38 + t * 0.72, Math.sin(a) * r));
    }
    const filCurve = new THREE.CatmullRomCurve3(filPts);
    const filGeo = new THREE.TubeGeometry(filCurve, 48, 0.02, 8);
    const filMat = new THREE.MeshBasicMaterial({ color: 0xcc8822 });
    const filament = new THREE.Mesh(filGeo, filMat);

    // Thread rings
    const threadGeo = new THREE.TorusGeometry(0.4, 0.046, 8, 32);
    const threadMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.95, roughness: 0.2 });
    const threads = [];
    for (let j = 0; j < 5; j++) {
      const t = new THREE.Mesh(threadGeo, threadMat);
      t.position.y = -1.34 - j * 0.1;
      t.rotation.x = Math.PI / 2;
      threads.push(t);
    }

    const bulbGroup = new THREE.Group();
    bulbGroup.add(bulbMesh, innerGlow, filament, ...threads);
    scene.add(bulbGroup);

    // ── PULL STRING – BIG AND BRIGHT ─────────────────────
    // The cord from bulb bottom to pull handle
    const cordMat = new THREE.MeshStandardMaterial({ color: 0xc89a40, roughness: 0.6 });
    const cordGeo = new THREE.CylinderGeometry(0.025, 0.025, 1.8, 10);
    const cordMesh = new THREE.Mesh(cordGeo, cordMat);
    scene.add(cordMesh);

    // Big gold ring pull handle
    const handleRingGeo = new THREE.TorusGeometry(0.22, 0.055, 12, 40);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0xf5a623, metalness: 0.8, roughness: 0.2,
      emissive: 0xf5a623, emissiveIntensity: 0.35 });
    const handleRing = new THREE.Mesh(handleRingGeo, handleMat);
    handleRing.rotation.x = Math.PI / 2;
    scene.add(handleRing);

    // ── ROPE (cord from ceiling to bulb top) ─────────────
    let ropeLine = null;
    const ropeMat = new THREE.LineBasicMaterial({ color: 0x8a6020 });
    const updateRope = () => {
      if (ropeLine) scene.remove(ropeLine);
      const rGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 5.5, 0),
        new THREE.Vector3(bulbBody.position.x, bulbBody.position.y + 1.98, bulbBody.position.z)
      ]);
      ropeLine = new THREE.Line(rGeo, ropeMat);
      scene.add(ropeLine);
    };

    // ── AMBIENT DUST ─────────────────────────────────────
    const dustCount = 160;
    const dustGeo = new THREE.BufferGeometry();
    const dPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dPos[i]   = (Math.random() - 0.5) * 18;
      dPos[i+1] = (Math.random() - 0.5) * 12;
      dPos[i+2] = (Math.random() - 0.5) * 8;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
    const dustMat = new THREE.PointsMaterial({ color: 0x3a2010, size: 0.04, transparent: true, opacity: 0.5 });
    scene.add(new THREE.Points(dustGeo, dustMat));

    // ── CLICK ANYWHERE TO PULL ───────────────────────────
    const triggerPull = () => {
      if (pulledRef.current) return;
      pulledRef.current = true;
      setPhase('flicker');

      // Physics pull
      bulbBody.applyImpulse(new CANNON.Vec3(2, -4, 0), bulbBody.position);

      let count = 0;
      const iv = setInterval(() => {
        const on = Math.random() > 0.38;
        filMat.color.setHex(on ? 0xffdd44 : 0x301800);
        innerMat.color.setHex(on ? 0xff9911 : 0x5a2c00);
        innerMat.opacity = on ? 1 : 0.6;
        glassMat.emissiveIntensity = on ? 0.7 : 0.15;
        bulbLight.intensity = on ? 6 : 0;
        count++;
        if (count > 18) {
          clearInterval(iv);
          // Full illuminate
          filMat.color.setHex(0xffee80);
          innerMat.color.setHex(0xffaa22);
          innerMat.opacity = 1;
          glassMat.emissive.setHex(0x553300);
          glassMat.emissiveIntensity = 1.0;
          glassMat.transmission = 0.3;
          bulbLight.intensity = 12;
          dustMat.color.setHex(0xf5a623);
          dustMat.opacity = 0.7;
          setPhase('lit');
          setTimeout(() => onEnter(), 900);
        }
      }, 55);
    };

    window.addEventListener('click', triggerPull);

    // ── RESIZE ───────────────────────────────────────────
    const onResize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // ── ANIMATE ──────────────────────────────────────────
    let frameId;
    let last = performance.now();
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      world.step(1 / 60, dt, 3);

      // Sync bulb group
      bulbGroup.position.copy(bulbBody.position);
      bulbGroup.quaternion.copy(bulbBody.quaternion);

      // The pull cord + ring hang below the bulb base
      const basePos = new THREE.Vector3(
        bulbBody.position.x,
        bulbBody.position.y - 1.97,
        bulbBody.position.z
      );
      // Cord center is between base and ring
      cordMesh.position.set(basePos.x, basePos.y - 0.9, basePos.z);
      // Tilt cord to match bulb lean
      cordMesh.rotation.z = -bulbBody.position.x * 0.2;

      // Handle ring at bottom of cord
      handleRing.position.set(basePos.x, basePos.y - 1.86, basePos.z);

      // Bulb's glow light tracks bulb
      bulbLight.position.copy(bulbBody.position);

      updateRope();
      renderer.render(scene, camera);
    };

    // Give it initial swing
    setTimeout(() => {
      bulbBody.applyImpulse(new CANNON.Vec3(1.2, 0, 0), bulbBody.position);
    }, 300);

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('click', triggerPull);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      className={`bulb-intro ${phase === 'lit' ? 'lit' : ''}`}
      style={{ cursor: phase === 'idle' ? 'pointer' : 'default' }}
    >
      <canvas className="bulb-intro-canvas" ref={canvasRef} />

      {/* BIG CLICK HINT UI */}
      {phase === 'idle' && (
        <div style={{
          position: 'absolute', bottom: '12%', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
          pointerEvents: 'none', zIndex: 10,
        }}>
          <div style={{
            fontFamily: "'DM Mono', monospace", fontSize: 11,
            letterSpacing: '0.28em', textTransform: 'uppercase',
            color: 'rgba(245,166,35,0.85)',
            animation: 'pulseHint 1.8s ease-in-out infinite',
          }}>
            Click anywhere to turn on the light
          </div>
          <div style={{
            width: 1, height: 48,
            background: 'linear-gradient(to bottom, rgba(245,166,35,0.6), transparent)',
          }} />
        </div>
      )}

      {/* FLICKER OVERLAY */}
      <div className={`flicker-overlay ${phase === 'flicker' ? 'active' : ''}`} />
    </div>
  );
}
