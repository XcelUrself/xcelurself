/* Menu mobile commun */
(function(){var ham=document.getElementById('ham'),drawer=document.getElementById('drawer');if(!ham||!drawer)return;
window.closeD=function(){ham.classList.remove('open');drawer.classList.remove('open');ham.setAttribute('aria-expanded','false');document.body.style.overflow='';};
ham.addEventListener('click',function(){var o=drawer.classList.contains('open');if(o){closeD();}else{ham.classList.add('open');drawer.classList.add('open');ham.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';}});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeD();});
var n=document.querySelector('nav');if(n)addEventListener('scroll',function(){n.classList.toggle('scrolled',scrollY>8);},{passive:true});})();
/* Retours et plaisir discrets : liens externes annoncés, apparition au défilement, chiffre qui se compte */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('a[target="_blank"]').forEach(function(a){
    if(a.getAttribute('aria-label')||a.querySelector('.sr'))return;
    var s=document.createElement('span');s.className='sr';s.textContent=' (s\'ouvre dans un nouvel onglet)';a.appendChild(s);
  });
  if(!document.documentElement.classList.contains('js')||!('IntersectionObserver' in window))return;
  var sel=['.paths .path','.say blockquote','.logos li','.band .card','.steps li','.quotes blockquote','.fq','.about','.hero .shot','.blegend li','.cta-band .c > *'];
  var els=[];sel.forEach(function(q){document.querySelectorAll(q).forEach(function(e,i){if(e.classList.contains('rv'))return;e.classList.add('rv');e.style.transitionDelay=(Math.min(i,5)*70)+'ms';els.push(e);});});
  function fmt(n){return n.toLocaleString('fr-FR');}
  function count(el){
    var to=+el.getAttribute('data-count'),pre=el.getAttribute('data-prefix')||'',suf=el.getAttribute('data-suffix')||'',dec=+(el.getAttribute('data-dec')||0),t0=null,d=1200;
    var f=function(v){return pre+v.toLocaleString('fr-FR',{minimumFractionDigits:dec,maximumFractionDigits:dec})+suf;};
    if(reduce){el.textContent=f(to);return;}
    (function step(t){t0=t0||t;var p=Math.min((t-t0)/d,1),e=1-Math.pow(1-p,3);el.textContent=f(to*e);if(p<1)requestAnimationFrame(step);else el.textContent=f(to);})(performance.now());
  }
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;e.target.classList.add('in');io.unobserve(e.target);var c=e.target.querySelector('[data-count]')||(e.target.matches('[data-count]')?e.target:null);if(c&&!c.dataset.done){c.dataset.done=1;count(c);}});},{threshold:.12});
  els.forEach(function(e){io.observe(e);});
  document.querySelectorAll('.proof b[data-count]').forEach(function(b){io.observe(b);});
  setTimeout(function(){els.forEach(function(e){e.classList.add('in');});},3500);  /* filet de sécurité */
})();

/* Carrousels d'avis : fondu, flèches, points, clavier et balayage, sans lecture automatique */
(function(){
  document.querySelectorAll('[data-car]').forEach(function(c){
    var s=[].slice.call(c.querySelectorAll('.car-s'));if(s.length<2)return;
    c.classList.add('js-car');var i=0;
    var nav=document.createElement('div');nav.className='car-nav';
    var prev=document.createElement('button');prev.type='button';prev.className='car-b';prev.setAttribute('aria-label','Avis précédent');prev.textContent='←';
    var cnt=document.createElement('span');cnt.className='car-n';cnt.setAttribute('aria-live','polite');
    var next=document.createElement('button');next.type='button';next.className='car-b';next.setAttribute('aria-label','Avis suivant');next.textContent='→';
    var dots=document.createElement('div');dots.className='car-dots';
    var ds=s.map(function(_,k){var d=document.createElement('button');d.type='button';d.className='car-d';d.setAttribute('aria-label','Avis '+(k+1));d.addEventListener('click',function(){go(k);});dots.appendChild(d);return d;});
    nav.appendChild(prev);nav.appendChild(cnt);nav.appendChild(next);nav.appendChild(dots);c.appendChild(nav);
    var tr=c.querySelector('.car-track');function fit(){tr.style.height=s[i].offsetHeight+'px';}
    function go(n){i=(n+s.length)%s.length;s.forEach(function(x,k){x.classList.toggle('on',k===i);x.setAttribute('aria-hidden',k===i?'false':'true');});ds.forEach(function(d,k){d.classList.toggle('on',k===i);});cnt.textContent=(i+1)+' / '+s.length;fit();}
    prev.addEventListener('click',function(){go(i-1);});next.addEventListener('click',function(){go(i+1);});
    c.setAttribute('tabindex','0');c.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){go(i-1);}if(e.key==='ArrowRight'){go(i+1);}});
    var x0=null;c.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;},{passive:true});
    c.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40)go(i+(dx<0?1:-1));x0=null;});
    addEventListener('resize',function(){fit();});go(0);
  });
})();
