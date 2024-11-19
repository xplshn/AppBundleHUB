let apps = [];

export function setApps(newApps) {
    apps = newApps;
}

export function getApps() {
    return apps;
}

function createLoadingSkeleton() {
    return `
        <!-- Trending Section Skeleton -->
        <div class="space-y-4 my-4">
            <div class="skeleton h-8 w-32"></div>
            <div class="skeleton h-64 w-full rounded-xl"></div>
        </div>

        <!-- Categories Section Skeletons -->
        ${Array(3).fill().map(() => `
            <div class="my-8 space-y-4">
                <!-- Category Title Skeleton -->
                <div class="skeleton h-8 w-48"></div>
                
                <!-- App Cards Grid Skeleton -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${Array(6).fill().map(() => `
                        <div class="card card-side bg-base-100 shadow-xl">
                            <!-- App Icon Skeleton -->
                            <figure class="hidden sm:block w-24 h-24 p-4">
                                <div class="skeleton w-full h-full rounded-lg"></div>
                            </figure>
                            
                            <!-- App Content Skeleton -->
                            <div class="card-body">
                                <div class="hidden sm:block space-y-3">
                                    <div class="skeleton h-4 w-3/4"></div>
                                    <div class="skeleton h-3 w-full"></div>
                                    <div class="skeleton h-3 w-5/6"></div>
                                </div>

                                <div class="sm:hidden lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('')}
    `;
}

document.addEventListener('DOMContentLoaded', async () => {
    const appSections = document.getElementById('app-sections');
    const searchInput = document.getElementById('desktop-search-input');
    const mobileSearchInput = document.getElementById('mobile-search-input');

    let categories = new Map();

    // Fetch app data from the provided URL
    async function fetchAppData() {
        const appSections = document.getElementById('app-sections');
        const popularAppsCarousel = document.getElementById('popular-apps-carousel');

        // Show loading state
        appSections.innerHTML = createLoadingSkeleton();
        popularAppsCarousel.innerHTML = ''; // Clear carousel while loading

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
                <figure class="w-24 h-24 mt-4">
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

    function displayPopularApps() {
        const popularAppsCarousel = document.getElementById('popular-apps-carousel');
        if (!popularAppsCarousel) return null;

        popularAppsCarousel.innerHTML = `
        <h2 class="text-2xl font-bold my-4">Trending</h2>
        <div class="carousel shadow-xl rounded-xl w-full h-64">
            <div class="w-full h-full flex items-center justify-center">
                <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </div>
        </div>
    `;

        const popularApps = getApps()
            .sort((a, b) => b.popularity_rank - a.popularity_rank)
            .slice(0, 10);

        // Function to validate screenshots
        const validateScreenshots = (app) => {
            return Array.isArray(app.screenshots) &&
                app.screenshots.length > 0 &&
                app.screenshots.some(screenshot => screenshot && screenshot.trim() !== '');
        };

        // Filter apps with valid screenshots
        const appsWithValidScreenshots = popularApps.filter(validateScreenshots);

        // If no valid apps found, show an error state
        if (appsWithValidScreenshots.length === 0) {
            popularAppsCarousel.innerHTML = `
                <h2 class="text-2xl font-bold my-4">Trending</h2>
                <div class="alert alert-warning">
                    <span>No trending apps available at the moment.</span>
                </div>
            `;
            return;
        }

        // Create promises for carousel HTML
        let carouselPromises = appsWithValidScreenshots.map((app, index) =>
            createCarouselHtml(app, index, appsWithValidScreenshots)
        );

        Promise.all(carouselPromises).then((carouselItems) => {
            const carouselHTML = carouselItems.join('');

            popularAppsCarousel.innerHTML = `
            <h2 class="text-2xl font-bold my-4">Trending</h2>
                <div class="carousel shadow-xl rounded-xl w-full h-64 carousel-end w-full">
                    ${carouselHTML}
                </div>
            `;

            // Attach event listeners after content is loaded
            attachCarouselEventListeners();
        });
    }

    function createCarouselHtml(app, index, popularApps) {
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
                return null;
            }

            const firstValidScreenshot = validScreenshots[0].src;
            const slideId = `slide${index + 1}`;
            const prevSlide = index === 0 ? popularApps.length : index;
            const nextSlide = index === popularApps.length - 1 ? 1 : index + 2;

            return `
                <div id="${slideId}" 
                     class="carousel-item relative w-full cursor-pointer" 
                     data-name="${app.pkg_name || app.pkg_id}">
                    <div class="flex flex-col lg:flex-row justify-center w-full gap-4 p-4">
                        <div class="lg:w-1/3 flex items-center flex-col justify-center space-y-4">
                            <div class="flex items-center space-x-4">
                                <img src="${app.icon}" 
                                     alt="${app.pkg_name || app.pkg_id}" 
                                     class="w-16 h-16 object-contain">
                                <h3 class="text-lg sm:text-xl font-semibold">${app.pkg_name || app.pkg_id}</h3>
                            </div>
                            <p class="text-sm sm:text-base">${app.description || 'No description available.'}</p>
                        </div>
                        <div class="hidden lg:block lg:w-2/3 relative">
                            <div class="w-full h-48 overflow-hidden rounded-lg">
                                <img src="${firstValidScreenshot}" 
                                     alt="Screenshot" 
                                     class="w-full h-full object-cover bg-base-200">
                            </div>
                        </div>
                    </div>
                    <div class="flex absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                        <button class="btn btn-circle carousel-prev" data-target="slide${prevSlide}">❮</button>
                        <button class="btn btn-circle carousel-next" data-target="slide${nextSlide}">❯</button>
                    </div>
                </div>
            `;
        });
    }

    function attachCarouselEventListeners() {
        const carousel = document.getElementById('popular-apps-carousel');
        if (!carousel) return;

        carousel.querySelectorAll('.carousel-prev, .carousel-next').forEach(button => {
            button.addEventListener('click', (e) => {
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

        carousel.querySelectorAll('.carousel-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.carousel-prev') && !e.target.closest('.carousel-next')) {
                    const appName = item.dataset.name;
                    if (appName) {
                        showAppDetails(appName, getApps());
                    }
                }
            });
        });

        let currentSlideIndex = 0;
        const slides = carousel.querySelectorAll('.carousel-item');

        function autoScroll() {
            const carouselContainer = carousel.querySelector('.carousel');
            if (!carouselContainer) return;
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            const targetSlide = slides[currentSlideIndex];
            const offsetLeft = targetSlide.offsetLeft;
            carouselContainer.scrollTo({
                left: offsetLeft,
                behavior: 'smooth'
            });
        }


        let autoScrollInterval = setInterval(autoScroll, 5000);

        carousel.addEventListener('mouseenter', () => {
            clearInterval(autoScrollInterval);
        });

        carousel.addEventListener('mouseleave', () => {
            autoScrollInterval = setInterval(autoScroll, 5000);
        });
    }
});
