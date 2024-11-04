// app/script.js
import { apps } from '../shared.js';
document.addEventListener('DOMContentLoaded', () => {
    const appDetailsModal = document.getElementById('app-details-modal');
    const detailsContent = document.querySelector('.details-body');

    // Function to show app details
    window.showAppDetails = function(name, apps) {
        const app = apps.find(app => app.name === name);
        if (app) {
            detailsContent.innerHTML = createAppDetails(app);
            appDetailsModal.showModal();

            // Update URL with app details
            const url = new URL(window.location);
            url.searchParams.set('app', name);
            history.pushState({ app: name }, '', url);
        } else {
            console.error('App not found:', name);
        }
    }

    function createAppDetails(app) {
        // Initial skeleton loading state
        const skeletonHtml = `
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
        `;

        // Function to create the actual content
        function createFinalContent(app) {
            const categoryTags = app.category
                ? app.category
                    .split(',')
                    .map(cat => cat.trim())
                    .filter(cat => cat)
                    .map(cat => `<span class="badge badge-neutral category-tag" data-category="${cat}">${cat}</span>`)
                    .join('')
                : '';

            // Format build date
            const buildDate = new Date(app.build_date);
            const formattedDate = buildDate.toLocaleDateString('es-AR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            return `
                <div class="details-header flex items-start gap-4 mb-4">
                    <img src="${app.icon}" alt="${app.name}" class="app-icon w-16 h-16 object-contain"
                         onerror="this.style.display='none';">
                    <div>
                        <h2 class="text-2xl font-semibold">${app.name}</h2>
                        <p>${app.description || 'No description available.'}</p>
                        <div class="category-tags flex flex-wrap gap-2 mt-2">${categoryTags}</div>
                    </div>
                </div>
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
                        <div class="stat-value text-2xl">${app.version || 'N/A'}</div>
                        <div class="stat-desc">Latest Release</div>
                    </div>

                    <div class="stat">
                        <div class="stat-title">Size</div>
                        <div class="stat-value text-2xl">${app.size}</div>
                        <div class="stat-desc">Download Size</div>
                    </div>

                    <div class="stat">
                        <div class="stat-title">Build Date</div>
                        <div class="stat-value text-2xl">${formattedDate}</div>
                        <div class="stat-desc">Last Updated</div>
                    </div>
                </div>
                <div class="app-links flex gap-2 mb-4">
                    <a href="${app.download_url}" class="download-button btn btn-primary">Download</a>
                    ${app.src_url ? `<a href="${app.src_url}" class="link-button btn btn-secondary" target="_blank">Source Code</a>` : ''}
                    ${app.web_url ? `<a href="${app.web_url}" class="link-button btn btn-secondary" target="_blank">Website</a>` : ''}
                </div>
                <div class="install-section p-4 bg-base-200 rounded-lg mb-4">
                    <h3 class="text-xl font-semibold mb-2">Install</h3>
                    <h4 class="text-base font-semibold mb-2"># If you don't have <span class="code">dbin</span> installed:</h4>
                    <div class="code bg-base-300 p-2 rounded mb-4">
                        <pre data-prefix="$"><code>wget -qO- "https://raw.githubusercontent.com/xplshn/dbin/master/stubdl" | sh -s -- install ${app.name}</code></pre>
                    </div>
                    <h4 class="text-base font-semibold mb-2"># If you have <span class="code">dbin</span> installed:</h4>
                    <div class="code bg-base-300 p-2 rounded mb-4">
                        <pre data-prefix="$"><code>dbin install ${app.name}</code></pre>
                    </div>
                    <h4 class="text-base font-semibold mb-2"># Alternative using <span class="code">soar</span>:</h4>
                    <div class="code bg-base-300 p-2 rounded">
                        <pre data-prefix="$"><code>soar add ${app.name}</code></pre>
                    </div>
                    <div class="tooltip tooltip-info" data-tip="You must have dbin protocol support on your computer">
                        <a href="dbin://install?${app.name}" class="install-button btn btn-primary mt-4">Install</a>
                    </div>
                </div>
                ${app.note ? `<div class="app-note alert alert-warning"><strong>Note:</strong> ${app.note}</div>` : ''}
            `;
        }

        // Function to create carousel HTML only for valid screenshots
        function createCarouselHtml(screenshots) {
            if (!Array.isArray(screenshots) || screenshots.length === 0) {
                return '<p>No screenshots available.</p>';
            }

            let loadingPromises = screenshots.map((src, index) =>
                new Promise((resolve) => {
                    let img = new Image();
                    img.onload = () => resolve({ src, index, valid: true });
                    img.onerror = () => resolve({ src, index, valid: false });
                    img.src = src;
                })
            );

            return Promise.all(loadingPromises).then(results => {
                const validScreenshots = results.filter(result => result.valid);

                if (validScreenshots.length === 0) {
                    return '<p>No screenshots available.</p>';
                }

                let carouselHtml = '<div class="carousel w-full h-64 rounded-lg">';
                validScreenshots.forEach((screenshot, idx) => {
                    const nextIdx = (idx + 1) % validScreenshots.length;
                    const prevIdx = (idx - 1 + validScreenshots.length) % validScreenshots.length;

                    carouselHtml += `
                        <div id="slide${idx}" class="carousel-item relative w-full">
                            <img src="${screenshot.src}" class="w-full h-full object-contain cursor-pointer" alt="Screenshot ${idx + 1}" data-fullscreen-src="${screenshot.src}"/>
                            <div class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                                <a href="#slide${prevIdx}" class="btn btn-circle">❮</a>
                                <a href="#slide${nextIdx}" class="btn btn-circle">❯</a>
                            </div>
                        </div>
                    `;
                });

                carouselHtml += '</div>';
                return carouselHtml;
            });
        }

        // Initially show skeleton
        detailsContent.innerHTML = skeletonHtml;

        // After a small delay, load the actual content
        setTimeout(() => {
            detailsContent.innerHTML = createFinalContent(app);

            // Then load the carousel
            const screenshotsContainer = document.getElementById('screenshots-container');
            if (screenshotsContainer) {
                createCarouselHtml(app.screenshots).then(carouselHtml => {
                    const skeletonContainer = screenshotsContainer.querySelector('.skeleton-container');
                    const carouselContainer = screenshotsContainer.querySelector('.carousel-container');

                    if (carouselContainer) {
                        carouselContainer.innerHTML = carouselHtml;
                        // Remove skeleton and show carousel
                        skeletonContainer.remove();
                        carouselContainer.classList.remove('hidden');

                        // Add event listeners to carousel images
                        carouselContainer.querySelectorAll('img').forEach(img => {
                            img.addEventListener('click', () => {
                                fullscreenImage.src = img.dataset.fullscreenSrc;
                                imageDialog.showModal();
                            });
                        });

                        // Add event listeners to carousel arrows to prevent default behavior
                        document.querySelectorAll('.carousel-item a').forEach(link => {
                            link.addEventListener('click', (e) => {
                                e.preventDefault(); // Prevent the default behavior of the anchor tag
                                const targetId = e.target.getAttribute('href');
                                document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
                            });
                        });
                    }
                });
            }

            // Add event listeners to category tags in app details
            detailsContent.querySelectorAll('.category-tag').forEach(tag => {
                tag.addEventListener('click', (e) => {
                    const category = e.target.dataset.category;
                    updateCategoryFilter(category);
                });
            });
        }, 500);

        return skeletonHtml;
    }

    // Event listener to close app details
    document.querySelector('form[method="dialog"] button').addEventListener('click', closeDetails);

    // Function to close app details
    function closeDetails() {
        appDetailsModal.close();

        // Update URL to remove app details
        const url = new URL(window.location);
        url.searchParams.delete('app');
        history.pushState({}, '', url);
    }
});
