(()=>{var c=[];function f(i){c=i}document.addEventListener("DOMContentLoaded",async()=>{let i=document.getElementById("app-sections"),b=document.querySelector(".search-input"),m=new Map;async function w(){try{let t=await(await fetch("https://raw.githubusercontent.com/xplshn/dbin-metadata/refs/heads/master/misc/cmd/modMetadataAIO-ng/METADATA_AIO_amd64_linux.json")).json();f(t.pkg||[]),v(),y(),u()}catch(e){console.error("Error fetching app data:",e),i.innerHTML='<div class="error">Failed to load applications. Please try again later.</div>'}}function y(){let e=new URL(window.location),t=e.searchParams.get("search")||"",n=e.searchParams.get("app")||"";u(t),n&&showAppDetails(n,c)}function v(){m.clear(),c.forEach(e=>{e.category&&e.category.split(",").map(n=>n.trim()).forEach(n=>{if(n){let o=m.get(n)||0;m.set(n,o+1)}})})}function h(e){return`
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
                    <h2 class="card-title">${e.pkg_name||e.pkg_id}</h2>
                    <p>${e.description||"No description available."}</p>
                </div>
            </div>
        `}function u(e=""){let t=c;if(e){let s=e.toLowerCase();t=t.filter(a=>a.pkg_name&&a.pkg_name.toLowerCase().includes(s)||a.description&&a.description.toLowerCase().includes(s)||a.category&&a.category.toLowerCase().includes(s))}let n=new Set,o="";m.forEach((s,a)=>{let l=t.filter(r=>r.category?r.category.split(",").map(E=>E.trim()).includes(a)&&!n.has(r.pkg_name||r.pkg_id):!1);if(l.length===0)return;let g=l.slice(0,6);g.forEach(r=>n.add(r.pkg_name||r.pkg_id));let d=g.map(r=>h(r)).join("");o+=`
                <div class="category-section mb-8">
                    <h2 class="category-title text-xl font-semibold mb-4">${a}</h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        ${d}
                    </div>
                    ${l.length>6?`<button class="see-more-btn btn btn-outline shadow-xl btn-xs sm:btn-sm md:btn-md lg:btn-lg" data-category="${a}">See more ${a}</button>`:""}
                </div>
            `}),i.innerHTML=o,i.querySelectorAll(".card").forEach(s=>{s.addEventListener("click",a=>{let l=a.currentTarget.dataset.name;showAppDetails(l,c)})}),i.querySelectorAll(".see-more-btn").forEach(s=>{s.addEventListener("click",a=>{let l=a.target.dataset.category;A(l)})});let p=[].slice.call(document.querySelectorAll("img.lazyload"));if("IntersectionObserver"in window){let s=new IntersectionObserver(function(a,l){a.forEach(function(g){if(g.isIntersecting){let d=g.target;d.src=d.dataset.src,d.classList.remove("lazyload"),s.unobserve(d)}})});p.forEach(function(a){s.observe(a)})}else p.forEach(function(s){s.src=s.dataset.src,s.classList.remove("lazyload")})}function A(e){let n=c.filter(o=>o.category?o.category.split(",").map(s=>s.trim()).includes(e):!1).map(o=>h(o)).join("");i.innerHTML=`
            <div class="category-section mb-8">
                <h2 class="category-title text-xl font-semibold mb-4">${e}</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    ${n}
                </div>
                <button class="see-more-btn btn btn-outline shadow-xl btn-xs sm:btn-sm md:btn-md lg:btn-lg" onclick="window.history.back()">Close</button>
            </div>
        `,i.querySelectorAll(".card").forEach(o=>{o.addEventListener("click",p=>{let s=p.currentTarget.dataset.name;showAppDetails(s,c)})})}b.addEventListener("input",e=>{let t=e.target.value;u(t);let n=new URL(window.location);n.searchParams.set("search",t),history.pushState({search:t},"",n)}),w(),window.addEventListener("popstate",e=>{let t=new URL(window.location),n=t.searchParams.get("search")||"",o=t.searchParams.get("app")||"";u(n),o?showAppDetails(o,c):L()});function L(){let e=document.querySelector(".app-details");if(e){e.classList.add("hidden");let t=new URL(window.location);t.searchParams.delete("app"),history.pushState({},"",t)}}});})();
//# sourceMappingURL=script.js.map
