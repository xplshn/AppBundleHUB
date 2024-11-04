(()=>{var n=[];function f(c){n=c}document.addEventListener("DOMContentLoaded",async()=>{let c=document.getElementById("app-sections"),b=document.querySelector(".search-input"),g=new Map;async function w(){try{let t=await(await fetch("https://corsproxy.io/?https://pkg.ajam.dev/x86_64/METADATA.AIO.json")).json();f(t.pkg||[]),v(),y(),u()}catch(e){console.error("Error fetching app data:",e),c.innerHTML='<div class="error">Failed to load applications. Please try again later.</div>'}}function y(){let e=new URL(window.location),t=e.searchParams.get("search")||"",a=e.searchParams.get("app")||"";u(t),a&&showAppDetails(a,n)}function v(){g.clear(),n.forEach(e=>{e.category&&e.category.split(",").map(a=>a.trim()).forEach(a=>{if(a){let r=g.get(a)||0;g.set(a,r+1)}})})}function h(e){return`
            <div class="card card-normal card-side bg-base-100 shadow-xl" data-name="${e.name}">
                <figure class="w-24 h-24">
                    <img 
                        src="${e.icon}" 
                        alt="${e.name}" 
                        class="w-full h-full object-contain rounded-md" 
                        loading="lazy" 
                        onerror="this.style.display='none';"
                    >
                </figure>
                <div class="card-body">
                    <h2 class="card-title">${e.name}</h2>
                    <p>${e.description||"No description available."}</p>
                </div>
            </div>
        `}function u(e=""){let t=n;if(e){let s=e.toLowerCase();t=t.filter(o=>o.name.toLowerCase().includes(s)||o.description&&o.description.toLowerCase().includes(s)||o.category&&o.category.toLowerCase().includes(s))}let a=new Set,r="";g.forEach((s,o)=>{let i=t.filter(l=>l.category?l.category.split(",").map(E=>E.trim()).includes(o)&&!a.has(l.name):!1);if(i.length===0)return;let m=i.slice(0,6);m.forEach(l=>a.add(l.name));let d=m.map(l=>h(l)).join("");r+=`
            <div class="category-section mb-8">
                <h2 class="category-title text-xl font-semibold mb-4">${o}</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    ${d}
                </div>
                ${i.length>6?`<button class="see-more-btn btn btn-outline shadow-xl btn-xs sm:btn-sm md:btn-md lg:btn-lg" data-category="${o}">See more ${o}</button>`:""}
            </div>
        `}),c.innerHTML=r,c.querySelectorAll(".card").forEach(s=>{s.addEventListener("click",o=>{let i=o.currentTarget.dataset.name;showAppDetails(i,n)})}),c.querySelectorAll(".see-more-btn").forEach(s=>{s.addEventListener("click",o=>{let i=o.target.dataset.category;A(i)})});let p=[].slice.call(document.querySelectorAll("img.lazyload"));if("IntersectionObserver"in window){let s=new IntersectionObserver(function(o,i){o.forEach(function(m){if(m.isIntersecting){let d=m.target;d.src=d.dataset.src,d.classList.remove("lazyload"),s.unobserve(d)}})});p.forEach(function(o){s.observe(o)})}else p.forEach(function(s){s.src=s.dataset.src,s.classList.remove("lazyload")})}function A(e){let a=n.filter(r=>r.category?r.category.split(",").map(s=>s.trim()).includes(e):!1).map(r=>h(r)).join("");c.innerHTML=`
            <div class="category-section mb-8">
                <h2 class="category-title text-xl font-semibold mb-4">${e}</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    ${a}
                </div>
                <button class="see-more-btn btn btn-outline shadow-xl btn-xs sm:btn-sm md:btn-md lg:btn-lg" onclick="window.history.back()">Close</button>
            </div>
        `,c.querySelectorAll(".card").forEach(r=>{r.addEventListener("click",p=>{let s=p.currentTarget.dataset.name;showAppDetails(s,n)})})}b.addEventListener("input",e=>{let t=e.target.value;u(t);let a=new URL(window.location);a.searchParams.set("search",t),history.pushState({search:t},"",a)}),w(),window.addEventListener("popstate",e=>{let t=new URL(window.location),a=t.searchParams.get("search")||"",r=t.searchParams.get("app")||"";u(a),r?showAppDetails(r,n):L()});function L(){let e=document.querySelector(".app-details");if(e){e.classList.add("hidden");let t=new URL(window.location);t.searchParams.delete("app"),history.pushState({},"",t)}}});})();
//# sourceMappingURL=script.js.map
