document.addEventListener('DOMContentLoaded', () => {
    const desktopSearchInput = document.getElementById('desktop-search-input');
    const mobileSearchInput = document.getElementById('mobile-search-input');
    const mobileSearchIcon = document.getElementById('mobile-search-icon');
    const mobileSearchContainer = document.getElementById('mobile-search-container');

    const searchIconSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
            <path fill-rule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clip-rule="evenodd" />
        </svg>
    `;

    const crossIconSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>
    `;

    mobileSearchIcon.addEventListener('click', (event) => {
        event.stopPropagation();
        const isHidden = mobileSearchContainer.classList.contains('hidden');

        if (isHidden) {
            mobileSearchContainer.classList.remove('hidden');
            setTimeout(() => {
                mobileSearchContainer.classList.add('opacity-100');
                mobileSearchContainer.classList.remove('opacity-0');
            }, 10);
            mobileSearchIcon.innerHTML = crossIconSVG;
            mobileSearchInput.focus();
        } else {
            // Hide search with transition
            mobileSearchContainer.classList.add('opacity-0');
            mobileSearchContainer.classList.remove('opacity-100');
            setTimeout(() => {
                mobileSearchContainer.classList.add('hidden');
                mobileSearchIcon.innerHTML = searchIconSVG;
            }, 300);
        }
    });

    // Handle clicks outside of search container to close it
    document.addEventListener('click', (event) => {
        if (!mobileSearchContainer.contains(event.target) &&
            !mobileSearchIcon.contains(event.target) &&
            !mobileSearchContainer.classList.contains('hidden')) {

            // Trigger click event on search icon to close
            mobileSearchIcon.click();
        }
    });

    // Search functionality for both desktop and mobile
    const handleSearch = (searchTerm) => {
        const url = new URL(window.location);
        url.searchParams.set('search', searchTerm);
        history.pushState({ search: searchTerm }, '', url);
    };

    // Add input event listeners to both search inputs
    desktopSearchInput.addEventListener('input', (e) => handleSearch(e.target.value));
    mobileSearchInput.addEventListener('input', (e) => handleSearch(e.target.value));
});