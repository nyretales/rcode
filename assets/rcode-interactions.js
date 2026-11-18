(()=>{
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Recreate the floating glass-nav hover indicator.
  document.querySelectorAll('header nav, nav[aria-label="Menu"]').forEach(nav=>{
    const indicator=nav.querySelector(':scope > span[aria-hidden="true"]');
    const links=[...nav.querySelectorAll('a')];
    if(!indicator||!links.length)return;
    const moveTo=link=>{
      const n=nav.getBoundingClientRect(),r=link.getBoundingClientRect();
      indicator.style.width=r.width+'px';
      indicator.style.transform=`translateX(${r.left-n.left}px)`;
      indicator.style.opacity='1';
    };
    links.forEach(link=>{
      link.addEventListener('pointerenter',()=>moveTo(link));
      link.addEventListener('focus',()=>moveTo(link));
      link.addEventListener('click',()=>moveTo(link));
    });
    nav.addEventListener('pointerleave',()=>indicator.style.opacity='0');
    nav.addEventListener('focusout',e=>{if(!nav.contains(e.relatedTarget))indicator.style.opacity='0'});
  });

  // Layered 3D phone carousel with swipe, drag, and automatic movement.
  const car=document.querySelector('.ph-car');
  if(car){
    const phones=[...car.querySelectorAll('.ph-phone')];
    let active=0,startX=0,startY=0,pointerId=null,dragging=false,lastChange=0;
    const render=()=>phones.forEach((phone,i)=>{
      let d=(i-active+phones.length)%phones.length;
      if(d>phones.length/2)d-=phones.length;
      phone.dataset.slot=Math.abs(d)<=2?String(d):'far';
      phone.setAttribute('aria-hidden',d===0?'false':'true');
    });
    const step=dir=>{active=(active+dir+phones.length)%phones.length;lastChange=Date.now();render()};
    render();
    const start=e=>{
      if(e.pointerType==='mouse'&&e.button!==0)return;
      pointerId=e.pointerId;startX=e.clientX;startY=e.clientY;dragging=false;
      try{car.setPointerCapture(pointerId)}catch{}
    };
    const move=e=>{
      if(pointerId===null||e.pointerId!==pointerId)return;
      const dx=e.clientX-startX,dy=e.clientY-startY;
      if(Math.abs(dx)>9&&Math.abs(dx)>Math.abs(dy)*1.15){dragging=true;car.classList.add('is-dragging');}
    };
    const end=e=>{
      if(pointerId===null||e.pointerId!==pointerId)return;
      const dx=e.clientX-startX,dy=e.clientY-startY;
      if(Math.abs(dx)>38&&Math.abs(dx)>Math.abs(dy)*1.15)step(dx<0?1:-1);
      pointerId=null;dragging=false;car.classList.remove('is-dragging');
    };
    car.addEventListener('pointerdown',start,{passive:true});
    car.addEventListener('pointermove',move,{passive:true});
    car.addEventListener('pointerup',end,{passive:true});
    car.addEventListener('pointercancel',end,{passive:true});
    car.addEventListener('lostpointercapture',()=>{pointerId=null;dragging=false;car.classList.remove('is-dragging')});
    // Keyboard support for desktop and assistive technology.
    car.tabIndex=0;car.setAttribute('role','group');car.setAttribute('aria-label','R•CODE project preview carousel. Swipe or use arrow keys.');
    car.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();step(1)}if(e.key==='ArrowLeft'){e.preventDefault();step(-1)}});
    if(!reduce&&phones.length>1){
      let timer=setInterval(()=>{if(pointerId===null&&Date.now()-lastChange>3600)step(1)},5200);
      document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInterval(timer)}else{clearInterval(timer);timer=setInterval(()=>{if(pointerId===null&&Date.now()-lastChange>3600)step(1)},5200)}});
    }
  }
  // Reveal fallback for browsers without scroll-driven animations.
  if(!CSS.supports('animation-timeline:view()')){
    const items=[...document.querySelectorAll('.reveal')];
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('rcode-visible');io.unobserve(e.target)}}),{threshold:.08});
    items.forEach(x=>io.observe(x));
  }
  if(!reduce)document.documentElement.style.scrollBehavior='smooth';
})();
