
'use strict';

import { NavItem } from "./components/NavItem.js"
import { activeNotebook } from "./utils.js";
import { Card } from "./components/Card.js";


const $sidebar = document.querySelector('[data-sidebar-list]');
const $notePanelTitle = document.querySelector('[data-note-panel-title]');
const $notePanel = document.querySelector('[data-note-panel]');
const $noteCreateBtns = document.querySelectorAll('[data-note-create-btn]');
const emptyNotesTemplate = `
    <div class="empty-notes">
            <span class="material-symbols-rounded" aria-hidden="true">note_stack</span>

            <div class="text-headline-small"> No notes </div>
        </div>
    `;

/** 
 * Enable or disable note creation buttons based on the presence of notebooks.
 */
const disableNoteCreteBtns = function(isThereAnyNotebooks) {
    $noteCreateBtns.forEach( $item => {
        $item[isThereAnyNotebooks ? 'removeAttribute' : 'setAttribute']('disabled', true);
    })
}

/**
 * The Client Object manages interactions with the user interface (UI) to create, read,
 * update, and delete notebooks and notes.
 * It serves as the bridge between the user and the underlying database operations.
 */

export const client = {

    notebook : {
        /**
         * Creats a new notebook in the UI and based on provided notebook data.
         * @param {Object} notebookData 
         */
        create(notebookData) {
            const $navItem = NavItem(notebookData.id, notebookData.name);
            $sidebar.appendChild($navItem);
            activeNotebook.call($navItem);
            $notePanelTitle.textContent = notebookData.name;
            $notePanel.innerHTML = emptyNotesTemplate;
            disableNoteCreteBtns(true);
        },
    

        read(notebookList) {
            notebookList.forEach((notebookData, index) => {
                const $navItem = NavItem(notebookData.id, notebookData.name);
                $sidebar.appendChild($navItem);

                console.log($navItem, "-> navitem");
                

                if (index === 0) {
                    activeNotebook.call($navItem);
                    $notePanelTitle.textContent = notebookData.name;

                    
                }
            })
        },

        /**
         * Update the UI to reflect changes made to a notebook.
         * @param {string} notebookId 
         * @param {object} notebookData - new data for the notebook
         */
        update(notebookId, notebookData) {
            const $oldNotebook = document.querySelector(`[data-notebook="${notebookId}"]`);
            console.log($oldNotebook);
            
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
            const $activeNavItem =  $deletedNotebook.nextElementSibling ?? $deletedNotebook.previousElementSibling;

            if ($activeNavItem) {
                $activeNavItem.click();
            } else {
                $notePanelTitle.innerHTML = '';
                $notePanel.innerHTML = '';
                disableNoteCreteBtns(false);
            }

            $deletedNotebook.remove();
        }
    },

    /**  
     * Create a new note in the UI based on provided note data.
     */
    note : {
        create(noteData) {

            if (!$notePanel.querySelector('[data-empty-notes]')) {
                $notePanel.innerHTML = '';
            }

            const $card = Card(noteData);
            $notePanel.appendChild($card);

        },

        // Read and render existing notes in the UI
        read(noteList) {

            if (noteList.length) {
                $notePanel.innerHTML = '';

                noteList.forEach( noteData => {
                const $card = Card(noteData);
                $notePanel.appendChild($card);
                });
            }
            else {
                $notePanel.innerHTML = emptyNotesTemplate;
            }
            
        }
    }
}