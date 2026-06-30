import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

export function CustomCursor({ theme = "default" }: { theme?: string }) {
  const containerRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const [isInsideHero, setIsInsideHero] = useState(false);

  // Monitor if cursor/touch is inside the hero cards area
  useEffect(() => {
    const checkInside = (clientX: number, clientY: number) => {
      const hero = document.getElementById("awwwards-responsive-epic-hero-canvas");
      if (hero) {
        const rect = hero.getBoundingClientRect();
        // Ensure we are inside the horizontal and vertical boundaries of the hero element,
        // and NOT hovering over the top nav bar (the header usually has a height of around 85px)
        const inside = (
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom &&
          clientY > 85 // Avoid the top bar height entirely!
        );
        setIsInsideHero(inside);
      } else {
        setIsInsideHero(false);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      checkInside(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        checkInside(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    
    // Check scroll position as well to deactivate when scrolling past the hero section
    const handleScroll = () => {
      const hero = document.getElementById("awwwards-responsive-epic-hero-canvas");
      if (hero) {
        const rect = hero.getBoundingClientRect();
        if (rect.bottom < 85 || rect.top > window.innerHeight) {
          setIsInsideHero(false);
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Unified position references
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const currentPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  // Mobile inertia and glide physics references
  const velocityRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const shouldPreventScrollRef = useRef(false);

  // Interactive scale parameters
  const scaleRef = useRef({ current: 1.0, goal: 1.0 });

  // Track hover on clickable items
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.tagName === "INPUT" ||
        target.tagName === "SELECT" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest('[role="button"]')
      ) {
        setIsHovered(true);
        scaleRef.current.goal = 1.35;
      } else {
        setIsHovered(false);
        scaleRef.current.goal = 1.0;
      }
    };

    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    return () => {
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  // Set click interactive physics
  useEffect(() => {
    const handleMouseDown = () => {
      scaleRef.current.goal = 0.85;
    };
    const handleMouseUp = () => {
      scaleRef.current.goal = isHovered ? 1.35 : 1.0;
    };

    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isHovered]);

  // Pointer Device/Width Detection
  useEffect(() => {
    const checkIsMobile = () => {
      const match = window.matchMedia("(pointer: coarse)").matches || window.innerWidth <= 768;
      setIsMobile(match);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile, { passive: true });
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Main Three.js Integration Hook (Combined Diamond + Broad Spectacular Saree Flow + Surti Food Plate Dioramas)
  useEffect(() => {
    const canvas = containerRef.current;
    if (!canvas) return;

    // 1. Hide default cursor on desktop inside the hero container ONLY
    let styleNode: HTMLStyleElement | null = null;
    if (!isMobile) {
      styleNode = document.createElement("style");
      styleNode.innerHTML = `
        #awwwards-responsive-epic-hero-canvas,
        #awwwards-responsive-epic-hero-canvas *,
        #awwwards-responsive-epic-hero-canvas a,
        #awwwards-responsive-epic-hero-canvas button,
        #awwwards-responsive-epic-hero-canvas select,
        #awwwards-responsive-epic-hero-canvas input,
        #awwwards-responsive-epic-hero-canvas textarea,
        #awwwards-responsive-epic-hero-canvas [role="button"] {
          cursor: none !important;
        }
      `;
      document.head.appendChild(styleNode);
    }

    // 2. Setup Dimensions
    let width = window.innerWidth;
    let height = window.innerHeight;

    // 3. Renderer Initialization with high-quality color science
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      premultipliedAlpha: false
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    // 4. Scene and Orthographic Camera Config (Pixel-exact 1:1 scaling)
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, width, 0, height, -1000, 1000);
    camera.position.z = 100; // Recessed to fit the 3D depth buffers cleanly

    // Clean tracking array for disposal
    const geometriesToDispose: THREE.BufferGeometry[] = [];
    const materialsToDispose: THREE.Material[] = [];

    const trackGeom = (g: THREE.BufferGeometry) => {
      geometriesToDispose.push(g);
      return g;
    };
    const trackMat = <T extends THREE.Material>(m: T): T => {
      materialsToDispose.push(m);
      return m;
    };

    const texturesToDispose: THREE.Texture[] = [];
    const trackTex = <T extends THREE.Texture>(t: T): T => {
      texturesToDispose.push(t);
      return t;
    };

    // 5. Environmental HDRI Map for diamond refraction and plate reflections
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();

    const rgbeLoader = new RGBELoader();
    rgbeLoader
      .setPath("/textures/")
      .load("royal_esplanade_1k.hdr", (hdr) => {
        const envMap = pmrem.fromEquirectangular(hdr).texture;
        scene.environment = envMap;
        diamond.material.envMap = envMap;
        diamond.material.envMapIntensity = 2.4;
        diamond.material.needsUpdate = true;

        hdr.dispose();
      }, undefined, (err) => {
        console.warn("HDRI Load bypassed. Fallback illumination activated.", err);
      });

    // 6. Brilliant Cut Diamond Geometry Builder (Properly oriented: Flat Up, Sharp Down)
    const makeBrilliantCut = () => {
      const g = new THREE.BufferGeometry();
      const SEG = 16;
      const rGirdle = 1.0;
      const rTable = 0.58;

      const yTable = -0.45; // Table top is UP
      const yGirdle = 0.0;
      const yCulet = 1.25;  // Carat tip is DOWN

      const verts: number[] = [];
      const ring = (r: number, y: number, twist = 0) => {
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i < SEG; i++) {
          const a = (i / SEG) * Math.PI * 2 + twist;
          pts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
        }
        return pts;
      };

      const tableRing = ring(rTable, yTable, Math.PI / SEG);
      const girdleRing = ring(rGirdle, yGirdle);
      const tableCenter = new THREE.Vector3(0, yTable, 0);
      const culetCenter = new THREE.Vector3(0, yCulet, 0);

      const addTriangle = (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3) => {
        verts.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
      };

      for (let i = 0; i < SEG; i++) {
        const nextIdx = (i + 1) % SEG;
        // 1. Flat Table crown
        addTriangle(tableCenter, tableRing[i], tableRing[nextIdx]);

        // 2. Crown Bevels
        addTriangle(tableRing[i], girdleRing[i], girdleRing[nextIdx]);
        addTriangle(tableRing[i], girdleRing[nextIdx], tableRing[nextIdx]);

        // 3. Bottom Pavilion culet
        addTriangle(girdleRing[i], culetCenter, girdleRing[nextIdx]);
      }

      g.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
      g.computeVertexNormals();
      g.center();
      trackGeom(g);
      return g;
    };

    // 7. Physical Transparent Refraction Diamond Material
    const diamondMat = trackMat(new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.0,
      roughness: 0.01,
      transmission: 1.0,
      thickness: 1.5,
      ior: 2.417, 
      dispersion: 4.5, // Beautiful rainbow fire sparkles
      reflectivity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.01,
      flatShading: true,
      side: THREE.DoubleSide
    }));

    const diamond = new THREE.Mesh(makeBrilliantCut(), diamondMat);
    const baseSize = isMobile ? 40 : 34; // Pixel-scale size
    diamond.scale.setScalar(baseSize);
    scene.add(diamond);

    // 8. HIGH QUALITY HIGH CONTRAST GOLD ZARI BROCADE EMBROIDERY GENERATOR
    const createZariTexture = () => {
      const zariCanvas = document.createElement("canvas");
      zariCanvas.width = 1024;
      zariCanvas.height = 1024;
      const ctx = zariCanvas.getContext("2d");
      
      if (ctx) {
        // Deep royal blood red base (with zero pinkish scarlet offsets, rich and intense)
        const grad = ctx.createLinearGradient(0, 0, 1024, 0);
        grad.addColorStop(0, "#8a0008");   // Deep rich blood crimson
        grad.addColorStop(0.5, "#b3000a"); // Vivid intense royal blood red
        grad.addColorStop(1.0, "#5e0004"); // Deep royal maroon fold shadow
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 1024);

        // Highly visible gold borders
        ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
        ctx.shadowBlur = 6;

        // Draw multiple layers of thick golden zari ribbons on both sides of the drape (borders only)
        const borderThickness = 90;
        
        // Solid Metallic Gold border base
        ctx.fillStyle = "#FFD700"; // Pure brilliant yellow gold
        ctx.fillRect(10, 0, borderThickness, 1024); // Left Border base
        ctx.fillRect(1024 - 10 - borderThickness, 0, borderThickness, 1024); // Right Border base

        // Outer sparkling gold cords
        ctx.lineWidth = 14;
        ctx.strokeStyle = "#FFF275"; // Radiant champagne gold details

        ctx.beginPath();
        ctx.moveTo(110, 0); ctx.lineTo(110, 1024);
        ctx.moveTo(1024 - 110, 0); ctx.lineTo(1024 - 110, 1024);
        ctx.stroke();

        // Double Scallop Arches / Intricate lace patterns inside gold border
        ctx.strokeStyle = "#B58A0F"; // Shadow gold stitching
        ctx.lineWidth = 4;
        const archHeight = 40;
        
        ctx.beginPath();
        for (let y = 0; y < 1100; y += archHeight) {
          // Left scalloped loops
          ctx.arc(10 + borderThickness / 2, y, borderThickness / 2 - 10, -Math.PI/2, Math.PI/2);
          // Right scalloped loops
          ctx.arc(1024 - 10 - borderThickness / 2, y, borderThickness / 2 - 10, -Math.PI/2, Math.PI/2);
        }
        ctx.stroke();
      }

      const texture = new THREE.CanvasTexture(zariCanvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      // Dense tiling matches a luxury drape lehenga border roll
      texture.repeat.set(1.0, 4.0);
      return texture;
    };

    // 8.5. Spectacular Procedural 2D Food Stickers Factory with Transparent background and White Outlines
    const createStickerMesh = (type: "khaman" | "ghari" | "locho" | "sev_khamani", radius: number) => {
      const geom = trackGeom(new THREE.PlaneGeometry(radius * 2, radius * 2));
      
      let imageUrl = "";
      if (type === "khaman") {
        imageUrl = "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?q=80&w=800&auto=format&fit=crop";
      } else if (type === "ghari") {
        imageUrl = "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=800&auto=format&fit=crop";
      } else if (type === "locho") {
        imageUrl = "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=800&auto=format&fit=crop";
      } else if (type === "sev_khamani") {
        imageUrl = "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?q=80&w=800&auto=format&fit=crop";
      }

      // Create an offscreen high-res canvas
      const size = 512;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;

      // Initial clean fallback circular disk in themed color so it looks perfect while loading
      ctx.fillStyle = type === "khaman" ? "#fbbf24" :
                      type === "ghari" ? "#fef08a" :
                      type === "locho" ? "#f59e0b" : "#b91c1c";
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 14, 0, Math.PI * 2);
      ctx.fill();

      // White outline for the initial fallback
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 14;
      ctx.stroke();

      const tex = new THREE.CanvasTexture(canvas);
      trackTex(tex);

      const mat = trackMat(new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 1.0,
        side: THREE.DoubleSide,
        depthWrite: false // Prevents rectangular alpha shadow sorting artifacts
      }));

      // Load image asynchronously and draw circular cropped sticker
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        ctx.clearRect(0, 0, size, size);

        // 1. Draw solid circular clipping mask for 100% transparent background outside
        ctx.save();
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 14, 0, Math.PI * 2);
        ctx.clip();

        // 2. Center and draw the image to cover the circle
        ctx.drawImage(img, 0, 0, size, size);
        ctx.restore();

        // 3. Draw a premium thick white sticker border outline to make it stand out on any background
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 14, 0, Math.PI * 2);
        ctx.stroke();

        // Trigger Three.js to re-upload canvas data to the GPU
        tex.needsUpdate = true;
      };
      img.onerror = () => {
        // Fall back gracefully to a fully stylized 2D circular vector emblem if blocked
        console.warn(`Sticker image failed to load, falling back to vector emblem for ${type}`);
      };
      img.src = imageUrl;
      
      const mesh = new THREE.Mesh(geom, mat);
      return mesh;
    };

    const SAREE_SEGS = isMobile ? 32 : 46;

    // Food platters array to flow along the saree trail
    const dishes: Array<{ mesh: THREE.Mesh; segmentIndex: number; offsetSide: number; zOffset: number }> = []; 
    const SAREE_WIDTH_MAX = isMobile ? 120 : 220; // Expanded to form a massive, epic flowing silk trail!
    const SAREE_W_SEGS = 16; // Upgraded grid density for rich folding dynamics

    const sareeGeo = trackGeom(new THREE.PlaneGeometry(1, 100, SAREE_W_SEGS, SAREE_SEGS));
    
    const sareeMat = trackMat(new THREE.MeshPhysicalMaterial({
      map: createZariTexture(),
      roughness: 0.88, // Matte finish of premium bridal georgette/silk fabrics
      metalness: 0.0, // Natural fabric is non-metallic
      clearcoat: 0.0, // Removes the wet/lacquered water look entirely
      clearcoatRoughness: 0.0,
      sheen: 0.8, // Keeps beautiful micro-fuzz fabric scattering
      sheenColor: 0x99000a, // Deep blood red velvet halo (no pink tint)
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.98,
      envMapIntensity: 0.0 // Zero environmental reflections for a perfectly organic, ultra-matte fabric feel
    }));

    const saree = new THREE.Mesh(sareeGeo, sareeMat);
    scene.add(saree);

    // Instantiate and push the food stickers (Increased plate size for gorgeous visibility!)
    const plateRadius = isMobile ? 26 : 40;
    dishes.push(
      {
        mesh: createStickerMesh("khaman", plateRadius),
        segmentIndex: isMobile ? 8 : 10,
        offsetSide: isMobile ? -18 : -34,
        zOffset: 4
      },
      {
        mesh: createStickerMesh("ghari", plateRadius - 1),
        segmentIndex: isMobile ? 15 : 20,
        offsetSide: isMobile ? 16 : 28,
        zOffset: 4
      },
      {
        mesh: createStickerMesh("locho", plateRadius + 1),
        segmentIndex: isMobile ? 22 : 30,
        offsetSide: isMobile ? -14 : -24,
        zOffset: 4
      },
      {
        mesh: createStickerMesh("sev_khamani", plateRadius),
        segmentIndex: isMobile ? 28 : 40,
        offsetSide: isMobile ? 12 : 22,
        zOffset: 4
      }
    );

    dishes.forEach((d) => {
      scene.add(d.mesh);
    });

    // Coordinate history buffer
    const sareeHistory: THREE.Vector3[] = [];
    const initialSpawnX = isMobile ? width * 0.78 : width / 2;
    const initialSpawnY = isMobile ? height * 0.72 : height / 2;

    for (let i = 0; i <= SAREE_SEGS; i++) {
      sareeHistory.push(new THREE.Vector3(initialSpawnX, initialSpawnY, -15));
    }

    // 10. Master Lights assembly
    scene.add(new THREE.AmbientLight(0xffffff, 0.45));
    const mainLight = new THREE.DirectionalLight(0xffffff, 3.2);
    mainLight.position.set(1000, 2000, 1500);
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0xffedd5, 2.0);
    rimLight.position.set(-1000, -2000, 1000);
    scene.add(rimLight);

    // Initial position states
    if (isMobile) {
      currentPosRef.current = { x: width * 0.78, y: height * 0.72 };
      mouseRef.current = { x: width * 0.78, y: height * 0.72 };
    }

    // 11. Desktop movement listener
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    // Mobile touch and glide support
    const handleTouchMoveLocal = (e: TouchEvent) => {
      const hero = document.getElementById("awwwards-responsive-epic-hero-canvas");
      if (!hero) {
        shouldPreventScrollRef.current = false;
        isDraggingRef.current = false;
        return;
      }

      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const mobileOffset = 90;
        if (shouldPreventScrollRef.current) {
          if (e.cancelable) {
            e.preventDefault(); // Prevent body scroll while actively sliding/gliding
          }
          isDraggingRef.current = true;
          mouseRef.current.x = touch.clientX - dragStartRef.current.x;
          mouseRef.current.y = (touch.clientY - mobileOffset) - dragStartRef.current.y;
        }
      }
    };

    const handleTouchStartLocal = (e: TouchEvent) => {
      const hero = document.getElementById("awwwards-responsive-epic-hero-canvas");
      if (!hero) {
        shouldPreventScrollRef.current = false;
        isDraggingRef.current = false;
        return;
      }

      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const isAtTop = window.scrollY < 100;
        const isUpperHalf = touch.clientY < window.innerHeight * 0.75;

        const rect = hero.getBoundingClientRect();
        const insideHero = (
          touch.clientX >= rect.left &&
          touch.clientX <= rect.right &&
          touch.clientY >= rect.top &&
          touch.clientY <= rect.bottom &&
          touch.clientY > 85
        );

        if (isAtTop && isUpperHalf && insideHero) {
          shouldPreventScrollRef.current = true;
          isDraggingRef.current = true;
          const mobileOffset = 90;
          dragStartRef.current = {
            x: touch.clientX - currentPosRef.current.x,
            y: (touch.clientY - mobileOffset) - currentPosRef.current.y
          };
        } else {
          shouldPreventScrollRef.current = false;
          isDraggingRef.current = false;
        }
      }
    };

    const handleTouchEndLocal = () => {
      isDraggingRef.current = false;
      shouldPreventScrollRef.current = false;
    };

    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    } else {
      window.addEventListener("touchstart", handleTouchStartLocal, { passive: false });
      window.addEventListener("touchmove", handleTouchMoveLocal, { passive: false });
      window.addEventListener("touchend", handleTouchEndLocal, { passive: false });
    }

    // 12. Physics, Waves, and Rendering Loop
    let animFrame: number;
    const clock = new THREE.Clock();

    const renderTick = () => {
      if (window.innerWidth < 768) {
        animFrame = requestAnimationFrame(renderTick);
        return;
      }

      const dt = clock.getDelta();
      const time = clock.getElapsedTime();

      // Constantly self-revolve the diamond cut
      const spinSpeed = isDraggingRef.current ? 2.8 : 0.9;
      diamond.rotation.y += spinSpeed * dt;
      diamond.rotation.x = Math.sin(time * 0.5) * 0.18;
      diamond.rotation.z = Math.cos(time * 0.25) * 0.12;

      // Smooth lerp on desktop, inert glide physics on mobile
      if (!isMobile) {
        const easeAmt = 0.18;
        let targetX = mouseRef.current.x;
        let targetY = mouseRef.current.y;

        const hero = document.getElementById("awwwards-responsive-epic-hero-canvas");
        if (hero) {
          const rect = hero.getBoundingClientRect();
          // Clamp target positions to hero container box (with 32px padding margins)
          const padX = 32;
          const padY = 32;
          targetX = Math.max(rect.left + padX, Math.min(rect.right - padX, targetX));
          targetY = Math.max(rect.top + padY, Math.min(rect.bottom - padY, targetY));
        }

        currentPosRef.current.x += (targetX - currentPosRef.current.x) * easeAmt;
        currentPosRef.current.y += (targetY - currentPosRef.current.y) * easeAmt;
      } else {
        const friction = 0.93;
        if (isDraggingRef.current) {
          const spring = 0.22;
          velocityRef.current.x = (mouseRef.current.x - currentPosRef.current.x) * spring;
          velocityRef.current.y = (mouseRef.current.y - currentPosRef.current.y) * spring;

          currentPosRef.current.x += velocityRef.current.x;
          currentPosRef.current.y += velocityRef.current.y;
        } else {
          // Momentum coasting
          velocityRef.current.x *= friction;
          velocityRef.current.y *= friction;

          currentPosRef.current.x += velocityRef.current.x;
          currentPosRef.current.y += velocityRef.current.y;

          // Elastic boundary bounce
          const margin = 40;
          const elasticity = -0.65;

          if (currentPosRef.current.x < margin) {
            currentPosRef.current.x = margin;
            velocityRef.current.x *= elasticity;
          } else if (currentPosRef.current.x > width - margin) {
            currentPosRef.current.x = width - margin;
            velocityRef.current.x *= elasticity;
          }

          if (currentPosRef.current.y < margin) {
            currentPosRef.current.y = margin;
            velocityRef.current.y *= elasticity;
          } else if (currentPosRef.current.y > height - margin) {
            currentPosRef.current.y = height - margin;
            velocityRef.current.y *= elasticity;
          }

          // Return quietly to static lower-right float point on idle
          const speedSq = velocityRef.current.x ** 2 + velocityRef.current.y ** 2;
          if (speedSq < 0.05) {
            const homeX = width * 0.78;
            const homeY = height * 0.72;
            currentPosRef.current.x += (homeX - currentPosRef.current.x) * 0.035;
            currentPosRef.current.y += (homeY - currentPosRef.current.y) * 0.035;
          }
        }
      }

      // Position the diamond precisely at the coordinates
      diamond.position.set(currentPosRef.current.x, currentPosRef.current.y, 0);

      // Smooth interactive pulse scaling
      scaleRef.current.current += (scaleRef.current.goal - scaleRef.current.current) * 0.16;
      diamond.scale.setScalar(baseSize * scaleRef.current.current);

      // SAREE FLUID PHYSICS (Position History + Sine Ripple Waves)
      sareeHistory.unshift(new THREE.Vector3(currentPosRef.current.x, currentPosRef.current.y, -15));
      if (sareeHistory.length > SAREE_SEGS + 1) {
        sareeHistory.pop();
      }

      // Displace Saree Vertices based on movement path
      const posAttr = saree.geometry.attributes.position;
      for (let i = 0; i <= SAREE_SEGS; i++) {
        const histPoint = sareeHistory[i];
        
        // Fluid factor: segments further down the tail ripple harder
        const flexFactor = i / SAREE_SEGS; 
        const waveOffset = Math.sin(time * 6.0 - i * 0.2) * 16.0 * flexFactor;

        // Elegant geometric taper:
        // Connects snugly behind the diamond at i=0, then flares out massively to extreme luxury breadth values!
        const currentBreadth = (0.3 + 0.7 * flexFactor) * SAREE_WIDTH_MAX;

        for (let j = 0; j <= SAREE_W_SEGS; j++) {
          const idx = i * (SAREE_W_SEGS + 1) + j;
          const normalizedWidth = (j / SAREE_W_SEGS) - 0.5; // -0.5 to 0.5 span
          const baseX = normalizedWidth * currentBreadth;

          // Dynamic silk folds/waves
          const crimpFold = Math.sin(normalizedWidth * Math.PI * 3.5 + time * 2.2) * 4.5;

          posAttr.setXYZ(idx,
            histPoint.x + baseX + waveOffset,
            histPoint.y + crimpFold,
            histPoint.z - (i * 2.5) // Gradually push back in depth to render behind the active diamond
          );
        }
      }

      posAttr.needsUpdate = true;
      saree.geometry.computeVertexNormals();

      // Food Platters/Stickers Flow & Align Trajectory Engine
      dishes.forEach((dish) => {
        const anchorPoint = sareeHistory[dish.segmentIndex];
        const leadPoint = sareeHistory[dish.segmentIndex - 1] || anchorPoint;

        // Calculate travel direction angle to align sticker rotation with saree trajectory
        const angle = Math.atan2(anchorPoint.y - leadPoint.y, anchorPoint.x - leadPoint.x);

        // Position sticker relative to its assigned segment along the trail
        dish.mesh.position.set(
          anchorPoint.x + Math.cos(angle + Math.PI / 2) * dish.offsetSide,
          anchorPoint.y + Math.sin(angle + Math.PI / 2) * dish.offsetSide,
          anchorPoint.z + dish.zOffset // Sit comfortably above active fabric depth folds
        );

        // Intricate rolling oscillation physics for ultimate luxury realism
        dish.mesh.rotation.z = angle + Math.PI / 2 + Math.sin(time * 1.5 + dish.segmentIndex) * 0.12;
        dish.mesh.rotation.y = Math.sin(time * 1.8 + dish.segmentIndex) * 0.1;
        dish.mesh.rotation.x = Math.cos(time * 1.2 + dish.segmentIndex) * 0.08;
      });

      renderer.render(scene, camera);
      animFrame = requestAnimationFrame(renderTick);
    };

    renderTick();

    // Handle window resizes safely
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      renderer.setSize(width, height);
      camera.right = width;
      camera.bottom = height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      if (styleNode && styleNode.parentNode) {
        document.head.removeChild(styleNode);
      }
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStartLocal);
      window.removeEventListener("touchmove", handleTouchMoveLocal);
      window.removeEventListener("touchend", handleTouchEndLocal);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animFrame);
      scene.clear();
      
      // Fully clean up Three.js objects of dishes, saree, diamond
      geometriesToDispose.forEach((g) => g.dispose());
      materialsToDispose.forEach((m) => m.dispose());
      texturesToDispose.forEach((t) => t.dispose());
      
      renderer.dispose();
      pmrem.dispose();
    };
  }, [isMobile]);

  return (
    <canvas
      ref={containerRef}
      id="diamond-cursor"
      className="hidden md:block fixed inset-0 w-full h-full pointer-events-none z-[999999] transition-opacity duration-300"
      style={{ 
        mixBlendMode: "normal",
        opacity: isInsideHero ? 1 : 0
      }}
    />
  );
}
