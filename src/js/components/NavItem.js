
'use strict';

import { Tooltip } from "./Tooltip.js";
import { activeNotebook, makeEleEditable } from "../utils.js";
import { db } from "../db.js";
import { client } from "../client.js";
import { DeleteConfirmModal } from "./Modal.js";

const $notePanelTitle = document.querySelector('[data-note-panel-title]');

/** 
 * Creates navigation item element for a notebook, The element includes the notebook name
 * and necessary attributes and classes. allows interaction with the notebook in the sidebar.
 * (e.g., selecting the notebook), (editing the notebook name), (deleting the notebook).
 */

/**
 * 
 * @param {string} id - the unique identifier of the notebook
 * @param {string} name - the name of the notebook
 */

export const NavItem = function (id, name) {
    const $navItem = document.createElement('div');
    $navItem.classList.add('nav-item');
    $navItem.setAttribute('data-notebook', id);

    $navItem.innerHTML =  `
        <span class="text text-label-large" data-notebook-field> ${name} </span>

                <button class="icon-btn small" aria-label="Edit Notebook" data-tooltip="Edit Notebook" data-edit-btn>
                    <span class="material-symbols-rounded" aria-hidden="true">edit</span>

                    <div class="state-layer"></div>
                </button>

                <button class="icon-btn small" aria-label="Delete Notebook" data-tooltip="Delete Notebook" data-delete-btn>
                    <span class="material-symbols-rounded" aria-hidden="true">delete</span>

                    <div class="state-layer"></div>
                </button>

                <div class="state-layer"></div>
    `;

    // Show Tooltip for Edit and Delete buttons
    const $tooltipElem = $navItem.querySelectorAll('[data-tooltip]');
    $tooltipElem.forEach($elem => Tooltip($elem));


    /** Handles the click event on the navigation item. updates the note panel */
    $navItem.addEventListener('click', function() {
        $notePanelTitle.textContent = name;
        activeNotebook.call(this);
    });


    //Notedbook Edit functionality
    const $navItemEditBtn = $navItem.querySelector('[data-edit-btn]');
    const $navItemField = $navItem.querySelector('[data-notebook-field]');

    $navItemEditBtn.addEventListener('click', makeEleEditable.bind(null, $navItemField));

    $navItemField.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            this.removeAttribute('contenteditable');

            // update edited data in the database
            const updatedNotebookData = db.update.notebook(id, this.textContent);

            console.log(updatedNotebookData);
            

            // Render updated notebook
            client.notebook.update(id, updatedNotebookData);
        }
    });


    // Notebook Delete functionality
    const $navItemDeleteBtn = $navItem.querySelector('[data-delete-btn]');
    $navItemDeleteBtn.addEventListener('click', function() {

        const model = DeleteConfirmModal(name);

        model.open();

    });


    return $navItem;
}