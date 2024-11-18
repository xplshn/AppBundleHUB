(()=>{document.addEventListener("DOMContentLoaded",()=>{let i=document.getElementById("desktop-search-input"),o=document.getElementById("mobile-search-input"),n=document.getElementById("mobile-search-icon"),t=document.getElementById("mobile-search-container"),c=`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
            <path fill-rule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clip-rule="evenodd" />
        </svg>
    `,d=`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>
    `;n.addEventListener("click",e=>{e.stopPropagation(),t.classList.contains("hidden")?(t.classList.remove("hidden"),setTimeout(()=>{t.classList.add("opacity-100"),t.classList.remove("opacity-0")},10),n.innerHTML=d,o.focus()):(t.classList.add("opacity-0"),t.classList.remove("opacity-100"),setTimeout(()=>{t.classList.add("hidden"),n.innerHTML=c},300))}),document.addEventListener("click",e=>{!t.contains(e.target)&&!n.contains(e.target)&&!t.classList.contains("hidden")&&n.click()});let a=e=>{let s=new URL(window.location);s.searchParams.set("search",e),history.pushState({search:e},"",s)};i.addEventListener("input",e=>a(e.target.value)),o.addEventListener("input",e=>a(e.target.value))});})();
//# sourceMappingURL=script.js.map
