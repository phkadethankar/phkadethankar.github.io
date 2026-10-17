/* Piyush H. Kadethankar · site behaviour: theme toggle, menu, hero network, journey map, timeline filters, copy buttons. */
(function(){
  var root=document.documentElement;
  var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  try{var saved=localStorage.getItem("phk-theme");if(saved==="dark"||saved==="light")root.setAttribute("data-theme",saved);}catch(e){}
  document.getElementById("themeBtn").addEventListener("click",function(){
    var cur=root.getAttribute("data-theme");
    if(!cur){cur=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}
    var next=cur==="dark"?"light":"dark";
    root.setAttribute("data-theme",next);
    try{localStorage.setItem("phk-theme",next);}catch(e){}
    readColors();
  });

  /* nav */
  var menuBtn=document.getElementById("menuBtn"),list=document.getElementById("navlist");
  function setMenu(open){list.classList.toggle("open",open);menuBtn.setAttribute("aria-expanded",open?"true":"false");menuBtn.setAttribute("aria-label",open?"Close menu":"Open menu");}
  menuBtn.addEventListener("click",function(){setMenu(!list.classList.contains("open"));});
  list.addEventListener("click",function(e){if(e.target.closest("a"))setMenu(false);});
  document.addEventListener("keydown",function(e){if(e.key==="Escape")setMenu(false);});

  /* the field: two poles and the economies between them */
  var cv=document.getElementById("field"),ctx=cv.getContext("2d"),W=0,H=0,dpr=1,nodes=[],poles=[],t0=performance.now(),running=false,visible=true;
  var mouse={x:-9999,y:-9999,on:false},shocks=[],C={};
  function readColors(){var s=getComputedStyle(root);C.a=s.getPropertyValue("--brass").trim();C.b=s.getPropertyValue("--steel").trim();C.m=s.getPropertyValue("--hero-ink").trim();C.hi=s.getPropertyValue("--brass-hi").trim();var h=s.getPropertyValue("--hero-bg").trim().replace("#","");if(h.length===6)C.bg=parseInt(h.slice(0,2),16)+","+parseInt(h.slice(2,4),16)+","+parseInt(h.slice(4,6),16);if(!running)draw();}
  function rnd(a,b){return a+Math.random()*(b-a);}
  function layout(){
    var narrow=W<760;
    poles=[{bx:narrow?W*.8:W*.55,by:narrow?H*.94:H*.66,x:0,y:0,ph:0},{bx:narrow?W*.9:W*.9,by:narrow?H*.06:H*.3,x:0,y:0,ph:Math.PI}];
    var n=Math.round(Math.max(46,Math.min(120,W*H/8200)));
    nodes=[];
    for(var i=0;i<n;i++){
      var r=Math.random(),aff=r<.36?rnd(0,.18):r<.72?rnd(.82,1):rnd(.32,.68);
      nodes.push({aff:aff,mid:aff>.3&&aff<.7,ang:rnd(0,Math.PI*2),rad:aff>.3&&aff<.7?rnd(10,Math.min(W,H)*.22):rnd(18,Math.min(W,H)*.2),spd:rnd(.00008,.00028)*(Math.random()<.5?-1:1),x:rnd(0,W),y:rnd(0,H),vx:0,vy:0,s:aff>.3&&aff<.7?rnd(1.8,3.2):rnd(1.4,2.6)});
    }
  }
  function size(){var r=cv.getBoundingClientRect();dpr=Math.min(2,window.devicePixelRatio||1);W=Math.max(1,r.width);H=Math.max(1,r.height);cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);layout();if(reduce){for(var k=0;k<260;k++)step(16,k*16);draw();}}
  function step(dt,time){
    poles.forEach(function(p,i){p.x=p.bx+Math.cos(time*.00021+p.ph)*W*.035;p.y=p.by+Math.sin(time*.00017+p.ph)*H*.06;});
    var A=poles[0],B=poles[1];
    nodes.forEach(function(n){
      n.ang+=n.spd*dt;
      var hx=A.x+(B.x-A.x)*n.aff+Math.cos(n.ang)*n.rad,hy=A.y+(B.y-A.y)*n.aff+Math.sin(n.ang)*n.rad*.8;
      var fx=(hx-n.x)*.0016,fy=(hy-n.y)*.0016;
      if(mouse.on){var dx=mouse.x-n.x,dy=mouse.y-n.y,d=Math.sqrt(dx*dx+dy*dy)+.01;var reach=n.mid?260:150;if(d<reach){var f=(n.mid?.06:.018)*(1-d/reach);fx+=dx/d*f;fy+=dy/d*f;}}
      shocks.forEach(function(s){var dx=n.x-s.x,dy=n.y-s.y,d=Math.sqrt(dx*dx+dy*dy)+.01;if(Math.abs(d-s.r)<40){var f=1.4*s.life;fx+=dx/d*f;fy+=dy/d*f;}});
      n.vx=(n.vx+fx*dt*.06)*.93;n.vy=(n.vy+fy*dt*.06)*.93;n.x+=n.vx*dt*.06;n.y+=n.vy*dt*.06;
    });
    shocks.forEach(function(s){s.r+=dt*.45;s.life-=dt*.0012;});shocks=shocks.filter(function(s){return s.life>0;});
  }
  function col(n){return n.mid?C.m:(n.aff<.5?C.a:C.b);}
  function draw(){
    if(!W)return;
    ctx.clearRect(0,0,W,H);
    var i,j,a,b,dx,dy,d,max=Math.min(118,W*.11);
    ctx.lineWidth=1;
    for(i=0;i<nodes.length;i++){a=nodes[i];for(j=i+1;j<nodes.length;j++){b=nodes[j];dx=a.x-b.x;dy=a.y-b.y;d=dx*dx+dy*dy;if(d<max*max){ctx.globalAlpha=(1-Math.sqrt(d)/max)*.32;ctx.strokeStyle=(a.mid||b.mid)?C.hi:(a.aff<.5?C.a:C.b);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}}}
    poles.forEach(function(p,k){var c=k?C.b:C.a;nodes.forEach(function(n){if((k===0&&n.aff<.18)||(k===1&&n.aff>.82)){ctx.globalAlpha=.12;ctx.strokeStyle=c;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(n.x,n.y);ctx.stroke();}});});
    if(mouse.on){nodes.forEach(function(n){dx=n.x-mouse.x;dy=n.y-mouse.y;d=Math.sqrt(dx*dx+dy*dy);if(d<170){ctx.globalAlpha=(1-d/170)*.7;ctx.strokeStyle=C.hi;ctx.beginPath();ctx.moveTo(mouse.x,mouse.y);ctx.lineTo(n.x,n.y);ctx.stroke();}});ctx.globalAlpha=.9;ctx.fillStyle=C.hi;ctx.beginPath();ctx.arc(mouse.x,mouse.y,3.2,0,7);ctx.fill();}
    shocks.forEach(function(s){ctx.globalAlpha=Math.max(0,s.life)*.6;ctx.strokeStyle=C.hi;ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,7);ctx.stroke();ctx.lineWidth=1;});
    nodes.forEach(function(n){ctx.globalAlpha=n.mid?.95:.8;ctx.fillStyle=col(n);ctx.beginPath();ctx.arc(n.x,n.y,n.s,0,7);ctx.fill();});
    poles.forEach(function(p,k){var c=k?C.b:C.a;ctx.globalAlpha=.16;ctx.fillStyle=c;ctx.beginPath();ctx.arc(p.x,p.y,34,0,7);ctx.fill();ctx.globalAlpha=1;ctx.strokeStyle=c;ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,p.y,15,0,7);ctx.stroke();ctx.fillStyle=c;ctx.beginPath();ctx.arc(p.x,p.y,6.5,0,7);ctx.fill();ctx.lineWidth=1;});
    ctx.globalAlpha=1;
    if(C.bg){var g=W>=760?ctx.createLinearGradient(0,0,W*.62,0):null;if(g){g.addColorStop(0,"rgba("+C.bg+",.82)");g.addColorStop(.7,"rgba("+C.bg+",.45)");g.addColorStop(1,"rgba("+C.bg+",0)");ctx.fillStyle=g;}else{ctx.fillStyle="rgba("+C.bg+",.5)";}ctx.fillRect(0,0,W,H);}
  }
  var last=performance.now();
  function frame(now){if(!running)return;var dt=Math.min(40,now-last);last=now;step(dt,now-t0);draw();requestAnimationFrame(frame);}
  function start(){if(reduce||running||!visible||document.hidden)return;running=true;last=performance.now();requestAnimationFrame(frame);}
  function stop(){running=false;}
  readColors();size();
  if(!reduce){for(var k=0;k<420;k++)step(16,k*16);t0-=420*16;}
  draw();start();
  window.addEventListener("resize",function(){size();draw();});
  document.addEventListener("visibilitychange",function(){document.hidden?stop():start();});
  if("IntersectionObserver" in window){new IntersectionObserver(function(e){visible=e[0].isIntersecting;visible?start():stop();}).observe(cv);}
  var hero=cv.parentNode;
  hero.addEventListener("pointermove",function(e){var r=cv.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;mouse.on=e.pointerType==="mouse";if(reduce)draw();});
  hero.addEventListener("pointerleave",function(){mouse.on=false;if(reduce)draw();});
  hero.addEventListener("pointerdown",function(e){if(e.target.closest("a,button"))return;var r=cv.getBoundingClientRect();shocks.push({x:e.clientX-r.left,y:e.clientY-r.top,r:4,life:1});});
  if(window.matchMedia){var mqd=window.matchMedia("(prefers-color-scheme: dark)");if(mqd.addEventListener)mqd.addEventListener("change",readColors);}

  /* journey filters, year markers and map link */
  var chips=document.querySelectorAll(".chip"),stops=document.querySelectorAll(".stop"),items=document.querySelectorAll("#timeline > li");
  function syncYears(){var mark=null,any=false;items.forEach(function(li){if(li.classList.contains("yr")){if(mark)mark.hidden=!any;mark=li;any=false;}else if(!li.hidden){any=true;}});if(mark)mark.hidden=!any;}
  chips.forEach(function(c){c.addEventListener("click",function(){
    var f=c.getAttribute("data-filter");
    chips.forEach(function(o){o.setAttribute("aria-pressed",o===c?"true":"false");});
    stops.forEach(function(s){s.hidden=!(f==="all"||s.getAttribute("data-type")===f);});
    syncYears();
  });});
  /* journey map: zoom and pan inside a locked frame, hover notes, scroll link */
  var map=document.getElementById("map"),box=map.parentNode,pins=[].slice.call(map.querySelectorAll(".pin")),tip=document.getElementById("map-tip"),hint=document.getElementById("map-hint"),mq=window.matchMedia("(max-width: 640px)");
  var MAX=6,base,view,raf=null,current=null,hotPlace=null,pinned=null;
  function baseBox(){return mq.matches?{x:140,y:60,w:790,h:470}:{x:0,y:0,w:1000,h:560};}
  function clampView(v){
    v.w=Math.max(base.w/MAX,Math.min(base.w,v.w));v.h=v.w*base.h/base.w;
    v.x=Math.max(base.x,Math.min(base.x+base.w-v.w,v.x));v.y=Math.max(base.y,Math.min(base.y+base.h-v.h,v.y));return v;
  }
  function apply(){
    map.setAttribute("viewBox",view.x.toFixed(2)+" "+view.y.toFixed(2)+" "+view.w.toFixed(2)+" "+view.h.toFixed(2));
    var z=base.w/view.w;
    pins.forEach(function(p){var x=p.getAttribute("data-x"),y=p.getAttribute("data-y");p.setAttribute("transform","translate("+x+" "+y+") scale("+(1/z).toFixed(4)+") translate("+(-x)+" "+(-y)+")");});
    map.classList.toggle("zoomed",z>1.01);
    if(pinned)placeTip(pinned);
  }
  function reset(){base=baseBox();view={x:base.x,y:base.y,w:base.w,h:base.h};apply();}
  function animateTo(target){
    clampView(target);
    if(reduce){view=target;apply();return;}
    cancelAnimationFrame(raf);var from={x:view.x,y:view.y,w:view.w,h:view.h},t0=performance.now();
    (function tick(now){var k=Math.min(1,(now-t0)/260),e=1-Math.pow(1-k,3);
      view={x:from.x+(target.x-from.x)*e,y:from.y+(target.y-from.y)*e,w:from.w+(target.w-from.w)*e,h:from.h+(target.h-from.h)*e};apply();
      if(k<1)raf=requestAnimationFrame(tick);})(t0);
  }
  function zoomed(f,cx,cy){var nw=Math.max(base.w/MAX,Math.min(base.w,view.w/f)),k=nw/view.w;return {x:cx-(cx-view.x)*k,y:cy-(cy-view.y)*k,w:nw,h:nw*base.h/base.w};}
  function toSvg(cx,cy){var r=map.getBoundingClientRect();return {x:view.x+(cx-r.left)/r.width*view.w,y:view.y+(cy-r.top)/r.height*view.h};}
  function used(){if(hint)hint.classList.add("gone");}
  reset();
  if(mq.addEventListener)mq.addEventListener("change",reset);
  window.addEventListener("resize",function(){if(pinned)placeTip(pinned);});

  document.getElementById("zin").addEventListener("click",function(){used();animateTo(zoomed(1.7,view.x+view.w/2,view.y+view.h/2));});
  document.getElementById("zout").addEventListener("click",function(){animateTo(zoomed(1/1.7,view.x+view.w/2,view.y+view.h/2));});
  document.getElementById("zreset").addEventListener("click",function(){animateTo({x:base.x,y:base.y,w:base.w,h:base.h});});
  map.addEventListener("wheel",function(e){if(!(e.ctrlKey||e.metaKey))return;e.preventDefault();used();var p=toSvg(e.clientX,e.clientY);view=clampView(zoomed(Math.exp(-e.deltaY*.0025),p.x,p.y));apply();},{passive:false});
  map.addEventListener("dblclick",function(e){if(e.target.closest(".pin"))return;e.preventDefault();used();var p=toSvg(e.clientX,e.clientY);animateTo(zoomed(e.shiftKey?1/2:2,p.x,p.y));});

  var ptrs=new Map(),last=null,moved=0;
  map.addEventListener("pointerdown",function(e){
    ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});moved=0;
    if(ptrs.size===2||map.classList.contains("zoomed")){try{map.setPointerCapture(e.pointerId);}catch(err){}map.classList.add("dragging");}
  });
  map.addEventListener("pointermove",function(e){
    if(!ptrs.has(e.pointerId))return;
    var prev=ptrs.get(e.pointerId),r=map.getBoundingClientRect();ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(ptrs.size===2){used();var a=[].slice.call(ptrs.values()),d1=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);
      if(last){var m=toSvg((a[0].x+a[1].x)/2,(a[0].y+a[1].y)/2);view=clampView(zoomed(d1/last,m.x,m.y));apply();}last=d1;moved+=10;e.preventDefault();return;}
    if(map.classList.contains("zoomed")){var dx=e.clientX-prev.x,dy=e.clientY-prev.y;moved+=Math.abs(dx)+Math.abs(dy);
      view.x-=dx/r.width*view.w;view.y-=dy/r.height*view.h;clampView(view);apply();}
  });
  function up(e){ptrs.delete(e.pointerId);if(ptrs.size<2)last=null;if(!ptrs.size)map.classList.remove("dragging");}
  map.addEventListener("pointerup",up);map.addEventListener("pointercancel",up);

  /* hover notes and timeline link */
  function placeTip(p){
    var b=p.querySelector(".badge").getBoundingClientRect(),o=box.getBoundingClientRect();
    tip.innerHTML="<strong>"+p.getAttribute("data-title")+"</strong>"+p.getAttribute("data-note");
    var x=b.left+b.width/2-o.left,y=b.top-o.top;
    tip.style.left=Math.max(90,Math.min(o.width-90,x))+"px";tip.style.top=y+"px";
    tip.classList.toggle("below",y<70);if(y<70)tip.style.top=(b.bottom-o.top)+"px";
    tip.classList.add("show");
  }
  function light(place){
    map.classList.toggle("has-active",!!place);
    pins.forEach(function(p){p.classList.toggle("active",p.getAttribute("data-place")===place);});
  }
  function hot(p){
    hotPlace=p.getAttribute("data-place");light(hotPlace);placeTip(p);
    stops.forEach(function(s){s.classList.toggle("linked",s.getAttribute("data-place")===hotPlace);});
  }
  function cool(){
    hotPlace=null;pinned=null;tip.classList.remove("show");
    stops.forEach(function(s){s.classList.remove("linked");});
    light(current?current.getAttribute("data-place"):null);
  }
  pins.forEach(function(p){
    p.addEventListener("pointerenter",function(e){if(e.pointerType==="mouse"&&!pinned)hot(p);});
    p.addEventListener("pointerleave",function(e){if(e.pointerType==="mouse"&&!pinned)cool();});
    p.addEventListener("focus",function(){hot(p);});
    p.addEventListener("blur",function(){cool();});
    p.addEventListener("click",function(e){if(moved>6)return;e.stopPropagation();if(pinned===p){cool();return;}pinned=null;hot(p);pinned=p;});
    p.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();var x=+p.getAttribute("data-x"),y=+p.getAttribute("data-y");used();animateTo(zoomed(base.w/view.w<3?3/(base.w/view.w):1,x,y));}});
  });
  map.addEventListener("click",function(e){if(!e.target.closest(".pin")&&pinned&&moved<6)cool();});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&pinned)cool();});

  function mark(stop){
    if(stop===current)return;
    if(current)current.classList.remove("active");
    current=stop;
    if(stop)stop.classList.add("active");
    if(!hotPlace)light(stop?stop.getAttribute("data-place"):null);
  }
  stops.forEach(function(s){s.addEventListener("mouseenter",function(){mark(s);});});
  if("IntersectionObserver" in window){
    var io=new IntersectionObserver(function(entries){entries.forEach(function(en){if(en.isIntersecting)mark(en.target);});},{rootMargin:"-45% 0px -50% 0px"});
    stops.forEach(function(s){io.observe(s);});
    new IntersectionObserver(function(entries){entries.forEach(function(en){if(!en.isIntersecting)mark(null);});},{threshold:0}).observe(document.getElementById("timeline"));
  }

  /* copy buttons */
  function copyText(text,btn,label){
    function ok(){btn.textContent="Copied";setTimeout(function(){btn.textContent=label;},1600);}
    function fallback(){var src=btn.closest(".ref,.line").querySelector(".cite,a");var r=document.createRange();r.selectNodeContents(src);var s=window.getSelection();s.removeAllRanges();s.addRange(r);btn.textContent="Selected, press copy";setTimeout(function(){btn.textContent=label;},2200);}
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(ok,fallback);}else{fallback();}
  }
  document.querySelectorAll("[data-copy]").forEach(function(b){b.addEventListener("click",function(){copyText(b.closest(".ref").querySelector(".cite").textContent.trim(),b,"Copy citation");});});
  document.querySelectorAll("[data-email]").forEach(function(b){b.addEventListener("click",function(){copyText(b.getAttribute("data-email"),b,"Copy");});});
})();
