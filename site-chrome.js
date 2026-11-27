/* Menu mobile commun */
(function(){var ham=document.getElementById('ham'),drawer=document.getElementById('drawer');if(!ham||!drawer)return;
window.closeD=function(){ham.classList.remove('open');drawer.classList.remove('open');ham.setAttribute('aria-expanded','false');document.body.style.overflow='';};
ham.addEventListener('click',function(){var o=drawer.classList.contains('open');if(o){closeD();}else{ham.classList.add('open');drawer.classList.add('open');ham.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';}});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeD();});
var n=document.querySelector('nav');if(n)addEventListener('scroll',function(){n.classList.toggle('scrolled',scrollY>8);},{passive:true});})();
