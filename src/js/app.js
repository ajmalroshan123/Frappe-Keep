
'use strict';

/** Module import */
import { 
    addEventOnElement, 
    getGreetinMsg, 
    activeNotebook, 
    makeEleEditable } 
from "./utils.js";
import { Tooltip } from "./components/Tooltip.js";
import { db } from "./db.js";
import { client } from "./client.js";
import { NoteModel } from "./components/Modal.js";
import { Card } from "./components/Card.js";

/** ===== SIDEBAR (toggle using Material Symbols left_panel_close / left_panel_open) ===== */

const $sidebar   = document.querySelector('[data-sidebar]');
const $sidebarTogglers = document.querySelectorAll('[data-sidebar-toggler]');
const $overlay   = document.querySelector('[data-sidebar-overlay]');
const $toggleBtn = document.getElementById('sidebar-edge-toggle');

function isMobile() { return window.innerWidth < 922; }

/**
 * Update icon text and tooltip to match the current sidebar state.
 * left_panel_close = sidebar is open, show collapse icon
 * left_panel_open  = sidebar is closed, show expand icon
 */
function updateToggleIcon() {
    if (!$toggleBtn) return;
    const $icon = $toggleBtn.querySelector('.sidebar-toggle-icon');
    if (!$icon) return;

    const isCollapsed = $sidebar.classList.contains('active');

    if (isMobile()) {
        $icon.textContent = isCollapsed ? 'left_panel_open' : 'left_panel_close';
        $toggleBtn.dataset.tooltip = isCollapsed ? 'Open sidebar' : 'Close sidebar';
    } else {
        // Desktop: collapsed = active → show open icon; expanded = show close icon
        $icon.textContent = isCollapsed ? 'left_panel_open' : 'left_panel_close';
        $toggleBtn.dataset.tooltip = isCollapsed ? 'Expand sidebar' : 'Collapse sidebar';
    }
}

function toggleSidebar() {
    $sidebar.classList.toggle('active');
    if (isMobile()) {
        $overlay.classList.toggle('active');
    }
    updateToggleIcon();
}

addEventOnElement($sidebarTogglers, 'click', toggleSidebar);

// Close mobile drawer when overlay is clicked
$overlay.addEventListener('click', () => {
    if (isMobile() && $sidebar.classList.contains('active')) {
        toggleSidebar();
    }
});

updateToggleIcon();

/**
 * Initialize tooltip behavior for all DOM elements with 'data-tooltip' attribute.
 */
const $tooltipELes = document.querySelectorAll('[data-tooltip]');
$tooltipELes.forEach($elem => Tooltip($elem));

// Also attach tooltip to the toggle button (dynamic tooltip)
if ($toggleBtn) Tooltip($toggleBtn);


/**
 * Show greeting message on homepage
 */
const $greetEle = document.querySelector('[data-greeting]');
const currentHour = new Date().getHours();
$greetEle.textContent = getGreetinMsg(currentHour);


/**
 * Show Current date on homepage
 */
const $currentDateEle = document.querySelector('[data-current-date]');
$currentDateEle.textContent = new Date().toDateString().replace(' ', ', ');



/**
 * Notebook create field
 * Guards against spamming: only allow one pending (un-named) notebook field at a time.
 */

const $sidebarList = document.querySelector('[data-sidebar-list]');
const $addNotebookBtn = document.querySelector('[data-add-notebook]');

const showNotebookField = function() {
    // Guard: do not create another field if one is already pending
    const existing = $sidebarList.querySelector('[data-notebook-field][contenteditable="true"]');
    if (existing) {
        existing.focus();
        return;
    }

    const $navItem = document.createElement('div');
    $navItem.classList.add('nav-item');

    $navItem.innerHTML = `
        <span class="material-symbols-rounded icon" aria-hidden="true">folder</span>
        <span class="text-label-large text" data-notebook-field data-placeholder="Notebook name..."></span>
        <div class="state-layer"></div>
    `;

    $sidebarList.appendChild($navItem);

    const $navItemField = $navItem.querySelector('[data-notebook-field]');

    activeNotebook.call($navItem);
    makeEleEditable($navItemField);

    $navItemField.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.blur();
        }
        if (event.key === 'Escape') {
            this.textContent = '';
            this.blur();
        }
    });

    let isSaved = false;
    $navItemField.addEventListener('blur', function() {
        if (isSaved) return;
        isSaved = true;
        
        const name = this.textContent.trim();
        if (!name) {
            this.parentElement.remove();
        } else {
            const notebookData = db.post.notebooks(name);
            this.parentElement.remove();
            client.notebook.create(notebookData);
        }
    });
};

$addNotebookBtn.addEventListener('click', showNotebookField);


/** 
 * Render existing notebooks from database and show in sidebar 
*/
const renderExistedNotebook = function() {
    const notebookList = db.get.notebooks();
    client.notebook.read(notebookList);
};

renderExistedNotebook();


/** ===================================================================
 *  GLOBAL SEARCH — searches across ALL notebooks
 * =================================================================== */

const $searchInput     = document.querySelector('[data-search-input]');
const $main            = document.querySelector('.main');
const $notePanel       = document.querySelector('[data-note-panel]');
const $notePanelTitle  = document.querySelector('[data-note-panel-title]');
const $resultsQuery    = document.querySelector('[data-results-query]');
const $resultsCount    = document.querySelector('[data-results-count]');

/**
 * Escape a string for safe insertion into RegExp
 */
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Wrap matched text inside a card element with <mark class="search-highlight">
 */
function highlightText(el, query) {
    if (!el || !query) return;
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    el.innerHTML = el.textContent.replace(regex, '<mark class="search-highlight">$1</mark>');
}

/**
 * Collect all notes across all notebooks from the DB.
 * Returns array of { note, notebookName }.
 */
function getAllNotes() {
    const notebooks = db.get.notebooks();
    const results = [];
    notebooks.forEach(nb => {
        (nb.notes || []).forEach(note => {
            results.push({ note, notebookName: nb.name });
        });
    });
    return results;
}

/**
 * Run a global search and render results into the note panel.
 */
function runGlobalSearch(query) {
    const q = query.trim().toLowerCase();
    $main.classList.add('search-active');

    if (!q) {
        // Empty query — restore active notebook view
        exitSearchMode();
        return;
    }

    // Filter all notes across all notebooks
    const allNotes = getAllNotes();
    const matches = allNotes.filter(({ note }) => {
        const title = (note.title || '').toLowerCase();
        const text  = (note.text  || '').toLowerCase();
        return title.includes(q) || text.includes(q);
    });

    // Update results header
    if ($resultsQuery) $resultsQuery.textContent = `Results for "${query}"`;
    if ($resultsCount) {
        $resultsCount.textContent = matches.length === 0
            ? 'No results'
            : `${matches.length} note${matches.length === 1 ? '' : 's'} found`;
    }

    // Render results
    $notePanel.innerHTML = '';

    if (!matches.length) {
        $notePanel.innerHTML = `
            <div class="search-no-results">
                <span class="material-symbols-rounded" aria-hidden="true">search_off</span>
                <div class="text-headline-small">No notes match "<strong>${query}</strong>"</div>
                <div class="text-body-medium">Try a different search term.</div>
            </div>
        `;
        return;
    }

    // Build card elements for each match — with notebook badge
    matches.forEach(({ note, notebookName }) => {
        const $card = Card(note);

        // Inject notebook badge at the top of the card (before h3)
        const $badge = document.createElement('span');
        $badge.className = 'notebook-badge';
        $badge.innerHTML = `<span class="material-symbols-rounded" aria-hidden="true">folder</span>${notebookName}`;
        $card.prepend($badge);

        // Highlight the matching text within the card
        highlightText($card.querySelector('.card-title'), query);
        highlightText($card.querySelector('.card-text'),  query);

        $notePanel.appendChild($card);
    });
}

/**
 * Exit search mode: restore the previously active notebook view.
 */
function exitSearchMode() {
    $main.classList.remove('search-active');

    // Re-render the active notebook
    const $activeNotebook = document.querySelector('[data-notebook].active');
    if ($activeNotebook) {
        const noteList = db.get.note($activeNotebook.dataset.notebook);
        $notePanelTitle.textContent = $activeNotebook.querySelector('[data-notebook-field]')?.textContent.trim() || '';
        client.note.read(noteList);
    } else {
        $notePanel.innerHTML = '';
        $notePanelTitle.textContent = '';
        const $emptyNotesArea = document.querySelector('[data-empty-notes-area]');
        if ($emptyNotesArea) $emptyNotesArea.style.display = 'flex';
    }
}

// Attach search input handler
$searchInput.addEventListener('input', function() {
    runGlobalSearch(this.value);
});

// Clear search on Escape
$searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        this.value = '';
        exitSearchMode();
        this.blur();
    }
});


/** 
 * Create new note — open modal
*/
const $noteCreateBtns = document.querySelectorAll('[data-note-create-btn]');

// Also handle the static empty-notes-area click → open note modal
const $emptyNotesArea = document.querySelector('[data-empty-notes-area]');
if ($emptyNotesArea) {
    $emptyNotesArea.addEventListener('click', openNoteModal);
}

function openNoteModal() {
    const modal = NoteModel();
    modal.open();

    modal.onSubmit(noteObj => {
        let activeNotebookEl = document.querySelector('[data-notebook].active');

        // Auto-create a default notebook if none exists
        if (!activeNotebookEl) {
            const notebookData = db.post.notebooks('My Notebook');
            client.notebook.create(notebookData);
            activeNotebookEl = document.querySelector('[data-notebook].active');
        }

        const activeNotebookId = activeNotebookEl.dataset.notebook;
        const newNote = db.post.note(activeNotebookId, noteObj);
        client.note.create(newNote);

        modal.close();
    });
}

addEventOnElement($noteCreateBtns, 'click', openNoteModal);


/** 
 * Render existing notes from database and show in the active notebook
 */
const renderExistedNotes = function() {
    const activeNotebookId = document.querySelector('[data-notebook].active')?.dataset.notebook;

    if (activeNotebookId) {
        const noteList = db.get.note(activeNotebookId);
        client.note.read(noteList);
    } else {
        $notePanelTitle.textContent = '';
        $notePanel.innerHTML = '';

        // Show centred empty-notes-area
        if ($emptyNotesArea) $emptyNotesArea.style.display = 'flex';
    }
};

renderExistedNotes();