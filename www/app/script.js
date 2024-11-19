document.addEventListener('DOMContentLoaded', () => {
    const appDetailsModal = document.getElementById('app-details-modal');
    const detailsContent = document.querySelector('.details-body');
    const imageDialog = document.getElementById('image-dialog');
    const fullscreenImage = document.getElementById('fullscreen-image');

    const dialogClose = document.getElementById('close-dialog');

    // Function to show app details
    window.showAppDetails = function (name, apps) {
        if (!Array.isArray(apps)) {
            console.error('Apps data is not an array');
            return;
        }

        const app = apps.find(app => (app.pkg_name || app.pkg) === name);
        if (!app) {
            console.error('App not found:', name);
            return;
        }

        try {
            // Show modal first
            appDetailsModal.showModal();

            // Update content
            detailsContent.innerHTML = createAppDetails(app);

            // Update URL with app details
            const url = new URL(window.location);
            url.searchParams.set('app', name);
            history.pushState({ app: name }, '', url);
        } catch (error) {
            console.error('Error showing app details:', error);
        }
    };

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
                    .map(cat => `<span class="badge badge-neutral category-tag cursor-pointer" data-category="${cat}">${cat}</span>`)
                    .join('')
                : '';

            // Format build date
            const buildDate = new Date(app.build_date);
            const formattedDate = buildDate.toLocaleDateString('es-AR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            // Parse and format rich description if available
            const richDescriptionHtml = app.rich_description
                ? `
                    <div class="rich-description mt-4 mb-6 prose max-w-none">
                        <h3 class="text-xl font-semibold mb-3">About ${app.pkg_name || app.pkg}</h3>
                        ${app.rich_description.replace(/\u003cp\u003e/g, '<p>')}
                    </div>
                  `
                : '';

            return `
                <div class="details-header flex items-start gap-4 mb-4">
                    <img src="${app.icon}" alt="${app.pkg_name || app.pkg}" class="app-icon w-16 h-16 object-contain"
                         onerror="this.style.display='none';">
                    <div>
                        <h2 class="text-2xl font-semibold">${app.pkg_name || app.pkg}</h2>
                        <p>${app.description || 'No description available.'}</p>
                        <div class="category-tags flex flex-wrap gap-2 mt-2">${categoryTags}</div>
                    </div>
                </div>
                ${richDescriptionHtml}
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
                    ${app.homepage ? `<a href="${app.homepage}" class="link-button btn btn-secondary" target="_blank">Website</a>` : ''}
                </div>
                <div class="install-section p-4 bg-base-200 rounded-lg mb-4">

                <div class="tooltip tooltip-info tooltip-right" data-tip="one-click-install requires dbin protocol to be set up correctly on your system">
                    <a href="dbin://install?${app.pkg}" class="install-button btn btn-ghost text-lg">Install <span class="nf nf-oct-desktop_download"></span></a>
                </div>

                    <h4 class="text-base font-semibold mb-2"># If you don't have <span class="code">dbin</span> installed:</h4>
                    <div class="code bg-base-300 p-2 rounded mb-4">
                        <pre data-prefix="$"><code>wget -qO- "https://raw.githubusercontent.com/xplshn/dbin/master/stubdl" | sh -s -- install ${app.pkg_name || app.pkg}</code></pre>
                    </div>
                    <h4 class="text-base font-semibold mb-2"># If you have <span class="code">dbin</span> installed:</h4>
                    <div class="code bg-base-300 p-2 rounded mb-4">
                        <pre data-prefix="$"><code>dbin install ${app.pkg}</code></pre>
                    </div>
                    <h4 class="text-base font-semibold mb-2"># Alternative using <span class="code">soar</span>:</h4>
                    <div class="code bg-base-300 p-2 rounded">
                        <pre data-prefix="$"><code>soar add ${app.pkg}</code></pre>
                    </div>
                </div>
                ${app.note ? `<div class="app-note alert alert-warning"><strong>Note:</strong> ${app.note}</div>` : ''}
            `;
        }

        // Function to create carousel HTML only for valid screenshots
        function createCarouselHtml(screenshots) {
            if (!Array.isArray(screenshots) || screenshots.length === 0) {
                return Promise.resolve('<p>No screenshots available.</p>');
            }

            const loadingPromises = screenshots.map((src, index) =>
                new Promise((resolve) => {
                    const img = new Image();
                    img.onload = () => resolve({ src, index, valid: true });
                    img.onerror = () => resolve({ src, index, valid: false });
                    img.src = src;
                })
            );

            return Promise.all(loadingPromises)
                .then(results => {
                    const validScreenshots = results.filter(result => result.valid);

                    if (validScreenshots.length === 0) {
                        return '<p>No screenshots available.</p>';
                    }

                    let carouselHtml = '<div class="carousel w-full h-64 rounded-lg">';
                    validScreenshots.forEach((screenshot, idx) => {
                        const slideId = `slide${idx + 1}`;
                        const prevSlide = idx === 0 ? validScreenshots.length : idx;
                        const nextSlide = idx === validScreenshots.length - 1 ? 1 : idx + 2;

                        carouselHtml += `
                            <div id="${slideId}" class="carousel-item relative w-full">
                                <img src="${screenshot.src}" class="w-full h-full object-contain cursor-pointer" alt="Screenshot ${idx + 1}" data-fullscreen-src="${screenshot.src}"/>
                                <div class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                                    <button data-target="slide${prevSlide}" class="btn btn-circle prev-img">❮</button>
                                    <button data-target="slide${nextSlide}" class="btn btn-circle next-img">❯</button>
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

                    if (!carouselContainer) {
                        console.log('error')
                        return null
                    }

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
                    carouselContainer.querySelectorAll('.prev-img, .next-img').forEach(button => {
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
                });
            }

        }, 1000);

        return skeletonHtml;
    }
});
