
'use strict';

import { NavItem } from "./components/NavItem.js"
import { activeNotebook } from "./utils.js";


const $sidebar = document.querySelector('[data-sidebar-list]');
const $notePanelTitle = document.querySelector('[data-note-panel-title]');
const $notePanel = document.querySelector('[data-note-panel]');

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
            const $deletedNotebook = document.querySelector(`[data-notebook= "${notebookId}"]`);
            const $activeNavItem =  $deletedNotebook.nextElementSibling ?? $deletedNotebook.previousElementSibling;

            if ($activeNavItem) {
                $activeNavItem.click();
            } else {
                $notePanelTitle.innerHTML = '';
                $notePanel.innerHTML = '';
            }

            $deletedNotebook.remove();
        }
    },
}