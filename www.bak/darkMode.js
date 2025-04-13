document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.querySelector('.theme-controller');
    const navElement = document.querySelector('nav');

    // Function to apply the theme
    const applyTheme = (theme) => {
        document.body.setAttribute('data-theme', theme);
        if (navElement) {
            navElement.setAttribute('data-theme', theme);
        }
        if (themeToggle) {
            themeToggle.checked = theme === 'dark';
        }
    };

    // Detect user's preferred color scheme
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme');
    const defaultTheme = storedTheme || (prefersDarkScheme ? 'dark' : 'light');

    // Apply the detected/stored theme
    applyTheme(defaultTheme);

    // Handle theme toggle changes
    if (themeToggle) {
        themeToggle.addEventListener('change', (e) => {
            const isDarkMode = e.target.checked;
            const newTheme = isDarkMode ? 'dark' : 'light';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme); // Save the user's preference
        });
    }
});
