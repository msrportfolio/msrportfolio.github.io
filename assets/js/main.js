(function(){
  const storageKey = 'portfolio-theme-v2';
  const viewKey = 'portfolio-view';
  const defaultView = 'projects';
  const body = document.body;
  const root = document.documentElement;
  const themeButtons = Array.from(document.querySelectorAll('.theme-btn'));
  const navLinks = Array.from(document.querySelectorAll('nav a[data-view]'));
  const views = Array.from(document.querySelectorAll('.view-page'));
  const siteNav = document.getElementById('site-nav');
  const menuToggle = document.querySelector('.mobile-menu-toggle');

  function setMobileMenu(open){
    body.classList.toggle('mobile-menu-open', open);
    if(menuToggle){ menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false'); }
  }

  function closeMobileMenu(){
    setMobileMenu(false);
  }

  function applyTheme(theme){
    const safeTheme = theme === 'dark' ? 'dark' : 'light';
    body.setAttribute('data-theme', safeTheme);
    root.setAttribute('data-theme', safeTheme);
    themeButtons.forEach(function(button){
      button.textContent = safeTheme === 'dark' ? 'DARK' : 'LIGHT';
      button.classList.toggle('is-dark', safeTheme === 'dark');
      button.classList.toggle('is-light', safeTheme === 'light');
    });
    try { localStorage.setItem(storageKey, safeTheme); } catch(e) {}
  }

  function applyView(view){
    const safeView = views.some(v => v.dataset.page === view) ? view : defaultView;
    views.forEach(v => {
      if(v.dataset.page === safeView){ v.removeAttribute('hidden'); }
      else { v.setAttribute('hidden', ''); }
    });
    navLinks.forEach(link => {
      if(link.dataset.view === safeView) link.classList.add('active');
      else link.classList.remove('active');
    });
    try { localStorage.setItem(viewKey, safeView); } catch(e) {}
    closeMobileMenu();
    window.scrollTo(0,0);
    document.dispatchEvent(new CustomEvent('portfolio:viewchange', { detail: { view: safeView } }));
  }

  const savedTheme = (() => {
    try { return localStorage.getItem(storageKey); } catch(e) { return null; }
  })();
  const hashViewMap = {
    'accueil': 'about',
    'a-propos': 'about',
    'experience': 'experience',
    'formation': 'experience',
    'projets': 'projects',
    'portfolio': 'projects',
    'contact': 'contact'
  };
  const initialHash = (window.location.hash || '').replace(/^#/, '');

  applyTheme(savedTheme === 'dark' ? 'dark' : 'light');
  applyView(hashViewMap[initialHash] || defaultView);

  themeButtons.forEach(function(button){
    button.addEventListener('click', function(){
      const current = body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  });

  navLinks.forEach(link => {
    link.addEventListener('click', function(e){
      e.preventDefault();
      applyView(link.dataset.view);
    });
  });

  document.querySelectorAll('[data-view-target]').forEach(link => {
    link.addEventListener('click', function(e){
      e.preventDefault();
      const targetView = link.getAttribute('data-view-target');
      if(targetView){ applyView(targetView); }
    });
  });

  if(menuToggle){
    menuToggle.addEventListener('click', function(){
      setMobileMenu(!body.classList.contains('mobile-menu-open'));
    });
  }

  document.addEventListener('click', function(e){
    if(!body.classList.contains('mobile-menu-open')) return;
    if(siteNav && siteNav.contains(e.target)) return;
    if(menuToggle && menuToggle.contains(e.target)) return;
    closeMobileMenu();
  });

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeMobileMenu();
  });
})();

(function(){
  var overlay=document.getElementById('project1-zoom-overlay');
  var panel=document.getElementById('project1-zoom-panel');
  var image=document.getElementById('project1-zoom-image');
  var caption=document.getElementById('project1-zoom-caption');
  var closeBtn=document.getElementById('project1-zoom-close');
  if(!overlay || !panel || !image || !caption || !closeBtn) return;
  var savedScroll=0;
  var activeTrigger=null;
  var triggers=Array.prototype.slice.call(document.querySelectorAll('.project-cards .project-card > .card-media > img, .project-detail img.project-zoom-trigger'));
  function triggerLabel(node){
    var alt=node.getAttribute('alt') || '';
    return document.documentElement.lang === 'en' ? 'Enlarge image: '+alt : 'Agrandir l’image : '+alt;
  }
  function updateTriggerLabels(){
    triggers.forEach(function(node){ node.setAttribute('aria-label',triggerLabel(node)); });
  }
  function imageCaption(node){
    var figure=node.closest ? node.closest('figure') : null;
    var figureCaption=figure ? figure.querySelector('figcaption') : null;
    return node.getAttribute('data-zoom-caption') || node.getAttribute('data-caption') || (figureCaption ? figureCaption.textContent.trim() : '') || node.getAttribute('alt') || '';
  }
  function openZoom(node){
    if(!node) return;
    savedScroll=window.pageYOffset || document.documentElement.scrollTop || 0;
    activeTrigger=node;
    image.src=node.currentSrc || node.getAttribute('src') || '';
    image.alt=node.getAttribute('alt') || '';
    caption.textContent=imageCaption(node);
    caption.hidden=!caption.textContent;
    panel.scrollTop=0;
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden','false');
    document.body.classList.add('project1-zoom-lock');
    requestAnimationFrame(function(){ closeBtn.focus(); });
  }
  function closeZoom(){
    if(!overlay.classList.contains('is-open')) return;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden','true');
    document.body.classList.remove('project1-zoom-lock');
    image.removeAttribute('src');
    window.scrollTo(0, savedScroll);
    if(activeTrigger){
      try { activeTrigger.focus({preventScroll:true}); } catch(e) { activeTrigger.focus(); }
    }
    activeTrigger=null;
  }
  window.project1OpenZoom=openZoom;
  window.project1CloseZoom=closeZoom;
  triggers.forEach(function(node){
    node.classList.add('project-zoom-enabled');
    node.setAttribute('role','button');
    node.setAttribute('tabindex','0');
    node.setAttribute('aria-haspopup','dialog');
    node.addEventListener('click', function(ev){
      ev.preventDefault();
      ev.stopPropagation();
      openZoom(node);
    });
    node.addEventListener('keydown', function(ev){
      if(ev.key !== 'Enter' && ev.key !== ' ') return;
      ev.preventDefault();
      openZoom(node);
    });
  });
  updateTriggerLabels();
  closeBtn.addEventListener('click', function(ev){ ev.preventDefault(); ev.stopPropagation(); closeZoom(); });
  overlay.addEventListener('click', function(ev){ if(ev.target===overlay){ closeZoom(); } });
  panel.addEventListener('click', function(ev){ ev.stopPropagation(); });
  document.addEventListener('keydown', function(ev){
    if(!overlay.classList.contains('is-open')) return;
    if(ev.key==='Escape'){ closeZoom(); }
    else if(ev.key==='Tab'){ ev.preventDefault(); closeBtn.focus(); }
  });
  document.addEventListener('portfolio:languagechange',updateTriggerLabels);
})();

(function(){
  var cardsRoot=document.querySelector('.view-page[data-page="projects"] .project-cards');
  if(cardsRoot){ cardsRoot.classList.remove('is-carousel-ready'); }
})();

(function(){
  var cardsRoot=document.querySelector('.view-page[data-page="formation"] .formation-cards');
  if(!cardsRoot) return;
  var cards=Array.prototype.slice.call(cardsRoot.querySelectorAll(':scope > .card'));
  if(!cards.length) return;
  var perPage=2;
  var totalPages=Math.max(1, Math.ceil(cards.length/perPage));
  cardsRoot.classList.add('is-carousel-ready');
  var track=document.createElement('div');
  track.className='formation-carousel-track';
  for(var i=0;i<totalPages;i++){
    var page=document.createElement('div');
    page.className='formation-carousel-page';
    cards.slice(i*perPage,(i+1)*perPage).forEach(function(card){ page.appendChild(card); });
    track.appendChild(page);
  }
  cardsRoot.innerHTML='';
  cardsRoot.appendChild(track);
  var nav=document.createElement('div');
  nav.className='formation-carousel-nav';
  var prev=document.createElement('button');
  prev.type='button';
  prev.className='formation-carousel-arrow formation-carousel-prev';
  prev.setAttribute('aria-label','Formation precedente');
  prev.innerHTML='&#8249;';
  var dots=document.createElement('div');
  dots.className='formation-carousel-dots';
  var next=document.createElement('button');
  next.type='button';
  next.className='formation-carousel-arrow formation-carousel-next';
  next.setAttribute('aria-label','Formation suivante');
  next.innerHTML='&#8250;';
  nav.appendChild(prev);
  nav.appendChild(dots);
  nav.appendChild(next);
  cardsRoot.insertAdjacentElement('afterend', nav);
  var pageIndex=0;
  var dotButtons=[];
  for(var d=0; d<totalPages; d++){
    var dot=document.createElement('button');
    dot.type='button';
    dot.className='formation-carousel-dot';
    dot.setAttribute('aria-label','Aller a la vue formation '+(d+1));
    (function(index){ dot.addEventListener('click', function(){ goTo(index); }); })(d);
    dots.appendChild(dot);
    dotButtons.push(dot);
  }
  function refresh(){
    track.style.transform='translateX(-'+(pageIndex*100)+'%)';
    prev.disabled=pageIndex===0;
    next.disabled=pageIndex===totalPages-1;
    dotButtons.forEach(function(dot, idx){ dot.classList.toggle('is-active', idx===pageIndex); });
  }
  function goTo(index){
    pageIndex=Math.max(0, Math.min(totalPages-1, index));
    refresh();
  }
  prev.addEventListener('click', function(){ goTo(pageIndex-1); });
  next.addEventListener('click', function(){ goTo(pageIndex+1); });
  refresh();
})();

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const selectors = [
    'header .brand',
    'header .header-signature',
    '.view-page[data-page="about"] .about-profile-section .photo-wrap',
    '.view-page[data-page="about"] .about-profile-section .photo-card',
    '.view-page[data-page="about"] .about-profile-section h1',
    '.view-page[data-page="about"] .about-profile-section .hero-copy > *',
    '.view-page[data-page="about"] .about-profile-section .cta-row',
    '.view-page[data-page="about"] .about-profile-section .stats',
    '.view-page[data-page="about"] .about-profile-section .stats > *',
    '.view-page[data-page="about"] .stack-section .stack-title',
    '.view-page[data-page="about"] .stack-grid .stack-item',
    '.view-page[data-page="about"] .about-story-block .about-story-title',
    '.view-page[data-page="about"] .about-story-block .about-story-copy > div',
    '.view-page[data-page="about"] section.block .section-kicker',
    '.view-page[data-page="about"] section.block .section-title',
    '.view-page[data-page="about"] section.block .section-desc',
    '.view-page[data-page="about"] section.block .shell',
    '.view-page[data-page="about"] .cards .card',
    '.view-page[data-page="about"] .cards .card .card-visual',
    '.view-page[data-page="about"] .cards .card .card-copy',
    '.view-page[data-page="experience"] .section-kicker',
    '.view-page[data-page="experience"] .section-title',
    '.view-page[data-page="experience"] .section-desc',
    '.view-page[data-page="experience"] .cards .card',
    '.view-page[data-page="experience"] .cards .card .card-media',
    '.view-page[data-page="experience"] .cards .card .card-body',
    '.view-page[data-page="experience"] .timeline-shell',
    '.view-page[data-page="experience"] .timeline-item',
    '.view-page[data-page="formation"] .timeline-shell',
    '.view-page[data-page="formation"] .timeline-item',
    '.view-page[data-page="formation"] .section-kicker',
    '.view-page[data-page="formation"] .section-title',
    '.view-page[data-page="formation"] .section-desc',
    '.view-page[data-page="formation"] .shell',
    '.view-page[data-page="formation"] .cards .card',
    '.view-page[data-page="formation"] .cards .card .card-media',
    '.view-page[data-page="formation"] .cards .card .card-body',
    '.view-page[data-page="projects"] .section-kicker',
    '.view-page[data-page="projects"] .section-title',
    '.view-page[data-page="projects"] .project-cards .project-card',
    '.view-page[data-page="projects"] .project-card .card-media',
    '.view-page[data-page="projects"] .project-card .card-body',
    '.view-page[data-page="projects"] .detail-shell',
    '.view-page[data-page="projects"] .detail-gallery',
    '.view-page[data-page="projects"] .detail-gallery img',
    '.view-page[data-page="projects"] .detail-text',
    '.view-page[data-page="projects"] .recommendation-box',
    '.view-page[data-page="experience"] .experience-accomplishments-title',
    '.view-page[data-page="experience"] .accomplishment-item',
    '.view-page .shell > hr'
  ];
  const items = Array.from(document.querySelectorAll(selectors.join(','))).filter((el) => !el.classList.contains('no-scroll-reveal'));
  if (!items.length) return;

  items.forEach((el) => {
    el.classList.add('scroll-reveal');
    if (el.matches('header .brand, header .header-signature, .view-page[data-page="about"] .about-profile-section .photo-wrap, .view-page[data-page="about"] .about-profile-section .photo-card, .view-page[data-page="about"] .stack-grid .stack-item:nth-child(odd), .view-page[data-page="about"] .about-story-block:nth-child(odd) .about-story-title, .view-page[data-page="about"] .about-story-block:nth-child(odd) .about-story-copy > div, .view-page[data-page="about"] .cards .card:nth-child(odd), .view-page[data-page="experience"] .cards .card:nth-child(odd), .view-page[data-page="experience"] .timeline-item:nth-child(odd), .view-page[data-page="experience"] .accomplishment-item:nth-child(odd), .view-page[data-page="formation"] .cards .card:nth-child(odd), .view-page[data-page="formation"] .timeline-item:nth-child(odd), .view-page[data-page="projects"] .project-cards .project-card:nth-child(odd), .view-page[data-page="projects"] .detail-gallery')) {
      el.classList.add('from-left');
    } else if (el.matches('.view-page[data-page="about"] .about-profile-section h1, .view-page[data-page="about"] .about-story-block:nth-child(even) .about-story-title, .view-page[data-page="about"] .about-story-block:nth-child(even) .about-story-copy > div, .view-page[data-page="about"] .cards .card:nth-child(even), .view-page[data-page="experience"] .cards .card:nth-child(even), .view-page[data-page="experience"] .timeline-item:nth-child(even), .view-page[data-page="experience"] .accomplishment-item:nth-child(even), .view-page[data-page="formation"] .cards .card:nth-child(even), .view-page[data-page="formation"] .timeline-item:nth-child(even), .view-page[data-page="projects"] .project-cards .project-card:nth-child(even), .view-page[data-page="projects"] .detail-text')) {
      el.classList.add('from-right');
    }
  });

  if (reduceMotion) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -6% 0px'
  });

  function visibleItemsFor(view) {
    return items.filter((el) => {
      const page = el.closest('.view-page');
      return !page || page.dataset.page === view;
    });
  }

  function replayViewAnimations(view, options) {
    const settings = options || {};
    const activeItems = visibleItemsFor(view);
    if (!activeItems.length) return;
    activeItems.forEach((el, index) => {
      observer.unobserve(el);
      el.classList.remove('is-visible');
      el.style.transitionDelay = Math.min(index * 0.06, 0.54).toFixed(2) + 's';
    });
    const activate = () => {
      activeItems.forEach((el) => observer.observe(el));
    };
    if (settings.immediate) {
      requestAnimationFrame(() => requestAnimationFrame(activate));
      return;
    }
    setTimeout(() => {
      requestAnimationFrame(() => requestAnimationFrame(activate));
    }, settings.delay || 120);
  }

  function replayInitialAbout() {
    const initialView = document.querySelector('.view-page[data-page="about"]:not([hidden])') || document.querySelector('.view-page:not([hidden])');
    if (!initialView) return;
    window.scrollTo(0, 0);
    replayViewAnimations(initialView.dataset.page || 'about', { delay: 180 });
  }

  if (document.readyState === 'complete') {
    replayInitialAbout();
  } else {
    window.addEventListener('load', replayInitialAbout, { once: true });
  }

  document.addEventListener('portfolio:viewchange', function (event) {
    replayViewAnimations((event.detail && event.detail.view) || 'about', { immediate: true });
  });
})();

(function(){
  var intro=document.getElementById('about-intro');
  if(!intro) return;
  var reduceMotion=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function activeAboutView(){
    var view=intro.closest('.view-page');
    return !!view && !view.hasAttribute('hidden');
  }
  function updateAboutIntro(){
    if(!activeAboutView()){
      intro.style.opacity='1';
      intro.style.transform='translate3d(0,0,0) scale(1)';
      intro.style.filter='blur(0px)';
      return;
    }
    if(reduceMotion){
      intro.style.opacity='1';
      intro.style.transform='translate3d(0,0,0) scale(1)';
      intro.style.filter='blur(0px)';
      return;
    }
    var rect=intro.getBoundingClientRect();
    var range=Math.max(intro.offsetHeight * 0.82, 320);
    var progress=Math.min(Math.max(-rect.top / range, 0), 1);
    var eased=1 - Math.pow(1 - progress, 2.2);
    intro.style.opacity=(1 - eased).toFixed(3);
    intro.style.transform='translate3d(0,' + (-28 * eased).toFixed(2) + 'px,0) scale(' + (1 + 0.045 * eased).toFixed(4) + ')';
    intro.style.filter='blur(' + (2.2 * eased).toFixed(2) + 'px)';
  }
  window.addEventListener('scroll', updateAboutIntro, {passive:true});
  window.addEventListener('resize', updateAboutIntro);
  document.addEventListener('portfolio:viewchange', function(){
    requestAnimationFrame(function(){
      requestAnimationFrame(updateAboutIntro);
    });
  });
  if(document.readyState==='complete') updateAboutIntro();
  else window.addEventListener('load', updateAboutIntro, {once:true});
})();
(function(){
  var projectView=document.querySelector('.view-page[data-page="projects"]');
  if(!projectView) return;
  var listView=projectView.querySelector('.project-list-view');
  var details=Array.prototype.slice.call(projectView.querySelectorAll('.project-detail'));
  var openLinks=Array.prototype.slice.call(projectView.querySelectorAll('[data-project-target]'));
  var backLinks=Array.prototype.slice.call(projectView.querySelectorAll('[data-project-back]'));
  if(!details.length || !listView) return;
  function setHash(hash){
    if(!window.history || !window.history.pushState) return;
    window.history.pushState(null, '', hash);
  }
  function showList(updateHash){
    projectView.classList.remove('is-project-detail');
    listView.removeAttribute('hidden');
    details.forEach(function(detail){
      detail.classList.remove('is-active');
      detail.setAttribute('hidden', '');
    });
    if(updateHash) setHash('#portfolio-list');
    window.scrollTo(0,0);
  }
  function showProject(id, updateHash){
    var detail=details.filter(function(item){ return item.id === id; })[0];
    if(!detail) return false;
    projectView.classList.add('is-project-detail');
    listView.setAttribute('hidden', '');
    details.forEach(function(item){
      if(item===detail){
        item.removeAttribute('hidden');
        item.classList.add('is-active');
      } else {
        item.classList.remove('is-active');
        item.setAttribute('hidden', '');
      }
    });
    if(updateHash) setHash('#'+id);
    window.scrollTo(0,0);
    document.dispatchEvent(new CustomEvent('portfolio:projectchange', { detail: { project: id } }));
    return true;
  }
  openLinks.forEach(function(link){
    link.addEventListener('click', function(event){
      if(showProject(link.getAttribute('data-project-target'), true)){
        event.preventDefault();
      }
    });
  });
  projectView.addEventListener('click', function(event){
    var link=event.target.closest ? event.target.closest('[data-project-target]') : null;
    if(!link || !projectView.contains(link) || openLinks.indexOf(link) !== -1) return;
    if(showProject(link.getAttribute('data-project-target'), true)){
      event.preventDefault();
    }
  });
  backLinks.forEach(function(link){
    link.addEventListener('click', function(event){
      event.preventDefault();
      showList(true);
    });
  });
  document.addEventListener('portfolio:viewchange', function(event){
    if(event.detail && event.detail.view === 'projects'){
      showList(false);
    }
  });
  function handleProjectHash(){
    var startId=(location.hash || '').slice(1);
    if(startId && showProject(startId, false)) return;
    if(startId === 'portfolio-list') showList(false);
  }
  if(location.hash){
    handleProjectHash();
  } else {
    showList(false);
  }
  window.addEventListener('hashchange', handleProjectHash);
})();


(function(){
  var frames = Array.prototype.slice.call(document.querySelectorAll('iframe[data-default-powerbi-page]'));
  if(!frames.length) return;
  function sendPage(frame){
    var pageName = frame.getAttribute('data-default-powerbi-page');
    if(!pageName || !frame.contentWindow) return;
    try {
      frame.contentWindow.postMessage(JSON.stringify({ action: 'setPage', pageName: pageName }), '*');
    } catch(e) {}
  }
  frames.forEach(function(frame){
    frame.addEventListener('load', function(){
      setTimeout(function(){ sendPage(frame); }, 900);
      setTimeout(function(){ sendPage(frame); }, 2200);
      setTimeout(function(){ sendPage(frame); }, 4200);
    });
    setTimeout(function(){ sendPage(frame); }, 1800);
    setTimeout(function(){ sendPage(frame); }, 3600);
  });
  document.addEventListener('portfolio:projectchange', function(event){
    if(!event.detail || event.detail.project !== 'projet-analyse-mobilite-rhone-detail') return;
    frames.forEach(function(frame){
      setTimeout(function(){ sendPage(frame); }, 900);
      setTimeout(function(){ sendPage(frame); }, 2200);
    });
  });
})();


(function(){
  const form = document.querySelector('[data-contact-form]');
  if(!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const name = (document.getElementById('contact-name') || {}).value || '';
    const email = (document.getElementById('contact-email') || {}).value || '';
    const message = (document.getElementById('contact-message') || {}).value || '';
    const english = document.documentElement.lang === 'en';
    const subject = encodeURIComponent((english ? 'Message from the portfolio - ' : 'Message depuis le portfolio - ') + (name.trim() || 'Contact'));
    const body = encodeURIComponent(english
      ? 'Name: ' + name.trim() + '\nEmail: ' + email.trim() + '\n\nMessage:\n' + message.trim()
      : 'Nom : ' + name.trim() + '\nEmail : ' + email.trim() + '\n\nMessage :\n' + message.trim());
    window.location.href = 'mailto:mandrindra23@yahoo.fr?subject=' + subject + '&body=' + body;
  });
})();

(function(){
  const languageKey = 'portfolio-language';
  const languageButtons = Array.from(document.querySelectorAll('.language-btn'));
  const htmlEntries = [];
  const attributeEntries = [];

  function addHTML(selector, englishValues){
    const elements = Array.from(document.querySelectorAll(selector));
    if(elements.length !== englishValues.length) return;
    elements.forEach(function(element, index){
      htmlEntries.push({ element: element, fr: element.innerHTML, en: englishValues[index] });
    });
  }

  function addAttribute(selector, attribute, englishValues){
    const elements = Array.from(document.querySelectorAll(selector));
    if(elements.length !== englishValues.length) return;
    elements.forEach(function(element, index){
      attributeEntries.push({
        element: element,
        attribute: attribute,
        fr: element.getAttribute(attribute) || '',
        en: englishValues[index]
      });
    });
  }

  addHTML('.site-nav a[data-view]', ['About', 'Portfolio', 'Experience', 'Contact']);
  addHTML('.about-intro-text', [
    'This portfolio showcases projects in <span class="portfolio-domain-accent">data engineering</span>, finance, <span class="portfolio-domain-accent">data analysis</span>, data visualization, and web development. Each project starts with a specific business need and delivers a <span class="portfolio-domain-accent">clear, practical solution</span>.'
  ]);
  addHTML('.about-profile-section .hero-copy p', [
    'I am <strong>Mandrindra RABEMANANJARA</strong>, a <strong>data consultant</strong> with a background in <strong>finance</strong>. Over the past <strong>eight years</strong>, I have worked in <strong>data-intensive</strong> business environments, building analytical solutions, reports, and decision-support tools that help organizations monitor performance and make better decisions.',
    'I work across the full <strong>data and analytics lifecycle</strong>, from requirements gathering and user-story definition to data modeling, pipeline development, automation, quality assurance, and production deployment. My core tools include <strong>Python</strong> and <strong>SQL</strong>, cloud data platforms such as <strong>Microsoft Fabric</strong>, <strong>AWS</strong>, and <strong>Google Cloud</strong>, and automation tools such as <strong>n8n</strong> and <strong>GitHub Actions</strong>.',
    'My finance experience includes budgeting, month-end and year-end close, forecasting, workforce cost analysis, performance management, and data visualization. I turn <strong>ERP</strong> and <strong>HRIS</strong> data into reliable reports and dashboards using <strong>advanced Excel and VBA</strong>, <strong>Power BI</strong>, <strong>Qlik</strong>, <strong>Looker</strong>, and <strong>MyReport</strong>, with a focus on <strong>accuracy</strong>, <strong>clarity</strong>, and practical <strong>decision support</strong>.'
  ]);
  addHTML('.about-profile-section .cta-row > a:not(.btn-github)', ['✉ Contact Me', 'View My Experience →']);
  addHTML('.stack-section .stack-title', ['Technical Stack', 'Business Tools &amp; ERP Systems']);
  addHTML('.expertise-metric-label span', ['years of experience', 'years of experience', 'years of experience']);

  addHTML('#experience > .section-inner > .section-title', ['Organizations I Have Worked With']);
  addHTML('.experience-company-cards .card-subtitle', [
    'Lyon-Based Foundation Specializing in Mental Health, Disability Services, and Social Care',
    'Public-Interest Foundation Supporting Children, Families, and Vulnerable Adults',
    'Global IT and Business Consulting Company',
    'Global Digital Engineering and Technology Consulting Company',
    'Public-Interest Organization Focused on Asylum, Refugee Support, and Integration',
    'Madagascar’s National Investment Company'
  ]);
  addHTML('.experience-company-cards .card-text', [
    'The ARHM Foundation provides mental health and disability services across the Lyon metropolitan area, the Rhône department, and southern Saône-et-Loire. Its work spans prevention, research, treatment, rehabilitation, and social inclusion, with the goal of improving care and quality of life.',
    'Based in the Rhône department and the Lyon metropolitan area, the ACOLEA Foundation supports vulnerable children, young people, families, and adults through social care, education, and inclusion services.',
    'CGI is one of the world’s largest IT and business consulting firms, helping organizations modernize operations, deliver digital transformation, and improve performance.',
    'Akkodis combines technology expertise, digital engineering, and consulting to help organizations accelerate innovation, digital transformation, and workforce development.',
    'Forum Réfugiés operates in France and internationally, supporting refugees, defending the right to asylum, and promoting the rule of law.',
    'SONAPAR supports economic development in Madagascar through private-equity investments and equity or quasi-equity financing for businesses and growth projects.'
  ]);
  addHTML('.experience-company-cards .company-link', ['Learn More', 'Learn More', 'Learn More', 'Learn More', 'Learn More', 'Learn More']);
  addHTML('.experience-accomplishments-title', ['Selected Achievements']);
  addHTML('.accomplishment-heading', [
    'Post-Merger Integration',
    'Finance Systems Integration',
    'Built a Finance Function',
    'Finance Process Automation',
    'Financial Turnaround and Cash Management',
    'Forecasting and Board Reporting'
  ]);
  addHTML('.accomplishment-copy', [
    'Played an active role in the integration of Modis and Akka Technologies following the merger that created Akkodis. Helped reorganize teams, improve cross-functional collaboration, and establish a more consistent finance and operating model aligned with the new group’s priorities.',
    'Represented Finance during the integration of a billing platform and an ERP system. Led requirements gathering, testing, user acceptance, and functional refinements, while redesigning the management accounting structure to improve reporting accuracy and financial control.',
    'Built a dedicated Finance function to support growth and strengthen performance management. The team grew to three people.',
    'Automated core finance reporting processes, shortening reporting cycles and improving KPI monitoring. The new tools gave management faster access to more reliable performance information.',
    'Helped turn around a loss-making operation and restore profitability. Introduced structured cash-flow forecasting and monitoring that eliminated recurring overdrafts and stabilized liquidity.',
    'Implemented quarterly forecasting and concise board-level reporting, giving directors a clear view of the group’s financial outlook, performance, and strategic priorities.'
  ]);
  addHTML('.formation-integrated-title', ['Education']);
  addHTML('.formation-timeline .timeline-company', [
    'Wild Code School',
    'INSEEC U — Lyon, France',
    'New Jersey City University — New Jersey, United States'
  ]);
  addHTML('.formation-timeline .timeline-role', [
    'Data Engineering and Data Analytics Program',
    'Master’s Degree in Audit and Finance',
    'Bachelor of Science in Finance'
  ]);
  addHTML('.formation-timeline .timeline-project', [
    'Intensive program in data engineering, automation, and analytics, with hands-on work in Python, SQL, Power BI, ETL, Docker, and data visualization.',
    'Coursework focused on performance management, financial analysis, audit, corporate finance, and IFRS.',
    'Coursework focused on financial management, planning, risk, international markets, and U.S. GAAP.'
  ]);
  addHTML('.formation-timeline .timeline-tag', [
    'Python', 'SQL', 'Power BI', 'ETL', 'Docker', 'Machine Learning',
    'Audit', 'Finance', 'Performance', 'Corporate Finance',
    'Finance', 'Risk management', 'U.S. GAAP', 'International Markets'
  ]);
  addHTML('.formation-timeline .timeline-highlight', [
    '<strong>Approach:</strong> Project-based training in data engineering, analytics, and business intelligence.',
    '<strong>Focus:</strong> Audit, financial performance, corporate finance, and IFRS.',
    '<strong>Focus:</strong> International finance, financial management, and U.S. GAAP.'
  ]);
  addHTML('.formation-cards .card-subtitle', [
    'Bachelor of Science in Finance · 2016',
    'Master’s Degree in Audit and Finance · 2018',
    'Data Engineering and Data Analytics Program · 2026'
  ]);
  addHTML('.formation-cards .card-text', [
    'New Jersey City University (NJCU) is a public university in Jersey City, New Jersey, near New York City. Founded in 1927, it offers programs in business, science, education, and professional studies, with an emphasis on applied learning and career preparation. Its location in one of the most diverse cities in the United States provides an international environment and exposure to a wide range of economic and cultural perspectives.',
    'INSEEC is a French business school specializing in management, finance, and marketing. Its career-focused programs are developed in collaboration with employers and emphasize practical approaches to business performance, management, and decision-making. The curriculum combines academic coursework with exposure to real-world business challenges.',
    'Wild Code School provides intensive, career-focused training in technology and data. Its project-based programs combine hands-on work, personalized support, and content aligned with current market needs. The curriculum emphasizes practical skills that can be applied directly in the workplace.'
  ]);
  addHTML('.formation-cards .formation-link', ['Learn More', 'Learn More', 'Learn More']);

  addHTML('.project-cards .card-title', [
    'Automated Train Cancellation Dashboard',
    'Rhône Mobility Analysis',
    'Front-End Development: Multi-View Portfolio Website'
  ]);
  addHTML('.project-cards .card-subtitle', [
    'Data engineering · Microsoft Fabric · GitHub Actions · GitHub Pages',
    'Data Analysis · Power BI · Data Visualization · Python · Open Data',
    'Front-end · GitHub Pages · Vanilla JavaScript · Responsive'
  ]);
  addHTML('.project-cards .card-text', [
    'Built an end-to-end data pipeline for SNCF train cancellation data published on data.gouv.fr, covering ingestion, data quality checks, Bronze/Silver/Gold modeling, and automated daily publication of a web dashboard.',
    'Analyzed mobility patterns across the Rhône department and the Lyon metropolitan area using open data. The project included data preparation in Python, the design of an analytical data model, and a Power BI report focused on travel patterns and geographic concentration.',
    'Developed a responsive, multi-view static portfolio using vanilla HTML, CSS, and JavaScript, and deployed it through GitHub Pages.'
  ]);
  addHTML('.project-cards .project-open-link span', ['Learn More', 'Learn More', 'Learn More']);
  addHTML('.project-card .project-button[href^="https://maxrabemananjara.github.io/"] > span:last-child', ['View Website', 'View Website']);
  addHTML('.project-back-button', ['← Back to Portfolio', '← Back to Portfolio', '← Back to Portfolio']);

  addHTML('.trains-article-header .section-kicker', ['DATA ENGINEERING PROJECT']);
  addHTML('.trains-article-header h1', ['Automated Train Cancellation<br>Monitoring Using<br>Open Data']);
  addHTML('.trains-article-lead', ['Turning raw public data into reliable metrics and publishing them in an interactive web dashboard.']);
  addHTML('.trains-article-meta', ['Project: <strong>Data Engineering / BI / Open Data</strong>']);
  addHTML('.trains-article-section > h2', ['CONTEXT', 'SOLUTION ARCHITECTURE', 'DASHBOARD', 'KEY RESULTS', 'TECHNICAL STACK', 'EXTERNAL LINKS']);
  addHTML('.trains-article-section > p', [
    'Mobility datasets are often publicly available but not ready for analysis. This project uses an open dataset of cancelled trains published on data.gouv.fr. Rather than simply displaying totals, it builds a data pipeline that converts raw files into clean, validated, and reusable data.',
    'The automated pipeline handles data ingestion, schema validation, cleaning, standardization, deduplication, and analytical modeling. A Bronze/Silver/Gold architecture separates raw data from validated and analysis-ready datasets.',
    'Microsoft Fabric hosts the Bronze, Silver, and Gold Lakehouse layers. GitHub Actions automates dashboard updates and deployment, while GitHub Pages hosts the public interface.',
    'The dashboard lets users analyze cancellations by date range, station, and train type, and identify the most affected stations and routes. Visuals show total cancellations, daily trends, breakdowns by train type, and time-of-day patterns.'
  ]);
  addHTML('.trains-article-facts span', ['Source', 'Architecture', 'Publication']);
  addHTML('.trains-article-facts strong', [
    'Public data published on data.gouv.fr',
    'Bronze / Silver / Gold with Microsoft Fabric',
    'Public dashboard hosted on GitHub Pages'
  ]);
  addHTML('.trains-article-figure figcaption', [
    'Project workflow: from open data ingestion to public dashboard deployment.',
    'Web dashboard: KPIs, trends, affected stations, and interactive filters.'
  ]);
  addHTML('.trains-proof-section li', [
    'Converted raw public data into clear business metrics.',
    'Designed a <strong>Bronze/Silver/Gold</strong> architecture that separates raw, validated, and analysis-ready data.',
    'Implemented data quality checks for schema validation, required fields, dates, times, and duplicate records.',
    'Built an analytical model based on fact tables, dimensions, and KPIs.',
    'Published a public web dashboard with automated daily updates.'
  ]);
  addHTML('.trains-links-section .project-button:not(.project-button-secondary)', ['View Dashboard']);

  addHTML('.mobilite-article-header .section-kicker', ['BI PROJECT · DATA ANALYSIS · DATA VISUALIZATION · BUSINESS INSIGHTS']);
  addHTML('.mobilite-article-header h1', ['Turning Public Data into a Power BI Mobility Analysis']);
  addHTML('.mobilite-article-meta', ['Project: <strong>Data Analysis / Data Visualization / Power BI</strong>']);
  addHTML('.mobilite-article-lead', [
    'This project analyzes mobility patterns across the Rhône department and the Lyon metropolitan area using public data. It covers the full workflow, from preparing the data in Python to building an analytical data model and presenting the results in Power BI.',
    'The final report examines three areas: overall travel volume, time-based patterns, and geographic concentration. Technical documentation is available in the GitHub repository for review and reproducibility.'
  ]);
  addHTML('.mobilite-article-section > h2', [
    'PROJECT APPROACH', 'PROCESSING PIPELINE', 'DATA MODEL', 'POWER BI REPORT', 'TECHNICAL STACK', 'CONCLUSION'
  ]);
  addHTML('.mobilite-article-section > p:not(.mobilite-powerbi-caption)', [
    'The project connects Python-based data preparation, Power BI modeling, and business reporting. Each stage has a clear purpose: prepare reliable data, build a coherent model, and present mobility patterns in a format that is easy to explore.',
    'The workflow begins with fragmented public datasets, validates and transforms them in Python, and organizes the prepared data in a Power BI model designed for geographic and mobility analysis.',
    'The prepared data is organized as a data warehouse. Fact tables store trip records, volume measures, weather, and roadwork data, while dimension tables organize dates, municipalities, time bands, geographic areas, stations, and fares.',
    'This structure avoids relying on a single oversized table and gives Power BI clear relationships, consistent filtering, and reliable measures.',
    'The Power BI report includes three pages: an overview, a time-based analysis, and a geographic analysis. The embedded report lets users move between pages while preserving filters and interactions.',
    'The analysis shows that mobility is concentrated around a small number of recurring hubs. Between January and March 2026, the dataset includes 74,795 trips, with the highest volume recorded in March after a slight decline in February.',
    'The most prominent travel flows involve Villeurbanne, Bron, Saint-Priest, Écully, and Bourgoin-Jallieu. The time analysis identifies two peak periods—8:00 a.m. to noon and 4:00 p.m. to 8:00 p.m.—primarily on weekdays.',
    'By consolidating fragmented public datasets, the report helps identify high-traffic areas, understand peak periods, and flag routes for deeper analysis.'
  ]);
  addHTML('.mobilite-step-grid span', ['1 · Python preparation', '2 · Power BI modeling', '3 · Visual storytelling']);
  addHTML('.mobilite-step-grid p', [
    'Collected public datasets, profiled the data, checked row counts, duplicates, missing values, and formats, and added time-based and geographic fields.',
    'Built a constellation model with fact tables, dimensions, technical keys, and consistent relationships to support reliable filtering.',
    'Delivered three report pages—overview, time-based analysis, and geographic analysis—to make the mobility patterns easy to interpret.'
  ]);
  addHTML('.mobilite-article-figure figcaption', [
    'Summary workflow: open sources, Python profiling, data preparation, analytical model and Power BI dashboard.',
    'Power BI model extract: fact tables, dimensions and analytical relationships.'
  ]);
  addHTML('.mobilite-powerbi-caption', ['Interactive Power BI report: overview, time analysis and geographic analysis.']);
  addHTML('.mobilite-tech-grid .stack-name', ['Python', 'Power BI', 'Open Data', 'Data Visualization', 'Data Analysis', 'Business Insights']);

  addHTML('.portfolio-web-article-header h1', ['Front-End Development:<br>Multi-View Portfolio Website']);
  addHTML('.portfolio-web-article-lead', [
    'This project involved designing and developing a personal portfolio website deployed on GitHub Pages. The site presents a professional profile, detailed project case studies, and career experience through clear navigation and a responsive interface.'
  ]);
  addHTML('.portfolio-web-article-meta', ['Project: <strong>Front-end / GitHub Pages / Portfolio</strong>']);
  addHTML('.portfolio-web-article-section > h2', ['CONTEXT', 'TECHNICAL IMPLEMENTATION', 'RESULT', 'TECHNICAL STACK', 'EXTERNAL LINKS']);
  addHTML('.portfolio-web-article-section > p', [
    'The project uses a streamlined technical approach: a fast, maintainable static site with a clear presentation of experience, projects, and achievements.',
    'The site makes it easy for recruiters to explore my experience and projects while demonstrating hands-on front-end skills, including interface structure, content organization, interaction design, integration of external links, dashboards, and project repositories, and deployment without a heavy framework.',
    'The result is a fast, responsive, and maintainable portfolio with a consistent interface for professional experience, project case studies, and external resources. New projects can be added without changing the site’s core architecture.'
  ]);
  addHTML('.portfolio-web-context-summary span', ['FOUNDATION', 'PUBLICATION', 'EXPERIENCE']);
  addHTML('.portfolio-web-context-summary strong', [
    'Vanilla HTML / CSS / JavaScript',
    'GitHub Pages',
    'Responsive · Light/Dark · multi-view'
  ]);
  addHTML('.portfolio-web-article-figure figcaption', [
    'Editorial and technical architecture of the portfolio: internal views, detailed projects and web publication.'
  ]);
  addHTML('.portfolio-web-article-section > ul > li', [
    'Built a complete static website with vanilla HTML5, CSS3, and JavaScript.',
    'Implemented client-side multi-view navigation without full-page reloads.',
    'Created a persistent light/dark theme using CSS variables and local storage.',
    'Implemented a responsive mobile menu.',
    'Designed project cards with dedicated actions for project details, live demos, and GitHub repositories.',
    'Built detailed project case-study pages.',
    'Embedded Power BI reports using iframes.',
    'Deployed on GitHub Pages with no framework or required build step.',
    'Organized local assets, including images, SVG files, backgrounds, and documents.'
  ]);
  addHTML('.portfolio-web-tech-grid .stack-name', [
    'HTML5', 'CSS3', 'Vanilla JavaScript', 'GitHub Pages', 'Power BI iframe', 'Responsive design', 'Light / Dark mode'
  ]);
  addHTML('.portfolio-web-links-section .project-button:not(.project-button-secondary) > span:last-child', ['View Website']);

  addHTML('.contact-form-heading', ['Contact Me']);
  addHTML('.contact-form label', ['Name', 'Email', 'Message']);
  addHTML('.contact-submit', ['Send']);
  addHTML('.model-footer-copy', ['© 2026 Mandrindra Rabemananjara. All rights reserved.']);
  addHTML('.model-footer-nav a', ['About', 'Portfolio', 'Experience', 'Contact']);
  addHTML('.model-footer-title', ['Contact Information']);

  addAttribute('.language-switch', 'aria-label', ['Select Language']);
  addAttribute('.header-signature', 'aria-label', ['Mandrindra Rabemananjara emblem']);
  addAttribute('.header-signature img', 'alt', ['Mandrindra Rabemananjara emblem']);
  addAttribute('.site-nav', 'aria-label', ['Main navigation']);
  addAttribute('.mobile-menu-toggle', 'aria-label', ['Open menu']);
  addAttribute('.about-intro-light', 'alt', ['Connected background image in light mode']);
  addAttribute('.about-intro-dark', 'alt', ['Connected background image in dark mode']);
  addAttribute('.about-profile-section .photo-card img', 'alt', ['Professional portrait of Mandrindra Rabemananjara']);
  addAttribute('.expertise-metrics-grid', 'aria-label', ['Key experience']);
  addAttribute('.accomplishment-icon', 'alt', [
    'Post-Merger Integration',
    'Finance Systems Integration',
    'Built a Finance Function',
    'Finance Process Automation',
    'Financial Turnaround and Cash Management',
    'Forecasting and Board Reporting'
  ]);
  addAttribute('.project-card > .card-media img', 'alt', [
    'Automated Train Cancellation Dashboard',
    'Rhône Mobility Analysis',
    'Front-End Development: Multi-View Portfolio Website'
  ]);
  addAttribute('.trains-article-cover img', 'alt', ['Editorial map, KPIs and delivery pipeline']);
  addAttribute('.trains-article-cover img', 'data-caption', ['Cover image']);
  addAttribute('.trains-article-cover img', 'data-zoom-caption', ['Cover image']);
  addAttribute('.trains-article-figure img[src*="img-trains-supprimes-02"]', 'alt', ['Project workflow: from open data ingestion to public dashboard deployment.']);
  addAttribute('.trains-article-figure img[src*="img-trains-supprimes-02"]', 'data-caption', ['Project workflow: from open data ingestion to public dashboard deployment.']);
  addAttribute('.trains-article-figure img[src*="img-trains-supprimes-02"]', 'data-zoom-caption', ['Project workflow: from open data ingestion to public dashboard deployment.']);
  addAttribute('.trains-article-figure img[src*="img-trains-supprimes-03"]', 'alt', ['Web dashboard: KPIs, trends, affected stations, and interactive filters.']);
  addAttribute('.trains-article-figure img[src*="img-trains-supprimes-03"]', 'data-caption', ['Web dashboard: KPIs, trends, affected stations, and interactive filters.']);
  addAttribute('.trains-article-figure img[src*="img-trains-supprimes-03"]', 'data-zoom-caption', ['Web dashboard: KPIs, trends, affected stations, and interactive filters.']);
  addAttribute('.project-tech-grid', 'aria-label', ['Project technical stack']);
  addAttribute('.trains-links-section .project-github-link', 'aria-label', ['View GitHub']);
  addAttribute('.trains-links-section .project-github-link', 'title', ['View GitHub']);

  addAttribute('.mobilite-article-cover img', 'alt', ['Rhône Mobility Analysis']);
  addAttribute('.mobilite-article-cover img', 'data-caption', ['Rhône Mobility Analysis']);
  addAttribute('.mobilite-article-cover img', 'data-zoom-caption', ['Rhône Mobility Analysis']);
  addAttribute('.mobilite-article-figure img[src*="img-mobilite-rhone-02"]', 'alt', ['Summary workflow: open sources, Python profiling, data preparation, analytical model and Power BI dashboard.']);
  addAttribute('.mobilite-article-figure img[src*="img-mobilite-rhone-02"]', 'data-caption', ['Summary workflow: open sources, Python profiling, data preparation, analytical model and Power BI dashboard.']);
  addAttribute('.mobilite-article-figure img[src*="img-mobilite-rhone-02"]', 'data-zoom-caption', ['Summary workflow: open sources, Python profiling, data preparation, analytical model and Power BI dashboard.']);
  addAttribute('.mobilite-article-figure img[src*="img-mobilite-rhone-03"]', 'alt', ['Power BI model extract: fact tables, dimensions and analytical relationships.']);
  addAttribute('.mobilite-article-figure img[src*="img-mobilite-rhone-03"]', 'data-caption', ['Power BI model extract: fact tables, dimensions and analytical relationships.']);
  addAttribute('.mobilite-article-figure img[src*="img-mobilite-rhone-03"]', 'data-zoom-caption', ['Power BI model extract: fact tables, dimensions and analytical relationships.']);
  addAttribute('.mobilite-powerbi-embed', 'aria-label', ['Interactive Power BI report: Rhône Mobility Analysis']);
  addAttribute('.mobilite-tech-grid', 'aria-label', ['Project technical stack']);

  addAttribute('.portfolio-web-article-cover img', 'alt', ['Front-End Development: Multi-View Portfolio Website']);
  addAttribute('.portfolio-web-article-cover img', 'data-caption', ['Front-End Development: Multi-View Portfolio Website']);
  addAttribute('.portfolio-web-article-cover img', 'data-zoom-caption', ['Front-End Development: Multi-View Portfolio Website']);
  addAttribute('.portfolio-web-article-figure img[src*="img-portfolio-web-02"]', 'alt', ['Portfolio technical stack and workflow']);
  addAttribute('.portfolio-web-article-figure img[src*="img-portfolio-web-02"]', 'data-caption', ['Portfolio technical stack and workflow']);
  addAttribute('.portfolio-web-article-figure img[src*="img-portfolio-web-02"]', 'data-zoom-caption', ['Portfolio technical stack and workflow']);
  addAttribute('.portfolio-web-context-summary', 'aria-label', ['Web portfolio project summary']);
  addAttribute('.portfolio-web-tech-grid', 'aria-label', ['Project technical stack']);
  addAttribute('.portfolio-web-links-section .project-github-link', 'aria-label', ['View GitHub']);
  addAttribute('.portfolio-web-links-section .project-github-link', 'title', ['View GitHub']);
  addAttribute('.contact-form', 'aria-label', ['Contact form']);
  addAttribute('.model-footer-mr', 'aria-label', ['Back to home']);
  addAttribute('.model-footer-emblem', 'aria-label', ['Back to home']);
  addAttribute('.model-footer-nav', 'aria-label', ['Footer navigation']);
  addAttribute('#project1-zoom-panel', 'aria-label', ['Enlarged Project Image']);
  addAttribute('#project1-zoom-close', 'aria-label', ['Close zoom']);
  addAttribute('.formation-carousel-prev', 'aria-label', ['Previous education slide']);
  addAttribute('.formation-carousel-next', 'aria-label', ['Next education slide']);
  addAttribute('.formation-carousel-dot', 'aria-label', ['Go to education slide 1', 'Go to education slide 2']);

  function applyLanguage(language){
    const safeLanguage = language === 'en' ? 'en' : 'fr';
    document.documentElement.lang = safeLanguage;
    document.body.setAttribute('data-language', safeLanguage);
    htmlEntries.forEach(function(entry){
      entry.element.innerHTML = safeLanguage === 'en' ? entry.en : entry.fr;
    });
    attributeEntries.forEach(function(entry){
      entry.element.setAttribute(entry.attribute, safeLanguage === 'en' ? entry.en : entry.fr);
    });
    document.querySelectorAll('[data-lang-src-fr][data-lang-src-en]').forEach(function(image){
      image.setAttribute('src', image.getAttribute(safeLanguage === 'en' ? 'data-lang-src-en' : 'data-lang-src-fr'));
    });
    languageButtons.forEach(function(button){
      const active = button.getAttribute('data-language') === safeLanguage;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    try { localStorage.setItem(languageKey, safeLanguage); } catch(e) {}
    document.dispatchEvent(new CustomEvent('portfolio:languagechange', { detail: { language: safeLanguage } }));
  }

  let savedLanguage = 'fr';
  try { savedLanguage = localStorage.getItem(languageKey) === 'en' ? 'en' : 'fr'; } catch(e) {}
  applyLanguage(savedLanguage);

  languageButtons.forEach(function(button){
    button.addEventListener('click', function(){
      applyLanguage(button.getAttribute('data-language'));
    });
  });
})();
