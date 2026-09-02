// SMZ Zürich: hash router + language toggle
(function(){
  var routes=['home','jugend','teams','wasserball','trainings','kalender','verein','kontakt','mitglied'];
  function route(){
    var h=(location.hash||'#/').replace('#/','').split('?')[0]||'home';
    if(routes.indexOf(h)<0)h='home';
    routes.forEach(function(r){var p=document.getElementById('page-'+r);if(p)p.classList.toggle('show',r===h)});
    document.querySelectorAll('.menu a').forEach(function(a){a.classList.toggle('active',a.getAttribute('data-route')===h)});
    document.getElementById('menu').classList.remove('open');
    if(typeof closeLb==='function'&&lb&&!lb.hidden)closeLb();
    window.scrollTo({top:0,behavior:'instant'});
  }
  window.addEventListener('hashchange',route);
  window.setLang=function(l){
    document.body.setAttribute('data-lang',l);
    document.documentElement.setAttribute('lang',l);
    document.getElementById('lang-de').classList.toggle('on',l==='de');
    document.getElementById('lang-en').classList.toggle('on',l==='en');
    try{localStorage.setItem('smz-lang',l)}catch(e){}
  };
  // Wasserball page: age group finder. Age in the current calendar year, result blocks live in the HTML.
  window.smzGroup=function(f){
    var v=f.dob.value;if(!v)return;
    var age=new Date().getFullYear()-parseInt(v.slice(0,4),10);
    var k=age<6?'early':age<=7?'u10':age<=10?'u10plus':age<=12?'u12':age===13?'u14':age<=15?'u16':age<=17?'u18':'adult';
    f.querySelectorAll('[data-grp]').forEach(function(p){p.hidden=p.getAttribute('data-grp')!==k});
  };
  // faces marquee: click a photo for the large view
  var lb=document.getElementById('lightbox'),lbImg=document.getElementById('lb-img'),
      lbCap=document.getElementById('lb-cap'),lbClose=document.getElementById('lb-close'),lastFocus=null;
  function openLb(btn){
    var img=btn.querySelector('img');
    lbImg.src=img.getAttribute('src'); lbImg.alt=img.getAttribute('alt')||'';
    lbCap.innerHTML='<span lang="de">'+btn.dataset.de+'</span><span lang="en">'+btn.dataset.en+'</span>';
    lastFocus=document.activeElement; lb.hidden=false; lbClose.focus();
    document.body.style.overflow='hidden';
  }
  function closeLb(){
    lb.hidden=true; lbImg.src=''; document.body.style.overflow='';
    if(lastFocus&&lastFocus.focus)lastFocus.focus();
  }
  document.addEventListener('click',function(e){
    var btn=e.target.closest&&e.target.closest('.face');
    if(btn){openLb(btn);return;}
    if(e.target===lb||e.target===lbClose)closeLb();
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!lb.hidden)closeLb();});

  var saved='de';try{saved=localStorage.getItem('smz-lang')||'de'}catch(e){}
  setLang(saved);
  route();
})();
