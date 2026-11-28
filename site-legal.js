/* Pied de page : les mentions légales se déplient à la demande */
(function(){
  var t=document.querySelector('.ft-toggle'),l=document.getElementById('legal');if(!t||!l)return;
  function set(o){t.setAttribute('aria-expanded',o?'true':'false');l.hidden=!o;t.querySelector('span').textContent=o?'–':'+';}
  t.addEventListener('click',function(){set(l.hidden);});
  function fromHash(){if(/^#legal-/.test(location.hash)){set(true);var e=document.querySelector(location.hash);if(e)e.scrollIntoView();}}
  fromHash();addEventListener('hashchange',fromHash);
})();
