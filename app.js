// Construction Engineering Platform - Core Logic and Calculators

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide Icons
  lucide.createIcons();
  
  // Set default date in Gantt planner to today
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById("gantt-start-date");
  if (dateInput) dateInput.value = today;

  // Initialize features
  initMarquee();
  runAllCalculators();
  
  // Start user-friendly elements and gadgets
  initCopyButtons();
  loadGadgetNotes();
  loadProfileData();
  
  // Initialize cinematic premium hero section scroll/parallax triggers
  initPremiumHero();
  
  // Global click listener to close profile menu when clicking outside
  document.addEventListener("click", () => {
    const menu = document.getElementById("profile-menu");
    if (menu) menu.classList.remove("active");
  });
});

// Sidebar navigation toggle
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("active");
}

// Routing between main sidebar views
function switchView(viewId) {
  // Hide all sections
  document.querySelectorAll(".view-section").forEach(section => {
    section.classList.remove("active");
  });
  
  // Show target section
  const target = document.getElementById(viewId);
  if (target) {
    target.classList.add("active");
  }
  
  // Update sidebar active link styling
  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.remove("active");
  });
  
  // Set active link based on click source or search
  const activeLink = Array.from(document.querySelectorAll(".nav-link")).find(link => {
    return link.getAttribute("onclick").includes(viewId);
  });
  if (activeLink) activeLink.classList.add("active");
  
  // Run specific view recalculations to render canvas diagrams properly
  if (viewId === 'civil-view') {
    runBeamCalculator();
    runConcreteCalculator();
  } else if (viewId === 'arch-view') {
    runArchPlanGenerator();
    runFSICalculator();
  } else if (viewId === 'elec-view') {
    runSolarCalculator();
    runCableCalculator();
  } else if (viewId === 'plumb-view') {
    runPlumbingCalculator();
  } else if (viewId === 'hvac-view') {
    runHVACCalculator();
  } else if (viewId === 'fire-view') {
    runFireCalculator();
  } else if (viewId === 'mech-view') {
    runPumpCalculator();
  } else if (viewId === 'pm-view') {
    runPMEstimator();
    runGanttPlanner();
  }
  
  // Close sidebar on mobile
  document.getElementById("sidebar").classList.remove("active");
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Sub-tab navigation switching within a view
function switchTab(discipline, tabName) {
  // Deactivate all tab buttons in this discipline
  const container = document.getElementById(`${discipline}-view`);
  container.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.remove("active");
  });
  
  // Deactivate all tab contents in this discipline
  container.querySelectorAll(".tab-content").forEach(content => {
    content.style.display = "none";
  });
  
  // Find active button and activate it
  const activeBtn = Array.from(container.querySelectorAll(".tab-btn")).find(btn => {
    return btn.getAttribute("onclick").includes(tabName);
  });
  if (activeBtn) activeBtn.classList.add("active");
  
  // Show active tab content
  const activeContent = document.getElementById(`${discipline}-${tabName}`);
  if (activeContent) {
    activeContent.style.display = "block";
  }
  
  // Re-run relevant calculator for visual refresh
  if (discipline === 'civil' && tabName === 'beam-calc') runBeamCalculator();
  if (discipline === 'civil' && tabName === 'concrete-calc') runConcreteCalculator();
  if (discipline === 'civil' && tabName === 'unit-calc') updateUnitConverter();
  if (discipline === 'arch' && tabName === 'plan-gen') runArchPlanGenerator();
  if (discipline === 'arch' && tabName === 'fsi-calc') runFSICalculator();
  if (discipline === 'elec' && tabName === 'solar-sizer') runSolarCalculator();
  if (discipline === 'elec' && tabName === 'cable-sizer') runCableCalculator();
  if (discipline === 'pm' && tabName === 'cost-est') runPMEstimator();
  if (discipline === 'pm' && tabName === 'gantt-chart') runGanttPlanner();
}

// Toggle light and dark theme modes
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute("data-theme");
  const themeIcon = document.getElementById("theme-icon");
  
  if (currentTheme === "dark") {
    html.setAttribute("data-theme", "light");
    themeIcon.setAttribute("data-lucide", "moon");
  } else {
    html.setAttribute("data-theme", "dark");
    themeIcon.setAttribute("data-lucide", "sun");
  }
  lucide.createIcons();
}

// Populate crawling marquee with duplicate array for infinite seamless wrap loop
// Populate crawling marquee with duplicate array for infinite seamless wrap loop
function initMarquee() {
  const marqueeTrack = document.getElementById("marquee-track");
  if (!marqueeTrack) return;
  
  const videos = ENGINEERING_DATA.tutorials;
  // Double list to create a seamless marquee flow
  const doubledVideos = [...videos, ...videos];
  
  marqueeTrack.innerHTML = doubledVideos.map((vid, idx) => {
    // ONLY Card 1 (Villa Architectural Walkthrough) renders the actual local MP4 drone video
    const isLocalVideo = vid.id === "vid_1";
    const mediaHTML = isLocalVideo
      ? `<video class="marquee-media" src="${vid.url}" muted loop playsinline preload="metadata" style="width:100%; height:100%; object-fit:cover;"></video>`
      : `<canvas class="marquee-media simulation-canvas" data-category="${vid.category}" style="width:100%; height:100%; background:#0f172a; display:block;"></canvas>`;
      
    return `
      <div class="video-card" onclick="openVideoModal('${vid.title.replace(/'/g, "\\'")}', '${vid.url}', '${vid.category}')" onmouseenter="playPreview(this)" onmouseleave="pausePreview(this)">
        <div class="thumbnail-box" style="height: 180px; position: relative; overflow: hidden;">
          ${mediaHTML}
          <div class="play-badge"><i data-lucide="play"></i></div>
          <div class="duration-badge">${vid.duration}</div>
        </div>
        <div class="video-meta">
          <div class="video-tag">${vid.category}</div>
          <div class="video-card-title">${vid.title}</div>
        </div>
      </div>
    `;
  }).join('');
  
  lucide.createIcons();
}

const activeSimulations = new Map(); // tracks running canvas animation frames

// Hover preview helper functions
function playPreview(card) {
  const video = card.querySelector("video");
  if (video) {
    video.play().catch(e => {});
  }
  
  const canvas = card.querySelector(".simulation-canvas");
  if (canvas) {
    startSimulation(canvas);
  }
}

function pausePreview(card) {
  const video = card.querySelector("video");
  if (video) {
    video.pause();
    video.currentTime = 0;
  }
  
  const canvas = card.querySelector(".simulation-canvas");
  if (canvas) {
    stopSimulation(canvas);
  }
}

function startSimulation(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const category = canvas.getAttribute("data-category");
  
  // Set dimensions based on parent container bounding box
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width || 250;
  canvas.height = rect.height || 180;
  
  let frame = 0;
  activeSimulations.set(canvas, { active: true });

  // Pre-generate engineering particles
  const particles = [];
  for (let i = 0; i < 20; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 1.2 + Math.random() * 1.8,
      size: 2.5 + Math.random() * 3
    });
  }

  function animate() {
    const sim = activeSimulations.get(canvas);
    if (!sim || !sim.active) return;
    
    // Clear background
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw drafting blueprint grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
    ctx.lineWidth = 1;
    for (let x = 15; x < canvas.width; x += 15) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 15; y < canvas.height; y += 15) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    frame++;

    if (category === "Coastal Design") {
      // 1. Smooth fluid wave sizer (Coastal waves simulation)
      ctx.lineWidth = 2.5;
      const waveCount = 3;
      const colors = ["rgba(6, 182, 212, 0.6)", "rgba(8, 145, 178, 0.45)", "rgba(14, 116, 144, 0.3)"];
      
      for (let w = 0; w < waveCount; w++) {
        ctx.strokeStyle = colors[w];
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x++) {
          const freq = 0.015 + w * 0.004;
          const amp = 18 - w * 3;
          const phase = frame * 0.04 + w * 1.5;
          const y = canvas.height / 2 + Math.sin(x * freq + phase) * amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(6, 182, 212, 0.85)";
      ctx.font = "bold 8px monospace";
      ctx.fillText("FLUID DYNAMICS WAVE ACTIVE", 15, 25);

    } else if (category === "Architecture") {
      // 2. Rotating isometric 3D CAD home blueprint (Architecture)
      const cx = canvas.width / 2;
      const cy = canvas.height / 2 + 10;
      const sz = 32;
      const angle = frame * 0.015;
      
      function rotateY(x, y, z, ang) {
        const cos = Math.cos(ang);
        const sin = Math.sin(ang);
        return { x: x * cos - z * sin, y, z: x * sin + z * cos };
      }
      
      function project(p) {
        return { x: cx + p.x, y: cy + p.y - p.z * 0.4 };
      }

      const points = [
        { x: -sz, y: sz, z: -sz }, { x: sz, y: sz, z: -sz },
        { x: sz, y: sz, z: sz }, { x: -sz, y: sz, z: sz },
        { x: -sz, y: -sz, z: -sz }, { x: sz, y: -sz, z: -sz },
        { x: sz, y: -sz, z: sz }, { x: -sz, y: -sz, z: sz },
        { x: 0, y: -sz - 20, z: 0 } // Roof
      ];

      const rotated = points.map(p => rotateY(p.x, p.y, p.z, angle));
      const proj = rotated.map(p => project(p));

      ctx.strokeStyle = "rgba(99, 102, 241, 0.8)";
      ctx.lineWidth = 1.5;
      
      // Draw faces
      ctx.beginPath();
      ctx.moveTo(proj[0].x, proj[0].y);
      for (let i = 1; i < 4; i++) ctx.lineTo(proj[i].x, proj[i].y);
      ctx.closePath(); ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(proj[4].x, proj[4].y);
      for (let i = 5; i < 8; i++) ctx.lineTo(proj[i].x, proj[i].y);
      ctx.closePath(); ctx.stroke();

      for (let i = 0; i < 4; i++) {
        ctx.beginPath(); ctx.moveTo(proj[i].x, proj[i].y); ctx.lineTo(proj[i+4].x, proj[i+4].y); ctx.stroke();
      }

      ctx.strokeStyle = "rgba(6, 182, 212, 0.8)";
      for (let i = 4; i < 8; i++) {
        ctx.beginPath(); ctx.moveTo(proj[i].x, proj[i].y); ctx.lineTo(proj[8].x, proj[8].y); ctx.stroke();
      }

      ctx.fillStyle = "rgba(99, 102, 241, 0.9)";
      ctx.font = "bold 8px monospace";
      ctx.fillText("3D STRUCTURAL BLUEPRINT", 15, 25);

    } else if (category === "Electrical") {
      // 3. Pulsing electrical currents (Electrical)
      ctx.strokeStyle = "rgba(16, 185, 129, 0.35)";
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      ctx.moveTo(20, canvas.height * 0.3); ctx.lineTo(canvas.width - 20, canvas.height * 0.3);
      ctx.moveTo(20, canvas.height * 0.7); ctx.lineTo(canvas.width - 20, canvas.height * 0.7);
      ctx.stroke();

      ctx.fillStyle = "#10b981";
      particles.forEach(p => {
        p.x += p.speed;
        if (p.x > canvas.width - 20) p.x = 20;
        
        ctx.beginPath();
        ctx.arc(p.x, canvas.height * (p.speed > 2.0 ? 0.3 : 0.7), p.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = "rgba(16, 185, 129, " + (0.4 + Math.sin(frame * 0.1) * 0.3) + ")";
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#10b981";
      ctx.font = "bold 8px monospace";
      ctx.fillText("CIRCUIT CURRENT FLOW ACTIVE", 15, 25);

    } else if (category === "HVAC Design") {
      // 4. HVAC Air ventilation velocity curves (HVAC Design)
      ctx.lineWidth = 2;
      const arrowCount = 5;
      
      for (let i = 0; i < arrowCount; i++) {
        const offset = (frame * 1.5 + i * 50) % canvas.width;
        ctx.strokeStyle = "rgba(6, 182, 212, 0.65)";
        ctx.fillStyle = "rgba(6, 182, 212, 0.65)";
        ctx.beginPath();
        ctx.moveTo(offset, canvas.height * 0.3);
        ctx.lineTo(offset - 7, canvas.height * 0.3 - 3.5);
        ctx.lineTo(offset - 7, canvas.height * 0.3 + 3.5);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        const offsetLeft = canvas.width - ((frame * 1.5 + i * 50) % canvas.width);
        ctx.strokeStyle = "rgba(244, 63, 94, 0.65)";
        ctx.fillStyle = "rgba(244, 63, 94, 0.65)";
        ctx.beginPath();
        ctx.moveTo(offsetLeft, canvas.height * 0.7);
        ctx.lineTo(offsetLeft + 7, canvas.height * 0.7 - 3.5);
        ctx.lineTo(offsetLeft + 7, canvas.height * 0.7 + 3.5);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      }

      ctx.fillStyle = "rgba(6, 182, 212, 0.85)";
      ctx.font = "bold 8px monospace";
      ctx.fillText("THERMAL AIRFLOW CIRCULATION", 15, 25);

    } else if (category === "Plumbing") {
      // 5. Water droplet piping riser sizer (Plumbing)
      ctx.strokeStyle = "rgba(59, 130, 246, 0.3)";
      ctx.lineWidth = 8;
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.35, 30);
      ctx.lineTo(canvas.width * 0.35, canvas.height - 30);
      ctx.lineTo(canvas.width * 0.65, canvas.height - 30);
      ctx.lineTo(canvas.width * 0.65, 30);
      ctx.stroke();

      ctx.fillStyle = "#3b82f6";
      particles.forEach(p => {
        p.y += p.speed;
        if (p.y > canvas.height - 30) p.y = 30;

        ctx.beginPath();
        ctx.arc(canvas.width * 0.35, p.y, p.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = "#3b82f6";
      ctx.font = "bold 8px monospace";
      ctx.fillText("PIPELINE RISER HYDRAULICS", 15, 25);
    }

    requestAnimationFrame(animate);
  }

  animate();
}

function stopSimulation(canvas) {
  if (!canvas) return;
  activeSimulations.set(canvas, { active: false });
}


// Video player or Interactive Simulation modal controls
let modalSimulationFrame = null;
let modalSimulationParams = {
  speed: 1.0,
  param1: 50,
  param2: 50
};

function openVideoModal(title, url, category) {
  const modal = document.getElementById("video-modal");
  const titleEl = document.getElementById("modal-video-title");
  const player = document.getElementById("modal-video-player");
  
  titleEl.innerText = title;
  
  // Clean up any running modal animations first
  if (modalSimulationFrame) {
    cancelAnimationFrame(modalSimulationFrame);
    modalSimulationFrame = null;
  }
  
  // Remove existing simulation container if any
  const oldSim = document.getElementById("modal-simulation-container");
  if (oldSim) oldSim.remove();
  
  if (url && url !== "") {
    // Show standard video player
    player.style.display = "block";
    player.src = url;
    modal.style.display = "flex";
    player.play().catch(e => {});
  } else {
    // Hide standard video player
    player.style.display = "none";
    player.src = "";
    
    // Create high-fidelity interactive simulation panel
    const modalBody = modal.querySelector(".modal-body");
    
    // Setup default values based on category
    modalSimulationParams = { speed: 1.0, param1: 50, param2: 50 };
    let param1Label = "Parameter 1";
    let param2Label = "Parameter 2";
    let formulaDesc = "";
    let specCode = "";
    let explanation = "";
    
    if (category === "Coastal Design") {
      param1Label = "Wave Amplitude (px)";
      param2Label = "Wave Frequency (Hz)";
      formulaDesc = "y = A * sin(k * x - ω * t)";
      specCode = "Coastal Engineering Manual (CEM) Part II";
      explanation = "Procedural analysis of shallow water sea wave dynamics. Adjusting amplitude maps coastal storm surges, while changing frequency shifts the period from long swells to steep breaking wind waves.";
    } else if (category === "Architecture") {
      param1Label = "Rotation Speed";
      param2Label = "Perspective Zoom";
      formulaDesc = "X_proj = X * cos(θ) - Z * sin(θ)";
      specCode = "Vastu Shastra Mandala & NBC Group B";
      explanation = "Isometric wireframe of a standard load-bearing brick villa layout. Structural walls are positioned in cardinal orientations, placing core utility spaces according to spatial energy zones.";
    } else if (category === "Electrical") {
      param1Label = "Current Electron Speed";
      param2Label = "Grid Particle Density";
      formulaDesc = "I = n * q * A * v_d";
      specCode = "IE Rules 1956 & IS 732 Standards";
      explanation = "Visualizing three-phase power cable distribution current grids. Adjusting parameters increases drift velocity (electron speed) and load density, simulating peak load demand thresholds.";
    } else if (category === "HVAC Design") {
      param1Label = "Fluid Velocity (CFM)";
      param2Label = "Thermal Delta (T)";
      formulaDesc = "Q = 1.08 * CFM * ΔT";
      specCode = "ASHRAE Standard 55 / NBC Part 8 Sec 3";
      explanation = "Interactive circulation paths of hot supply airflow (red indicators) and cold return airflow (cyan indicators). Highlights laminar friction bounds within primary duct bends.";
    } else if (category === "Plumbing") {
      param1Label = "Hydraulic Flow Rate";
      param2Label = "Fluid Droplet Volume";
      formulaDesc = "Q = A * V = C * A * sqrt(2 * g * h)";
      specCode = "Uniform Plumbing Code (UPC-I) / NBC Part 9";
      explanation = "Dynamic hydraulic riser model showing high-velocity gravity drainage flows. Adjusting variables tracks peak water demand cycles and discharge unit loading on sanitary loops.";
    }
    
    const container = document.createElement("div");
    container.id = "modal-simulation-container";
    container.style.width = "100%";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "16px";
    container.style.marginTop = "10px";
    
    container.innerHTML = `
      <div style="position: relative; width: 100%; height: 320px; border-radius: 8px; overflow: hidden; background: #0f172a; border: 1px solid var(--border-glass);">
        <canvas id="modal-sim-canvas" style="width: 100%; height: 100%; display: block;"></canvas>
        <div style="position: absolute; top: 12px; left: 12px; padding: 6px 12px; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(8px); border-radius: 4px; font-family: monospace; font-size: 11px; color: var(--accent-secondary); font-weight: 700; border: 1px solid var(--border-glass);">
          ${category.toUpperCase()} INTERACTIVE SIMULATOR v2.6
        </div>
      </div>
      
      <!-- Interactive Sliders -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; background: var(--bg-tertiary); padding: 16px; border-radius: 8px; border: 1px solid var(--border-glass);">
        <div class="form-group" style="margin-bottom: 0;">
          <label style="display: flex; justify-content: space-between; font-size: 12px;">
            <span>Simulation Flow Rate</span>
            <span id="lbl-sim-speed" style="color: var(--accent-primary); font-weight: 700;">1.0x</span>
          </label>
          <input type="range" id="modal-slider-speed" min="0" max="2.5" step="0.1" value="1.0" style="width: 100%; accent-color: var(--accent-primary);" oninput="updateModalSimParam('speed', this.value)">
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label style="display: flex; justify-content: space-between; font-size: 12px;">
            <span>${param1Label}</span>
            <span id="lbl-sim-p1" style="color: var(--accent-secondary); font-weight: 700;">50</span>
          </label>
          <input type="range" id="modal-slider-p1" min="10" max="150" step="1" value="50" style="width: 100%; accent-color: var(--accent-secondary);" oninput="updateModalSimParam('param1', this.value)">
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label style="display: flex; justify-content: space-between; font-size: 12px;">
            <span>${param2Label}</span>
            <span id="lbl-sim-p2" style="color: var(--accent-success); font-weight: 700;">50</span>
          </label>
          <input type="range" id="modal-slider-p2" min="10" max="150" step="1" value="50" style="width: 100%; accent-color: var(--accent-success);" oninput="updateModalSimParam('param2', this.value)">
        </div>
      </div>
      
      <!-- Scientific Reference Block -->
      <div style="display: flex; flex-direction: column; gap: 8px; background: rgba(99, 102, 241, 0.05); padding: 16px; border-radius: 8px; border: 1px solid rgba(99, 102, 241, 0.15);">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed rgba(99, 102, 241, 0.2); padding-bottom: 8px; margin-bottom: 4px;">
          <span style="font-family: monospace; font-size: 13px; font-weight: 700; color: var(--accent-primary);">${formulaDesc}</span>
          <span style="font-family: monospace; font-size: 10px; padding: 2px 6px; background: rgba(99, 102, 241, 0.15); border-radius: 4px; color: var(--accent-primary);">${specCode}</span>
        </div>
        <div style="font-size: 12px; line-height: 1.6; color: var(--text-secondary);">
          ${explanation}
        </div>
      </div>
    `;
    
    modalBody.appendChild(container);
    modal.style.display = "flex";
    
    // Start canvas animation loop inside the modal
    const simCanvas = document.getElementById("modal-sim-canvas");
    startModalSimulation(simCanvas, category);
  }
  
  lucide.createIcons();
}

function updateModalSimParam(key, val) {
  modalSimulationParams[key] = parseFloat(val);
  
  const speedEl = document.getElementById("lbl-sim-speed");
  const p1El = document.getElementById("lbl-sim-p1");
  const p2El = document.getElementById("lbl-sim-p2");
  
  if (speedEl && key === 'speed') speedEl.innerText = parseFloat(val).toFixed(1) + "x";
  if (p1El && key === 'param1') p1El.innerText = Math.round(val);
  if (p2El && key === 'param2') p2El.innerText = Math.round(val);
}

function startModalSimulation(canvas, category) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  
  // Set dimensions based on bounding box
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width || 600;
  canvas.height = rect.height || 320;
  
  let frame = 0;
  
  // Pre-generate fine engineering particles for high res
  const particles = [];
  for (let i = 0; i < 40; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 1.0 + Math.random() * 2.0,
      size: 2.0 + Math.random() * 3.5
    });
  }
  
  function drawFrame() {
    // Clear and draw grid
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    const gridSpacing = 20;
    for (let x = gridSpacing; x < canvas.width; x += gridSpacing) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = gridSpacing; y < canvas.height; y += gridSpacing) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
    
    // Increment local virtual time frames based on flow speed
    frame += modalSimulationParams.speed;
    
    // Draw exact category animation
    if (category === "Coastal Design") {
      // 1. Deep ocean wave swells + breakers
      const amp = modalSimulationParams.param1; // maps to amplitude
      const freq = modalSimulationParams.param2 * 0.0003; // maps to frequency
      
      const waveCount = 4;
      const colors = [
        "rgba(6, 182, 212, 0.7)",
        "rgba(8, 145, 178, 0.5)",
        "rgba(14, 116, 144, 0.3)",
        "rgba(21, 94, 117, 0.15)"
      ];
      
      for (let w = 0; w < waveCount; w++) {
        ctx.strokeStyle = colors[w];
        ctx.lineWidth = 3 - w * 0.5;
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x++) {
          const currentFreq = freq + w * 0.001;
          const currentAmp = amp - w * 6;
          const phase = frame * 0.045 + w * 1.8;
          const y = canvas.height / 2 + Math.sin(x * currentFreq + phase) * currentAmp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      
      // Floating survey buoy particle in waves
      const buoyX = canvas.width / 2;
      const buoyFreq = freq + 1 * 0.001;
      const buoyAmp = amp - 1 * 6;
      const buoyPhase = frame * 0.045 + 1 * 1.8;
      const buoyY = canvas.height / 2 + Math.sin(buoyX * buoyFreq + buoyPhase) * buoyAmp;
      
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(buoyX, buoyY - 8, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.beginPath();
      ctx.moveTo(buoyX, buoyY - 8);
      ctx.lineTo(buoyX, buoyY + 20);
      ctx.stroke();
      
    } else if (category === "Architecture") {
      // 2. High res rotating isometric vector blueprint
      const cx = canvas.width / 2;
      const cy = canvas.height / 2 + 10;
      const sz = modalSimulationParams.param2 * 0.9; // Zoom factor
      const angle = frame * (modalSimulationParams.param1 * 0.0003); // Rotation speed
      
      function rotateY(x, y, z, ang) {
        const cos = Math.cos(ang);
        const sin = Math.sin(ang);
        return { x: x * cos - z * sin, y, z: x * sin + z * cos };
      }
      
      function project(p) {
        return { x: cx + p.x, y: cy + p.y - p.z * 0.45 };
      }
      
      const points = [
        { x: -sz, y: sz * 0.6, z: -sz }, { x: sz, y: sz * 0.6, z: -sz },
        { x: sz, y: sz * 0.6, z: sz }, { x: -sz, y: sz * 0.6, z: sz },
        { x: -sz, y: -sz * 0.6, z: -sz }, { x: sz, y: -sz * 0.6, z: -sz },
        { x: sz, y: -sz * 0.6, z: sz }, { x: -sz, y: -sz * 0.6, z: sz },
        { x: 0, y: -sz * 1.3, z: 0 } // Roof peak
      ];
      
      const rotated = points.map(p => rotateY(p.x, p.y, p.z, angle));
      const proj = rotated.map(p => project(p));
      
      ctx.strokeStyle = "rgba(99, 102, 241, 0.85)";
      ctx.lineWidth = 2;
      
      // Draw foundation walls
      ctx.beginPath();
      ctx.moveTo(proj[0].x, proj[0].y);
      for (let i = 1; i < 4; i++) ctx.lineTo(proj[i].x, proj[i].y);
      ctx.closePath(); ctx.stroke();
      
      // Draw ceiling lines
      ctx.beginPath();
      ctx.moveTo(proj[4].x, proj[4].y);
      for (let i = 5; i < 8; i++) ctx.lineTo(proj[i].x, proj[i].y);
      ctx.closePath(); ctx.stroke();
      
      // Draw vertical column pillars
      for (let i = 0; i < 4; i++) {
        ctx.beginPath(); ctx.moveTo(proj[i].x, proj[i].y); ctx.lineTo(proj[i+4].x, proj[i+4].y); ctx.stroke();
      }
      
      // Draw roof lines in cyan
      ctx.strokeStyle = "rgba(6, 182, 212, 0.85)";
      for (let i = 4; i < 8; i++) {
        ctx.beginPath(); ctx.moveTo(proj[i].x, proj[i].y); ctx.lineTo(proj[8].x, proj[8].y); ctx.stroke();
      }
      
    } else if (category === "Electrical") {
      // 3. Triple phase distribution grid currents
      const currentSpeed = modalSimulationParams.param1 * 0.08;
      const count = modalSimulationParams.param2 * 0.4;
      
      // Render three-phase busbars
      const phaseY = [canvas.height * 0.25, canvas.height * 0.5, canvas.height * 0.75];
      const phaseColor = ["#ef4444", "#fbbf24", "#3b82f6"]; // Red, Yellow, Blue standard R-Y-B three phase
      
      for (let p = 0; p < 3; p++) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = 10;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(30, phaseY[p]);
        ctx.lineTo(canvas.width - 30, phaseY[p]);
        ctx.stroke();
        
        ctx.strokeStyle = phaseColor[p];
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(30, phaseY[p]);
        ctx.lineTo(canvas.width - 30, phaseY[p]);
        ctx.stroke();
        
        // Label phase lines
        ctx.fillStyle = phaseColor[p];
        ctx.font = "bold 9px monospace";
        ctx.fillText(`PHASE LINE ${p+1} (RYB)`, 35, phaseY[p] - 12);
      }
      
      // Animate flowing electrons
      ctx.fillStyle = "#10b981";
      for (let i = 0; i < count; i++) {
        const lineIdx = i % 3;
        // Seed an X offset based on index and frame progression
        const speedMultiplier = 1.0 + (i % 3) * 0.3;
        const x = (i * 35 + frame * currentSpeed * speedMultiplier) % (canvas.width - 60) + 30;
        
        ctx.beginPath();
        ctx.arc(x, phaseY[lineIdx], 3.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Spark halo
        ctx.fillStyle = "rgba(16, 185, 129, 0.2)";
        ctx.beginPath();
        ctx.arc(x, phaseY[lineIdx], 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#10b981";
      }
      
    } else if (category === "HVAC Design") {
      // 4. Detailed double-loop thermal circulation velocities
      const CFM = modalSimulationParams.param1 * 0.04;
      const heatT = modalSimulationParams.param2;
      
      ctx.lineWidth = 3;
      const loops = 6;
      for (let i = 0; i < loops; i++) {
        // Cold loop arrows
        const coldOffset = (frame * CFM + i * 80) % canvas.width;
        ctx.strokeStyle = "rgba(6, 182, 212, 0.7)";
        ctx.fillStyle = "rgba(6, 182, 212, 0.7)";
        ctx.beginPath();
        ctx.moveTo(coldOffset, canvas.height * 0.35);
        ctx.lineTo(coldOffset - 12, canvas.height * 0.35 - 5);
        ctx.lineTo(coldOffset - 12, canvas.height * 0.35 + 5);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        
        // Heat loop arrows
        const heatOffset = canvas.width - ((frame * CFM * 0.8 + i * 80) % canvas.width);
        ctx.strokeStyle = `rgba(244, 63, 94, ${0.4 + heatT * 0.004})`;
        ctx.fillStyle = `rgba(244, 63, 94, ${0.4 + heatT * 0.004})`;
        ctx.beginPath();
        ctx.moveTo(heatOffset, canvas.height * 0.65);
        ctx.lineTo(heatOffset + 12, canvas.height * 0.65 - 5);
        ctx.lineTo(heatOffset + 12, canvas.height * 0.65 + 5);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      }
      
      // Draw ducts
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 16;
      ctx.beginPath();
      ctx.moveTo(20, canvas.height * 0.35); ctx.lineTo(canvas.width - 20, canvas.height * 0.35);
      ctx.moveTo(20, canvas.height * 0.65); ctx.lineTo(canvas.width - 20, canvas.height * 0.65);
      ctx.stroke();
      
    } else if (category === "Plumbing") {
      // 5. Advanced wastewater gravity sewage bends
      const flowRate = modalSimulationParams.param1 * 0.06;
      const particleSz = modalSimulationParams.param2 * 0.06;
      
      // Draw main thick piping bend
      ctx.strokeStyle = "rgba(59, 130, 246, 0.25)";
      ctx.lineWidth = 22;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      
      ctx.beginPath();
      ctx.moveTo(50, 40);
      ctx.lineTo(canvas.width * 0.35, 40);
      ctx.lineTo(canvas.width * 0.35, canvas.height - 60);
      ctx.lineTo(canvas.width * 0.65, canvas.height - 60);
      ctx.lineTo(canvas.width * 0.65, 40);
      ctx.lineTo(canvas.width - 50, 40);
      ctx.stroke();
      
      // Inner flow track line
      ctx.strokeStyle = "rgba(59, 130, 246, 0.4)";
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw fluid particles flowing along path
      ctx.fillStyle = "#3b82f6";
      particles.forEach((p, idx) => {
        // Find segment coordinate based on animated position
        const pathPercent = ((idx * 20 + frame * flowRate) % 400) / 400;
        
        let px = 0;
        let py = 0;
        
        // Interpolate over piping layout segments
        // Segment 1 (top left to bend 1): 0.0 to 0.2
        // Segment 2 (bend 1 downwards): 0.2 to 0.5
        // Segment 3 (bottom horizontal): 0.5 to 0.8
        // Segment 4 (bend 2 upwards): 0.8 to 1.0
        if (pathPercent < 0.2) {
          const t = pathPercent / 0.2;
          px = 50 + (canvas.width * 0.35 - 50) * t;
          py = 40;
        } else if (pathPercent < 0.5) {
          const t = (pathPercent - 0.2) / 0.3;
          px = canvas.width * 0.35;
          py = 40 + (canvas.height - 100) * t;
        } else if (pathPercent < 0.8) {
          const t = (pathPercent - 0.5) / 0.3;
          px = canvas.width * 0.35 + (canvas.width * 0.3) * t;
          py = canvas.height - 60;
        } else {
          const t = (pathPercent - 0.8) / 0.2;
          px = canvas.width * 0.65;
          py = canvas.height - 60 - (canvas.height - 100) * t;
        }
        
        ctx.beginPath();
        ctx.arc(px, py, particleSz + 1, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    
    modalSimulationFrame = requestAnimationFrame(drawFrame);
  }
  
  drawFrame();
}

function closeVideoModal() {
  const modal = document.getElementById("video-modal");
  const player = document.getElementById("modal-video-player");
  player.pause();
  player.src = "";
  
  if (modalSimulationFrame) {
    cancelAnimationFrame(modalSimulationFrame);
    modalSimulationFrame = null;
  }
  
  const sim = document.getElementById("modal-simulation-container");
  if (sim) sim.remove();
  
  modal.style.display = "none";
}

// Trigger all calculators on start
function runAllCalculators() {
  runBeamCalculator();
  runConcreteCalculator();
  updateUnitConverter();
  runArchPlanGenerator();
  runFSICalculator();
  runSolarCalculator();
  runCableCalculator();
  runPlumbingCalculator();
  runHVACCalculator();
  runFireCalculator();
  runPumpCalculator();
  runPMEstimator();
  runGanttPlanner();
}


/* ================= CIVIL BEAM CALCULATIONS ================= */
function toggleLoadInput() {
  const type = document.getElementById("beam-load-type").value;
  const valGroup = document.getElementById("beam-load-val-group");
  const posGroup = document.getElementById("beam-load-pos-group");
  const label = document.getElementById("load-val-label");
  const length = parseFloat(document.getElementById("beam-length").value) || 5;
  const posInput = document.getElementById("beam-load-pos");
  
  posInput.max = length;
  
  if (type === "udl") {
    valGroup.style.display = "flex";
    posGroup.style.display = "none";
    label.innerText = "UDL Intensity (w, kN/m)";
  } else {
    valGroup.style.display = "flex";
    posGroup.style.display = "flex";
    label.innerText = "Point Load (P, kN)";
    if (parseFloat(posInput.value) > length) {
      posInput.value = (length / 2).toFixed(1);
    }
  }
}

function runBeamCalculator() {
  const L = parseFloat(document.getElementById("beam-length").value) || 5;
  const support = document.getElementById("beam-support").value;
  const loadType = document.getElementById("beam-load-type").value;
  const loadVal = parseFloat(document.getElementById("beam-load").value) || 10;
  const loadPos = parseFloat(document.getElementById("beam-load-pos").value) || (L / 2);
  
  let Ra = 0, Rb = 0, Vmax = 0, Mmax = 0;
  let formula = "";
  let explanation = "";
  
  if (support === "simply") {
    if (loadType === "udl") {
      Ra = (loadVal * L) / 2;
      Rb = Ra;
      Vmax = Ra;
      Mmax = (loadVal * L * L) / 8;
      
      formula = `Ra = Rb = wL/2 = ${Ra.toFixed(1)} kN\nMmax = wL²/8 = ${Mmax.toFixed(2)} kNm`;
      explanation = `<p>A simply supported beam under Uniformly Distributed Load (UDL) experiences linear shear variation. The shear force drops to zero at the exact center span where the bending moment reaches its maximum absolute value.</p><p><strong>Deflection check:</strong> The structural maximum deflection occurs at the mid-span: δ = 5wL⁴ / 384EI.</p>`;
    } else {
      // Point Load
      const a = loadPos;
      const b = L - a;
      Rb = (loadVal * a) / L;
      Ra = (loadVal * b) / L;
      Vmax = Math.max(Ra, Rb);
      Mmax = (loadVal * a * b) / L;
      
      formula = `Ra = P(L-x)/L = ${Ra.toFixed(1)} kN\nRb = Px/L = ${Rb.toFixed(1)} kN\nMmax = Pab/L = ${Mmax.toFixed(2)} kNm`;
      explanation = `<p>A concentrated point load creates static reactions inversely proportional to the load's distance from either support boundary. The shear force remains constant along each side of the load point, shifting signs at x.</p>`;
    }
  } else {
    // Cantilever Beam
    if (loadType === "udl") {
      Ra = loadVal * L;
      Rb = 0;
      Vmax = Ra;
      Mmax = (loadVal * L * L) / 2;
      
      formula = `Ra = wL = ${Ra.toFixed(1)} kN\nMmax = wL²/2 = ${Mmax.toFixed(2)} kNm`;
      explanation = `<p>A cantilever beam with UDL has its fixed support on the left. The bending moment scales quadratically, peaking as tension in the top fiber at the fixed wall interface. Shear values drop to zero at the free tip.</p>`;
    } else {
      // Point Load
      Ra = loadVal;
      Rb = 0;
      Vmax = Ra;
      Mmax = loadVal * loadPos; // loadPos is distance from fixed end
      
      formula = `Ra = P = ${Ra.toFixed(1)} kN\nMmax = Px = ${Mmax.toFixed(2)} kNm`;
      explanation = `<p>For a point load on a cantilever, shear force is uniform at P from the support to the load point, and zero from the load point to the beam tip. Bending moment is a linear slope, max at the support base.</p>`;
    }
  }
  
  // Set UI Results
  document.getElementById("res-ra").innerText = Ra.toFixed(1) + " kN";
  document.getElementById("res-rb").innerText = Rb.toFixed(1) + " kN";
  document.getElementById("res-vmax").innerText = Vmax.toFixed(1) + " kN";
  document.getElementById("res-mmax").innerText = Mmax.toFixed(2) + " kNm";
  
  // Set AI Pane
  document.getElementById("civil-ai-formula").innerText = formula;
  document.getElementById("civil-ai-exp").innerHTML = explanation;
  document.getElementById("civil-ai-code").innerText = "IS 456-2000 (Indian Standard)";
  
  // Draw diagrams
  drawBeamDiagrams(L, support, loadType, loadVal, loadPos, Ra, Rb, Vmax, Mmax);
}

function drawBeamDiagrams(L, support, loadType, loadVal, loadPos, Ra, Rb, Vmax, Mmax) {
  const canvas = document.getElementById("beam-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const width = canvas.width;
  const height = canvas.height;
  const marginX = 50;
  const beamY = 60;
  const plotWidth = width - (marginX * 2);
  
  // Theme styling colors
  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  const lineColor = isLight ? "#1e293b" : "#f3f4f6";
  const mutedColor = isLight ? "#64748b" : "#9ca3af";
  const sfdColor = "rgba(6, 182, 212, 0.4)";
  const sfdStroke = "#06b6d4";
  const bmdColor = "rgba(99, 102, 241, 0.4)";
  const bmdStroke = "#6366f1";
  
  // 1. Draw Beam Line & Supports
  ctx.lineWidth = 4;
  ctx.strokeStyle = lineColor;
  ctx.beginPath();
  ctx.moveTo(marginX, beamY);
  ctx.lineTo(width - marginX, beamY);
  ctx.stroke();
  
  ctx.fillStyle = mutedColor;
  ctx.font = "10px sans-serif";
  ctx.fillText("0m", marginX - 5, beamY - 10);
  ctx.fillText(L + "m", width - marginX - 10, beamY - 10);
  
  if (support === "simply") {
    // Left support (Triangle pin)
    ctx.beginPath();
    ctx.moveTo(marginX, beamY);
    ctx.lineTo(marginX - 10, beamY + 12);
    ctx.lineTo(marginX + 10, beamY + 12);
    ctx.closePath();
    ctx.fill();
    ctx.fillText("Ra", marginX - 18, beamY + 22);
    
    // Right support (Circles roller)
    ctx.beginPath();
    ctx.arc(width - marginX, beamY + 6, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText("Rb", width - marginX + 8, beamY + 10);
  } else {
    // Cantilever support (Vertical Fixed wall hash)
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(marginX, beamY - 20);
    ctx.lineTo(marginX, beamY + 20);
    ctx.stroke();
    // Hash marks
    ctx.lineWidth = 2;
    for (let i = beamY - 20; i <= beamY + 20; i += 8) {
      ctx.beginPath();
      ctx.moveTo(marginX, i);
      ctx.lineTo(marginX - 6, i - 4);
      ctx.stroke();
    }
    ctx.fillText("Fixed", marginX - 40, beamY + 5);
  }
  
  // Draw Load representation
  if (loadType === "udl") {
    ctx.strokeStyle = "#e11d48";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = marginX; x <= width - marginX; x += 12) {
      ctx.arc(x + 6, beamY - 12, 6, Math.PI, 0, false);
    }
    ctx.stroke();
    ctx.fillText(`UDL: ${loadVal} kN/m`, width / 2 - 35, beamY - 25);
  } else {
    // Point load arrow
    const arrowX = marginX + (loadPos / L) * plotWidth;
    ctx.strokeStyle = "#e11d48";
    ctx.fillStyle = "#e11d48";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(arrowX, beamY - 30);
    ctx.lineTo(arrowX, beamY - 2);
    ctx.stroke();
    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(arrowX - 5, beamY - 8);
    ctx.lineTo(arrowX, beamY - 2);
    ctx.lineTo(arrowX + 5, beamY - 8);
    ctx.fill();
    ctx.fillText(`${loadVal} kN at ${loadPos}m`, arrowX - 35, beamY - 35);
  }
  
  // 2. Draw Shear Force Diagram (SFD)
  const sfdCenterY = 150;
  const sfdScale = Vmax > 0 ? 35 / Vmax : 1;
  
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(marginX, sfdCenterY);
  ctx.lineTo(width - marginX, sfdCenterY);
  ctx.stroke();
  ctx.fillText("SFD (kN)", marginX - 40, sfdCenterY + 4);
  
  ctx.fillStyle = sfdColor;
  ctx.strokeStyle = sfdStroke;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(marginX, sfdCenterY);
  
  if (support === "simply") {
    if (loadType === "udl") {
      ctx.lineTo(marginX, sfdCenterY - Ra * sfdScale);
      ctx.lineTo(width - marginX, sfdCenterY + Rb * sfdScale);
      ctx.lineTo(width - marginX, sfdCenterY);
    } else {
      const loadX = marginX + (loadPos / L) * plotWidth;
      ctx.lineTo(marginX, sfdCenterY - Ra * sfdScale);
      ctx.lineTo(loadX, sfdCenterY - Ra * sfdScale);
      ctx.lineTo(loadX, sfdCenterY + Rb * sfdScale);
      ctx.lineTo(width - marginX, sfdCenterY + Rb * sfdScale);
      ctx.lineTo(width - marginX, sfdCenterY);
    }
  } else {
    // Cantilever
    if (loadType === "udl") {
      ctx.lineTo(marginX, sfdCenterY - Ra * sfdScale);
      ctx.lineTo(width - marginX, sfdCenterY);
    } else {
      const loadX = marginX + (loadPos / L) * plotWidth;
      ctx.lineTo(marginX, sfdCenterY - Ra * sfdScale);
      ctx.lineTo(loadX, sfdCenterY - Ra * sfdScale);
      ctx.lineTo(loadX, sfdCenterY);
      ctx.lineTo(width - marginX, sfdCenterY);
    }
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Add SFD values labels
  ctx.fillStyle = lineColor;
  if (support === "simply") {
    ctx.fillText("+" + Ra.toFixed(1), marginX + 5, sfdCenterY - Ra * sfdScale - 4);
    ctx.fillText("-" + Rb.toFixed(1), width - marginX - 35, sfdCenterY + Rb * sfdScale + 12);
  } else {
    ctx.fillText("+" + Ra.toFixed(1), marginX + 5, sfdCenterY - Ra * sfdScale - 4);
  }
  
  // 3. Draw Bending Moment Diagram (BMD)
  const bmdCenterY = 240;
  const bmdScale = Mmax > 0 ? 40 / Mmax : 1;
  
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(marginX, bmdCenterY);
  ctx.lineTo(width - marginX, bmdCenterY);
  ctx.stroke();
  ctx.fillText("BMD (kNm)", marginX - 40, bmdCenterY + 4);
  
  ctx.fillStyle = bmdColor;
  ctx.strokeStyle = bmdStroke;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(marginX, bmdCenterY);
  
  if (support === "simply") {
    if (loadType === "udl") {
      // Parabolic curve
      for (let i = 0; i <= 100; i++) {
        const pct = i / 100;
        const x = marginX + pct * plotWidth;
        const currentX = pct * L;
        const moment = (loadVal * currentX / 2) * (L - currentX);
        ctx.lineTo(x, bmdCenterY + moment * bmdScale); // Bending diagram plotted downwards for tension side conventionally
      }
      ctx.lineTo(width - marginX, bmdCenterY);
    } else {
      const loadX = marginX + (loadPos / L) * plotWidth;
      ctx.lineTo(loadX, bmdCenterY + Mmax * bmdScale);
      ctx.lineTo(width - marginX, bmdCenterY);
    }
  } else {
    // Cantilever
    if (loadType === "udl") {
      // Parabolic curve
      for (let i = 0; i <= 100; i++) {
        const pct = i / 100;
        const x = marginX + pct * plotWidth;
        const currentX = (1 - pct) * L;
        const moment = (loadVal * currentX * currentX) / 2;
        ctx.lineTo(x, bmdCenterY + moment * bmdScale);
      }
      ctx.lineTo(width - marginX, bmdCenterY);
    } else {
      const loadX = marginX + (loadPos / L) * plotWidth;
      ctx.lineTo(loadX, bmdCenterY);
      ctx.lineTo(width - marginX, bmdCenterY);
      ctx.moveTo(marginX, bmdCenterY);
      ctx.lineTo(marginX, bmdCenterY + Mmax * bmdScale);
      ctx.lineTo(loadX, bmdCenterY);
    }
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Add BMD max marker
  ctx.fillStyle = lineColor;
  if (support === "simply") {
    const labelX = loadType === "udl" ? width / 2 : marginX + (loadPos / L) * plotWidth;
    ctx.fillText(Mmax.toFixed(2), labelX - 15, bmdCenterY + Mmax * bmdScale + 12);
  } else {
    ctx.fillText(Mmax.toFixed(2), marginX + 5, bmdCenterY + Mmax * bmdScale + 12);
  }
}


/* ================= CIVIL CONCRETE DESIGN ================= */
function runConcreteCalculator() {
  const grade = document.getElementById("concrete-grade").value;
  const volume = parseFloat(document.getElementById("concrete-volume").value) || 1;
  const factor = parseFloat(document.getElementById("concrete-factor").value) || 1.54;
  
  const mix = ENGINEERING_DATA.concreteMixes[grade];
  if (!mix) return;
  
  // Concrete dry density volume required
  const dryVolume = volume * factor;
  
  // Parse ratios
  const parts = mix.ratioText.split(":").map(Number);
  const totalParts = parts[0] + parts[1] + parts[2];
  
  // Volumes in cubic meters
  const cementVol = (parts[0] / totalParts) * dryVolume;
  const sandVol = (parts[1] / totalParts) * dryVolume;
  const aggVol = (parts[2] / totalParts) * dryVolume;
  
  // Weights (Cement=1440 kg/m³, Sand=1600 kg/m³, Aggregate=1500 kg/m³)
  const cementKg = cementVol * 1440;
  const sandKg = sandVol * 1600;
  const aggKg = aggVol * 1500;
  const waterLitres = cementKg * mix.w_c;
  
  // Update UI results
  document.getElementById("res-cement").innerText = Math.round(cementKg) + " kg (" + Math.round(cementKg / 50) + " bags)";
  document.getElementById("res-sand").innerText = Math.round(sandKg) + " kg (" + Math.round(sandVol * 35.315) + " CFT)";
  document.getElementById("res-agg").innerText = Math.round(aggKg) + " kg (" + Math.round(aggVol * 35.315) + " CFT)";
  document.getElementById("res-water").innerText = Math.round(waterLitres) + " Litres";
  
  // Update AI Pane
  const formula = `Dry Vol = ${volume}m³ * ${factor} = ${dryVolume.toFixed(2)}m³\nRatio = ${mix.ratioText}\nWater/Cement = ${mix.w_c}`;
  const explanation = `<p>Concrete design matches Indian Standard structural code <strong>IS 10262</strong>. Dry volume undergoes shrinkage compression, expanding raw concrete requirements by approximately 54%.</p><p><strong>Target Strengths:</strong> Grade ${grade} exhibits a target characteristic compressive strength of ${mix.targetStrength} N/mm² at 28 days curing.</p>`;
  
  document.getElementById("civil-ai-formula").innerText = formula;
  document.getElementById("civil-ai-exp").innerHTML = explanation;
  
  // Draw Proportions bar chart
  drawConcreteChart(parts, cementKg, sandKg, aggKg);
}

function drawConcreteChart(parts, cement, sand, agg) {
  const canvas = document.getElementById("concrete-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const width = canvas.width;
  const height = canvas.height;
  
  const totalWeight = cement + sand + agg;
  const pctCement = cement / totalWeight;
  const pctSand = sand / totalWeight;
  const pctAgg = agg / totalWeight;
  
  const barY = 60;
  const barH = 50;
  const startX = 40;
  const chartW = width - (startX * 2);
  
  // Proportions segments colors
  const cementColor = "#6366f1";
  const sandColor = "#f59e0b";
  const aggColor = "#06b6d4";
  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  const textColor = isLight ? "#1f2937" : "#ffffff";
  
  const wCement = chartW * pctCement;
  const wSand = chartW * pctSand;
  const wAgg = chartW * pctAgg;
  
  // Draw Cement Segment
  ctx.fillStyle = cementColor;
  ctx.fillRect(startX, barY, wCement, barH);
  // Draw Sand
  ctx.fillStyle = sandColor;
  ctx.fillRect(startX + wCement, barY, wSand, barH);
  // Draw Aggregate
  ctx.fillStyle = aggColor;
  ctx.fillRect(startX + wCement + wSand, barY, wAgg, barH);
  
  // Legend
  ctx.font = "12px sans-serif";
  ctx.fillStyle = textColor;
  
  ctx.fillStyle = cementColor;
  ctx.fillRect(startX, 140, 15, 15);
  ctx.fillStyle = textColor;
  ctx.fillText(`Cement: ${Math.round(pctCement * 100)}% (1 part)`, startX + 22, 152);
  
  ctx.fillStyle = sandColor;
  ctx.fillRect(startX, 170, 15, 15);
  ctx.fillStyle = textColor;
  ctx.fillText(`Fine Sand: ${Math.round(pctSand * 100)}% (${parts[1]} parts)`, startX + 22, 182);
  
  ctx.fillStyle = aggColor;
  ctx.fillRect(startX, 200, 15, 15);
  ctx.fillStyle = textColor;
  ctx.fillText(`Coarse Aggregate: ${Math.round(pctAgg * 100)}% (${parts[2]} parts)`, startX + 22, 212);
}


/* ================= ARCHITECTURE FLOOR PLATFORM ================= */
function runArchPlanGenerator() {
  const widthFt = parseFloat(document.getElementById("plot-width").value) || 30;
  const depthFt = parseFloat(document.getElementById("plot-depth").value) || 50;
  const facing = document.getElementById("plot-facing").value;
  const bhk = parseInt(document.getElementById("plot-bhk").value) || 2;
  const vastu = document.getElementById("plot-vastu").value;
  
  const totalArea = widthFt * depthFt;
  
  // Local building bye-laws setbacks estimation
  let frontSetback = 3;
  if (depthFt > 40) frontSetback = 5;
  if (depthFt > 60) frontSetback = 8;
  
  let sideSetback = 2;
  if (widthFt > 30) sideSetback = 3;
  if (widthFt > 50) sideSetback = 5;
  
  const usableWidth = widthFt - (sideSetback * 2);
  const usableDepth = depthFt - frontSetback - 3; // 3ft rear setback
  const usableArea = usableWidth * usableDepth;
  
  // Update UI stats
  document.getElementById("arch-res-area").innerText = totalArea + " sq ft";
  document.getElementById("arch-res-front").innerText = frontSetback + " ft";
  document.getElementById("arch-res-sides").innerText = sideSetback + " ft";
  document.getElementById("arch-res-plinth").innerText = Math.round(usableArea) + " sq ft";
  
  // Dynamic AI Advisor text
  const vastuData = ENGINEERING_DATA.housePlans[facing];
  let formula = `Plot = ${widthFt}ft x ${depthFt}ft = ${totalArea} sq ft\nNet Plinth Area = ${usableWidth}ft x ${usableDepth}ft = ${Math.round(usableArea)} sq ft`;
  let explanation = `<p><strong>Vastu compliance selected.</strong> For an <strong>${facing.replace("Facing", "")} Facing</strong> plot boundary:</p>`;
  explanation += `<ul>
    <li>Main Entrance: Aligned to <strong>${vastuData.entrance}</strong>.</li>
    <li>Kitchen Area: Located in <strong>${vastuData.kitchen}</strong>.</li>
    <li>Master Bedroom: Set in <strong>${vastuData.masterBedroom}</strong>.</li>
    <li>Prayer/Pooja Room: Set in <strong>${vastuData.poojaRoom}</strong>.</li>
  </ul>`;
  
  document.getElementById("arch-ai-formula").innerText = formula;
  document.getElementById("arch-ai-exp").innerHTML = explanation;
  
  // Draw floor plan SVG diagram
  drawSVGFloorPlan(widthFt, depthFt, frontSetback, sideSetback, bhk, vastu, facing);
}

function drawSVGFloorPlan(widthFt, depthFt, frontS, sideS, bhk, vastu, facing) {
  const svg = document.getElementById("arch-plan-svg");
  if (!svg) return;
  
  // Clear SVG
  svg.innerHTML = "";
  
  // SVG boundary dimensioning (e.g. 400x400)
  const size = 400;
  const padding = 30;
  const plotW = size - (padding * 2);
  const plotH = size - (padding * 2);
  
  // Calculate relative sizes matching proportions
  const maxFt = Math.max(widthFt, depthFt);
  const ftScale = plotW / maxFt;
  
  const drawW = widthFt * ftScale;
  const drawH = depthFt * ftScale;
  
  // Offset to center
  const ox = padding + (plotW - drawW) / 2;
  const oy = padding + (plotH - drawH) / 2;
  
  // Color standards
  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  const plotStroke = isLight ? "#475569" : "#64748b";
  const wallStroke = isLight ? "#0f172a" : "#f1f5f9";
  const wallFill = isLight ? "#f1f5f9" : "#1e293b";
  const roomFill = isLight ? "#e2e8f0" : "#131b2e";
  const labelColor = isLight ? "#1e293b" : "#e2e8f0";
  const textMuted = isLight ? "#64748b" : "#94a3b8";
  
  // 1. Draw Plot Boundary
  svg.innerHTML += `<rect x="${ox}" y="${oy}" width="${drawW}" height="${drawH}" fill="none" stroke="${plotStroke}" stroke-dasharray="4" stroke-width="1.5" />`;
  svg.innerHTML += `<text x="${ox}" y="${oy - 8}" fill="${textMuted}" font-size="10">Road Boundary / Frontage</text>`;
  
  // 2. Draw Usable Plinth House Wall
  const hx = ox + (sideS * ftScale);
  const hy = oy + (frontS * ftScale);
  const hw = drawW - (sideS * 2 * ftScale);
  const hh = drawH - ((frontS + 3) * ftScale);
  
  svg.innerHTML += `<rect x="${hx}" y="${hy}" width="${hw}" height="${hh}" fill="${wallFill}" stroke="${wallStroke}" stroke-width="3.5" />`;
  
  // 3. Divide house into rooms depending on BHK requirements
  const rx = hx + 4;
  const ry = hy + 4;
  const rw = hw - 8;
  const rh = hh - 8;
  
  if (bhk === 1) {
    // Split into 4 quadrants: Bed, Living, Kitchen, Bath
    const midX = rx + rw * 0.5;
    const midY = ry + rh * 0.5;
    
    // Draw partition lines
    svg.innerHTML += `<line x1="${midX}" y1="${ry}" x2="${midX}" y2="${ry + rh}" stroke="${wallStroke}" stroke-width="2" />`;
    svg.innerHTML += `<line x1="${rx}" y1="${midY}" x2="${rx + rw}" y2="${midY}" stroke="${wallStroke}" stroke-width="2" />`;
    
    // Labels
    addRoomLabel(svg, rx + rw*0.25, ry + rh*0.25, "Master Bed", "11' x 12'", labelColor, textMuted);
    addRoomLabel(svg, rx + rw*0.75, ry + rh*0.25, "Living Area", "12' x 12'", labelColor, textMuted);
    addRoomLabel(svg, rx + rw*0.25, ry + rh*0.75, "Toilet/Bath", "6' x 8'", labelColor, textMuted);
    addRoomLabel(svg, rx + rw*0.75, ry + rh*0.75, "Kitchen", "8' x 10'", labelColor, textMuted);
    
  } else if (bhk === 2) {
    // 2BHK: Living, Kitchen, Bed 1, Bed 2, Toilet
    const w50 = rw * 0.5;
    const h50 = rh * 0.5;
    const h30 = rh * 0.35;
    const h70 = rh * 0.65;
    
    // Internal walls
    svg.innerHTML += `<line x1="${rx + w50}" y1="${ry}" x2="${rx + w50}" y2="${ry + rh}" stroke="${wallStroke}" stroke-width="2" />`;
    svg.innerHTML += `<line x1="${rx}" y1="${ry + h50}" x2="${rx + w50}" y2="${ry + h50}" stroke="${wallStroke}" stroke-width="2" />`;
    svg.innerHTML += `<line x1="${rx + w50}" y1="${ry + h30}" x2="${rx + rw}" y2="${ry + h30}" stroke="${wallStroke}" stroke-width="2" />`;
    svg.innerHTML += `<line x1="${rx + w50 + rw*0.25}" y1="${ry + h30}" x2="${rx + w50 + rw*0.25}" y2="${ry + rh}" stroke="${wallStroke}" stroke-width="2" />`;
    
    // Left side: Master Bed (Top), Bedroom 2 (Bottom)
    addRoomLabel(svg, rx + w50*0.5, ry + h50*0.5, "Master Bed", "12' x 14'", labelColor, textMuted);
    addRoomLabel(svg, rx + w50*0.5, ry + h50 + h50*0.5, "Bedroom 2", "10' x 12'", labelColor, textMuted);
    
    // Right side: Living (Top), Kitchen (Bottom Left), Toilet (Bottom Right)
    addRoomLabel(svg, rx + w50 + w50*0.5, ry + h30*0.5, "Living Hall", "14' x 16'", labelColor, textMuted);
    addRoomLabel(svg, rx + w50 + rw*0.125, ry + h30 + (rh-h30)*0.5, "Kitchen", "8' x 10'", labelColor, textMuted);
    addRoomLabel(svg, rx + w50 + rw*0.375, ry + h30 + (rh-h30)*0.5, "Toilet", "5' x 7'", labelColor, textMuted);
    
  } else {
    // 3BHK: 3 beds, Living, Kitchen, 2 Toilets
    const w60 = rw * 0.6;
    const w40 = rw * 0.4;
    const h40 = rh * 0.4;
    const h30 = rh * 0.3;
    
    // Wall partitions
    svg.innerHTML += `<line x1="${rx + w60}" y1="${ry}" x2="${rx + w60}" y2="${ry + rh}" stroke="${wallStroke}" stroke-width="2" />`;
    svg.innerHTML += `<line x1="${rx}" y1="${ry + h40}" x2="${rx + w60}" y2="${ry + h40}" stroke="${wallStroke}" stroke-width="2" />`;
    svg.innerHTML += `<line x1="${rx}" y1="${ry + h40 + (rh-h40)*0.5}" x2="${rx + w60}" y2="${ry + h40 + (rh-h40)*0.5}" stroke="${wallStroke}" stroke-width="2" />`;
    svg.innerHTML += `<line x1="${rx + w60}" y1="${ry + h30}" x2="${rx + rw}" y2="${ry + h30}" stroke="${wallStroke}" stroke-width="2" />`;
    svg.innerHTML += `<line x1="${rx + w60}" y1="${ry + h30 + (rh-h30)*0.5}" x2="${rx + rw}" y2="${ry + h30 + (rh-h30)*0.5}" stroke="${wallStroke}" stroke-width="2" />`;
    
    // Room Labels
    addRoomLabel(svg, rx + w60*0.5, ry + h40*0.5, "Living Room", "16' x 14'", labelColor, textMuted);
    addRoomLabel(svg, rx + w60*0.5, ry + h40 + (rh-h40)*0.25, "Master Bed", "12' x 12'", labelColor, textMuted);
    addRoomLabel(svg, rx + w60*0.5, ry + h40 + (rh-h40)*0.75, "Bedroom 2", "11' x 11'", labelColor, textMuted);
    
    addRoomLabel(svg, rx + w60 + w40*0.5, ry + h30*0.5, "Bedroom 3", "10' x 10'", labelColor, textMuted);
    addRoomLabel(svg, rx + w60 + w40*0.5, ry + h30 + (rh-h30)*0.25, "Kitchen", "8' x 10'", labelColor, textMuted);
    addRoomLabel(svg, rx + w60 + w40*0.5, ry + h30 + (rh-h30)*0.75, "Toilet", "5' x 7'", labelColor, textMuted);
  }
  
  // 4. Direction compass indicator overlay
  const compassX = size - 45;
  const compassY = 45;
  svg.innerHTML += `
    <circle cx="${compassX}" cy="${compassY}" r="16" fill="none" stroke="${plotStroke}" stroke-width="1"/>
    <line x1="${compassX}" y1="${compassY - 20}" x2="${compassX}" y2="${compassY + 20}" stroke="#e11d48" stroke-width="1.5"/>
    <line x1="${compassX - 20}" y1="${compassY}" x2="${compassX + 20}" y2="${compassY}" stroke="${plotStroke}" stroke-width="1"/>
    <text x="${compassX - 3}" y="${compassY - 23}" fill="#e11d48" font-size="9" font-weight="bold">N</text>
    <text x="${compassX + 23}" y="${compassY + 3}" fill="${textMuted}" font-size="8">E</text>
    <text x="${compassX - 3}" y="${compassY + 30}" fill="${textMuted}" font-size="8">S</text>
    <text x="${compassX - 32}" y="${compassY + 3}" fill="${textMuted}" font-size="8">W</text>
  `;
}

function addRoomLabel(svg, x, y, name, sizeText, titleColor, subtitleColor) {
  svg.innerHTML += `<text x="${x}" y="${y - 3}" fill="${titleColor}" font-size="11" font-weight="600" text-anchor="middle">${name}</text>`;
  svg.innerHTML += `<text x="${x}" y="${y + 9}" fill="${subtitleColor}" font-size="9" text-anchor="middle">${sizeText}</text>`;
}


/* ================= ARCHITECTURE FSI CALCULATIONS ================= */
function runFSICalculator() {
  const plotArea = parseFloat(document.getElementById("fsi-plot-area").value) || 2000;
  const roadWidth = parseFloat(document.getElementById("fsi-road-width").value) || 9;
  const builtUp = parseFloat(document.getElementById("fsi-builtup").value) || 3000;
  
  const fsiRatio = builtUp / plotArea;
  
  // Set permissible limits based on municipal road-width parameters
  let allowedFSI = 1.5;
  if (roadWidth >= 9) allowedFSI = 2.0;
  if (roadWidth >= 12) allowedFSI = 2.5;
  if (roadWidth >= 18) allowedFSI = 3.0;
  
  const capacityDiff = (allowedFSI * plotArea) - builtUp;
  const isCompliant = fsiRatio <= allowedFSI;
  
  document.getElementById("arch-fsi-ratio").innerText = fsiRatio.toFixed(2);
  document.getElementById("arch-fsi-allowed").innerText = allowedFSI.toFixed(2);
  
  const statusEl = document.getElementById("arch-fsi-status");
  if (isCompliant) {
    statusEl.innerText = "COMPLIANT";
    statusEl.style.color = "var(--accent-success)";
  } else {
    statusEl.innerText = "NON-COMPLIANT";
    statusEl.style.color = "var(--accent-danger)";
  }
  
  const diffPrefix = capacityDiff >= 0 ? "+" : "";
  document.getElementById("arch-fsi-diff").innerText = diffPrefix + Math.round(capacityDiff) + " sq ft";
}


/* ================= ELECTRICAL SOLAR PV SIZING ================= */
function runSolarCalculator() {
  const monthlyUnits = parseFloat(document.getElementById("solar-units").value) || 300;
  const dailySunHours = parseFloat(document.getElementById("solar-hours").value) || 4.5;
  const roofArea = parseFloat(document.getElementById("solar-area").value) || 500;
  const batteryType = document.getElementById("solar-battery").value;
  const safetyFactor = parseFloat(document.getElementById("solar-safety").value) || 1.25;
  
  // Sizing formula
  const dailyConsumption = monthlyUnits / 30;
  const requiredPV = (dailyConsumption / dailySunHours) * safetyFactor;
  
  // Panel counts (assuming standard 400W modern monocrystalline panels)
  const panelWatts = 400;
  const panelsNeeded = Math.ceil((requiredPV * 1000) / panelWatts);
  
  // Roof spacing checks (1kW needs approx 100 sq ft)
  const areaRequired = requiredPV * 100;
  const areaPassed = roofArea >= areaRequired;
  
  // Calculate battery capacity if off-grid
  let batteryCap = "None";
  if (batteryType !== "none") {
    const backupDays = parseInt(batteryType);
    // standard 48V layout conversion
    const ampHours = (dailyConsumption * 1000 * backupDays * 1.2) / 48; // 1.2 depth of discharge buffer
    batteryCap = `${Math.round(ampHours)} Ah @ 48V`;
  }
  
  // Update UI Sizing output
  document.getElementById("elec-res-pv").innerText = requiredPV.toFixed(2) + " kWp";
  document.getElementById("elec-res-panels").innerText = panelsNeeded + " Panels (" + panelWatts + "W)";
  document.getElementById("elec-res-batt").innerText = batteryCap;
  document.getElementById("elec-res-roof").innerText = `${Math.round(areaRequired)} sq ft (Status: ${areaPassed ? 'OK' : 'Insufficient'})`;
  
  // Update AI Pane
  const formula = `PV Size = (Units/30) / SunHours * SafetyFactor\nRequired Roof = PV * 100 sq ft`;
  const explanation = `<p>Sizing considers a <strong>${requiredPV.toFixed(2)} kWp</strong> solar utility array. Average solar performance accounts for inverter efficiencies, cabling heat dissipation, and micro-shading losses (estimated at ${Math.round((1 - 1/safetyFactor)*100)}%).</p>`;
  
  document.getElementById("elec-ai-formula").innerText = formula;
  document.getElementById("elec-ai-exp").innerHTML = explanation;
}


/* ================= ELECTRICAL CABLE SIZE & VOLTAGE DROP ================= */
function runCableCalculator() {
  const current = parseFloat(document.getElementById("cable-current").value) || 20;
  const length = parseFloat(document.getElementById("cable-length").value) || 50;
  const voltage = parseInt(document.getElementById("cable-voltage").value) || 230;
  const material = document.getElementById("cable-material").value;
  const dropLimitPct = parseFloat(document.getElementById("cable-drop-limit").value) || 3;
  
  // Iterate through cable databases
  let recommendedSize = null;
  let finalVoltageDrop = 0;
  let finalDropPct = 0;
  
  for (let i = 0; i < ENGINEERING_DATA.cableSizes.length; i++) {
    const cable = ENGINEERING_DATA.cableSizes[i];
    
    // Check ampacity (continuous current limit)
    const allowedAmp = material === "copper" ? cable.ampacityCu : cable.ampacityAl;
    if (allowedAmp < current) continue;
    
    // Calculate resistance
    const rPerKm = material === "copper" ? cable.resistanceCu : cable.resistanceAl;
    const rTotal = (rPerKm * length) / 1000;
    
    // Voltage drop calculation
    let vDrop = 0;
    if (voltage === 230) {
      // 1 Phase: 2 * I * R
      vDrop = 2 * current * rTotal;
    } else {
      // 3 Phase: sqrt(3) * I * R
      vDrop = Math.sqrt(3) * current * rTotal;
    }
    
    const dropPct = (vDrop / voltage) * 100;
    
    if (dropPct <= dropLimitPct) {
      recommendedSize = cable;
      finalVoltageDrop = vDrop;
      finalDropPct = dropPct;
      break;
    }
  }
  
  // If no size matches within drop limits, fallback to the largest available size
  if (!recommendedSize) {
    recommendedSize = ENGINEERING_DATA.cableSizes[ENGINEERING_DATA.cableSizes.length - 1];
    const rPerKm = material === "copper" ? recommendedSize.resistanceCu : recommendedSize.resistanceAl;
    const rTotal = (rPerKm * length) / 1000;
    finalVoltageDrop = voltage === 230 ? 2 * current * rTotal : Math.sqrt(3) * current * rTotal;
    finalDropPct = (finalVoltageDrop / voltage) * 100;
  }
  
  const ampacity = material === "copper" ? recommendedSize.ampacityCu : recommendedSize.ampacityAl;
  const passCheck = finalDropPct <= dropLimitPct && ampacity >= current;
  
  // Update UI Sizing output
  document.getElementById("elec-res-size").innerText = recommendedSize.sizeSqmm.toFixed(1) + " mm²";
  document.getElementById("elec-res-drop").innerText = `${finalVoltageDrop.toFixed(2)} V (${finalDropPct.toFixed(2)}%)`;
  document.getElementById("elec-res-amp").innerText = ampacity + " Amps";
  
  const checkEl = document.getElementById("elec-res-check");
  if (passCheck) {
    checkEl.innerText = "PASS";
    checkEl.style.color = "var(--accent-success)";
  } else {
    checkEl.innerText = "FAIL (EXCEEDS LIMITS)";
    checkEl.style.color = "var(--accent-danger)";
  }
  
  // Update AI Panel
  const formula = `V_drop (1Φ) = 2 * I * R * L\nV_drop (3Φ) = √3 * I * R * L`;
  const explanation = `<p>Calculates conductor limits according to <strong>NEC India (SP 30) / Indian Electricity (IE) Rules</strong>. Conductor resistance is based on resistivity at 30°C: Copper = 1.72×10⁻⁸ Ω·m, Aluminum = 2.82×10⁻⁸ Ω·m.</p>`;
  
  document.getElementById("elec-ai-formula").innerText = formula;
  document.getElementById("elec-ai-exp").innerHTML = explanation;
}


/* ================= PLUMBING WATER TANK DESIGN ================= */
function runPlumbingCalculator() {
  const occupants = parseFloat(document.getElementById("plumb-occupants").value) || 5;
  const rate = parseFloat(document.getElementById("plumb-rate").value) || 135;
  const days = parseFloat(document.getElementById("plumb-days").value) || 2;
  
  const totalVolume = occupants * rate * days;
  const sumpVol = totalVolume * 0.6; // 60% underground sump
  const ohtVol = totalVolume * 0.4;  // 40% overhead tank
  
  // Estimate dimensions for underground sump (Volume = L * W * H, assuming height = 1.2m)
  const sumpHeight = 1.2;
  const reqArea = (sumpVol / 1000) / sumpHeight; // 1000L = 1m³
  const width = Math.sqrt(reqArea / 1.2);
  const length = width * 1.2;
  
  // Update UI results
  document.getElementById("plumb-res-total").innerText = totalVolume.toLocaleString() + " Litres";
  document.getElementById("plumb-res-sump").innerText = Math.round(sumpVol).toLocaleString() + " Litres";
  document.getElementById("plumb-res-oht").innerText = Math.round(ohtVol).toLocaleString() + " Litres";
  document.getElementById("plumb-res-dim").innerText = `${length.toFixed(1)}m x ${width.toFixed(1)}m`;
  
  // Update AI Panel
  const formula = `Total Vol = Occupants * Rate * Days\nSump = 60%, Overhead = 40%`;
  const explanation = `<p>Water distribution calculations align with <strong>IS 1172 standards</strong> (recommending 135 L/person/day for domestic housing). The split configuration prevents high localized structural loading of overhead tanks on building beams.</p>`;
  
  document.getElementById("plumb-ai-formula").innerText = formula;
  document.getElementById("plumb-ai-exp").innerHTML = explanation;
  
  // Draw water tank 3D/Level representation
  drawWaterTank(totalVolume, sumpVol, ohtVol);
}

function drawWaterTank(total, sump, oht) {
  const canvas = document.getElementById("tank-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const width = canvas.width;
  const height = canvas.height;
  
  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  const labelColor = isLight ? "#0f172a" : "#f1f5f9";
  const tankBorder = isLight ? "rgba(51, 65, 85, 0.8)" : "rgba(148, 163, 184, 0.8)";
  const gridColor = isLight ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.05)";
  
  // Gradients for water
  const waterGrad = ctx.createLinearGradient(0, 50, 0, 220);
  waterGrad.addColorStop(0, "rgba(6, 182, 212, 0.55)");
  waterGrad.addColorStop(1, "rgba(8, 145, 178, 0.8)");

  const waterTopGrad = ctx.createLinearGradient(0, 50, 0, 220);
  waterTopGrad.addColorStop(0, "rgba(34, 211, 238, 0.7)");
  waterTopGrad.addColorStop(1, "rgba(6, 182, 212, 0.8)");

  // Fill ratio (e.g., 75% full for representation)
  const sumpRatio = 0.78; 
  const ohtRatio = 0.72;

  // Draw elegant grid lines in background for engineering aesthetic
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  for (let i = 20; i < width; i += 20) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, height);
    ctx.stroke();
  }
  for (let i = 20; i < height; i += 20) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(width, i);
    ctx.stroke();
  }

  // ================= 1. DRAW UNDERGROUND SUMP (3D BOX) =================
  // Sump coordinates (Front face)
  const sx = 50;
  const sy = 100;
  const sw = 130;
  const sh = 90;
  const sd = 25; // 3D depth offset

  // Sump back offsets
  const sbx = sx + sd;
  const sby = sy - sd;

  // A. Draw Water Block
  const sumpWaterH = sh * sumpRatio;
  const swy = sy + sh - sumpWaterH; // water top Y

  ctx.fillStyle = waterGrad;
  // Front water face
  ctx.beginPath();
  ctx.moveTo(sx + 2, sy + sh - 2);
  ctx.lineTo(sx + sw - 2, sy + sh - 2);
  ctx.lineTo(sx + sw - 2, swy);
  ctx.lineTo(sx + 2, swy);
  ctx.closePath();
  ctx.fill();

  // Side water face
  ctx.beginPath();
  ctx.moveTo(sx + sw - 2, sy + sh - 2);
  ctx.lineTo(sx + sw + sd - 2, sy + sh - sd - 2);
  ctx.lineTo(sx + sw + sd - 2, swy - sd);
  ctx.lineTo(sx + sw - 2, swy);
  ctx.closePath();
  ctx.fill();

  // Top water face (light cap)
  ctx.fillStyle = waterTopGrad;
  ctx.beginPath();
  ctx.moveTo(sx + 2, swy);
  ctx.lineTo(sx + sw - 2, swy);
  ctx.lineTo(sx + sw + sd - 2, swy - sd);
  ctx.lineTo(sx + 2 + sd, swy - sd);
  ctx.closePath();
  ctx.fill();

  // B. Draw Glass Sump Wireframe/Edges
  ctx.strokeStyle = tankBorder;
  ctx.lineWidth = 2.5;

  // Back face (partial/hidden behind glass)
  ctx.strokeStyle = isLight ? "rgba(51, 65, 85, 0.3)" : "rgba(148, 163, 184, 0.3)";
  ctx.beginPath();
  ctx.moveTo(sbx, sby);
  ctx.lineTo(sbx + sw, sby);
  ctx.lineTo(sbx + sw, sby + sh);
  ctx.lineTo(sbx, sby + sh);
  ctx.closePath();
  ctx.stroke();

  // Connecting depth lines (back to front)
  ctx.beginPath();
  ctx.moveTo(sx, sy); ctx.lineTo(sbx, sby);
  ctx.moveTo(sx + sw, sy); ctx.lineTo(sbx + sw, sby);
  ctx.moveTo(sx, sy + sh); ctx.lineTo(sbx, sby + sh);
  ctx.moveTo(sx + sw, sy + sh); ctx.lineTo(sbx + sw, sby + sh);
  ctx.stroke();

  // Front face (stronger/closer)
  ctx.strokeStyle = tankBorder;
  ctx.beginPath();
  ctx.rect(sx, sy, sw, sh);
  ctx.stroke();

  // Labels for Sump
  ctx.fillStyle = labelColor;
  ctx.font = "bold 12px sans-serif";
  ctx.fillText("Underground Sump (60% Split)", sx, sy - 40);
  ctx.font = "9px sans-serif";
  ctx.fillStyle = isLight ? "#475569" : "#94a3b8";
  ctx.fillText("Capacity: " + Math.round(sump) + " Litres", sx, sy + sh + 20);
  ctx.fillText("Depth: 1.2m", sx, sy + sh + 33);


  // ================= 2. DRAW OVERHEAD TANK (3D CYLINDER & LEGS) =================
  const tx = 360;      // center X
  const ty = 75;       // top Y
  const tr = 45;       // radius
  const th = 100;      // cylinder height
  const t_by = ty + th; // bottom Y
  const rx = tr;
  const ry = 14;       // vertical radius of ellipse

  // A. Draw Support Steel Legs under Overhead Tank
  ctx.strokeStyle = isLight ? "rgba(71, 85, 105, 0.7)" : "rgba(100, 116, 139, 0.7)";
  ctx.lineWidth = 3.5;
  
  // 4 Legs
  const leg1_x = tx - rx + 8;
  const leg2_x = tx + rx - 8;
  const leg_y = t_by + 5;
  const ground_y = t_by + 45;

  // Front Left Leg
  ctx.beginPath();
  ctx.moveTo(leg1_x, leg_y);
  ctx.lineTo(leg1_x - 5, ground_y);
  ctx.stroke();

  // Front Right Leg
  ctx.beginPath();
  ctx.moveTo(leg2_x, leg_y);
  ctx.lineTo(leg2_x + 5, ground_y);
  ctx.stroke();

  // Back legs
  ctx.lineWidth = 2;
  ctx.strokeStyle = isLight ? "rgba(71, 85, 105, 0.4)" : "rgba(100, 116, 139, 0.4)";
  ctx.beginPath();
  ctx.moveTo(tx - 15, t_by + 2);
  ctx.lineTo(tx - 18, ground_y - 5);
  ctx.moveTo(tx + 15, t_by + 2);
  ctx.lineTo(tx + 18, ground_y - 5);
  ctx.stroke();

  // Leg Bracing (X cross)
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = isLight ? "rgba(71, 85, 105, 0.5)" : "rgba(100, 116, 139, 0.5)";
  ctx.beginPath();
  ctx.moveTo(leg1_x, leg_y + 10);
  ctx.lineTo(leg2_x + 3, ground_y - 10);
  ctx.moveTo(leg2_x, leg_y + 10);
  ctx.lineTo(leg1_x - 3, ground_y - 10);
  ctx.stroke();

  // B. Draw Water inside Overhead Tank (3D cylinder fill)
  const ohtWaterH = th * ohtRatio;
  const owy = t_by - ohtWaterH; // water level Y

  // Water body path
  ctx.fillStyle = waterGrad;
  ctx.beginPath();
  // Bottom curve of water (bottom half ellipse)
  ctx.ellipse(tx, t_by, rx - 2, ry - 1, 0, 0, Math.PI, false);
  ctx.lineTo(tx + rx - 2, owy);
  // Top curve of water (full ellipse cap)
  ctx.ellipse(tx, owy, rx - 2, ry - 1, 0, 0, 2 * Math.PI);
  ctx.lineTo(tx - rx + 2, owy);
  ctx.lineTo(tx - rx + 2, t_by);
  ctx.closePath();
  ctx.fill();

  // Top water cap (highlighted top ellipse)
  ctx.fillStyle = waterTopGrad;
  ctx.beginPath();
  ctx.ellipse(tx, owy, rx - 2, ry - 1, 0, 0, 2 * Math.PI);
  ctx.fill();

  // C. Draw Cylinder Tank Glass Outlines
  ctx.strokeStyle = tankBorder;
  ctx.lineWidth = 2.5;

  // Bottom Ellipse
  ctx.beginPath();
  ctx.ellipse(tx, t_by, rx, ry, 0, 0, 2 * Math.PI);
  ctx.stroke();

  // Straight Sides
  ctx.beginPath();
  ctx.moveTo(tx - rx, ty);
  ctx.lineTo(tx - rx, t_by);
  ctx.moveTo(tx + rx, ty);
  ctx.lineTo(tx + rx, t_by);
  ctx.stroke();

  // Top Ellipse
  ctx.beginPath();
  ctx.ellipse(tx, ty, rx, ry, 0, 0, 2 * Math.PI);
  ctx.stroke();

  // D. Details: Scale/Indicators
  ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(tx + rx - 10, ty + 20);
  ctx.lineTo(tx + rx - 5, ty + 20);
  ctx.moveTo(tx + rx - 10, ty + 50);
  ctx.lineTo(tx + rx - 5, ty + 50);
  ctx.moveTo(tx + rx - 10, ty + 80);
  ctx.lineTo(tx + rx - 5, ty + 80);
  ctx.stroke();

  // Labels for OHT
  ctx.fillStyle = labelColor;
  ctx.font = "bold 12px sans-serif";
  ctx.fillText("Overhead Tank (40% Split)", tx - 60, ty - 40);
  ctx.font = "9px sans-serif";
  ctx.fillStyle = isLight ? "#475569" : "#94a3b8";
  ctx.fillText("Capacity: " + Math.round(oht) + " Litres", tx - 50, ground_y + 15);
  ctx.fillText("Elevated Level", tx - 50, ground_y + 28);
}


/* ================= HVAC AC TONNAGE & COOLING ================= */
function runHVACCalculator() {
  const len = parseFloat(document.getElementById("hvac-length").value) || 5;
  const wid = parseFloat(document.getElementById("hvac-width").value) || 4;
  const high = parseFloat(document.getElementById("hvac-height").value) || 3;
  const climate = document.getElementById("hvac-climate").value;
  const people = parseInt(document.getElementById("hvac-people").value) || 2;
  const watts = parseFloat(document.getElementById("hvac-appliances").value) || 500;
  
  const volumeCubicM = len * wid * high;
  
  // Volume to BTU baseline calculation depending on climates (BTU per cubic meter)
  let factor = 170; // moderate climate normal sun
  if (climate === "temperate") factor = 130;
  if (climate === "tropical") factor = 210;
  
  const baseBTU = volumeCubicM * factor;
  const occupancyHeat = people * 500; // 500 BTU per person
  const applianceHeat = watts * 3.41;  // 3.41 BTU per Watt
  
  const totalBTU = baseBTU + occupancyHeat + applianceHeat;
  const tonnage = totalBTU / 12000;  // 12000 BTU/hr = 1 Ton
  const kwCapacity = totalBTU * 0.000293071; // 1 BTU/hr = 0.000293 kW
  
  // Estimate ventilation based on occupancy standard codes
  const freshAirCFM = people * 15; // 15 CFM fresh air per person
  
  // Update UI results
  document.getElementById("hvac-res-load").innerText = Math.round(totalBTU).toLocaleString() + " BTU/hr";
  document.getElementById("hvac-res-ton").innerText = tonnage.toFixed(1) + " Tons";
  document.getElementById("hvac-res-kw").innerText = kwCapacity.toFixed(2) + " kW";
  document.getElementById("hvac-res-vent").innerText = freshAirCFM + " CFM";
  
  // Update AI Panel
  const formula = `BTU = (Vol * ClimateFactor) + (People * 500) + (Watts * 3.41)`;
  const explanation = `<p>Cooling heat load accounts for building envelopes thermal transfer (sensible heat), latent heat from human occupants, and heat dissipated from office machinery. Standard complies with <strong>ASHRAE calculations</strong>.</p>`;
  
  document.getElementById("hvac-ai-formula").innerText = formula;
  document.getElementById("hvac-ai-exp").innerHTML = explanation;
}


/* ================= FIRE EXITS & OCCUPANCY ================= */
function runFireCalculator() {
  const type = document.getElementById("fire-occupancy").value;
  const area = parseFloat(document.getElementById("fire-area").value) || 200;
  
  const safety = ENGINEERING_DATA.fireSafety.occupancyTypes[type];
  if (!safety) return;
  
  // Occupant load = Area / Density standard
  const occupants = Math.ceil(area / safety.density);
  
  // Exits count rules
  let exits = safety.minExits;
  if (occupants > 500) exits = 3;
  if (occupants > 1000) exits = 4;
  
  // Exit width in meters (width factor is mm per person)
  const exitWidthM = (occupants * safety.exitWidthPerPerson) / 1000;
  
  // Update UI safety parameters
  document.getElementById("fire-res-load").innerText = occupants + " People";
  document.getElementById("fire-res-exits").innerText = exits + " Exits";
  document.getElementById("fire-res-width").innerText = Math.max(exitWidthM, 2.0).toFixed(2) + " meters";
  document.getElementById("fire-res-dist").innerText = safety.travelDistance + " meters";
  
  // Generate extinguisher grid
  const extGrid = document.getElementById("extinguisher-allocations");
  extGrid.innerHTML = ENGINEERING_DATA.fireSafety.extinguishers.map(ext => `
    <div style="background-color: var(--bg-tertiary); border-left: 4px solid ${ext.color}; padding: 10px; border-radius: 4px;">
      <div style="font-weight: 700; font-size: 12px; color: ${ext.color};">${ext.class} (${ext.type})</div>
      <div style="font-size: 11px; margin-top: 4px; color: var(--text-secondary);">${ext.hazards}</div>
    </div>
  `).join('');
  
  // Update AI Panel
  const formula = `Occupants = Floor Area / Density Factor\nMin Width = Occupants * width_factor / 1000`;
  const explanation = `<p>Building egress sizing complies with Indian National Building Code (<strong>NBC 2016 Part 4 - Fire and Life Safety</strong>). Exit pathway dimensions must avoid bottlenecks, and staircase widths must exceed a 1.2m baseline.</p>`;
  
  document.getElementById("fire-ai-formula").innerText = formula;
  document.getElementById("fire-ai-exp").innerHTML = explanation;
}


/* ================= MECHANICAL PUMP SELECTION ================= */
function runPumpCalculator() {
  const flowLPM = parseFloat(document.getElementById("pump-flow").value) || 200;
  const liftM = parseFloat(document.getElementById("pump-lift").value) || 20;
  const runL = parseFloat(document.getElementById("pump-length").value) || 30;
  const diaMM = parseInt(document.getElementById("pump-diameter").value) || 38;
  const eff = parseFloat(document.getElementById("pump-eff").value) || 65;
  
  // Flow in m³/s
  const flowM3S = (flowLPM / 1000) / 60;
  
  // Pipe inner area in m²
  const r = (diaMM / 1000) / 2;
  const area = Math.PI * r * r;
  
  // Velocity in pipe (m/s)
  const velocity = flowM3S / area;
  
  // Friction loss calculation (Hazen-Williams simplification for plastic/steel pipeline)
  // Hf = 10.67 * L * Q^1.852 / (C^1.852 * D^4.87)
  const C = 130; // standard roughness factor
  const dM = diaMM / 1000;
  const frictionLoss = 10.67 * runL * Math.pow(flowM3S, 1.852) / (Math.pow(C, 1.852) * Math.pow(dM, 4.87));
  
  // Total dynamic head (static lift + friction losses + fittings allowance 15%)
  const tdh = liftM + (frictionLoss * 1.15);
  
  // Power requirement hydraulic (P = Q * H * g * density)
  const powerHydKW = (flowM3S * tdh * 9.81 * 1000) / 1000;
  
  // Power motor output
  const powerMotorKW = powerHydKW / (eff / 100);
  const HP = powerMotorKW * 1.34102; // 1 kW = 1.341 HP
  
  // Update UI results
  document.getElementById("pump-res-friction").innerText = frictionLoss.toFixed(2) + " meters";
  document.getElementById("pump-res-tdh").innerText = tdh.toFixed(2) + " meters";
  document.getElementById("pump-res-hyd-pwr").innerText = powerHydKW.toFixed(2) + " kW";
  document.getElementById("pump-res-hp").innerText = `${HP.toFixed(1)} HP (${powerMotorKW.toFixed(2)} kW)`;
  
  // Update AI Panel
  const formula = `Hf = 10.67 * L * Q^1.85 / (C^1.85 * D^4.87)\nMotor HP = (Q * TDH * 9.81) / (1000 * Efficiency)`;
  const explanation = `<p>Pump selection uses pipeline friction modeling. Reducing pipeline diameters dramatically expands velocity head requirements, requiring larger motors and wasting electricity. Continuous velocity should stay under 2.5 m/s.</p>`;
  
  document.getElementById("mech-ai-formula").innerText = formula;
  document.getElementById("mech-ai-exp").innerHTML = explanation;
}


/* ================= PROJECT PM COST & MATERIALS ESTIMATION ================= */
function runPMEstimator() {
  const area = parseFloat(document.getElementById("pm-area").value) || 1500;
  const finishClass = document.getElementById("pm-class").value;
  
  const spec = ENGINEERING_DATA.constructionEstimator.rates[finishClass];
  const matConst = ENGINEERING_DATA.constructionEstimator.materialConstants;
  if (!spec) return;
  
  // Calculate total costs
  const totalCost = area * spec.costPerSqFt;
  
  // Financial breakdowns
  const cementCost = totalCost * (spec.cementPct / 100);
  const steelCost = totalCost * (spec.steelPct / 100);
  const sandAggCost = totalCost * ((spec.sandPct + spec.aggregatePct) / 100);
  const finishCost = totalCost * (spec.finishPct / 100);
  const laborCost = totalCost * (spec.laborPct / 100);
  
  // Material quantities estimates
  const cementBags = Math.round(area * matConst.cementBagsPerSqFt);
  const steelTons = (area * matConst.steelKgPerSqFt) / 1000;
  const sandCFT = Math.round(area * matConst.sandCftPerSqFt);
  const aggCFT = Math.round(area * matConst.aggregateCftPerSqFt);
  const bricks = Math.round(area * matConst.bricksPerSqFt);
  
  // Set UI Results
  document.getElementById("pm-res-total-cost").innerText = "₹" + totalCost.toLocaleString();
  
  document.getElementById("pm-mat-cement").innerText = cementBags.toLocaleString() + " Bags";
  document.getElementById("pm-mat-steel").innerText = steelTons.toFixed(1) + " Tons";
  document.getElementById("pm-mat-sand").innerText = sandCFT.toLocaleString() + " CFT";
  document.getElementById("pm-mat-agg").innerText = aggCFT.toLocaleString() + " CFT";
  document.getElementById("pm-mat-bricks").innerText = bricks.toLocaleString() + " Pcs";
  
  document.getElementById("pm-cost-cement").innerText = "₹" + Math.round(cementCost).toLocaleString();
  document.getElementById("pm-cost-steel").innerText = "₹" + Math.round(steelCost).toLocaleString();
  document.getElementById("pm-cost-sandagg").innerText = "₹" + Math.round(sandAggCost).toLocaleString();
  document.getElementById("pm-cost-finishes").innerText = "₹" + Math.round(finishCost).toLocaleString();
  document.getElementById("pm-cost-labor").innerText = "₹" + Math.round(laborCost).toLocaleString();
  
  // Update AI Panel
  const formula = `Budget = Area * SpecRate\nMaterial = Area * Factor`;
  const explanation = `<p>Estimation models translate total building plinth dimensions to absolute material quotas using standard volumetric ratios: cement density (1440 kg/m³), brick sizing (190x90x90 mm), and structural reinforcement averages.</p>`;
  
  document.getElementById("pm-ai-formula").innerText = formula;
  document.getElementById("pm-ai-exp").innerHTML = explanation;
}


/* ================= PROJECT PM GANTT SCHEDULE PLANNER ================= */
function runGanttPlanner() {
  const startDateStr = document.getElementById("gantt-start-date").value;
  const crew = parseInt(document.getElementById("gantt-crew").value) || 10;
  const grid = document.getElementById("gantt-chart-grid");
  
  if (!startDateStr || !grid) return;
  
  const startDate = new Date(startDateStr);
  
  // Pre-configured task sequences with default durations (in days)
  // Duration scale is inverse to crew size
  const efficiencyMultiplier = 12 / crew; // crew 12 is baseline 1.0x
  
  const tasks = [
    { name: "Excavation & Footing", days: Math.round(15 * efficiencyMultiplier), color: "#3B82F6" },
    { name: "Column Casting & Plinth", days: Math.round(20 * efficiencyMultiplier), color: "#2563EB" },
    { name: "Slab & Beam Concrete", days: Math.round(25 * efficiencyMultiplier), color: "#1D4ED8" },
    { name: "Brick Masonry Work", days: Math.round(22 * efficiencyMultiplier), color: "#10B981" },
    { name: "Conduit Routing & Pipes", days: Math.round(18 * efficiencyMultiplier), color: "#F59E0B" },
    { name: "Plastering & Curing", days: Math.round(20 * efficiencyMultiplier), color: "#06B6D4" },
    { name: "Tiling & Paint Finish", days: Math.round(28 * efficiencyMultiplier), color: "#EC4899" },
    { name: "Egress Checks & Handover", days: Math.round(10 * efficiencyMultiplier), color: "#8B5CF6" }
  ];
  
  // Calculate sequential timelines
  let totalProjectDays = 0;
  let currentDate = new Date(startDate);
  
  const timelineData = tasks.map(task => {
    const start = new Date(currentDate);
    currentDate.setDate(currentDate.getDate() + task.days);
    const end = new Date(currentDate);
    totalProjectDays += task.days;
    return {
      name: task.name,
      start: start,
      end: end,
      days: task.days,
      color: task.color
    };
  });
  
  // Populate the Grid HTML
  let html = `
    <div class="gantt-header">Task Name</div>
    <div class="gantt-header">Schedule Timeline (${totalProjectDays} days total)</div>
  `;
  
  timelineData.forEach(task => {
    const formattedStart = task.start.toLocaleDateString(undefined, {month: 'short', day: 'numeric'});
    const formattedEnd = task.end.toLocaleDateString(undefined, {month: 'short', day: 'numeric'});
    
    // Calculate percentages for bars positioning
    const taskStartOffsetDays = (task.start - startDate) / (1000 * 60 * 60 * 24);
    const startPct = (taskStartOffsetDays / totalProjectDays) * 100;
    const widthPct = (task.days / totalProjectDays) * 100;
    
    html += `
      <div class="gantt-row">
        <div class="gantt-task-name">${task.name}</div>
        <div class="gantt-track">
          <div class="gantt-bar" style="left: ${startPct}%; width: ${widthPct}%; background-color: ${task.color};">
            ${task.days}d (${formattedStart} - ${formattedEnd})
          </div>
        </div>
      </div>
    `;
  });
  
  grid.innerHTML = html;
  
  // Update AI Panel
  const formula = `Total Days = Sum(TaskDays * (12 / CrewSize))\nSequence = Critical Path Method (CPM)`;
  const explanation = `<p>Scheduler applies a sequential waterfall timeline layout using <strong>Critical Path Method (CPM)</strong> logic. Adjusting the crew count modifies labor output and project completion limits.</p>`;
  
  document.getElementById("pm-ai-formula").innerText = formula;
  document.getElementById("pm-ai-exp").innerHTML = explanation;
}

/* ================= CIVIL UNIT CONVERSION TOOLS ================= */
const UNIT_FACTORS = {
  length: {
    m: 1,
    ft: 3.28084,
    in: 39.3701,
    mm: 1000
  },
  area: {
    "m²": 1,
    "ft²": 10.7639,
    Acre: 0.000247105,
    Hectare: 0.0001
  },
  volume: {
    "m³": 1,
    "ft³": 35.3147,
    Litre: 1000,
    Gallon: 264.172
  },
  stress: {
    MPa: 1,
    psi: 145.038,
    "kg/cm²": 10.1972
  }
};

function updateUnitConverter() {
  const category = document.getElementById("unit-category").value;
  const fromSelect = document.getElementById("unit-from");
  const toSelect = document.getElementById("unit-to");
  
  if (!fromSelect || !toSelect) return;
  
  const units = Object.keys(UNIT_FACTORS[category]);
  
  fromSelect.innerHTML = units.map(u => `<option value="${u}">${u}</option>`).join('');
  toSelect.innerHTML = units.map(u => `<option value="${u}">${u}</option>`).join('');
  
  // Set different defaults if possible
  if (units.length > 1) {
    toSelect.selectedIndex = 1;
  }
  
  runUnitConversion();
}

function runUnitConversion() {
  const category = document.getElementById("unit-category").value;
  const val = parseFloat(document.getElementById("unit-source-val").value) || 0;
  const from = document.getElementById("unit-from").value;
  const to = document.getElementById("unit-to").value;
  const resValEl = document.getElementById("unit-res-val");
  
  if (!from || !to || !resValEl) return;
  
  // Convert to base (which is factor = 1)
  const baseVal = val / UNIT_FACTORS[category][from];
  // Convert from base to target
  const converted = baseVal * UNIT_FACTORS[category][to];
  
  resValEl.innerText = `${converted.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 4})} ${to}`;
  
  // Update AI Panel
  const formula = `Value_in_base = Source / Factor_from\nResult = Value_in_base * Factor_to`;
  const explanation = `<p>Unit converter is optimized for civil engineering design equations. Accurate translation factors avoid design translation safety errors across metric (IS/SI) and imperial systems.</p>`;
  
  document.getElementById("civil-ai-formula").innerText = formula;
  document.getElementById("civil-ai-exp").innerHTML = explanation;
  document.getElementById("civil-ai-code").innerText = "IS 456 / Indian Standard Conversion Factors";
}

/* ================= USER PROFILE CUSTOMIZATION ================= */
function toggleProfileDropdown(e) {
  if (e) e.stopPropagation();
  const menu = document.getElementById("profile-menu");
  if (menu) menu.classList.toggle("active");
}

function openProfileSettingsModal() {
  const modal = document.getElementById("profile-modal");
  
  // Profile inputs
  const nameInput = document.getElementById("profile-input-name");
  const roleInput = document.getElementById("profile-input-role");
  
  const currentName = document.getElementById("header-profile-name").innerText;
  const currentRole = document.getElementById("menu-profile-role").innerText;
  
  if (nameInput) nameInput.value = currentName;
  if (roleInput) roleInput.value = currentRole;

  // Custom brand logo input
  const logoInput = document.getElementById("settings-input-logo");
  const logoSpan = document.getElementById("nav-logo-text");
  if (logoInput && logoSpan) {
    logoInput.value = localStorage.getItem("civarch_settings_logo") || logoSpan.innerText;
  }

  // Sidebar label inputs
  const navIds = ["home", "civil", "arch", "elec", "plumb", "hvac", "fire", "mech", "pm", "gadgets"];
  navIds.forEach(id => {
    const input = document.getElementById(`settings-input-${id}`);
    const span = document.getElementById(`nav-${id}-text`);
    if (input && span) {
      input.value = localStorage.getItem(`civarch_settings_nav_${id}`) || span.innerText;
    }
  });
  
  if (modal) modal.style.display = "flex";
  
  // Close dropdown
  const menu = document.getElementById("profile-menu");
  if (menu) menu.classList.remove("active");
  lucide.createIcons();
}

function closeProfileModal() {
  const modal = document.getElementById("profile-modal");
  if (modal) modal.style.display = "none";
}

function saveProfileChanges() {
  const newName = document.getElementById("profile-input-name").value.trim() || "Er. Durga Prasad";
  const newRole = document.getElementById("profile-input-role").value.trim() || "Senior Structural Eng.";
  
  // Cache profile locally
  localStorage.setItem("civarch_profile_name", newName);
  localStorage.setItem("civarch_profile_role", newRole);
  applyProfileData(newName, newRole);

  // Cache platform logo name
  const logoInput = document.getElementById("settings-input-logo");
  if (logoInput) {
    const newLogo = logoInput.value.trim() || "CivArch Engine";
    localStorage.setItem("civarch_settings_logo", newLogo);
    const logoSpan = document.getElementById("nav-logo-text");
    if (logoSpan) logoSpan.innerText = newLogo;
  }

  // Cache each sidebar menu tab name
  const navIds = ["home", "civil", "arch", "elec", "plumb", "hvac", "fire", "mech", "pm", "gadgets"];
  navIds.forEach(id => {
    const input = document.getElementById(`settings-input-${id}`);
    if (input) {
      const newVal = input.value.trim();
      if (newVal) {
        localStorage.setItem(`civarch_settings_nav_${id}`, newVal);
        const span = document.getElementById(`nav-${id}-text`);
        if (span) span.innerText = newVal;
      }
    }
  });
  
  closeProfileModal();
  showToast("Profile & labels updated successfully!");
}

function applyProfileData(name, role) {
  const headerName = document.getElementById("header-profile-name");
  const menuName = document.getElementById("menu-profile-name");
  const menuRole = document.getElementById("menu-profile-role");
  const avatarInitials = document.getElementById("header-avatar-initials");
  
  if (headerName) headerName.innerText = name;
  if (menuName) menuName.innerText = name;
  if (menuRole) menuRole.innerText = role;
  
  if (avatarInitials) {
    // Generate 2 initials from name
    const initials = name
      .replace(/Er\./i, "")
      .trim()
      .split(/\s+/)
      .map(w => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "DP";
    avatarInitials.innerText = initials;
  }
}

function loadProfileData() {
  const name = localStorage.getItem("civarch_profile_name") || "Er. Durga Prasad";
  const role = localStorage.getItem("civarch_profile_role") || "Senior Structural Eng.";
  applyProfileData(name, role);

  // Load platform brand logo name
  const savedLogo = localStorage.getItem("civarch_settings_logo");
  const logoSpan = document.getElementById("nav-logo-text");
  if (savedLogo && logoSpan) {
    logoSpan.innerText = savedLogo;
  }

  // Load each sidebar menu tab name
  const navIds = ["home", "civil", "arch", "elec", "plumb", "hvac", "fire", "mech", "pm", "gadgets"];
  navIds.forEach(id => {
    const savedNav = localStorage.getItem(`civarch_settings_nav_${id}`);
    const span = document.getElementById(`nav-${id}-text`);
    if (savedNav && span) {
      span.innerText = savedNav;
    }
  });
}


/* ================= ENGINEERING GADGETS SOLVERS ================= */
function runRebarCalculator() {
  const dia = parseFloat(document.getElementById("gadget-rebar-dia").value) || 12;
  const len = parseFloat(document.getElementById("gadget-rebar-len").value) || 12;
  
  // Formula: Weight = D^2 / 162.162 * L
  const weight = (dia * dia / 162.2) * len;
  
  document.getElementById("gadget-rebar-res").innerText = weight.toFixed(2) + " kg";
}

function rotateVastuCompass(deg) {
  const ring = document.getElementById("vastu-compass-ring");
  if (!ring) return;
  ring.style.transform = `rotate(${deg}deg)`;
  document.getElementById("compass-angle-text").innerText = `${deg}°`;
  
  let sector = "Eshanya (Northeast) — Water / Pooja";
  if (deg > 45 && deg <= 135) sector = "Agneya (Southeast) — Fire / Kitchen";
  else if (deg > 135 && deg <= 225) sector = "Nairutya (Southwest) — Earth / Master Bed";
  else if (deg > 225 && deg <= 315) sector = "Vayavya (Northwest) — Air / Restroom";
  else sector = "Eshanya (Northeast) — Water / Pooja";
  
  document.getElementById("compass-vastu-sector").innerText = sector;
}

function saveGadgetNotes() {
  const text = document.getElementById("gadget-notes").value;
  localStorage.setItem("civarch_gadget_notes", text);
  document.getElementById("gadget-notes-status").innerText = "Saved to local cache";
}

function clearGadgetNotes() {
  const notesEl = document.getElementById("gadget-notes");
  if (notesEl) notesEl.value = "";
  localStorage.removeItem("civarch_gadget_notes");
  document.getElementById("gadget-notes-status").innerText = "Cleared";
}

function loadGadgetNotes() {
  const notes = localStorage.getItem("civarch_gadget_notes");
  const notesEl = document.getElementById("gadget-notes");
  if (notesEl && notes) {
    notesEl.value = notes;
  }
  // Run initial rebar sizer calculation
  runRebarCalculator();
}


/* ================= CLIPBOARD COPYING & USER-FRIENDLY UTILS ================= */
function showToast(message, isSuccess = true) {
  const toast = document.getElementById("toast-notification");
  if (!toast) return;
  toast.innerText = message;
  toast.style.borderColor = isSuccess ? "var(--accent-success)" : "var(--accent-danger)";
  toast.classList.add("active");
  setTimeout(() => {
    toast.classList.remove("active");
  }, 2500);
}

function initCopyButtons() {
  document.querySelectorAll(".results-box").forEach(box => {
    const header = box.querySelector(".results-header");
    if (header && !header.querySelector(".copy-btn")) {
      const btn = document.createElement("button");
      btn.className = "copy-btn";
      btn.title = "Copy calculated results";
      btn.innerHTML = `<i data-lucide="copy" style="width:14px; height:14px;"></i>`;
      btn.onclick = (e) => {
        e.stopPropagation();
        copyBoxResults(box);
      };
      header.appendChild(btn);
    }
  });
  lucide.createIcons();
}

function copyBoxResults(box) {
  let summary = "";
  const header = box.querySelector(".results-header");
  if (header) {
    const headerText = Array.from(header.childNodes)
      .filter(node => node.nodeType === Node.TEXT_NODE || (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains("copy-btn")))
      .map(node => node.textContent.trim())
      .join(" ");
    summary += `=== ${headerText} ===\n`;
  }
  
  box.querySelectorAll(".result-item").forEach(item => {
    const lbl = item.querySelector(".result-lbl")?.innerText || "";
    const val = item.querySelector(".result-val")?.innerText || "";
    if (lbl && val) {
      summary += `${lbl}: ${val}\n`;
    }
  });
  
  box.querySelectorAll("table tr").forEach(row => {
    const cells = Array.from(row.querySelectorAll("td")).map(td => td.innerText.trim());
    if (cells.length >= 2) {
      summary += `${cells[0]} ${cells[1]}\n`;
    }
  });
  
  navigator.clipboard.writeText(summary.trim()).then(() => {
    showToast("Copied to clipboard!");
  }).catch(err => {
    console.error("Clipboard copy failed:", err);
  });
}

/* ================= PREMIUM CINEMATIC HERO CONTROLLER ================= */
function initPremiumHero() {
  const hero = document.getElementById("premium-hero");
  const canvas = document.getElementById("hero-canvas");
  
  if (!hero || !canvas) return;
  const ctx = canvas.getContext("2d");

  // 1. Intersection Observer to detect entering the hero section
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Activate staggered text and cards animations
        hero.classList.add("active");
        
        // Fade in canvas
        canvas.style.opacity = 1;
        
        // Trigger count-up stats animations
        animateStats();
        
        // Unobserve to trigger only once on initial scroll-in
        observer.unobserve(hero);
      }
    });
  }, {
    threshold: 0.15 // trigger when 15% of hero is in viewport
  });
  
  observer.observe(hero);

  // 2. CAD Constellation Snapping Blueprint Generator
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || 1200;
    canvas.height = rect.height || 520;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const particles = [];
  const particleCount = 75;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: 1.5 + Math.random() * 2.0,
      color: i % 2 === 0 ? "rgba(99, 102, 241, 0.7)" : "rgba(6, 182, 212, 0.7)"
    });
  }

  let mouse = { x: null, y: null, radius: 160 };

  hero.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  hero.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  function drawHeroNetwork() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw drafting blueprint coordinate grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
    ctx.lineWidth = 1;
    const gridSpacing = 24;
    for (let x = gridSpacing; x < canvas.width; x += gridSpacing) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = gridSpacing; y < canvas.height; y += gridSpacing) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Update and draw nodes
    particles.forEach(p => {
      // Natural float velocity
      p.x += p.vx;
      p.y += p.vy;

      // Wrap boundaries smoothly
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // snappable magnetic cursor pull
      if (mouse.x !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x += (dx / dist) * force * 1.5;
          p.y += (dy / dist) * force * 1.5;
        }
      }

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw connecting beams between nodes (beams web)
    ctx.lineWidth = 0.8;
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          const alpha = (100 - dist) / 100 * 0.15;
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // Draw cursor snap lines (High-voltage snapping rays)
      if (mouse.x !== null) {
        const dx = mouse.x - p1.x;
        const dy = mouse.y - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius * 0.8) {
          const alpha = (mouse.radius * 0.8 - dist) / (mouse.radius * 0.8) * 0.3;
          ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }

    // Draw drafting target reticle coordinate overlay at cursor position
    if (mouse.x !== null) {
      ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
      ctx.lineWidth = 1;
      
      // Dynamic crosshair reticle
      ctx.beginPath();
      ctx.moveTo(mouse.x - 12, mouse.y); ctx.lineTo(mouse.x + 12, mouse.y);
      ctx.moveTo(mouse.x, mouse.y - 12); ctx.lineTo(mouse.x, mouse.y + 12);
      ctx.stroke();

      ctx.strokeStyle = "rgba(6, 182, 212, 0.25)";
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 6, 0, Math.PI * 2);
      ctx.stroke();

      // Dynamic coordinate readout matching premium CAD plots
      ctx.fillStyle = "rgba(6, 182, 212, 0.85)";
      ctx.font = "bold 9px monospace";
      ctx.fillText(`SNAP X: ${mouse.x.toFixed(1)}px`, mouse.x + 16, mouse.y - 4);
      ctx.fillText(`SNAP Y: ${mouse.y.toFixed(1)}px`, mouse.x + 16, mouse.y + 7);
    }

    requestAnimationFrame(drawHeroNetwork);
  }
  
  drawHeroNetwork();

  // 3. High-Performance Parallax Scroll Loop
  let lastScrollY = 0;
  let ticking = false;
  
  window.addEventListener("scroll", () => {
    lastScrollY = window.scrollY;
    
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateHeroParallax(lastScrollY, hero, canvas);
        ticking = false;
      });
      ticking = true;
    }
  });
}

function updateHeroParallax(scrollY, hero, canvas) {
  const rect = hero.getBoundingClientRect();
  const heroHeight = rect.height;
  const heroTop = rect.top + window.scrollY;
  
  if (scrollY > heroTop + heroHeight || scrollY + window.innerHeight < heroTop) {
    return; 
  }
  
  const scrolled = scrollY - (heroTop - window.innerHeight);
  const totalDuration = window.innerHeight + heroHeight;
  const progress = Math.max(0, Math.min(1, scrolled / totalDuration));
  
  // Parallax scale interpolation of canvas grid
  const startScale = 1.0;
  const maxScale = 1.15;
  const currentScale = startScale + (progress * (maxScale - startScale));
  
  canvas.style.transform = `scale(${currentScale}) translateY(${scrollY * 0.08}px)`;
  
  // Translate overlay text slowly (Apple/Autodesk overlay parallax effect)
  const content = document.getElementById("hero-content");
  const stats = document.getElementById("hero-stats-panel");
  const activeScrolled = Math.max(0, scrollY);
  
  if (content && window.innerWidth > 950) {
    content.style.transform = `translateY(${activeScrolled * 0.15}px)`;
  }
  if (stats && window.innerWidth > 950) {
    stats.style.transform = `translateY(${activeScrolled * 0.08}px)`;
  }
}

function animateStats() {
  const stats = document.querySelectorAll(".stat-num");
  
  stats.forEach(stat => {
    const target = parseInt(stat.getAttribute("data-target")) || 0;
    const duration = 2000; // 2 seconds animation duration
    const startTime = performance.now();
    
    function updateCount(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      
      // Quartic ease-out function for dynamic slowdown at the end
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const currentVal = Math.floor(easeProgress * target);
      
      stat.innerText = currentVal;
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        stat.innerText = target;
      }
    }
    
    requestAnimationFrame(updateCount);
  });
}

function scrollToDisciplines() {
  const marqueeTitle = document.querySelector(".marquee-container-title");
  if (marqueeTitle) {
    marqueeTitle.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}
