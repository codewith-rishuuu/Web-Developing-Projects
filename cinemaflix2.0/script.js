const movies = [
  {title:"The Fast & The Furious", year:2001, genre:"action", g:"Action", rating:"7.3", img:"https://i.pinimg.com/736x/00/b4/69/00b469fc87bb4e85202f0631a14c9065.jpg", desc:"Undercover cop Brian infiltrates the world of illegal street racing.", link:"https://youtu.be/ZsJz2TJAPjw"},
  {title:"The Godfather", year:1972, genre:"classic", g:"Crime", rating:"9.2", img:"https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg", desc:"The aging patriarch of a crime dynasty transfers control to his son.", link:"https://youtu.be/UaVTIH8mujA"},
  {title:"Scarface", year:1983, genre:"classic", g:"Crime", rating:"8.3", img:"https://image.tmdb.org/t/p/w500/iQ5ztdjvteGeboxtmRdXEChJOHh.jpg", desc:"A Cuban immigrant rises to power in Miami's drug scene.", link:"https://youtu.be/cv276Wg3e7I"},
  {title:"Titanic", year:1997, genre:"romance", g:"Romance", rating:"7.9", img:"https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg", desc:"A love story unfolds aboard the doomed R.M.S. Titanic.", link:"https://youtu.be/kVrqfYjkTdQ"},
  {title:"The Notebook", year:2004, genre:"romance", g:"Romance", rating:"7.8", img:"https://image.tmdb.org/t/p/w500/rNzQyW4f8B8cQeg7Dgj3n6eT5k9.jpg", desc:"A poor young man falls in love with a rich young woman.", link:"https://youtu.be/BjJcYdEOI0k"},
  {title:"La La Land", year:2016, genre:"romance", g:"Musical", rating:"8.0", img:"https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg", desc:"A jazz musician and an actress fall in love in Los Angeles.", link:"https://youtu.be/0pdqf4P9MB8"},
  {title:"500 Days of Summer", year:2009, genre:"romance", g:"Rom-Com", rating:"7.7", img:"https://image.tmdb.org/t/p/w500/f9mbM0YMLpYemcWx6o2WeiYQLDP.jpg", desc:"An offbeat look at a relationship that didn't quite work out.", link:"https://youtu.be/PsD0NpFSADM"},
  {title:"Mr. & Mrs. Smith", year:2005, genre:"action", g:"Action", rating:"6.5", img:"https://i.pinimg.com/736x/48/66/89/486689c40c2f4cde19a8f16c7614f781.jpg", desc:"Two bored spouses discover they're both secret assassins.", link:"https://youtu.be/CZ0B22z22pI"},
  {title:"No Time to Die", year:2021, genre:"action", g:"Action", rating:"7.3", img:"https://image.tmdb.org/t/p/w500/iUgygt3fscRoKWCV1d0C7FbM9TP.jpg", desc:"James Bond is pulled out of retirement for one last mission.", link:"https://youtu.be/BIhNsAtPbPI"},
  {title:"Dev D", year:2009, genre:"bolly", g:"Drama", rating:"7.9", img:"https://i.pinimg.com/736x/f8/38/9f/f8389f3611f6ade6083a168abc294fb5.jpg", desc:"A modern retelling of the classic Devdas story.", link:"https://youtu.be/ATZB8mwU3M0"}
];

const rail = document.getElementById('rail');
function renderCards(filter='all'){
  rail.innerHTML='';
  movies.forEach((m,i)=>{
    if(filter!=='all' && m.genre!==filter) return;
    const card=document.createElement('div');
    card.className='card reveal';
    card.innerHTML=`
      <div class="card-inner">
        <div class="card-face card-front">
          <img src="${m.img}" alt="${m.title}" data-link="${m.link || ''}"
            onerror="this.src='https://placehold.co/300x450/0a0a0a/ff2d3d?text=cinemaflix'">
          <div class="card-rank">${i+1}</div>
        </div>
        <div class="card-face card-back">
          <h4>${m.title}</h4>
          <span class="meta">${m.year} • ${m.g}</span>
          <span class="rating">★ ${m.rating}</span>
          <button class="btn btn-accent ripple" data-info="${i}">View Details</button>
        </div>
      </div>`;  
    const inner = card.querySelector('.card-inner');
    card.addEventListener('click', e => {
      if (e.target.closest('button[data-info]')) return;
      card.classList.toggle('flipped');
      if (inner) inner.style.transform = '';
    });
    add3DTilt(card);
    const imgEl = card.querySelector('.card-front img');
    if (imgEl) imgEl.addEventListener('click', e => {
      e.stopPropagation();
      card.classList.toggle('flipped');
      if (inner) inner.style.transform = '';
    });
    rail.appendChild(card);
  });
  observeReveals();
}

function add3DTilt(card){
  const inner=card.querySelector('.card-inner');
  card.addEventListener('mousemove',e=>{
    if(card.classList.contains('flipped'))return;
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-0.5;
    const y=(e.clientY-r.top)/r.height-0.5;
    inner.style.transform=`rotateY(${x*16}deg) rotateX(${-y*16}deg) translateZ(20px)`;
  });
  card.addEventListener('mouseleave',()=>{
    if(!card.classList.contains('flipped')) inner.style.transform='';
  });
}

document.getElementById('chips').addEventListener('click',e=>{
  if(!e.target.classList.contains('chip'))return;
  document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
  e.target.classList.add('active');
  renderCards(e.target.dataset.filter);
});

document.querySelectorAll('.rail-arrow').forEach(btn=>{
  btn.addEventListener('click',()=>rail.scrollBy({left:btn.dataset.dir*400,behavior:'smooth'}));
});
let isDown=false,startX,scrollL;
rail.addEventListener('mousedown',e=>{isDown=true;rail.classList.add('dragging');startX=e.pageX;scrollL=rail.scrollLeft});
window.addEventListener('mouseup',()=>{isDown=false;rail.classList.remove('dragging')});
rail.addEventListener('mousemove',e=>{if(!isDown)return;e.preventDefault();rail.scrollLeft=scrollL-(e.pageX-startX)*1.5});

const modal=document.getElementById('modal');
const modalTrailerBtn=document.getElementById('modalTrailerBtn');
let activeMovieIndex = null;
function openModal(i){
  activeMovieIndex = i;
  const m=movies[i];
  mPoster.src=m.img; mPoster.alt=m.title;
  mTitle.textContent=m.title; mYear.textContent=m.year;
  mGenre.textContent=m.g; mRating.textContent='★ '+m.rating;
  mDesc.textContent=m.desc;
  modal.classList.add('open');
}
modalTrailerBtn?.addEventListener('click', ()=>{
  if (activeMovieIndex === null) return;
  const url = movies[activeMovieIndex]?.link;
  if (!url) return;
  try { window.open(url, '_blank', 'noopener'); } catch (err) { location.href = url; }
});
document.addEventListener('click', e => {
  const infoEl = e.target.closest('button[data-info]');
  if (infoEl) openModal(+infoEl.dataset.info);
});
modalClose.onclick=()=>modal.classList.remove('open');
modal.onclick=e=>{if(e.target===modal)modal.classList.remove('open')};
document.addEventListener('keydown',e=>{if(e.key==='Escape')modal.classList.remove('open')});

const faqs=[
  ["What is cinemaflix?","cinemaflix is a streaming service offering award-winning shows, movies, anime and more across all your devices."],
  ["How much does cinemaflix cost?","Watch on your phone, TV, laptop or tablet from ₹149/month. No extra fees, no contracts."],
  ["Where can I watch?","Watch anywhere, anytime. Sign in to stream instantly on the web or download the app on your devices."],
  ["How do I cancel?","cinemaflix is flexible. There are no annoying contracts and you can cancel your account online in two clicks."],
  ["What can I watch on cinemaflix?","An extensive library of feature films, documentaries, series, anime, award-winning originals and more."]
];
const faqList=document.getElementById('faqList');
faqs.forEach(([q,a])=>{
  const item=document.createElement('div');
  item.className='faq-item reveal';
  item.innerHTML=`<button class="faq-q">${q}<span>+</span></button><div class="faq-a"><p>${a}</p></div>`;
  item.querySelector('.faq-q').addEventListener('click',()=>{
    const open=item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(f=>{f.classList.remove('active');f.querySelector('.faq-a').style.maxHeight=null});
    if(!open){item.classList.add('active');const a=item.querySelector('.faq-a');a.style.maxHeight=a.scrollHeight+'px'}
  });
  faqList.appendChild(item);
});

let io;
function observeReveals(){
  io=io||new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('visible');io.unobserve(en.target)}}),{threshold:.15});
  document.querySelectorAll('.reveal:not(.visible)').forEach(el=>io.observe(el));
}

addEventListener('scroll',()=>document.getElementById('nav').classList.toggle('scrolled',scrollY>40));

document.addEventListener('click',e=>{
  const b=e.target.closest('.ripple'); if(!b)return;
  const r=b.getBoundingClientRect(),s=document.createElement('span');
  s.className='rp';const d=Math.max(r.width,r.height);
  s.style.width=s.style.height=d+'px';
  s.style.left=e.clientX-r.left-d/2+'px';
  s.style.top=e.clientY-r.top-d/2+'px';
  b.appendChild(s);setTimeout(()=>s.remove(),600);
});

function dismissPortal(){
  const p=document.getElementById('portalLoader');
  if(p) p.classList.add('done');
}
window.addEventListener('load',()=>setTimeout(dismissPortal,1300));
setTimeout(dismissPortal,3500); 

document.getElementById('emailForm').addEventListener('submit',e=>{
  e.preventDefault();alert('Welcome to cinemaflix! 🎬 (demo)');
});

renderCards();
observeReveals();