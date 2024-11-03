// script.js
import { setApps, apps } from './shared.js';
document.addEventListener('DOMContentLoaded', async () => {
    const appGrid = document.querySelector('.app-grid');
    const categoryList = document.querySelector('.category-list');
    const searchInput = document.querySelector('.search-input');

    let categories = new Map();
    let currentCategory = 'All';

    // Fetch app data from the provided URL
    async function fetchAppData() {
        try {
            const response = await fetch('https://corsproxy.io/?https://pkg.ajam.dev/x86_64/METADATA.AIO.json');
            const data = await response.json();
            setApps(data.pkg || []);
            processCategories();
            initializeFromUrl(); // Initialize state from URL after data is fetched.
            displayApps();
        } catch (error) {
            console.error('Error fetching app data:', error);
            appGrid.innerHTML = '<div class="error">Failed to load applications. Please try again later.</div>';
        }
    }

    // Initialize app state from URL parameters
    function initializeFromUrl() {
        const url = new URL(window.location);
        const initialCategory = url.searchParams.get('category') || 'All';
        const initialSearch = url.searchParams.get('search') || '';
        const initialApp = url.searchParams.get('app') || '';

        updateCategoryFilter(initialCategory);
        displayApps(initialSearch);

        if (initialApp) {
            showAppDetails(initialApp, apps);
        }
    }

    // Process categories from apps
    function processCategories() {
        categories.clear();
        categories.set('All', apps.length);

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

        const sortedCategories = new Map([
            ['All', categories.get('All')],
            ...Array.from(categories.entries())
                .filter(([cat]) => cat !== 'All')
                .sort((a, b) => a[0].localeCompare(b[0]))
        ]);

        categoryList.innerHTML = Array.from(sortedCategories.entries())
            .map(([category, count]) => `
                <li class="category-item ${category === currentCategory ? 'active' : ''}"
                    data-category="${category}">
                    <a class="menu-item flex items-center justify-between">
                        ${category}
                        <span class="category-count badge badge-neutral">${count}</span>
                    </a>
                </li>
            `).join('');
    }

    // Filter apps by category
    function filterAppsByCategory(category) {
        if (category === 'All') {
            return apps;
        }
        return apps.filter(app => {
            if (!app.category) return false;
            const appCategories = app.category.split(',').map(cat => cat.trim());
            return appCategories.includes(category);
        });
    }

    // Create app card HTML
    function createAppCard(app) {
        const categoryTags = app.category
            ? app.category
                .split(',')
                .map(cat => cat.trim())
                .filter(cat => cat)
                .map(cat => `<span class="badge badge-sm badge-outline category-tag" data-category="${cat}">${cat}</span>`)
                .join('')
            : '';

        return `
            <div class="app-card card card-compact bg-base-100 shadow-md border border-base-300" data-name="${app.name}">
                <figure class="px-4 pt-4">
                    <img src="${app.icon}" alt="${app.name}" class="app-icon w-16 h-16 object-contain rounded-md" onerror="this.style.display='none';">
                </figure>
                <div class="card-body">
                    <h2 class="card-title truncate">${app.name}</h2>
                    <p class="truncate text-base-content/70">${app.description || 'No description available.'}</p>
                    <div class="card-actions justify-end">
                        <div class="flex flex-wrap gap-2">
                            ${categoryTags}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Display the apps in the grid
    function displayApps(searchTerm = '') {
        let filteredApps = filterAppsByCategory(currentCategory);

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filteredApps = filteredApps.filter(app =>
                app.name.toLowerCase().includes(term) ||
                (app.description && app.description.toLowerCase().includes(term)) ||
                (app.category && app.category.toLowerCase().includes(term))
            );
        }

        const appCards = filteredApps.map(app => createAppCard(app));

        appGrid.innerHTML = appCards.join('');

        // Add event listeners to category tags in app cards
        appGrid.querySelectorAll('.category-tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.stopPropagation();  // Prevent click from bubbling up to app card
                const category = e.target.dataset.category;
                updateCategoryFilter(category);
            });
        });

        // Add event listeners to app cards
        appGrid.querySelectorAll('.app-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const appName = e.currentTarget.dataset.name;
                showAppDetails(appName, apps);
            });
        });
    }

    // Update category filter and display apps
    function updateCategoryFilter(category) {
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.remove('active');
        });
        const categoryItem = document.querySelector(`.category-item[data-category="${category}"]`);
        if (categoryItem) {
            categoryItem.classList.add('active');
        }

        currentCategory = category;
        displayApps(searchInput.value);

        closeDetails();

        const url = new URL(window.location);
        url.searchParams.set('category', category);
        history.pushState({ category: category }, '', url);
    }

    // Event Listeners
    categoryList.addEventListener('click', (e) => {
        const categoryItem = e.target.closest('.category-item');
        if (categoryItem) {
            updateCategoryFilter(categoryItem.dataset.category);
        }
    });

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
        const category = url.searchParams.get('category') || 'All';
        const search = url.searchParams.get('search') || '';
        const app = url.searchParams.get('app') || '';

        updateCategoryFilter(category);
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
