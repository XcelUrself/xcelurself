/* Simulateur de licence : moteur repris de la page de simulation (5 questions, récapitulatif en direct, formule recommandée) */
(function(){
  var FORM_URL='https://tally.so/r/LDPZVG';
  var CONTACT='mr.grosj@gmail.com';
  function mail(subject,body){return 'mailto:'+CONTACT+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);}
  function dest(subject,body,params){
    if(!FORM_URL) return mail(subject,body);
    var q=Object.keys(params||{}).filter(function(k){return params[k]!==undefined&&params[k]!=='';}).map(function(k){return encodeURIComponent(k)+'='+encodeURIComponent(params[k]);}).join('&');
    return FORM_URL+(q?(FORM_URL.indexOf('?')>-1?'&':'?')+q:'');
  }
  function openNew(a){if(FORM_URL){a.target='_blank'; a.rel='noopener';}}
  /* Grille tarifaire HT (feuille « Grille » du simulateur de licence) */
  var P={p5:125,p10:220,p25:450,session:290,sessionMax:15,annuelle:990,devisAuDela:100};
  /* ---- Sélecteur de licence ---- */
  var main=document.getElementById('pk-main'); if(!main) return;
  var back=document.getElementById('pk-back'), bars=document.querySelectorAll('.prog i'), liveBox=document.getElementById('pk-live');
  var LBL={type:{ind:"Formateur indépendant",of:"Organisme de formation",cfa:"CFA ou école",ent:"Entreprise (formation interne)",res:"Réseau ou revendeur"},
    dur:{'3':"3 mois",'6':"6 mois",'12':"12 mois",plus:"Plus de 12 mois"},
    cadre:{un:"Un seul site",multi:"Plusieurs sites",revente:"Mis à disposition d'autres structures"},
    xl:{pc:"Windows, Excel 2021 ou Microsoft 365",pc19:"Windows, Excel 2019",old:"Windows, Excel 2016 ou plus ancien",mac:"Mac",web:"Excel en ligne",nsp:"Je ne sais pas"}};
  var Q=[
    {k:'type',t:"Qui êtes-vous ?",o:[['ind',"Formateur indépendant",""],['of',"Organisme de formation",""],['cfa',"CFA ou école",""],['ent',"Entreprise","Formation interne"],['res',"Réseau ou revendeur","Plusieurs structures"]]},
    {k:'vol',t:"Combien de stagiaires souhaitez-vous évaluer sur la durée de la licence ?",num:true},
    {k:'dur',t:"Sur quelle durée ?",o:[['3',"3 mois","Une promotion"],['6',"6 mois",""],['12',"12 mois","Une année de formation"],['plus',"Plus de 12 mois",""]]},
    {k:'cadre',t:"Comment utiliserez-vous les fichiers ?",o:[['un',"Sur un seul site","Pour vos propres stagiaires"],['multi',"Sur plusieurs sites","Plusieurs lieux de formation"],['revente',"Mis à disposition d'autres structures","Revente ou partage"]]},
    {k:'xl',t:"Quelle version d'Excel utilisent vos stagiaires ?",o:[['pc',"Windows, Excel 2021 ou Microsoft 365",""],['pc19',"Windows, Excel 2019","Édition dédiée"],['old',"Windows, Excel 2016 ou plus ancien",""],['mac',"Mac",""],['web',"Excel en ligne",""],['nsp',"Je ne sais pas",""]]}
  ];
  var A={}, step=0;
  function el(tag,cls,html){var e=document.createElement(tag); if(cls) e.className=cls; if(html!==undefined) e.innerHTML=html; return e;}
  function fmt(n){return new Intl.NumberFormat('fr-FR').format(n);}
  function setProg(){bars.forEach(function(b,i){b.classList.toggle('on',i<step);}); back.hidden=(step===0); live();}
  function focusOn(sel){var t=main.querySelector(sel); if(t){t.setAttribute('tabindex','-1'); t.focus({preventScroll:true});}}

  /* meilleur assemblage de packs de 25, 10 et 5 pour couvrir V stagiaires (même logique que le simulateur) */
  function packs(V){
    var best=null, maxE=Math.ceil(V/25), maxF=Math.ceil(V/10);
    for(var e=0;e<=maxE;e++) for(var f=0;f<=maxF;f++){
      var g=Math.max(0,Math.ceil((V-25*e-10*f)/5)), cap=25*e+10*f+5*g;
      if(cap<V) continue;
      var cost=e*P.p25+f*P.p10+g*P.p5;
      if(!best||cost<best.cost||(cost===best.cost&&cap<best.cap)) best={e:e,f:f,g:g,cost:cost,cap:cap};
    }
    var parts=[]; if(best.e) parts.push(best.e+' pack'+(best.e>1?'s':'')+' de 25'); if(best.f) parts.push(best.f+' pack'+(best.f>1?'s':'')+' de 10'); if(best.g) parts.push(best.g+' pack'+(best.g>1?'s':'')+' de 5');
    return {price:best.cost,label:parts.join(' + '),cap:best.cap};
  }
  function plan(a){
    var V=a.vol, why=[];
    if(a.type==='res') why.push("Un réseau ou un revendeur");
    if(a.cadre==='revente') why.push("Une mise à disposition à d'autres structures");
    if(a.cadre==='multi') why.push("Plusieurs sites");
    if(a.dur==='plus') why.push("Une durée de plus de 12 mois");
    if(V>P.devisAuDela) why.push("Plus de "+P.devisAuDela+" stagiaires par an");
    if(why.length) return {devis:true,why:why};
    var opts=[], pk=packs(V);
    opts.push({name:'Packs de stagiaires',price:pk.price,detail:pk.label+' · '+pk.cap+' stagiaires · valables 12 mois'});
    opts.push({name:'Licence annuelle',price:P.annuelle,detail:'Stagiaires illimités, un site · 12 mois'});
    if((a.dur==='3')&&V<=P.sessionMax) opts.push({name:'Session de 3 mois',price:P.session,detail:'Une promotion, '+P.sessionMax+' stagiaires au plus'});
    opts.sort(function(x,y){return x.price-y.price;});
    return {devis:false,main:opts[0],other:opts[1]};
  }

  /* récapitulatif en direct : on voit ses réponses et une première estimation dès le nombre de stagiaires */
  function live(){
    liveBox.textContent='';
    var items=[]; if(A.type) items.push(LBL.type[A.type]); if(A.vol) items.push(A.vol+' stagiaire'+(A.vol>1?'s':'')); if(A.dur) items.push(LBL.dur[A.dur]); if(A.cadre) items.push(LBL.cadre[A.cadre]); if(A.xl) items.push(LBL.xl[A.xl]);
    if(!items.length||step>=Q.length){liveBox.hidden=true; return;}
    liveBox.hidden=false;
    liveBox.appendChild(el('p','live-k','Votre sélection'));
    var ul=el('ul'); items.forEach(function(t){ul.appendChild(el('li','',t));}); liveBox.appendChild(ul);
    if(A.vol){
      var r=plan(Object.assign({dur:'12',cadre:'un'},A));
      var est=r.devis?"Offre sur devis probable":"Estimation : "+fmt(r.main.price)+" € HT";
      liveBox.appendChild(el('p','est',est+'<small>'+(r.devis?"Selon vos prochaines réponses.":"Affinée par les questions suivantes.")+'</small>'));
    }
  }

  function renderQ(){
    var q=Q[step]; main.textContent='';
    var w=el('div','pin');
    w.appendChild(el('p','qstep','Question '+(step+1)+' sur '+Q.length));
    var h=el('h3','qt',q.t); h.id='pk-q'; w.appendChild(h);
    if(q.num){
      var row=el('div','numrow'), inp=el('input','num'); inp.type='number'; inp.min='1'; inp.max='5000'; inp.inputMode='numeric'; inp.id='pk-num'; inp.value=A.vol||'';
      inp.setAttribute('aria-labelledby','pk-q'); row.appendChild(inp);
      var ok=el('button','btn btn-primary','Continuer'); ok.type='button'; row.appendChild(ok); w.appendChild(row);
      var chips=el('div','chips'); chips.setAttribute('aria-label','Valeurs courantes');
      [5,10,15,25,50,100].forEach(function(n){var c=el('button','chip',String(n)); c.type='button'; c.addEventListener('click',function(){inp.value=n; inp.focus();}); chips.appendChild(c);});
      w.appendChild(chips);
      var go=function(){var v=parseInt(inp.value,10); if(!(v>=1)){inp.focus(); return;} A.vol=Math.min(v,5000); step++; step<Q.length?renderQ():renderRes(); setProg();};
      ok.addEventListener('click',go); inp.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault(); go();}});
    }else{
      var g=el('div','opts'); g.setAttribute('role','group'); g.setAttribute('aria-labelledby','pk-q');
      q.o.forEach(function(o){
        var b=el('button','opt','<b>'+o[1]+'</b>'+(o[2]?'<small>'+o[2]+'</small>':'')); b.type='button'; b.setAttribute('aria-pressed',A[q.k]===o[0]?'true':'false');
        b.addEventListener('click',function(){A[q.k]=o[0]; step++; step<Q.length?renderQ():renderRes(); setProg();});
        g.appendChild(b);
      });
      w.appendChild(g);
    }
    main.appendChild(w); setProg(); if(step>0) focusOn('.qt');
  }

  function compat(){
    var m={
      pc:null,
      pc19:"Excel 2019 : l'édition dédiée est fournie. Elle ne contient pas les questions qui demandent les fonctions FILTRE, UNIQUE et TRIER (138 questions au lieu de 145).",
      old:"Excel 2016 ou plus ancien n'est pas pris en charge : la simulation demande Excel 2021 ou Microsoft 365 (ou Excel 2019 avec l'édition dédiée).",
      mac:"Sur Mac, le fonctionnement reste à confirmer : demandez-moi avant de commander. La simulation est conçue pour Excel sous Windows.",
      web:"Excel en ligne n'est pas pris en charge : vos stagiaires doivent ouvrir les fichiers dans l'application Excel.",
      nsp:"Vérifiez la version d'Excel de vos stagiaires avant de commander : Excel 2021 ou Microsoft 365 sous Windows (Excel 2019 avec l'édition dédiée)."
    };
    return m[A.xl]||null;
  }
  function recap(reco){return "Bonjour Joffrey,\n\nVoici ma situation :\n- Structure : "+LBL.type[A.type]+"\n- Stagiaires : "+A.vol+"\n- Durée : "+LBL.dur[A.dur]+"\n- Utilisation : "+LBL.cadre[A.cadre]+"\n- Excel : "+LBL.xl[A.xl]+"\n- Formule recommandée : "+reco+"\n\nOrganisme : \nNom et fonction : \nTéléphone : \n\nMerci !";}
  function cta(label,evt,subject,reco){var a=el('a','btn btn-primary',label); a.href=dest(subject,recap(reco),{origine:'selecteur',structure:LBL.type[A.type],stagiaires:A.vol,duree:LBL.dur[A.dur],usage:LBL.cadre[A.cadre],excel:LBL.xl[A.xl],formule:reco}); openNew(a); a.setAttribute('data-umami-event',evt); return a;}

  function renderRes(){
    var r=plan(A), w=el('div','res pin'); main.textContent='';
    if(r.devis){
      w.appendChild(el('p','k','Ma recommandation'));
      w.appendChild(el('h3','','Une offre sur devis'));
      w.appendChild(el('p','','Votre situation sort de la grille standard : '+r.why.map(function(x){return x.charAt(0).toLowerCase()+x.slice(1);}).join(', ')+'. Nous construisons ensemble une offre adaptée (volume, sites, durée, fichiers à votre nom).'));
      var act=el('div','actions'); act.appendChild(cta('Demander un devis','Orga : demande devis','Demande de devis : Simulation Excel','Offre sur devis')); w.appendChild(act);
    }else{
      var m=r.main;
      w.appendChild(el('p','k','Recommandé pour '+A.vol+' stagiaire'+(A.vol>1?'s':'')));
      w.appendChild(el('h3','',m.name));
      w.appendChild(el('p','price',fmt(m.price)+' €<small>HT</small>'));
      w.appendChild(el('p','',m.detail+'.'));
      var ul=el('ul'); ['Licence au nom de votre organisme','Simulation complète, test de positionnement et tableau de bord formateur','Mises à jour et assistance par e-mail pendant la licence'].forEach(function(t){ul.appendChild(el('li','',t));}); w.appendChild(ul);
      if(r.other) w.appendChild(el('p','alt-line','Autre option : '+r.other.name+', '+fmt(r.other.price)+' € HT ('+r.other.detail.toLowerCase()+').'));
      var act2=el('div','actions'); act2.appendChild(cta('Demander cette licence','Orga : demande licence','Demande de licence : Simulation Excel',m.name+' ('+fmt(m.price)+' € HT)')); w.appendChild(act2);
    }
    var c=compat(); if(c) w.appendChild(el('p','warn',c));
    w.appendChild(el('p','alt-line','Pas encore décidé ? <a href="simulation-excel-organismes.html#pilote" style="color:#fff">Essayez d\'abord le test gratuitement</a>.'));
    var rs=el('button','linkbtn','Recommencer'); rs.type='button'; rs.addEventListener('click',function(){A={}; step=0; renderQ(); focusOn('.qt');});
    var ra=el('div','actions'); ra.appendChild(rs); w.appendChild(ra);
    main.appendChild(w); setProg(); focusOn('h3');
  }
  back.addEventListener('click',function(){ if(step>0) step--; renderQ(); focusOn('.qt'); });
  renderQ();
  window.__licence={plan:function(a){return plan(Object.assign({},a));}};

})();
