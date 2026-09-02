// SMZ Zürich: hash router + language toggle
(function(){
  var routes=['home','jugend','teams','trainings','kalender','verein','kontakt','mitglied'];
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
  var saved='de';try{saved=localStorage.getItem('smz-lang')||'de'}catch(e){}
  setLang(saved);
  route();
})();
