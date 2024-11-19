(()=>{var v=[];function C(u){v=u}function c(){return v}function $(){return`
        <!-- Trending Section Skeleton -->
        <div class="space-y-4 my-4">
            <div class="skeleton h-8 w-32"></div>
            <div class="skeleton h-64 w-full rounded-xl"></div>
        </div>

        <!-- Categories Section Skeletons -->
        ${Array(3).fill().map(()=>`
            <div class="my-8 space-y-4">
                <!-- Category Title Skeleton -->
                <div class="skeleton h-8 w-48"></div>
                
                <!-- App Cards Grid Skeleton -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${Array(6).fill().map(()=>`
                        <div class="card card-side bg-base-100 shadow-xl">
                            <!-- App Icon Skeleton -->
                            <figure class="hidden sm:block w-24 h-24 p-4">
                                <div class="skeleton w-full h-full rounded-lg"></div>
                            </figure>
                            
                            <!-- App Content Skeleton -->
                            <div class="card-body">
                                <div class="hidden sm:block space-y-3">
                                    <div class="skeleton h-4 w-3/4"></div>
                                    <div class="skeleton h-3 w-full"></div>
                                    <div class="skeleton h-3 w-5/6"></div>
                                </div>

                                <div class="sm:hidden lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
        `).join("")}
    `}document.addEventListener("DOMContentLoaded",async()=>{let u=document.getElementById("app-sections"),f=document.getElementById("desktop-search-input"),b=document.getElementById("mobile-search-input"),m=new Map;async function w(){let e=document.getElementById("app-sections"),a=document.getElementById("popular-apps-carousel");e.innerHTML=$(),a.innerHTML="";try{let l=await(await fetch("https://raw.githubusercontent.com/xplshn/dbin-metadata/refs/heads/master/misc/cmd/modMetadataAIO-ng/METADATA_AIO_amd64_linux.json")).json();C(l.pkg||[]),k(),y(),S(),g()}catch(n){console.error("Error fetching app data:",n),e.innerHTML='<div class="error">Failed to load applications. Please try again later.</div>'}}function y(){let e=new URL(window.location),a=e.searchParams.get("search")||"",n=e.searchParams.get("app")||"";g(a),n&&showAppDetails(n,c())}function k(){m.clear(),c().forEach(e=>{e.category&&e.category.split(",").map(n=>n.trim()).forEach(n=>{if(n){let l=m.get(n)||0;m.set(n,l+1)}})})}function h(e){let a=e.pkg.endsWith(".NixAppImage")||e.pkg.endsWith(".FlatImage")||e.pkg.endsWith(".AppBundle"),n;return e.pkg.endsWith(".NixAppImage")?n="badge-warning":e.pkg.endsWith(".FlatImage")?n="badge-success":e.pkg.endsWith(".AppBundle")&&(n="badge-info"),`
            <div class="card cursor-pointer card-normal card-side bg-base-100 shadow-xl" data-name="${e.pkg_name||e.pkg_id}">
                <figure class="w-24 h-24 mt-4">
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
                        ${a?`<span class="badge ${n}">Portable</span>`:""}
                    </h2>
                    <p>${e.description||"No description available."}</p>
                </div>
            </div>
        `}function g(e=""){let a=c();if(e){let t=e.toLowerCase();a=a.filter(s=>s.pkg_name&&s.pkg_name.toLowerCase().includes(t)||s.description&&s.description.toLowerCase().includes(t)||s.category&&s.category.toLowerCase().includes(t))}let n=new Set,l="";m.forEach((t,s)=>{let i=a.filter(r=>r.category?r.category.split(",").map(I=>I.trim()).includes(s)&&!n.has(r.pkg_name||r.pkg_id):!1);if(i.length===0)return;let p=i.slice(0,6);p.forEach(r=>n.add(r.pkg_name||r.pkg_id));let d=p.map(r=>h(r)).join("");l+=`
                <div class="category-section my-8">
                    <h2 class="category-title text-xl font-semibold mb-4">${s}</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${d}
                    </div>
                    ${i.length>6?`<button class="see-more-btn btn btn-outline shadow-xl btn-xs sm:btn-sm md:btn-md lg:btn-lg" data-category="${s}">See more ${s}</button>`:""}
                </div>
            `}),u.innerHTML=l,u.querySelectorAll(".card").forEach(t=>{t.addEventListener("click",s=>{let i=s.currentTarget.dataset.name;showAppDetails(i,c())})}),u.querySelectorAll(".see-more-btn").forEach(t=>{t.addEventListener("click",s=>{let i=s.target.dataset.category;A(i)})});let o=[].slice.call(document.querySelectorAll("img.lazyload"));if("IntersectionObserver"in window){let t=new IntersectionObserver(function(s,i){s.forEach(function(p){if(p.isIntersecting){let d=p.target;d.src=d.dataset.src,d.classList.remove("lazyload"),t.unobserve(d)}})});o.forEach(function(s){t.observe(s)})}else o.forEach(function(t){t.src=t.dataset.src,t.classList.remove("lazyload")})}function A(e){let n=c().filter(l=>l.category?l.category.split(",").map(t=>t.trim()).includes(e):!1).map(l=>h(l)).join("");u.innerHTML=`
            <div class="category-section my-8">
                <h2 class="category-title text-xl font-semibold mb-4">${e}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${n}
                </div>
                <button class="see-more-btn btn btn-outline shadow-xl btn-xs sm:btn-sm md:btn-md lg:btn-lg" onclick="window.history.back()">Close</button>
            </div>
        `,u.querySelectorAll(".card").forEach(l=>{l.addEventListener("click",o=>{let t=o.currentTarget.dataset.name;showAppDetails(t,c())})})}f.addEventListener("input",e=>{let a=e.target.value;g(a);let n=new URL(window.location);n.searchParams.set("search",a),history.pushState({search:a},"",n)}),b.addEventListener("input",e=>{let a=e.target.value;g(a);let n=new URL(window.location);n.searchParams.set("search",a),history.pushState({search:a},"",n)}),w(),window.addEventListener("popstate",e=>{let a=new URL(window.location),n=a.searchParams.get("search")||"",l=a.searchParams.get("app")||"";g(n),l?showAppDetails(l,c()):x()});function x(){let e=document.querySelector(".app-details");if(e){e.classList.add("hidden");let a=new URL(window.location);a.searchParams.delete("app"),history.pushState({},"",a)}}function S(){let e=document.getElementById("popular-apps-carousel");if(!e)return null;e.innerHTML=`
        <h2 class="text-2xl font-bold my-4">Trending</h2>
        <div class="carousel shadow-xl rounded-xl w-full h-64">
            <div class="w-full h-full flex items-center justify-center">
                <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </div>
        </div>
    `;let a=c().sort((t,s)=>s.popularity_rank-t.popularity_rank).slice(0,10),n=t=>Array.isArray(t.screenshots)&&t.screenshots.length>0&&t.screenshots.some(s=>s&&s.trim()!==""),l=a.filter(n);if(l.length===0){e.innerHTML=`
                <h2 class="text-2xl font-bold my-4">Trending</h2>
                <div class="alert alert-warning">
                    <span>No trending apps available at the moment.</span>
                </div>
            `;return}let o=l.map((t,s)=>L(t,s,l));Promise.all(o).then(t=>{let s=t.join("");e.innerHTML=`
            <h2 class="text-2xl font-bold my-4">Trending</h2>
                <div class="carousel shadow-xl rounded-xl w-full h-64 carousel-end w-full">
                    ${s}
                </div>
            `,E()})}function L(e,a,n){let l=e.screenshots.map(o=>new Promise(t=>{let s=new Image;s.onload=()=>t({src:o,valid:!0}),s.onerror=()=>t({src:o,valid:!1}),s.src=o}));return Promise.all(l).then(o=>{let t=o.filter(r=>r.valid);if(t.length===0)return null;let s=t[0].src,i=`slide${a+1}`,p=a===0?n.length:a,d=a===n.length-1?1:a+2;return`
                <div id="${i}" 
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
                        <button class="btn btn-circle carousel-prev" data-target="slide${p}">\u276E</button>
                        <button class="btn btn-circle carousel-next" data-target="slide${d}">\u276F</button>
                    </div>
                </div>
            `})}function E(){let e=document.getElementById("popular-apps-carousel");if(!e)return;e.querySelectorAll(".carousel-prev, .carousel-next").forEach(t=>{t.addEventListener("click",s=>{let i=document.getElementById(t.dataset.target);i&&i.scrollIntoView({behavior:"smooth",block:"nearest",inline:"start"})})}),e.querySelectorAll(".carousel-item").forEach(t=>{t.addEventListener("click",s=>{if(!s.target.closest(".carousel-prev")&&!s.target.closest(".carousel-next")){let i=t.dataset.name;i&&showAppDetails(i,c())}})});let a=0,n=e.querySelectorAll(".carousel-item");function l(){let t=e.querySelector(".carousel");if(!t)return;a=(a+1)%n.length;let i=n[a].offsetLeft;t.scrollTo({left:i,behavior:"smooth"})}let o=setInterval(l,5e3);e.addEventListener("mouseenter",()=>{clearInterval(o)}),e.addEventListener("mouseleave",()=>{o=setInterval(l,5e3)})}});})();
//# sourceMappingURL=script.js.map
