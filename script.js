// ---------- Discography data ----------
// NOTE: "Beyond" and "Inspire" currently point to the same YouTube ID
// (CZKsiwCu-Ao) because that's what was provided — worth double-checking
// against your upload history in case one link is wrong.
const SONGS = [
  { name:"Beyond",              month:"Dec", year:2020, id:"CZKsiwCu-Ao" },
  { name:"Fade Light",          month:"Dec", year:2020, id:"L8bm6Tpx8Ic" },
  { name:"Inspire",             month:"May", year:2021, id:"CZKsiwCu-Ao" },
  { name:"Freeze",              month:"Jun", year:2021, id:"NdJIr32Ii1w" },
  { name:"Waves",               month:"Sep", year:2021, id:"XqBwP1zESKQ" },
  { name:"Starlight",           month:"Jun", year:2022, id:"mlMbFy0JJec" },
  { name:"Devil's Hour",        month:"Dec", year:2022, id:"PuncBCv5S-g" },
  { name:"Good Vibes",          month:"Jan", year:2023, id:"c6sR21xKM0M" },
  { name:"Stellar",             month:"Feb", year:2023, id:"1Jo1_i6xlHg" },
  { name:"Cold",                month:"May", year:2023, id:"DQv5tGvcabs" },
  { name:"Sunshine",            month:"Jun", year:2023, id:"OXPWS2y6nKQ" },
  { name:"Flux",                month:"Jul", year:2023, id:"0YA0mMExH9M" },
  { name:"Symphony of Shadow",  month:"Sep", year:2023, id:"EYmQowKS51w" },
  { name:"Blaze",                month:"Nov", year:2023, id:"Bl53r8cNRMI" },
  { name:"Voyage",              month:"Apr", year:2024, id:"PKnDMtZwRRc" },
  { name:"Nexus",               month:"Mar", year:2025, id:"PsgS6w7j-KY" },
  { name:"Daze",                month:"Jun", year:2025, id:"l-pOaCWOG_M" },
  { name:"Collide",             month:"Jun", year:2025, id:"4Zwrq7_B07o" },
  { name:"Bling",               month:"Aug", year:2025, id:"ry4aQx4OHko" },
  { name:"Inferno",             month:"Aug", year:2025, id:"wbQJSocsFLI" },
  { name:"Horizon",             month:"Aug", year:2025, id:"YaJgYuyn_u4" },
  { name:"Eclipse",             month:"Aug", year:2025, id:"iktkw6R0dck" },
  { name:"Reignite",            month:"Nov", year:2025, id:"u0zNfdSCuBI" },
];

function ytUrl(id){ return `https://youtu.be/${id}`; }
function ytThumb(id){ return `https://img.youtube.com/vi/${id}/hqdefault.jpg`; }

// ---------- Waveform ----------
function buildWaveform(el, bars=28){
  if(!el) return;
  for(let i=0;i<bars;i++){
    const s = document.createElement('span');
    s.style.animationDelay = (Math.random()*1.4).toFixed(2)+'s';
    s.style.animationDuration = (1.1+Math.random()*0.8).toFixed(2)+'s';
    el.appendChild(s);
  }
}

// ---------- Timeline (home page) ----------
function buildTimeline(el){
  if(!el) return;
  const byYear = {};
  SONGS.forEach(s => { (byYear[s.year] ||= []).push(s); });

  const years = [2019, ...Object.keys(byYear).map(Number).sort((a,b)=>a-b), 2026];
  const uniqueYears = [...new Set(years)];

  uniqueYears.forEach(year => {
    const block = document.createElement('div');
    block.className = 'timeline-year reveal';

    if(year === 2019){
      block.innerHTML = `<h3>2019</h3><div class="milestone">First tracks made in a bedroom setup — the beginning.</div>`;
    } else if(year === 2026){
      block.innerHTML = `<h3>2026</h3><div class="milestone">Present day — new sounds in the works.</div>`;
    } else if(byYear[year]){
      const chips = byYear[year].map(s => `
        <a class="song-chip" href="${ytUrl(s.id)}" target="_blank" rel="noopener">
          <span class="month">${s.month}</span>
          <span class="name">${s.name}</span>
        </a>
      `).join('');
      block.innerHTML = `<h3>${year}</h3><div class="song-row">${chips}</div>`;
    } else {
      return;
    }
    el.appendChild(block);
  });
}

// ---------- Video grid (videos page) ----------
function buildVideoGrid(el){
  if(!el) return;
  el.innerHTML = SONGS.map(s => `
    <a class="video-card reveal" href="${ytUrl(s.id)}" target="_blank" rel="noopener">
      <div class="thumb-wrap">
        <img src="${ytThumb(s.id)}" alt="${s.name}" loading="lazy">
        <div class="play-badge">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </div>
      </div>
      <div class="video-meta">
        <div class="name">${s.name}</div>
        <div class="date">${s.month} ${s.year}</div>
      </div>
    </a>
  `).join('');
}

// ---------- Scroll reveal ----------
function initReveal(){
  const items = document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){
    items.forEach(i => i.classList.add('in-view'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  }, { threshold:0.12 });
  items.forEach(i => io.observe(i));
}

// ---------- Mouse parallax on hero mark (desktop only) ----------
function initParallax(){
  const stage = document.querySelector('.mark-stage');
  const img = document.querySelector('.mark-img');
  if(!stage || !img) return;
  if(!window.matchMedia('(pointer: fine)').matches) return;

  stage.addEventListener('mousemove', (e) => {
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left)/r.width - 0.5;
    const y = (e.clientY - r.top)/r.height - 0.5;
    img.style.transform = `translate(${x*18}px, ${y*18}px) rotate(${x*4}deg)`;
  });
  stage.addEventListener('mouseleave', () => {
    img.style.transform = 'translate(0,0) rotate(0deg)';
  });
}

// ---------- Ambient full-bleed canvas (gives desktop life) ----------
function initAmbientCanvas(){
  const canvas = document.getElementById('ambient-canvas');
  if(!canvas) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  let w, h, dpr;
  let particles = [];

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w*dpr; canvas.height = h*dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const count = Math.max(24, Math.floor((w*h)/34000));
    particles = Array.from({length:count}, () => ({
      x: Math.random()*w,
      y: Math.random()*h,
      r: 0.6 + Math.random()*1.8,
      vx: (Math.random()-0.5)*0.14,
      vy: (Math.random()-0.5)*0.14,
      a: 0.15 + Math.random()*0.35
    }));
  }

  function step(){
    ctx.clearRect(0,0,w,h);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0) p.x = w; if(p.x > w) p.x = 0;
      if(p.y < 0) p.y = h; if(p.y > h) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(23,232,255,${p.a})`;
      ctx.fill();
    });
    // faint connecting lines for nearby particles (only on larger screens for perf)
    if(w > 720){
      for(let i=0;i<particles.length;i++){
        for(let j=i+1;j<particles.length;j++){
          const dx = particles[i].x-particles[j].x;
          const dy = particles[i].y-particles[j].y;
          const dist = Math.sqrt(dx*dx+dy*dy);
          if(dist < 120){
            ctx.strokeStyle = `rgba(23,232,255,${0.06*(1-dist/120)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }
    requestAnimationFrame(step);
  }

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(step);
}

// ---------- Nav active state ----------
function markActiveNav(){
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if(href === path || (path === '' && href === 'index.html')){
      a.classList.add('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  buildWaveform(document.getElementById('waveform'));
  buildTimeline(document.getElementById('timeline'));
  buildVideoGrid(document.getElementById('video-grid'));
  initReveal();
  initParallax();
  initAmbientCanvas();
  markActiveNav();
});
