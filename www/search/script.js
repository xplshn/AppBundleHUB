document.addEventListener('DOMContentLoaded', () => {
    // Get desktop and mobile elements
    const desktopSearchInput = document.getElementById('desktop-search-input');
    const mobileSearchInput = document.getElementById('mobile-search-input');
    const mobileSearchIcon = document.getElementById('mobile-search-icon');
    const mobileSearchContainer = document.getElementById('mobile-search-container');

    // Toggle mobile search
    mobileSearchIcon.addEventListener('click', () => {
        const isHidden = mobileSearchContainer.classList.contains('hidden');
        mobileSearchContainer.classList.toggle('hidden', !isHidden);
        if (isHidden) {
            mobileSearchInput.focus();
        }
    });

    // Handle clicks outside of search container to close it
    document.addEventListener('click', (event) => {
        if (!mobileSearchContainer.contains(event.target) &&
            !mobileSearchIcon.contains(event.target) &&
            !mobileSearchContainer.classList.contains('hidden')) {
            mobileSearchContainer.classList.add('hidden');
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