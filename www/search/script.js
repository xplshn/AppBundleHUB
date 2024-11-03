// search/script.js
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');

    // Event listener for search input
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value;
        displayApps(searchTerm);

        // Update URL with search term
        const url = new URL(window.location);
        url.searchParams.set('search', searchTerm);
        history.pushState({ search: searchTerm }, '', url);
    });
});
