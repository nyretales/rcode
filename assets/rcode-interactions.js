(()=>{
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Recreate the original floating glass-nav hover indicator without the old site hydration bundle.
  document.querySelectorAll('header nav, nav[aria-label="Menu"]').forEach(nav=>{
    const indicator=nav.querySelector(':scope > span[aria-hidden="true"]');
    const links=[...nav.querySelectorAll('a')];
    if(!indicator||!links.length)return;
    const moveTo=(link)=>{
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
    nav.addEventListener('pointerleave',()=>{indicator.style.opacity='0'});
    nav.addEventListener('focusout',e=>{if(!nav.contains(e.relatedTarget))indicator.style.opacity='0'});
  });
  // Phone mockup carousel: keeps the original layered 3D presentation, with empty content slots.
  const car=document.querySelector('.ph-car');
  if(car){
    const phones=[...car.querySelectorAll('.ph-phone')];
    let active=0;
    const render=()=>phones.forEach((phone,i)=>{
      let d=(i-active+phones.length)%phones.length;
      if(d>phones.length/2)d-=phones.length;
      phone.dataset.slot=Math.abs(d)<=2?String(d):'far';
      phone.setAttribute('aria-hidden',d===0?'false':'true');
    });
    render();
    if(!reduce&&phones.length>1)setInterval(()=>{active=(active+1)%phones.length;render()},4200);
  }
  // Progressive reveal fallback for browsers without scroll-driven animations.
  if(!CSS.supports('animation-timeline:view()')){
    const items=[...document.querySelectorAll('.reveal')];
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('rcode-visible');io.unobserve(e.target)}}),{threshold:.08});
    items.forEach(x=>io.observe(x));
  }
  // Keep anchor navigation smooth and respect reduced-motion preference.
  if(!reduce)document.documentElement.style.scrollBehavior='smooth';
})();
