// SMZ Zürich: hash router + language toggle
(function(){
  var routes=['home','jugend','teams','wasserball','trainings','kalender','verein','kontakt','mitglied'];
  function route(){
    var h=(location.hash||'#/').replace('#/','').split('?')[0]||'home';
    if(routes.indexOf(h)<0)h='home';
    routes.forEach(function(r){var p=document.getElementById('page-'+r);if(p)p.classList.toggle('show',r===h)});
    document.querySelectorAll('.menu a').forEach(function(a){a.classList.toggle('active',a.getAttribute('data-route')===h)});
    document.getElementById('menu').classList.remove('open');
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
  var saved='de';try{saved=localStorage.getItem('smz-lang')||'de'}catch(e){}
  setLang(saved);
  route();
})();
