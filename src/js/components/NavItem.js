
'use strict';

import { Tooltip } from "./Tooltip.js";

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

    return $navItem;
}