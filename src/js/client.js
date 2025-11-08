
'use strict';

import { NavItem } from "./components/NavItem.js"
import { activeNotebook } from "./utils.js";


const $sidebar = document.querySelector('[data-sidebar-list]');
const $notePanelTitle = document.querySelector('[data-note-panel-title]');

/**
 * The Client Object manages interactions with the user interface (UI) to create, read,
 * update, and delete notebooks and notes.
 * It serves as the bridge between the user and the underlying database operations.
 */

export const client = {

    notebooks : {
        /**
         * Creats a new notebook in the UI and based on provided notebook data.
         * @param {Object} notebookData 
         */
        create(notebookData) {
            const $navItem = NavItem(notebookData.id, notebookData.name);
            $sidebar.appendChild($navItem);
            activeNotebook.call($navItem);
            $notePanelTitle.textContent = notebookData.name;
        }
    }
}