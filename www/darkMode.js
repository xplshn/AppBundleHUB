document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.querySelector('.theme-controller');
    const navElement = document.querySelector('nav');

    if (themeToggle) {
        // Set initial state
        const currentTheme = document.body.getAttribute('data-theme');
        themeToggle.checked = currentTheme === 'dark';

        // Handle theme changes
        themeToggle.addEventListener('change', (e) => {
            const isDarkMode = e.target.checked;
            const newTheme = isDarkMode ? 'dark' : 'light';
            document.body.setAttribute('data-theme', newTheme);
            if (navElement) {
                navElement.setAttribute('data-theme', newTheme);
            }
        });
    }
});