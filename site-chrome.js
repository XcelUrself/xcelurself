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
    var to=+el.getAttribute('data-count'),pre=el.getAttribute('data-prefix')||'',t0=null,d=1100;
    if(reduce){el.textContent=pre+fmt(to);return;}
    (function step(t){t0=t0||t;var p=Math.min((t-t0)/d,1),e=1-Math.pow(1-p,3);el.textContent=pre+fmt(Math.round(to*e));if(p<1)requestAnimationFrame(step);})(performance.now());
  }
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;e.target.classList.add('in');io.unobserve(e.target);var c=e.target.querySelector('[data-count]')||(e.target.matches('[data-count]')?e.target:null);if(c&&!c.dataset.done){c.dataset.done=1;count(c);}});},{threshold:.12});
  els.forEach(function(e){io.observe(e);});
  document.querySelectorAll('.proof b[data-count]').forEach(function(b){io.observe(b);});
  setTimeout(function(){els.forEach(function(e){e.classList.add('in');});},3500);  /* filet de sécurité */
})();
