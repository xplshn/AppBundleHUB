(()=>{var o=[];function y(c){o=c}document.addEventListener("DOMContentLoaded",async()=>{let c=document.querySelector(".app-grid"),g=document.querySelector(".category-list"),u=document.querySelector(".search-input"),n=new Map,d="All";async function f(){try{let e=await(await fetch("https://corsproxy.io/?https://pkg.ajam.dev/x86_64/METADATA.AIO.json")).json();y(e.pkg||[]),w(),h(),i()}catch(t){console.error("Error fetching app data:",t),c.innerHTML='<div class="error">Failed to load applications. Please try again later.</div>'}}function h(){let t=new URL(window.location),e=t.searchParams.get("category")||"All",a=t.searchParams.get("search")||"",r=t.searchParams.get("app")||"";l(e),i(a),r&&showAppDetails(r,o)}function w(){n.clear(),n.set("All",o.length),o.forEach(e=>{e.category&&e.category.split(",").map(r=>r.trim()).forEach(r=>{if(r){let s=n.get(r)||0;n.set(r,s+1)}})});let t=new Map([["All",n.get("All")],...Array.from(n.entries()).filter(([e])=>e!=="All").sort((e,a)=>e[0].localeCompare(a[0]))]);g.innerHTML=Array.from(t.entries()).map(([e,a])=>`
                <li class="category-item ${e===d?"active":""}"
                    data-category="${e}">
                    <a class="menu-item flex items-center justify-between">
                        ${e}
                        <span class="category-count badge badge-neutral">${a}</span>
                    </a>
                </li>
            `).join("")}function A(t){return t==="All"?o:o.filter(e=>e.category?e.category.split(",").map(r=>r.trim()).includes(t):!1)}function v(t){let e=t.category?t.category.split(",").map(a=>a.trim()).filter(a=>a).map(a=>`<span class="badge badge-sm badge-outline category-tag" data-category="${a}">${a}</span>`).join(""):"";return`
            <div class="app-card card card-compact bg-base-100 shadow-md border border-base-300" data-name="${t.name}">
                <figure class="px-4 pt-4">
                    <img src="${t.icon}" alt="${t.name}" class="app-icon w-16 h-16 object-contain rounded-md" onerror="this.style.display='none';">
                </figure>
                <div class="card-body">
                    <h2 class="card-title truncate">${t.name}</h2>
                    <p class="truncate text-base-content/70">${t.description||"No description available."}</p>
                    <div class="card-actions justify-end">
                        <div class="flex flex-wrap gap-2">
                            ${e}
                        </div>
                    </div>
                </div>
            </div>
        `}function i(t=""){let e=A(d);if(t){let r=t.toLowerCase();e=e.filter(s=>s.name.toLowerCase().includes(r)||s.description&&s.description.toLowerCase().includes(r)||s.category&&s.category.toLowerCase().includes(r))}let a=e.map(r=>v(r));c.innerHTML=a.join(""),c.querySelectorAll(".category-tag").forEach(r=>{r.addEventListener("click",s=>{s.stopPropagation();let p=s.target.dataset.category;l(p)})}),c.querySelectorAll(".app-card").forEach(r=>{r.addEventListener("click",s=>{let p=s.currentTarget.dataset.name;showAppDetails(p,o)})})}function l(t){document.querySelectorAll(".category-item").forEach(r=>{r.classList.remove("active")});let e=document.querySelector(`.category-item[data-category="${t}"]`);e&&e.classList.add("active"),d=t,i(u.value),m();let a=new URL(window.location);a.searchParams.set("category",t),history.pushState({category:t},"",a)}g.addEventListener("click",t=>{let e=t.target.closest(".category-item");e&&l(e.dataset.category)}),u.addEventListener("input",t=>{let e=t.target.value;i(e);let a=new URL(window.location);a.searchParams.set("search",e),history.pushState({search:e},"",a)}),f(),window.addEventListener("popstate",t=>{let e=new URL(window.location),a=e.searchParams.get("category")||"All",r=e.searchParams.get("search")||"",s=e.searchParams.get("app")||"";l(a),i(r),s?showAppDetails(s,o):m()});function m(){let t=document.querySelector(".app-details");if(t){t.classList.add("hidden");let e=new URL(window.location);e.searchParams.delete("app"),history.pushState({},"",e)}}});})();
//# sourceMappingURL=script.js.map
