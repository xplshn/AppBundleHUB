(()=>{var $=[],v="amd64";function I(o){$=o}function d(){return $}function B(){return`
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
    `}document.addEventListener("DOMContentLoaded",async()=>{let o=document.getElementById("app-sections"),b=document.getElementById("desktop-search-input"),w=document.getElementById("mobile-search-input"),y=document.getElementById("repo-amd64"),k=document.getElementById("repo-arm64"),f=document.getElementById("file-input"),A=document.getElementById("upload-button"),m=new Map;async function h(){if(!o)return;let e=document.getElementById("popular-apps-carousel");o.innerHTML=B(),e&&(e.innerHTML="");try{let s=await fetch(`https://fatbuffalo.neocities.org/AppBundleHUBStore/METADATA_${v}_linux.json`);if(!s.ok)throw new Error("Network response was not ok");let r=await s.json(),a=[];for(let i in r)Array.isArray(r[i])&&a.push(...r[i]);I(a),x(),S(),L(),g()}catch(s){console.error("Error fetching app data:",s),o.innerHTML='<div class="error">Failed to load applications. Please try again later.</div>'}}function S(){let e=new URL(window.location),s=e.searchParams.get("search")||"",r=e.searchParams.get("app")||"";g(s),r&&showAppDetails(r,d())}function x(){m.clear();let e=d();if(e.length===0){console.error("No apps found in the data");return}e.forEach(s=>{s.categories&&s.categories.split(",").map(a=>a.trim()).forEach(a=>{if(a){let i=m.get(a)||0;m.set(a,i+1)}})})}function E(e){let s=e.pkg.endsWith(".NixAppImage")||e.pkg.endsWith(".FlatImage")||e.pkg.endsWith(".AppBundle"),r;return e.pkg.endsWith(".NixAppImage")?r="badge-warning":e.pkg.endsWith(".FlatImage")?r="badge-info":e.pkg.endsWith(".AppBundle")&&(r="badge-success"),`
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
                        ${s?`<span class="badge ${r}">Portable</span>`:""}
                    </h2>
                    <p>${e.description||"No description available."}</p>
                </div>
            </div>
        `}function g(e=""){if(!o)return;let s=d();if(e){let t=e.toLowerCase();s=s.filter(n=>n.pkg_name&&n.pkg_name.toLowerCase().includes(t)||n.description&&n.description.toLowerCase().includes(t)||n.categories&&n.categories.toLowerCase().includes(t))}let r=new Set,a="";m.forEach((t,n)=>{let l=s.filter(c=>c.categories?c.categories.split(",").map(P=>P.trim()).includes(n)&&!r.has(c.pkg_name||c.pkg_id):!1);if(l.length===0)return;let p=l.slice(0,6);p.forEach(c=>r.add(c.pkg_name||c.pkg_id));let u=p.map(c=>E(c)).join("");a+=`
                <div class="category-section my-8">
                    <h2 class="category-title text-xl font-semibold mb-4">${n}</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${u}
                    </div>
                    ${l.length>6?`<button class="see-more-btn btn btn-outline shadow-xl btn-xs sm:btn-sm md:btn-md lg:btn-lg" data-category="${n}">See more ${n}</button>`:""}
                </div>
            `}),o.innerHTML=a,o.querySelectorAll(".card").forEach(t=>{t.addEventListener("click",n=>{let l=n.currentTarget.dataset.name;showAppDetails(l,d())})}),o.querySelectorAll(".see-more-btn").forEach(t=>{t.addEventListener("click",n=>{let l=n.target.dataset.category;C(l)})});let i=[].slice.call(document.querySelectorAll("img.lazyload"));if("IntersectionObserver"in window){let t=new IntersectionObserver(function(n,l){n.forEach(function(p){if(p.isIntersecting){let u=p.target;u.src=u.dataset.src,u.classList.remove("lazyload"),t.unobserve(u)}})});i.forEach(function(n){t.observe(n)})}else i.forEach(function(t){t.src=t.dataset.src,t.classList.remove("lazyload")})}function C(e){if(!o)return;let r=d().filter(a=>a.categories?a.categories.split(",").map(t=>t.trim()).includes(e):!1).map(a=>E(a)).join("");o.innerHTML=`
            <div class="category-section my-8">
                <h2 class="category-title text-xl font-semibold mb-4">${e}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${r}
                </div>
                <button class="see-more-btn btn btn-outline shadow-xl btn-xs sm:btn-sm md:btn-md lg:btn-lg" onclick="window.history.back()">Close</button>
            </div>
        `,o.querySelectorAll(".card").forEach(a=>{a.addEventListener("click",i=>{let t=i.currentTarget.dataset.name;showAppDetails(t,d())})})}b&&b.addEventListener("input",e=>{let s=e.target.value;g(s);let r=new URL(window.location);r.searchParams.set("search",s),history.pushState({search:s},"",r)}),w&&w.addEventListener("input",e=>{let s=e.target.value;g(s);let r=new URL(window.location);r.searchParams.set("search",s),history.pushState({search:s},"",r)}),y&&y.addEventListener("click",()=>{v="amd64",h()}),k&&k.addEventListener("click",()=>{v="arm64",h()}),A&&A.addEventListener("click",()=>{f&&f.click()}),f&&f.addEventListener("change",e=>{let s=e.target.files[0];if(s){let r=new FileReader;r.onload=async a=>{try{let i=JSON.parse(a.target.result);if(!i||typeof i!="object")throw new Error("Invalid JSON structure: root should be an object");let t=[];for(let n in i)Array.isArray(i[n])&&t.push(...i[n]);I(t),x(),S(),L(),g()}catch(i){console.error("Error parsing JSON file:",i),o&&(o.innerHTML='<div class="error">Failed to load applications. Please ensure the file is a valid JSON object with arrays as values.</div>')}},r.readAsText(s)}}),h(),window.addEventListener("popstate",e=>{let s=new URL(window.location),r=s.searchParams.get("search")||"",a=s.searchParams.get("app")||"";g(r),a?showAppDetails(a,d()):T()});function T(){let e=document.querySelector(".app-details");if(e){e.classList.add("hidden");let s=new URL(window.location);s.searchParams.delete("app"),history.pushState({},"",s)}}function L(){let e=document.getElementById("popular-apps-carousel");if(!e)return null;e.innerHTML=`
        <h2 class="text-2xl font-bold my-4">Trending</h2>
        <div class="carousel shadow-xl rounded-xl w-full h-64">
            <div class="w-full h-full flex items-center justify-center">
                <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </div>
        </div>
    `;let s=d().sort((t,n)=>n.rank-t.rank).slice(0,10),r=t=>Array.isArray(t.screenshots)&&t.screenshots.length>0&&t.screenshots.some(n=>n&&n.trim()!==""),a=s.filter(r);if(a.length===0){e.innerHTML=`
                <h2 class="text-2xl font-bold my-4">Trending</h2>
                <div class="alert alert-warning">
                    <span>No trending apps available at the moment.</span>
                </div>
            `;return}let i=a.map((t,n)=>_(t,n,a));Promise.all(i).then(t=>{let n=t.join("");e.innerHTML=`
            <h2 class="text-2xl font-bold my-4">Trending</h2>
                <div class="carousel shadow-xl rounded-xl w-full h-64 carousel-end w-full">
                    ${n}
                </div>
            `,j()})}function _(e,s,r){let a=e.screenshots.map(i=>new Promise(t=>{let n=new Image;n.onload=()=>t({src:i,valid:!0}),n.onerror=()=>t({src:i,valid:!1}),n.src=i}));return Promise.all(a).then(i=>{let t=i.filter(c=>c.valid);if(t.length===0)return null;let n=t[0].src,l=`slide${s+1}`,p=s===0?r.length:s,u=s===r.length-1?1:s+2;return`
                <div id="${l}"
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
                                <img src="${n}"
                                     alt="Screenshot"
                                     class="w-full h-full object-cover bg-base-200">
                            </div>
                        </div>
                    </div>
                    <div class="flex absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                        <button class="btn btn-circle carousel-prev" data-target="slide${p}">\u276E</button>
                        <button class="btn btn-circle carousel-next" data-target="slide${u}">\u276F</button>
                    </div>
                </div>
            `})}function j(){let e=document.getElementById("popular-apps-carousel");if(!e)return;e.querySelectorAll(".carousel-prev, .carousel-next").forEach(t=>{t.addEventListener("click",n=>{let l=document.getElementById(t.dataset.target);l&&l.scrollIntoView({behavior:"smooth",block:"nearest",inline:"start"})})}),e.querySelectorAll(".carousel-item").forEach(t=>{t.addEventListener("click",n=>{if(!n.target.closest(".carousel-prev")&&!n.target.closest(".carousel-next")){let l=t.dataset.name;l&&showAppDetails(l,d())}})});let s=0,r=e.querySelectorAll(".carousel-item");function a(){let t=e.querySelector(".carousel");if(!t)return;s=(s+1)%r.length;let l=r[s].offsetLeft;t.scrollTo({left:l,behavior:"smooth"})}let i=setInterval(a,5e3);e.addEventListener("mouseenter",()=>{clearInterval(i)}),e.addEventListener("mouseleave",()=>{i=setInterval(a,5e3)})}});})();
//# sourceMappingURL=script.js.map
