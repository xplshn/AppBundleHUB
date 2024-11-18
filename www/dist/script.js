(()=>{var f=[];function C(c){f=c}function u(){return f}document.addEventListener("DOMContentLoaded",async()=>{let c=document.getElementById("app-sections"),v=document.getElementById("desktop-search-input"),b=document.getElementById("mobile-search-input"),m=new Map;async function w(){try{let t=await(await fetch("https://raw.githubusercontent.com/xplshn/dbin-metadata/refs/heads/master/misc/cmd/modMetadataAIO-ng/METADATA_AIO_amd64_linux.json")).json();C(t.pkg||[]),A(),y(),L(),g()}catch(e){console.error("Error fetching app data:",e),c.innerHTML='<div class="error">Failed to load applications. Please try again later.</div>'}}function y(){let e=new URL(window.location),t=e.searchParams.get("search")||"",s=e.searchParams.get("app")||"";g(t),s&&showAppDetails(s,u())}function A(){m.clear(),u().forEach(e=>{e.category&&e.category.split(",").map(s=>s.trim()).forEach(s=>{if(s){let r=m.get(s)||0;m.set(s,r+1)}})})}function h(e){let t=e.pkg.endsWith(".NixAppImage")||e.pkg.endsWith(".FlatImage")||e.pkg.endsWith(".AppBundle"),s;return e.pkg.endsWith(".NixAppImage")?s="badge-warning":e.pkg.endsWith(".FlatImage")?s="badge-success":e.pkg.endsWith(".AppBundle")&&(s="badge-info"),`
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
                        ${t?`<span class="badge ${s}">Portable</span>`:""}
                    </h2>
                    <p>${e.description||"No description available."}</p>
                </div>
            </div>
        `}function g(e=""){let t=u();if(e){let a=e.toLowerCase();t=t.filter(n=>n.pkg_name&&n.pkg_name.toLowerCase().includes(a)||n.description&&n.description.toLowerCase().includes(a)||n.category&&n.category.toLowerCase().includes(a))}let s=new Set,r="";m.forEach((a,n)=>{let l=t.filter(i=>i.category?i.category.split(",").map(S=>S.trim()).includes(n)&&!s.has(i.pkg_name||i.pkg_id):!1);if(l.length===0)return;let p=l.slice(0,6);p.forEach(i=>s.add(i.pkg_name||i.pkg_id));let d=p.map(i=>h(i)).join("");r+=`
                <div class="category-section my-8">
                    <h2 class="category-title text-xl font-semibold mb-4">${n}</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${d}
                    </div>
                    ${l.length>6?`<button class="see-more-btn btn btn-outline shadow-xl btn-xs sm:btn-sm md:btn-md lg:btn-lg" data-category="${n}">See more ${n}</button>`:""}
                </div>
            `}),c.innerHTML=r,c.querySelectorAll(".card").forEach(a=>{a.addEventListener("click",n=>{let l=n.currentTarget.dataset.name;showAppDetails(l,u())})}),c.querySelectorAll(".see-more-btn").forEach(a=>{a.addEventListener("click",n=>{let l=n.target.dataset.category;k(l)})});let o=[].slice.call(document.querySelectorAll("img.lazyload"));if("IntersectionObserver"in window){let a=new IntersectionObserver(function(n,l){n.forEach(function(p){if(p.isIntersecting){let d=p.target;d.src=d.dataset.src,d.classList.remove("lazyload"),a.unobserve(d)}})});o.forEach(function(n){a.observe(n)})}else o.forEach(function(a){a.src=a.dataset.src,a.classList.remove("lazyload")})}function k(e){let s=u().filter(r=>r.category?r.category.split(",").map(a=>a.trim()).includes(e):!1).map(r=>h(r)).join("");c.innerHTML=`
            <div class="category-section my-8">
                <h2 class="category-title text-xl font-semibold mb-4">${e}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${s}
                </div>
                <button class="see-more-btn btn btn-outline shadow-xl btn-xs sm:btn-sm md:btn-md lg:btn-lg" onclick="window.history.back()">Close</button>
            </div>
        `,c.querySelectorAll(".card").forEach(r=>{r.addEventListener("click",o=>{let a=o.currentTarget.dataset.name;showAppDetails(a,u())})})}v.addEventListener("input",e=>{let t=e.target.value;g(t);let s=new URL(window.location);s.searchParams.set("search",t),history.pushState({search:t},"",s)}),b.addEventListener("input",e=>{let t=e.target.value;g(t);let s=new URL(window.location);s.searchParams.set("search",t),history.pushState({search:t},"",s)}),w(),window.addEventListener("popstate",e=>{let t=new URL(window.location),s=t.searchParams.get("search")||"",r=t.searchParams.get("app")||"";g(s),r?showAppDetails(r,u()):x()});function x(){let e=document.querySelector(".app-details");if(e){e.classList.add("hidden");let t=new URL(window.location);t.searchParams.delete("app"),history.pushState({},"",t)}}function L(){let e=document.getElementById("popular-apps-carousel");if(!e)return;let t=u().sort((o,a)=>a.popularity_rank-o.popularity_rank).slice(0,10),s=[],r=t.map((o,a)=>E(o,a,t).then(n=>{n&&s.push({app:o,html:n})}));Promise.all(r).then(()=>{let o=s.map(({html:a})=>a).join("");e.innerHTML=`
            <div class="carousel w-full">
                ${o}
            </div>
        `,$()})}function E(e,t,s){if(!Array.isArray(e.screenshots)||e.screenshots.length===0)return Promise.resolve('<div class="skeleton"></div>');let r=e.screenshots.map(o=>new Promise(a=>{let n=new Image;n.onload=()=>a({src:o,valid:!0}),n.onerror=()=>a({src:o,valid:!1}),n.src=o}));return Promise.all(r).then(o=>{let a=o.filter(i=>i.valid);if(a.length===0)return'<div class="skeleton"></div>';let n=a[0].src,l=`slide${t+1}`,p=t===0?s.length:t,d=t===s.length-1?1:t+2;return`
            <div id="${l}" class="carousel-item relative w-full">
                <div class="flex flex-col sm:flex-row w-full gap-4 p-4">
                    <div class="sm:w-1/3 flex flex-col justify-center space-y-4">
                        <div class="flex items-center space-x-4">
                            <img src="${e.icon}" 
                                 alt="${e.pkg_name||e.pkg_id}" 
                                 class="w-16 h-16 object-contain">
                            <h3 class="text-lg sm:text-xl font-semibold">${e.pkg_name||e.pkg_id}</h3>
                        </div>
                        <p class="text-sm sm:text-base">${e.description||"No description available."}</p>
                    </div>
                    <div class="sm:w-2/3 relative">
                        <div class="w-full h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg">
                            <img src="${n}" 
                                 alt="Screenshot" 
                                 class="w-full h-full object-contain bg-base-200">
                        </div>
                    </div>
                </div>
                <div class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <button class="btn btn-circle carousel-prev" data-target="slide${p}">\u276E</button>
                    <button class="btn btn-circle carousel-next" data-target="slide${d}">\u276F</button>
                </div>
            </div>
        `})}function $(){let e=document.querySelector(".carousel");e&&e.querySelectorAll(".carousel-prev, .carousel-next").forEach(t=>{t.addEventListener("click",s=>{s.preventDefault();let r=document.getElementById(t.dataset.target);r&&r.scrollIntoView({behavior:"smooth",block:"nearest",inline:"start"})})})}});})();
//# sourceMappingURL=script.js.map
