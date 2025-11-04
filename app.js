// app.js - full client JS
// Data
const skillsData = [
  {name:'Python', icon:'fab fa-python'},
  {name:'Pandas', icon:'fas fa-chart-bar'},
  {name:'NumPy', icon:'fas fa-calculator'},
  {name:'Scikit-Learn', icon:'fas fa-brain'},
  {name:'Java', icon:'fab fa-java'},
  {name:'SQL', icon:'fas fa-database'},
  {name:'Time Series', icon:'fas fa-chart-line'},
  {name:'Monte Carlo', icon:'fas fa-dice'},
  {name:'Risk Mgmt', icon:'fas fa-shield-alt'},
  {name:'Machine Learning', icon:'fas fa-robot'},
  {name:'Fixed Income', icon:'fas fa-chart-area'},
  {name:'Derivatives', icon:'fas fa-project-diagram'},
  {name:'Power BI', icon:'fas fa-chart-pie'},
  {name:'Tableau', icon:'fas fa-chart-bar'},
  {name:'Git', icon:'fab fa-git-alt'},
  {name:'VBA', icon:'fas fa-file-code'}
];

const projectsData = [
  {
    title:'Fixed Income Analytics',
    subtitle:'Yield Curve Modeling & RVA',
    description:'Constructed and calibrated the USD Treasury yield curve using Nelson–Siegel and identified relative value opportunities.',
    details:[{label:'RMSE', value:'4', unit:'bps'},{label:'Model', value:'Nelson-Siegel'},{label:'Forecast R²', value:'>75', unit:'%'}],
    tags:['Python','Quant Modeling','Term Structure'],
    image:'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2000&auto=format&fit=crop'
  },
  {
    title:'Quant Trading Strategy',
    subtitle:'Pairs Trading',
    description:'Developed and backtested a pairs trading strategy on S&P100 equities with strong simulated performance.',
    details:[{label:'Sharpe', value:'1.8'},{label:'Annualized', value:'15', unit:'%'}],
    tags:['Backtest','Algos','Python'],
    image:'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2000&auto=format&fit=crop'
  },
  {
    title:'Options Pricing & Volatility Analysis',
    subtitle:'Black-Scholes & Binomial Models',
    description:'Implemented Black-Scholes-Merton and Binomial Tree models in Python to price European options. Fetched real-market data to calibrate models and analyze implied volatility smiles, identifying potential mispricings.',
    details:[{label:'Models', value:'2'},{label:'Accuracy', value:'98', unit:'%'},{label:'Vol Surface', value:'Interactive'}],
    tags:['Options Pricing','Black-Scholes','Volatility','Python'],
    image:'https://images.unsplash.com/photo-1611289658038-e8b53246400c?q=80&w=2000&auto=format&fit=crop'
  }
];

const experienceData = [
  {
    role:'ML Analyst Intern',
    company:'Intrain Tech',
    date:'Summer 2024',
    description:'Evaluated ML models for loan risk assessment, identifying a Random Forest model that improved default prediction accuracy by 15%. Engineered 5 new features that increased model AUC score from 0.75 to 0.78. Preprocessed and cleaned a dataset of 100,000+ loan applications for model training.',
    logo:'https://via.placeholder.com/48x48/007cf0/ffffff?text=IT'
  },
  {
    role:'Technical Content Writer',
    company:'GeeksForGeeks',
    date:'2023 - Present',
    description:'Authored 10+ technical articles on data structures and Python, accumulating over 200,000 total views with 3 articles featured on the platform\'s homepage.',
    logo:'https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210420155809/gfg-new-logo.png'
  },
  {
    role:'Technical Team Member',
    company:'Google DSC',
    date:'2023 - Present',
    description:'Co-organized 4 technical workshops on Python and Machine Learning, attracting 150+ student attendees. Collaborated in cross-functional team to plan and execute hands-on learning sessions.',
    logo:'https://developers.google.com/community/gdsc/images/gdsc-social-share.png'
  }
];

const certificationsData = [
  {name:'Quant Finance & Algo Trading', issuer:'Udemy', logo:'https://cdn.icon-icons.com/icons2/2699/PNG/512/udemy_logo_icon_170241.png'},
  {name:'IBM Data Science Professional', issuer:'Coursera', logo:'https://cdn.icon-icons.com/icons2/2699/PNG/512/coursera_logo_icon_169315.png'},
  {name:'Microsoft Azure AI Fundamentals', issuer:'Microsoft', logo:'https://cdn.icon-icons.com/icons2/2699/PNG/512/microsoft_azure_logo_icon_168977.png'},
  {name:'Financial Risk Manager (FRM) - Part I', issuer:'GARP', logo:'https://cdn.icon-icons.com/icons2/2699/PNG/512/garp_logo_icon_169315.png'},
  {name:'Bloomberg Market Concepts', issuer:'Bloomberg', logo:'https://cdn.icon-icons.com/icons2/2699/PNG/512/bloomberg_logo_icon_169315.png'}
];

// Helpers
function encodeHTML(s){ return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// Populate
function fillSkills(){ const c=document.getElementById('skills-container'); if(!c) return; c.innerHTML=''; skillsData.forEach(s=>{ const el=document.createElement('div'); el.className='glass-card text-center p-4 reveal'; el.innerHTML=`<i class="${s.icon}"></i><p>${s.name}</p>`; c.appendChild(el); }); }
function fillProjects(){ const g=document.getElementById('projects-grid'); if(!g) return; g.innerHTML=''; projectsData.forEach(p=>{ const wrapper=document.createElement('div'); wrapper.className='project-card h-96 relative reveal'; wrapper.innerHTML=`<div class="project-inner glass-card p-6 relative h-full"><div class="absolute inset-0 bg-cover opacity-10 rounded-lg" style="background-image:url('${p.image}')"></div><div class="relative z-10 flex flex-col h-full"><div><h3 class="text-2xl font-bold text-accent mb-2">${p.title}</h3><p class="text-sm text-gray-300 mb-3">${p.subtitle}</p><p class="text-gray-400 mb-4">${p.description}</p></div><div class="mt-auto"><div class="mb-4"><h4 class="text-lg font-semibold mb-2 text-accent">Key Metrics</h4><div class="grid grid-cols-2 gap-3 text-center">${p.details.map(d=>`<div><p class="text-xl font-bold text-accent">${d.value}${d.unit||''}</p><p class="text-xs text-gray-400">${d.label}</p></div>`).join('')}</div></div><div class="flex flex-wrap gap-2 mb-4">${p.tags.map(t=>`<span class="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">${t}</span>`).join('')}</div><div class="flex justify-between items-center"><span class="text-xs text-gray-400">Click AI to learn more</span><button class="ai-explain-btn bg-accent/20 text-accent px-3 py-1 rounded text-sm hover:bg-accent/30 transition-colors" data-title="${encodeHTML(p.title)}" data-details="${encodeHTML(p.description)}">✨ Ask AI</button></div></div></div></div>`; g.appendChild(wrapper); }); }
function fillExperience(){ const c=document.getElementById('timeline-container'); if(!c) return; c.innerHTML=''; experienceData.forEach(e=>{ c.innerHTML += `<div class="glass-card p-4 flex gap-4 items-start reveal"><img src="${e.logo}" class="h-12 w-12 object-contain rounded bg-white/10 p-1" alt="${e.company} logo"><div><p class="text-sm text-gray-400">${e.date}</p><h3 class="text-lg font-bold text-accent">${e.role}</h3><h4 class="font-semibold mb-2">${e.company}</h4><p class="text-gray-400">${e.description}</p></div></div>`; }); }
function fillCerts(){ const g=document.getElementById('certifications-grid'); if(!g) return; g.innerHTML=''; certificationsData.forEach(c=>{ g.innerHTML += `<div class="glass-card p-4 flex items-center gap-4 reveal"><img src="${c.logo}" class="h-12 w-12 object-contain bg-white/10 p-1 rounded" alt="${c.issuer} logo"><div><h4 class="font-semibold">${c.name}</h4><p class="text-sm text-gray-400">${c.issuer}</p></div></div>`; }); }

// Theme & particles
function initTheme(){ try{ const icon=document.getElementById('theme-icon'); const btn=document.getElementById('theme-toggle'); function apply(){ document.documentElement.classList.toggle('light', localStorage.getItem('theme')==='light'); icon.className = localStorage.getItem('theme')==='light' ? 'fas fa-sun text-xl' : 'fas fa-moon text-xl'; initParticles(); } btn.onclick = ()=>{ localStorage.setItem('theme', localStorage.getItem('theme')==='light' ? 'dark' : 'light'); apply(); }; if(!localStorage.getItem('theme')) localStorage.setItem('theme','dark'); apply(); } catch(e){console.warn(e);} }
function initParticles(){ try{ particlesJS('particles-js', { particles:{ number:{value:50}, size:{value:3}, move:{enable:true, speed:1}, line_linked:{enable:true, color:'#aaa'} }, interactivity:{ events:{ onhover:{ enable:true, mode:'grab' } } } }); } catch(e){ console.warn('particles failed', e); } }

// AI modal + backend
let currentProjectTitle='', currentProjectDetails='';
function openModal(title, details){ currentProjectTitle = title || ''; currentProjectDetails = details || ''; const modal = document.getElementById('ai-modal'); if(!modal) return; document.getElementById('ai-modal-title').textContent = title || 'Project'; document.getElementById('ai-chat-box').innerHTML = ''; addMsg('Hi — ask me about this project.', 'ai'); modal.classList.remove('hidden'); }
function addMsg(text, who){ const box = document.getElementById('ai-chat-box'); if(!box) return; const div = document.createElement('div'); div.className = 'chat-bubble ' + (who==='user'?'user':'ai'); div.textContent = text; box.appendChild(div); box.scrollTop = box.scrollHeight; }
async function callGeminiAPI(userInput){ const resp = await fetch('/api/ai', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ projectTitle: currentProjectTitle, projectDetails: currentProjectDetails, userInput }) }); if(!resp.ok){ const txt = await resp.text().catch(()=>null); throw new Error('API error: ' + (txt || resp.status)); } const data = await resp.json(); return data.reply || 'No reply'; }
async function handleUserMsg(){ const input = document.getElementById('ai-chat-input'); if(!input) return; const text = input.value.trim(); if(!text) return; addMsg(text,'user'); input.value=''; const loading = document.getElementById('ai-loading'); if(loading) loading.classList.remove('hidden'); try{ const reply = await callGeminiAPI(text); addMsg(reply,'ai'); } catch(e){ addMsg('Sorry, AI currently unavailable. Try again later.','ai'); } finally{ if(loading) loading.classList.add('hidden'); } }

// Reveal observer
function initRevealObserver(){ try{ const io = new IntersectionObserver((entries, obs) => { entries.forEach(en => { if(en.isIntersecting){ en.target.classList.add('visible'); obs.unobserve(en.target); } }); }, { threshold: 0.12 }); document.querySelectorAll('.reveal').forEach(el => io.observe(el)); } catch(e){ console.warn('reveal unavailable', e); } }

// Routing & safety
(function makeParticlesNonBlocking(){ const p = document.getElementById('particles-js'); if(p){ p.style.pointerEvents='none'; p.style.zIndex='0'; } })();
function safeShowPage(pageId){ try{ document.querySelectorAll('.page').forEach(p=>p.style.display='none'); const id = pageId && document.getElementById('page-'+pageId) ? pageId : 'home'; const el = document.getElementById('page-'+id); if(el){ el.style.display='block'; el.querySelectorAll('.reveal').forEach(r=>r.classList.add('visible')); } else { const first = document.querySelector('.page'); if(first) first.style.display='block'; } } catch(e){ console.error(e); document.querySelectorAll('.page').forEach(p=>p.style.display='block'); } }
function handleRouteChangeSafe(){ try{ const hash = window.location.hash || '#/home'; const pageId = hash.replace('#/','').replace('/','') || 'home'; safeShowPage(pageId); document.querySelectorAll('.nav-link').forEach(link=>{ let target = link.dataset && link.dataset.page ? link.dataset.page : (link.getAttribute('href')||'').replace('#/','').replace('/',''); if(!target) target = link.textContent.trim().toLowerCase(); link.classList.toggle('text-accent', target===pageId); }); } catch(e){ console.error(e); document.querySelectorAll('.page').forEach(p=>p.style.display='block'); } finally{ const loader = document.getElementById('loader'); if(loader){ loader.style.display='none'; loader.style.visibility='hidden'; } } }
function initNavigation(){ try{ document.querySelectorAll('.page').forEach(p=>p.style.display='none'); document.querySelectorAll('.nav-link').forEach(link=>{ link.addEventListener('click', (e)=>{ const href = link.getAttribute('href')||''; if(href.startsWith('http')||href.startsWith('mailto:')) return; e.preventDefault(); const target = link.dataset && link.dataset.page ? link.dataset.page : (href.replace('#/','').replace('/','') || link.textContent.trim().toLowerCase()); window.location.hash = '/' + target; }); }); window.addEventListener('hashchange', handleRouteChangeSafe); if(!window.location.hash) window.location.hash = '/home'; handleRouteChangeSafe(); } catch(e){ console.error(e); document.querySelectorAll('.page').forEach(p=>p.style.display='block'); } }

// Init
window.addEventListener('load', ()=>{ try{ fillSkills(); fillProjects(); fillExperience(); fillCerts(); initRevealObserver(); try{ new Typed('#typed-text', { strings:['Quantitative Analyst','Financial Modeler','Python Developer'], typeSpeed:40, backSpeed:30, loop:true }); }catch(e){} initNavigation(); initTheme(); initParticles(); const mobileBtn = document.getElementById('mobile-btn'); if(mobileBtn) mobileBtn.onclick = ()=> document.getElementById('mobile-menu').classList.toggle('hidden'); document.body.addEventListener('click', e=>{ const btn = e.target.closest && e.target.closest('.ai-explain-btn'); if(btn) openModal(btn.dataset.title || btn.getAttribute('data-title'), btn.dataset.details || btn.getAttribute('data-details')); }); const modalClose = document.getElementById('ai-modal-close'); if(modalClose) modalClose.onclick = ()=> document.getElementById('ai-modal').classList.add('hidden'); const sendBtn = document.getElementById('ai-chat-send'); if(sendBtn) sendBtn.onclick = handleUserMsg; const chatInput = document.getElementById('ai-chat-input'); if(chatInput) chatInput.addEventListener('keypress', e => { if(e.key==='Enter') handleUserMsg(); }); } catch(e){ console.error('Init error', e); document.querySelectorAll('.page').forEach(p=>p.style.display='block'); } finally{ const loader = document.getElementById('loader'); if(loader) loader.style.display='none'; } });
