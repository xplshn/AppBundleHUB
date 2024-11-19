(()=>{document.addEventListener("DOMContentLoaded",()=>{let u=document.getElementById("app-details-modal"),v=document.querySelector(".details-body"),g=document.getElementById("image-dialog"),m=document.getElementById("fullscreen-image"),k=document.getElementById("close-dialog");window.showAppDetails=function(o,d){if(!Array.isArray(d)){console.error("Apps data is not an array");return}let c=d.find(a=>(a.pkg_name||a.pkg)===o);if(!c){console.error("App not found:",o);return}try{u.showModal(),v.innerHTML=b(c);let a=new URL(window.location);a.searchParams.set("app",o),history.pushState({app:o},"",a)}catch(a){console.error("Error showing app details:",a)}};function b(o){let d=`
            <div class="animate-pulse">
                <!-- Header skeleton with icon and title -->
                <div class="flex items-start gap-4 mb-6">
                    <div class="skeleton w-16 h-16 rounded-lg"></div>
                    <div class="flex-1">
                        <div class="skeleton h-8 w-48 mb-4"></div>
                        <div class="skeleton h-4 w-full mb-2"></div>
                        <div class="skeleton h-4 w-3/4 mb-4"></div>
                        <div class="flex gap-2">
                            <div class="skeleton h-6 w-20"></div>
                            <div class="skeleton h-6 w-20"></div>
                            <div class="skeleton h-6 w-20"></div>
                        </div>
                    </div>
                </div>

                <!-- Screenshots carousel skeleton -->
                <div class="skeleton w-full h-64 mb-6 rounded-lg"></div>

                <!-- Stats skeleton -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div class="skeleton h-24 w-full"></div>
                    <div class="skeleton h-24 w-full"></div>
                    <div class="skeleton h-24 w-full"></div>
                </div>

                <!-- Action buttons skeleton -->
                <div class="flex gap-2 mb-6">
                    <div class="skeleton h-12 w-32"></div>
                    <div class="skeleton h-12 w-32"></div>
                    <div class="skeleton h-12 w-32"></div>
                </div>

                <!-- Install section skeleton -->
                <div class="skeleton h-64 w-full rounded-lg"></div>
            </div>
        `;function c(e){let r=e.category?e.category.split(",").map(t=>t.trim()).filter(t=>t).map(t=>`<span class="badge badge-neutral category-tag cursor-pointer" data-category="${t}">${t}</span>`).join(""):"",s=new Date(e.build_date).toLocaleDateString("es-AR",{year:"numeric",month:"short",day:"numeric"}),l=e.rich_description?`
                    <div class="rich-description mt-4 mb-6 prose max-w-none">
                        <h3 class="text-xl font-semibold mb-3">About ${e.pkg_name||e.pkg}</h3>
                        ${e.rich_description.replace(/\u003cp\u003e/g,"<p>")}
                    </div>
                  `:"";return`
                <div class="details-header flex items-start gap-4 mb-4">
                    <img src="${e.icon}" alt="${e.pkg_name||e.pkg}" class="app-icon w-16 h-16 object-contain"
                         onerror="this.style.display='none';">
                    <div>
                        <h2 class="text-2xl font-semibold">${e.pkg_name||e.pkg}</h2>
                        <p>${e.description||"No description available."}</p>
                        <div class="category-tags flex flex-wrap gap-2 mt-2">${r}</div>
                    </div>
                </div>
                ${l}
                <div id="screenshots-container" class="mb-4">
                    <div class="skeleton-container skeleton h-64">
                        <div class="flex items-center justify-center h-full text-base-content/50">
                            Loading screenshots...
                        </div>
                    </div>
                    <div class="carousel-container hidden"></div>
                </div>
                <div class="stats stats-horizontal shadow w-full bg-base-200 mb-4">
                    <div class="stat">
                        <div class="stat-title">Version</div>
                        <div class="stat-value text-2xl">${e.version||"N/A"}</div>
                        <div class="stat-desc">Latest Release</div>
                    </div>

                    <div class="stat">
                        <div class="stat-title">Size</div>
                        <div class="stat-value text-2xl">${e.size}</div>
                        <div class="stat-desc">Download Size</div>
                    </div>

                    <div class="stat">
                        <div class="stat-title">Build Date</div>
                        <div class="stat-value text-2xl">${s}</div>
                        <div class="stat-desc">Last Updated</div>
                    </div>
                </div>
                <div class="app-links flex gap-2 mb-4">
                    <a href="${e.download_url}" class="download-button btn btn-primary">Download</a>
                    ${e.src_url?`<a href="${e.src_url}" class="link-button btn btn-secondary" target="_blank">Source Code</a>`:""}
                    ${e.homepage?`<a href="${e.homepage}" class="link-button btn btn-secondary" target="_blank">Website</a>`:""}
                </div>
                <div class="install-section p-4 bg-base-200 rounded-lg mb-4">

                <div class="tooltip tooltip-info tooltip-right" data-tip="one-click-install requires dbin protocol to be set up correctly on your system">
                    <a href="dbin://install?${e.pkg}" class="install-button btn btn-ghost text-lg">Install <span class="nf nf-oct-desktop_download"></span></a>
                </div>

                    <h4 class="text-base font-semibold mb-2"># If you don't have <span class="code">dbin</span> installed:</h4>
                    <div class="code bg-base-300 p-2 rounded mb-4">
                        <pre data-prefix="$"><code>wget -qO- "https://raw.githubusercontent.com/xplshn/dbin/master/stubdl" | sh -s -- install ${e.pkg_name||e.pkg}</code></pre>
                    </div>
                    <h4 class="text-base font-semibold mb-2"># If you have <span class="code">dbin</span> installed:</h4>
                    <div class="code bg-base-300 p-2 rounded mb-4">
                        <pre data-prefix="$"><code>dbin install ${e.pkg}</code></pre>
                    </div>
                    <h4 class="text-base font-semibold mb-2"># Alternative using <span class="code">soar</span>:</h4>
                    <div class="code bg-base-300 p-2 rounded">
                        <pre data-prefix="$"><code>soar add ${e.pkg}</code></pre>
                    </div>
                </div>
                ${e.note?`<div class="app-note alert alert-warning"><strong>Note:</strong> ${e.note}</div>`:""}
            `}function a(e){if(!Array.isArray(e)||e.length===0)return Promise.resolve("<p>No screenshots available.</p>");let r=e.map((i,s)=>new Promise(l=>{let t=new Image;t.onload=()=>l({src:i,index:s,valid:!0}),t.onerror=()=>l({src:i,index:s,valid:!1}),t.src=i}));return Promise.all(r).then(i=>{let s=i.filter(t=>t.valid);if(s.length===0)return"<p>No screenshots available.</p>";let l='<div class="carousel w-full h-64 rounded-lg">';return s.forEach((t,n)=>{let h=`slide${n+1}`,f=n===0?s.length:n,p=n===s.length-1?1:n+2;l+=`
                            <div id="${h}" class="carousel-item relative w-full">
                                <img src="${t.src}" class="w-full h-full object-contain cursor-pointer" alt="Screenshot ${n+1}" data-fullscreen-src="${t.src}"/>
                                <div class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                                    <button data-target="slide${f}" class="btn btn-circle prev-img">\u276E</button>
                                    <button data-target="slide${p}" class="btn btn-circle next-img">\u276F</button>
                                </div>
                            </div>
                        `}),l+="</div>",l})}return v.innerHTML=d,setTimeout(()=>{v.innerHTML=c(o);let e=document.getElementById("screenshots-container");e&&a(o.screenshots).then(r=>{let i=e.querySelector(".skeleton-container"),s=e.querySelector(".carousel-container");if(!s)return console.log("error"),null;s.innerHTML=r,i.remove(),s.classList.remove("hidden"),s.querySelectorAll("img").forEach(l=>{l.addEventListener("click",()=>{m.src=l.dataset.fullscreenSrc,g.showModal()})}),s.querySelectorAll(".prev-img, .next-img").forEach(l=>{l.addEventListener("click",t=>{let n=document.getElementById(l.dataset.target);n&&n.scrollIntoView({behavior:"smooth",block:"nearest",inline:"start"})})})})},1e3),d}});})();
//# sourceMappingURL=script.js.map
