/* Mentions légales repliées sur mobile */
(function(){
  var legal=document.getElementById('mentions-legales');if(!legal)return;
  var wrap=document.createElement('div');wrap.id='legal-wrap';legal.parentNode.insertBefore(wrap,legal);
  var n=legal;while(n&&!(n.classList&&n.classList.contains('footer-copy'))){var nx=n.nextElementSibling;wrap.appendChild(n);n=nx;}
  var t=document.createElement('button');t.type='button';t.id='legal-toggle';t.setAttribute('aria-expanded','false');t.setAttribute('aria-controls','legal-wrap');t.textContent='Mentions légales, CGV et confidentialité';
  wrap.parentNode.insertBefore(t,wrap);
  function set(o){t.setAttribute('aria-expanded',o?'true':'false');wrap.classList.toggle('open',o);}
  t.addEventListener('click',function(){set(t.getAttribute('aria-expanded')!=='true');});
  document.querySelectorAll('a[href="#mentions-legales"],a[href="#cgv"],a[href="#confidentialite"]').forEach(function(a){a.addEventListener('click',function(){set(true);});});
})();
