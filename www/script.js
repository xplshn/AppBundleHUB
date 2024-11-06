// script.js
import { setApps, apps } from './shared.js';

document.addEventListener('DOMContentLoaded', async () => {
    const appSections = document.getElementById('app-sections');
    const searchInput = document.querySelector('.search-input');

    let categories = new Map();

    // Fetch app data from the provided URL
    async function fetchAppData() {
        try {
            const response = await fetch('https://raw.githubusercontent.com/xplshn/dbin-metadata/refs/heads/master/misc/cmd/modMetadataAIO-ng/METADATA_AIO_amd64_linux.json');
            const data = await response.json();
            setApps(data.pkg || []);
            processCategories();
            initializeFromUrl(); // Initialize state from URL after data is fetched.
            displayApps();
        } catch (error) {
            console.error('Error fetching app data:', error);
            appSections.innerHTML = '<div class="error">Failed to load applications. Please try again later.</div>';
        }
    }

    // Initialize app state from URL parameters
    function initializeFromUrl() {
        const url = new URL(window.location);
        const initialSearch = url.searchParams.get('search') || '';
        const initialApp = url.searchParams.get('app') || '';

        displayApps(initialSearch);

        if (initialApp) {
            showAppDetails(initialApp, apps);
        }
    }

    // Process categories from apps
    function processCategories() {
        categories.clear();

        apps.forEach(app => {
            if (app.category) {
                const appCategories = app.category.split(',').map(cat => cat.trim());
                appCategories.forEach(category => {
                    if (category) {
                        const count = categories.get(category) || 0;
                        categories.set(category, count + 1);
                    }
                });
            }
        });
    }

    // Create app card HTML
    function createAppCard(app) {
        const isPortable = app.pkg.endsWith('.appbundle') || app.pkg.endsWith('.nixappimage');
        const badgeColor = app.pkg.endsWith('.AppBundle') ? 'badge-warning' : 'badge-success';
    
        return `
            <div class="card card-normal card-side bg-base-100 shadow-xl" data-name="${app.pkg_name || app.pkg_id}">
                <figure class="w-24 h-24">
                    <img
                        src="${app.icon}"
                        alt="${app.pkg_name || app.pkg_id}"
                        class="w-full h-full object-contain rounded-md"
                        loading="lazy"
                        onerror="this.style.display='none';"
                    >
                </figure>
                <div class="card-body">
                    <h2 class="card-title">
                        ${app.pkg_name || app.pkg_id}
                        ${isPortable ? `<span class="badge ${badgeColor}">Portable</span>` : ''}
                    </h2>
                    <p>${app.description || 'No description available.'}</p>
                </div>
            </div>
        `;
    }

    // Display the apps in the sections
    function displayApps(searchTerm = '') {
        let filteredApps = apps;

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filteredApps = filteredApps.filter(app =>
                (app.pkg_name && app.pkg_name.toLowerCase().includes(term)) ||
                (app.description && app.description.toLowerCase().includes(term)) ||
                (app.category && app.category.toLowerCase().includes(term))
            );
        }

        const displayedApps = new Set();
        let appSectionsHTML = '';

        categories.forEach((count, category) => {
            // Filter apps for this category
            const categoryApps = filteredApps.filter(app => {
                if (!app.category) return false;
                const appCategories = app.category.split(',').map(cat => cat.trim());
                return appCategories.includes(category) && !displayedApps.has(app.pkg_name || app.pkg_id);
            });

            // Skip if there are no apps in this category
            if (categoryApps.length === 0) {
                return;
            }

            // Collect the first six apps and mark them as displayed
            const firstSixApps = categoryApps.slice(0, 6);
            firstSixApps.forEach(app => displayedApps.add(app.pkg_name || app.pkg_id));

            // Generate HTML for app cards
            const appCards = firstSixApps.map(app => createAppCard(app)).join('');

            // Generate the section HTML
            appSectionsHTML += `
                <div class="category-section mb-8">
                    <h2 class="category-title text-xl font-semibold mb-4">${category}</h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        ${appCards}
                    </div>
                    ${categoryApps.length > 6 ? `<button class="see-more-btn btn btn-outline shadow-xl btn-xs sm:btn-sm md:btn-md lg:btn-lg" data-category="${category}">See more ${category}</button>` : ''}
                </div>
            `;
        });

        // Update the inner HTML of the app sections
        appSections.innerHTML = appSectionsHTML;

        // Add event listeners to app cards
        appSections.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', (e) => {
                const appName = e.currentTarget.dataset.name;
                showAppDetails(appName, apps);
            });
        });

        // Add event listeners to "See more" buttons
        appSections.querySelectorAll('.see-more-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                showAllAppsInCategory(category);
            });
        });

        // Lazy load images
        const lazyImages = [].slice.call(document.querySelectorAll('img.lazyload'));
        if ('IntersectionObserver' in window) {
            let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        let lazyImage = entry.target;
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.classList.remove('lazyload');
                        lazyImageObserver.unobserve(lazyImage);
                    }
                });
            });

            lazyImages.forEach(function(lazyImage) {
                lazyImageObserver.observe(lazyImage);
            });
        } else {
            // Fallback for older browsers
            lazyImages.forEach(function(lazyImage) {
                lazyImage.src = lazyImage.dataset.src;
                lazyImage.classList.remove('lazyload');
            });
        }
    }

    // Show all apps in a specific category
    function showAllAppsInCategory(category) {
        const categoryApps = apps.filter(app => {
            if (!app.category) return false;
            const appCategories = app.category.split(',').map(cat => cat.trim());
            return appCategories.includes(category);
        });

        const appCards = categoryApps.map(app => createAppCard(app)).join('');

        appSections.innerHTML = `
            <div class="category-section mb-8">
                <h2 class="category-title text-xl font-semibold mb-4">${category}</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    ${appCards}
                </div>
                <button class="see-more-btn btn btn-outline shadow-xl btn-xs sm:btn-sm md:btn-md lg:btn-lg" onclick="window.history.back()">Close</button>
            </div>
        `;

        // Add event listeners to app cards
        appSections.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', (e) => {
                const appName = e.currentTarget.dataset.name;
                showAppDetails(appName, apps);
            });
        });
    }

    // Event Listeners
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value;
        displayApps(searchTerm);

        // Update URL with search term
        const url = new URL(window.location);
        url.searchParams.set('search', searchTerm);
        history.pushState({ search: searchTerm }, '', url);
    });

    // Initial load
    fetchAppData();

    // Handle popstate event to sync URL with app state
    window.addEventListener('popstate', (e) => {
        const url = new URL(window.location);
        const search = url.searchParams.get('search') || '';
        const app = url.searchParams.get('app') || '';

        displayApps(search);

        if (app) {
            showAppDetails(app, apps);
        } else {
            closeDetails();
        }
    });

    function closeDetails() {
        const appDetails = document.querySelector('.app-details');
        if (appDetails) {
            appDetails.classList.add('hidden');

            // Update URL to remove app details
            const url = new URL(window.location);
            url.searchParams.delete('app');
            history.pushState({}, '', url);
        }
    }
});
