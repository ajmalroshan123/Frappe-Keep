
'use strict';


const toggleTheme = function () {
    const /** {string} */ currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const /** {string} */ newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

/**
 * Initialize the theme
 */

const storedTheme = localStorage.getItem('theme');

const /** {boolean} */ systemThemeIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

const /** {string} */ initialTheme = storedTheme ?? (systemThemeIsDark ? 'dark': 'light');
document.documentElement.setAttribute('data-theme', initialTheme);


/** 
 * Attach toggleTheme to the buttom event click
 */

window.addEventListener('DOMContentLoaded', function() {
    const /** {HTMLElement} */ $themebtn = document.querySelector('[data-theme-btn]');
    if ($themebtn) $themebtn.addEventListener('click', toggleTheme);
})