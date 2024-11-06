(()=>{var c=[];function f(i){c=i}document.addEventListener("DOMContentLoaded",async()=>{let i=document.getElementById("app-sections"),b=document.querySelector(".search-input"),m=new Map;async function w(){try{let t=await(await fetch("https://raw.githubusercontent.com/xplshn/dbin-metadata/refs/heads/master/misc/cmd/modMetadataAIO-ng/METADATA_AIO_amd64_linux.json")).json();f(t.pkg||[]),v(),y(),u()}catch(e){console.error("Error fetching app data:",e),i.innerHTML='<div class="error">Failed to load applications. Please try again later.</div>'}}function y(){let e=new URL(window.location),t=e.searchParams.get("search")||"",s=e.searchParams.get("app")||"";u(t),s&&showAppDetails(s,c)}function v(){m.clear(),c.forEach(e=>{e.category&&e.category.split(",").map(s=>s.trim()).forEach(s=>{if(s){let o=m.get(s)||0;m.set(s,o+1)}})})}function h(e){let t=e.pkg.endsWith(".appbundle")||e.pkg.endsWith(".nixappimage"),s=e.pkg.endsWith(".AppBundle")?"badge-warning":"badge-success";return`
            <div class="card card-normal card-side bg-base-100 shadow-xl" data-name="${e.pkg_name||e.pkg_id}">
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
        `}function u(e=""){let t=c;if(e){let a=e.toLowerCase();t=t.filter(n=>n.pkg_name&&n.pkg_name.toLowerCase().includes(a)||n.description&&n.description.toLowerCase().includes(a)||n.category&&n.category.toLowerCase().includes(a))}let s=new Set,o="";m.forEach((a,n)=>{let l=t.filter(r=>r.category?r.category.split(",").map(k=>k.trim()).includes(n)&&!s.has(r.pkg_name||r.pkg_id):!1);if(l.length===0)return;let g=l.slice(0,6);g.forEach(r=>s.add(r.pkg_name||r.pkg_id));let d=g.map(r=>h(r)).join("");o+=`
                <div class="category-section mb-8">
                    <h2 class="category-title text-xl font-semibold mb-4">${n}</h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        ${d}
                    </div>
                    ${l.length>6?`<button class="see-more-btn btn btn-outline shadow-xl btn-xs sm:btn-sm md:btn-md lg:btn-lg" data-category="${n}">See more ${n}</button>`:""}
                </div>
            `}),i.innerHTML=o,i.querySelectorAll(".card").forEach(a=>{a.addEventListener("click",n=>{let l=n.currentTarget.dataset.name;showAppDetails(l,c)})}),i.querySelectorAll(".see-more-btn").forEach(a=>{a.addEventListener("click",n=>{let l=n.target.dataset.category;A(l)})});let p=[].slice.call(document.querySelectorAll("img.lazyload"));if("IntersectionObserver"in window){let a=new IntersectionObserver(function(n,l){n.forEach(function(g){if(g.isIntersecting){let d=g.target;d.src=d.dataset.src,d.classList.remove("lazyload"),a.unobserve(d)}})});p.forEach(function(n){a.observe(n)})}else p.forEach(function(a){a.src=a.dataset.src,a.classList.remove("lazyload")})}function A(e){let s=c.filter(o=>o.category?o.category.split(",").map(a=>a.trim()).includes(e):!1).map(o=>h(o)).join("");i.innerHTML=`
            <div class="category-section mb-8">
                <h2 class="category-title text-xl font-semibold mb-4">${e}</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    ${s}
                </div>
                <button class="see-more-btn btn btn-outline shadow-xl btn-xs sm:btn-sm md:btn-md lg:btn-lg" onclick="window.history.back()">Close</button>
            </div>
        `,i.querySelectorAll(".card").forEach(o=>{o.addEventListener("click",p=>{let a=p.currentTarget.dataset.name;showAppDetails(a,c)})})}b.addEventListener("input",e=>{let t=e.target.value;u(t);let s=new URL(window.location);s.searchParams.set("search",t),history.pushState({search:t},"",s)}),w(),window.addEventListener("popstate",e=>{let t=new URL(window.location),s=t.searchParams.get("search")||"",o=t.searchParams.get("app")||"";u(s),o?showAppDetails(o,c):L()});function L(){let e=document.querySelector(".app-details");if(e){e.classList.add("hidden");let t=new URL(window.location);t.searchParams.delete("app"),history.pushState({},"",t)}}});})();
//# sourceMappingURL=script.js.map
