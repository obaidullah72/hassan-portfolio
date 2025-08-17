(function(){
  const tabs = Array.from(document.querySelectorAll('.sk-tab'));
  const panels = {
    web: document.getElementById('panel-web'),
    design: document.getElementById('panel-design'),
    mobile: document.getElementById('panel-mobile'),
    marketing: document.getElementById('panel-marketing')
  };
  const idMap = { 'tab-web':'web', 'tab-design':'design', 'tab-mobile':'mobile', 'tab-marketing':'marketing' };
  const section = document.getElementById('skillsSection');

  function targetWidth(el){
    // read the inline custom prop like style="--w:75%"
    const w = getComputedStyle(el).getPropertyValue('--w').trim();
    return w || '70%';
  }

  function animateFill(el){
    // reset to 0, force reflow, then set to target so transition runs
    el.style.width = '0px';
    void el.offsetWidth;                 // reflow
    requestAnimationFrame(()=>{ el.style.width = targetWidth(el); });
  }
  function resetFill(el){ el.style.width = '0px'; }

  function animatePanel(panel){
    panel.querySelectorAll('.sk-fill').forEach(animateFill);
  }
  function resetPanel(panel){
    panel.querySelectorAll('.sk-fill').forEach(resetFill);
  }

  function activate(key){
    tabs.forEach(t => t.setAttribute('aria-selected', idMap[t.id]===key ? 'true' : 'false'));
    Object.entries(panels).forEach(([k,p])=>{
      const show = k===key;
      p.setAttribute('aria-hidden', show ? 'false' : 'true');
      if(show && section.classList.contains('sk-in')) animatePanel(p);
      else resetPanel(p);
    });
  }

  tabs.forEach(tab=>{
    tab.addEventListener('click', ()=> activate(idMap[tab.id]));
    tab.addEventListener('keydown', e=>{
      const i = tabs.indexOf(tab);
      if(e.key==='ArrowRight'){ (tabs[i+1]||tabs[0]).focus(); }
      if(e.key==='ArrowLeft'){ (tabs[i-1]||tabs[tabs.length-1]).focus(); }
    });
  });

  // Reveal on scroll, then animate the visible panel
  const io = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        section.classList.add('sk-in');
        const current = document.querySelector('.sk-panel[aria-hidden="false"]');
        if(current) animatePanel(current);
        io.disconnect();
      }
    });
  }, { threshold: 0.15 });
  io.observe(section);
  // Add after your existing IntersectionObserver
const cards = document.querySelectorAll('.sk-card');
const cardObserver = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('sk-in');
      cardObserver.unobserve(entry.target);
    }
  });
},{threshold:0.2});
cards.forEach(c=>cardObserver.observe(c));


  // Init
  activate('web');
})();