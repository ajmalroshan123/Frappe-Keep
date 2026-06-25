
'use strict';

import { NavItem } from "./components/NavItem.js"
import { activeNotebook } from "./utils.js";
import { Card } from "./components/Card.js";


const $sidebar = document.querySelector('[data-sidebar-list]');
const $notePanelTitle = document.querySelector('[data-note-panel-title]');
const $notePanel = document.querySelector('[data-note-panel]');
const $noteCreateBtns = document.querySelectorAll('[data-note-create-btn]');
const $emptyNotesArea = document.querySelector('[data-empty-notes-area]');

const emptyNotesTemplate = `
    <div class="empty-notes" data-empty-notes style="cursor:pointer;">
            <span class="material-symbols-rounded" aria-hidden="true">note_add</span>

            <div class="text-headline-small"> No notes here. Click to add a new note. </div>
        </div>
    `;

/** Inject empty template into $notePanel and attach click-to-create handler */
function showEmptyState() {
    $notePanel.innerHTML = emptyNotesTemplate;
    const $empty = $notePanel.querySelector('[data-empty-notes]');
    if ($empty) {
        $empty.addEventListener('click', () => {
            // Dispatch a click on the note-create-bar which has the note create logic
            const $bar = document.querySelector('[data-note-create-btn]');
            if ($bar) $bar.click();
        });
    }
}

/** 
 * We no longer disable the note creation buttons. 
 * If a user clicks 'New Note' with no notebooks, we will auto-create one.
 */
const disableNoteCreteBtns = function(isThereAnyNotebooks) {
    $noteCreateBtns.forEach( $item => {
        $item.removeAttribute('disabled');
    });
};

/** Helper: hide the centred empty-notes-area overlay */
function hideEmptyArea() {
    if ($emptyNotesArea) $emptyNotesArea.style.display = 'none';
}

/**
 * The Client Object manages interactions with the user interface (UI) to create, read,
 * update, and delete notebooks and notes.
 * It serves as the bridge between the user and the underlying database operations.
 */

export const client = {

    notebook : {
        /**
         * Creates a new notebook in the UI based on provided notebook data.
         * @param {Object} notebookData 
         */
        create(notebookData) {
            const $navItem = NavItem(notebookData.id, notebookData.name);
            $sidebar.appendChild($navItem);
            activeNotebook.call($navItem);
            $notePanelTitle.textContent = notebookData.name;
            showEmptyState();
            hideEmptyArea();
            disableNoteCreteBtns(true);
        },
    

        read(notebookList) {
            if (!notebookList || !notebookList.length) {
                disableNoteCreteBtns(false);
                return;
            }
            notebookList.forEach((notebookData, index) => {
                const $navItem = NavItem(notebookData.id, notebookData.name);
                $sidebar.appendChild($navItem);

                if (index === 0) {
                    activeNotebook.call($navItem);
                    $notePanelTitle.textContent = notebookData.name;
                }
            });
            hideEmptyArea();
            disableNoteCreteBtns(true);
        },

        /**
         * Update the UI to reflect changes made to a notebook.
         * @param {string} notebookId 
         * @param {object} notebookData - new data for the notebook
         */
        update(notebookId, notebookData) {
            const $oldNotebook = document.querySelector(`[data-notebook="${notebookId}"]`);
            const $newNotebook = NavItem(notebookData.id, notebookData.name);

            $notePanelTitle.textContent = notebookData.name;
            $sidebar.replaceChild($newNotebook, $oldNotebook);
            activeNotebook.call($newNotebook);
        },

        /**
         * Delete notebook from the UI
         */
        delete(notebookId) {
            const $deletedNotebook = document.querySelector(`[data-notebook="${notebookId}"]`);
            const $activeNavItem = $deletedNotebook.nextElementSibling ?? $deletedNotebook.previousElementSibling;

            if ($activeNavItem) {
                $activeNavItem.click();
            } else {
                $notePanelTitle.innerHTML = '';
                $notePanel.innerHTML = '';
                disableNoteCreteBtns(false);
                // Show centred empty area when no notebooks remain
                if ($emptyNotesArea) $emptyNotesArea.style.display = 'flex';
            }

            $deletedNotebook.remove();
        }
    },

    /**  
     * Create a new note in the UI based on provided note data.
     */
    note : {
        create(noteData) {
            hideEmptyArea();

            if ($notePanel.querySelector('[data-empty-notes]')) {
                $notePanel.innerHTML = '';
            }

            const $card = Card(noteData);
            $notePanel.prepend($card);
        },

        // Read and render existing notes in the UI
        read(noteList) {
            hideEmptyArea();

            if (noteList.length) {
                $notePanel.innerHTML = '';

                noteList.forEach( noteData => {
                const $card = Card(noteData);
                $notePanel.appendChild($card);
                });
            }
            else {
                showEmptyState();
            }

            
        },

        // Update the UI to reflect changes made to a note
        update(noteId, noteData) {
            const $oldCard = document.querySelector(`[data-note="${noteId}"]`);
            const $newCard = Card(noteData);
            $notePanel.removeChild($oldCard);
            $notePanel.prepend($newCard);
        },

        delete(noteId, existedNotesCount) {
            const $deletedCard = document.querySelector(`[data-note="${noteId}"]`);
            $deletedCard.remove();  

            if(!existedNotesCount) {
                showEmptyState();
            }
        }
    }
};