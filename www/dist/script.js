(()=>{var f=[];function $(d){f=d}function i(){return f}document.addEventListener("DOMContentLoaded",async()=>{let d=document.getElementById("app-sections"),v=document.getElementById("desktop-search-input"),b=document.getElementById("mobile-search-input"),m=new Map;async function w(){try{let a=await(await fetch("https://raw.githubusercontent.com/xplshn/dbin-metadata/refs/heads/master/misc/cmd/modMetadataAIO-ng/METADATA_AIO_amd64_linux.json")).json();$(a.pkg||[]),A(),y(),E(),p()}catch(e){console.error("Error fetching app data:",e),d.innerHTML='<div class="error">Failed to load applications. Please try again later.</div>'}}function y(){let e=new URL(window.location),a=e.searchParams.get("search")||"",r=e.searchParams.get("app")||"";p(a),r&&showAppDetails(r,i())}function A(){m.clear(),i().forEach(e=>{e.category&&e.category.split(",").map(r=>r.trim()).forEach(r=>{if(r){let n=m.get(r)||0;m.set(r,n+1)}})})}function h(e){let a=e.pkg.endsWith(".NixAppImage")||e.pkg.endsWith(".FlatImage")||e.pkg.endsWith(".AppBundle"),r;return e.pkg.endsWith(".NixAppImage")?r="badge-warning":e.pkg.endsWith(".FlatImage")?r="badge-success":e.pkg.endsWith(".AppBundle")&&(r="badge-info"),`
            <div class="card cursor-pointer card-normal card-side bg-base-100 shadow-xl" data-name="${e.pkg_name||e.pkg_id}">
                <figure class="w-24 h-24">
                    <img
                        src="${e.icon}"
                        alt="${e.pkg_name||e.pkg_id}"
                        class="w-full h-full object-contain rounded-md"
                        loading="lazy"
                        onerror="this.style.display='none';"
                    >
                </figure>
                <div class="card-body">
                    <h2 class="card-title">
                        ${e.pkg_name||e.pkg_id}
                        ${a?`<span class="badge ${r}">Portable</span>`:""}
                    </h2>
                    <p>${e.description||"No description available."}</p>
                </div>
            </div>
        `}function p(e=""){let a=i();if(e){let t=e.toLowerCase();a=a.filter(s=>s.pkg_name&&s.pkg_name.toLowerCase().includes(t)||s.description&&s.description.toLowerCase().includes(t)||s.category&&s.category.toLowerCase().includes(t))}let r=new Set,n="";m.forEach((t,s)=>{let o=a.filter(c=>c.category?c.category.split(",").map(I=>I.trim()).includes(s)&&!r.has(c.pkg_name||c.pkg_id):!1);if(o.length===0)return;let g=o.slice(0,6);g.forEach(c=>r.add(c.pkg_name||c.pkg_id));let u=g.map(c=>h(c)).join("");n+=`
                <div class="category-section my-8">
                    <h2 class="category-title text-xl font-semibold mb-4">${s}</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${u}
                    </div>
                    ${o.length>6?`<button class="see-more-btn btn btn-outline shadow-xl btn-xs sm:btn-sm md:btn-md lg:btn-lg" data-category="${s}">See more ${s}</button>`:""}
                </div>
            `}),d.innerHTML=n,d.querySelectorAll(".card").forEach(t=>{t.addEventListener("click",s=>{let o=s.currentTarget.dataset.name;showAppDetails(o,i())})}),d.querySelectorAll(".see-more-btn").forEach(t=>{t.addEventListener("click",s=>{let o=s.target.dataset.category;k(o)})});let l=[].slice.call(document.querySelectorAll("img.lazyload"));if("IntersectionObserver"in window){let t=new IntersectionObserver(function(s,o){s.forEach(function(g){if(g.isIntersecting){let u=g.target;u.src=u.dataset.src,u.classList.remove("lazyload"),t.unobserve(u)}})});l.forEach(function(s){t.observe(s)})}else l.forEach(function(t){t.src=t.dataset.src,t.classList.remove("lazyload")})}function k(e){let r=i().filter(n=>n.category?n.category.split(",").map(t=>t.trim()).includes(e):!1).map(n=>h(n)).join("");d.innerHTML=`
            <div class="category-section my-8">
                <h2 class="category-title text-xl font-semibold mb-4">${e}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${r}
                </div>
                <button class="see-more-btn btn btn-outline shadow-xl btn-xs sm:btn-sm md:btn-md lg:btn-lg" onclick="window.history.back()">Close</button>
            </div>
        `,d.querySelectorAll(".card").forEach(n=>{n.addEventListener("click",l=>{let t=l.currentTarget.dataset.name;showAppDetails(t,i())})})}v.addEventListener("input",e=>{let a=e.target.value;p(a);let r=new URL(window.location);r.searchParams.set("search",a),history.pushState({search:a},"",r)}),b.addEventListener("input",e=>{let a=e.target.value;p(a);let r=new URL(window.location);r.searchParams.set("search",a),history.pushState({search:a},"",r)}),w(),window.addEventListener("popstate",e=>{let a=new URL(window.location),r=a.searchParams.get("search")||"",n=a.searchParams.get("app")||"";p(r),n?showAppDetails(n,i()):L()});function L(){let e=document.querySelector(".app-details");if(e){e.classList.add("hidden");let a=new URL(window.location);a.searchParams.delete("app"),history.pushState({},"",a)}}function E(){let e=document.getElementById("popular-apps-carousel");if(!e)return;let a=i().sort((t,s)=>s.popularity_rank-t.popularity_rank).slice(0,10),r=t=>Array.isArray(t.screenshots)&&t.screenshots.length>0&&t.screenshots.some(s=>s&&s.trim()!==""),n=a.filter(r),l=n.map((t,s)=>S(t,s,n));Promise.all(l).then(t=>{let s=t.join("");e.innerHTML=`
                <div class="carousel carousel-end w-full">
                    ${s}
                </div>
            `,x()})}function S(e,a,r){let n=e.screenshots.map(l=>new Promise(t=>{let s=new Image;s.onload=()=>t({src:l,valid:!0}),s.onerror=()=>t({src:l,valid:!1}),s.src=l}));return Promise.all(n).then(l=>{let t=l.filter(c=>c.valid);if(t.length===0)return null;let s=t[0].src,o=`slide${a+1}`,g=a===0?r.length:a,u=a===r.length-1?1:a+2;return`
                <div id="${o}" 
                     class="carousel-item relative w-full cursor-pointer" 
                     data-name="${e.pkg_name||e.pkg_id}">
                    <div class="flex flex-col lg:flex-row justify-center w-full gap-4 p-4">
                        <div class="lg:w-1/3 flex items-center flex-col justify-center space-y-4">
                            <div class="flex items-center space-x-4">
                                <img src="${e.icon}" 
                                     alt="${e.pkg_name||e.pkg_id}" 
                                     class="w-16 h-16 object-contain">
                                <h3 class="text-lg sm:text-xl font-semibold">${e.pkg_name||e.pkg_id}</h3>
                            </div>
                            <p class="text-sm sm:text-base">${e.description||"No description available."}</p>
                        </div>
                        <div class="hidden lg:block lg:w-2/3 relative">
                            <div class="w-full h-48 overflow-hidden rounded-lg">
                                <img src="${s}" 
                                     alt="Screenshot" 
                                     class="w-full h-full object-cover bg-base-200">
                            </div>
                        </div>
                    </div>
                    <div class="flex absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                        <button class="btn btn-circle carousel-prev" data-target="slide${g}">\u276E</button>
                        <button class="btn btn-circle carousel-next" data-target="slide${u}">\u276F</button>
                    </div>
                </div>
            `})}function x(){let e=document.getElementById("popular-apps-carousel");if(!e)return;e.querySelectorAll(".carousel-prev, .carousel-next").forEach(t=>{t.addEventListener("click",s=>{let o=document.getElementById(t.dataset.target);o&&o.scrollIntoView({behavior:"smooth",block:"nearest",inline:"start"})})}),e.querySelectorAll(".carousel-item").forEach(t=>{t.addEventListener("click",s=>{if(!s.target.closest(".carousel-prev")&&!s.target.closest(".carousel-next")){let o=t.dataset.name;o&&showAppDetails(o,i())}})});let a=0,r=e.querySelectorAll(".carousel-item");function n(){let t=e.querySelector(".carousel");if(!t)return;a=(a+1)%r.length;let o=r[a].offsetLeft;t.scrollTo({left:o,behavior:"smooth"})}let l=setInterval(n,5e3);e.addEventListener("mouseenter",()=>{clearInterval(l)}),e.addEventListener("mouseleave",()=>{l=setInterval(n,5e3)})}});})();
//# sourceMappingURL=script.js.map
