(()=>{document.addEventListener("DOMContentLoaded",()=>{document.querySelector(".search-input").addEventListener("input",n=>{let e=n.target.value;displayApps(e);let t=new URL(window.location);t.searchParams.set("search",e),history.pushState({search:e},"",t)})});})();
//# sourceMappingURL=script.js.map
