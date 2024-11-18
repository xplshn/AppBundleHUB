let apps = [];

export function setApps(newApps) {
    apps = newApps;
}

export function getApps() {
    return apps;
}

document.addEventListener('DOMContentLoaded', async () => {
    const appSections = document.getElementById('app-sections');
    const searchInput = document.getElementById('desktop-search-input');
    const mobileSearchInput = document.getElementById('mobile-search-input');

    let categories = new Map();

    // Fetch app data from the provided URL
    async function fetchAppData() {
        try {
            const response = await fetch('https://raw.githubusercontent.com/xplshn/dbin-metadata/refs/heads/master/misc/cmd/modMetadataAIO-ng/METADATA_AIO_amd64_linux.json');
            const data = await response.json();
            setApps(data.pkg || []);
            processCategories();
            initializeFromUrl(); // Initialize state from URL after data is fetched.
            displayPopularApps();
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
            showAppDetails(initialApp, getApps());
        }
    }

    // Process categories from apps
    function processCategories() {
        categories.clear();

        getApps().forEach(app => {
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
        const isPortable = app.pkg.endsWith('.NixAppImage') || app.pkg.endsWith('.FlatImage') || app.pkg.endsWith('.AppBundle');
        let badgeColor;
        if (app.pkg.endsWith('.NixAppImage')) {
            badgeColor = 'badge-warning'; // Bronze
        } else if (app.pkg.endsWith('.FlatImage')) {
            badgeColor = 'badge-success'; // Yellow
        } else if (app.pkg.endsWith('.AppBundle')) {
            badgeColor = 'badge-info'; // Green
        }

        return `
            <div class="card cursor-pointer card-normal card-side bg-base-100 shadow-xl" data-name="${app.pkg_name || app.pkg_id}">
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
        let filteredApps = getApps();

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
                <div class="category-section my-8">
                    <h2 class="category-title text-xl font-semibold mb-4">${category}</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                showAppDetails(appName, getApps());
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
            let lazyImageObserver = new IntersectionObserver(function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        let lazyImage = entry.target;
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.classList.remove('lazyload');
                        lazyImageObserver.unobserve(lazyImage);
                    }
                });
            });

            lazyImages.forEach(function (lazyImage) {
                lazyImageObserver.observe(lazyImage);
            });
        } else {
            // Fallback for older browsers
            lazyImages.forEach(function (lazyImage) {
                lazyImage.src = lazyImage.dataset.src;
                lazyImage.classList.remove('lazyload');
            });
        }
    }

    // Show all apps in a specific category
    function showAllAppsInCategory(category) {
        const categoryApps = getApps().filter(app => {
            if (!app.category) return false;
            const appCategories = app.category.split(',').map(cat => cat.trim());
            return appCategories.includes(category);
        });

        const appCards = categoryApps.map(app => createAppCard(app)).join('');

        appSections.innerHTML = `
            <div class="category-section my-8">
                <h2 class="category-title text-xl font-semibold mb-4">${category}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${appCards}
                </div>
                <button class="see-more-btn btn btn-outline shadow-xl btn-xs sm:btn-sm md:btn-md lg:btn-lg" onclick="window.history.back()">Close</button>
            </div>
        `;

        // Add event listeners to app cards
        appSections.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', (e) => {
                const appName = e.currentTarget.dataset.name;
                showAppDetails(appName, getApps());
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


    mobileSearchInput.addEventListener('input', (e) => {
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
            showAppDetails(app, getApps());
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

    // Function to display popular apps in the carousel
    function displayPopularApps() {
        const popularAppsCarousel = document.getElementById('popular-apps-carousel');
        if (!popularAppsCarousel) return;

        const popularApps = getApps()
            .sort((a, b) => b.popularity_rank - a.popularity_rank)
            .slice(0, 10);

        let validApps = [];
        let promises = popularApps.map((app, index) =>
            createCarouselHtml(app, index, popularApps).then(html => {
                if (html) {
                    validApps.push({ app, html });
                }
            })
        );

        Promise.all(promises).then(() => {
            const carouselHTML = validApps.map(({ html }) => html).join('');

            popularAppsCarousel.innerHTML = `
            <div class="carousel w-full">
                ${carouselHTML}
            </div>
        `;

            // Attach event listeners after content is loaded
            attachCarouselEventListeners();
        });
    }

    // Helper function to create carousel HTML
    function createCarouselHtml(app, index, popularApps) {
        if (!Array.isArray(app.screenshots) || app.screenshots.length === 0) {
            return Promise.resolve(`<div class="skeleton"></div>`);
        }

        let loadingPromises = app.screenshots.map((src) =>
            new Promise((resolve) => {
                let img = new Image();
                img.onload = () => resolve({ src, valid: true });
                img.onerror = () => resolve({ src, valid: false });
                img.src = src;
            })
        );

        return Promise.all(loadingPromises).then(results => {
            const validScreenshots = results.filter(result => result.valid);

            if (validScreenshots.length === 0) {
                return `<div class="skeleton"></div>`;
            }

            const firstValidScreenshot = validScreenshots[0].src;
            const slideId = `slide${index + 1}`;
            const prevSlide = index === 0 ? popularApps.length : index;
            const nextSlide = index === popularApps.length - 1 ? 1 : index + 2;

            return `
            <div id="${slideId}" class="carousel-item relative w-full">
                <div class="flex flex-col sm:flex-row w-full gap-4 p-4">
                    <div class="sm:w-1/3 flex flex-col justify-center space-y-4">
                        <div class="flex items-center space-x-4">
                            <img src="${app.icon}" 
                                 alt="${app.pkg_name || app.pkg_id}" 
                                 class="w-16 h-16 object-contain">
                            <h3 class="text-lg sm:text-xl font-semibold">${app.pkg_name || app.pkg_id}</h3>
                        </div>
                        <p class="text-sm sm:text-base">${app.description || 'No description available.'}</p>
                    </div>
                    <div class="sm:w-2/3 relative">
                        <div class="w-full h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg">
                            <img src="${firstValidScreenshot}" 
                                 alt="Screenshot" 
                                 class="w-full h-full object-contain bg-base-200">
                        </div>
                    </div>
                </div>
                <div class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <button class="btn btn-circle carousel-prev" data-target="slide${prevSlide}">❮</button>
                    <button class="btn btn-circle carousel-next" data-target="slide${nextSlide}">❯</button>
                </div>
            </div>
        `;
        });
    }

    // New function to handle carousel navigation
    function attachCarouselEventListeners() {
        const carousel = document.querySelector('.carousel');
        if (!carousel) return;

        carousel.querySelectorAll('.carousel-prev, .carousel-next').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSlide = document.getElementById(button.dataset.target);
                if (targetSlide) {
                    targetSlide.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'start'
                    });
                }
            });
        });
    }

});
