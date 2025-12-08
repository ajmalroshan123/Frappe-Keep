
'use strict';

/** Module import */
import { 
    addEventOnElement, 
    getGreetinMsg, 
    activeNotebook, 
    makeEleEditable } 
from "./utils.js";
import {Tooltip} from "./components/Tooltip.js"
import { db } from "./db.js";
import { client } from "./client.js";
import { NoteModel } from "./components/Modal.js";

/** Toggle sidebar in small screen */

const $sidebar = document.querySelector('[data-sidebar]');
const $sidebarTogglers = document.querySelectorAll('[data-sidebar-toggler]');
const $overlay = document.querySelector('[data-sidebar-overlay]');



addEventOnElement($sidebarTogglers, 'click', function() {
    $sidebar.classList.toggle('active');
    $overlay.classList.toggle('active');
})


/**
 * Initialize tootip behaivior for all DOM elements with 'data-tooltip' attribute.
 */

const $tooltipELes = document.querySelectorAll('[data-tooltip]');
$tooltipELes.forEach($elem => Tooltip($elem));




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
 */

const $sidebarList = document.querySelector('[data-sidebar-list]');
const $addNotebookBtn = document.querySelector('[data-add-notebook]');

const showNotebookField = function() {
    const $navItem = document.createElement('div');
    $navItem.classList.add('nav-item');

    $navItem.innerHTML = `
        <span class="text-label-large" data-notebook-field></span>
        <div class="state-layer"></div>
    `;

    $sidebarList.appendChild($navItem);

    const $navItemField = $navItem.querySelector('[data-notebook-field]');

    // Active new created notebook and deactive last one
    activeNotebook.call($navItem);

    // Make notebook field content editable and focus
    makeEleEditable($navItemField)

    // when user press 'Enter' then create notebook
    $navItemField.addEventListener('keydown', createNotebook);
}

$addNotebookBtn.addEventListener('click', showNotebookField);


const createNotebook = function (event) {
    
    if (event.key === 'Enter') {
        
        // store new created notebook in database
        const notebookData = db.post.notebooks(this.textContent || 'Untitled Notebook'); // this :- refers to the notebook field element

        this.parentElement.remove(); // remove the notebook field element
        client.notebook.create(notebookData); // create notebook in the UI


    }
}


/** 
 * Render existing notebooks from database and show in sidebar 
*/

const renderExistedNotebook = function() {
    const notebookList = db.get.notebooks();
    client.notebook.read(notebookList);
}

renderExistedNotebook();


/** 
 * Create new note 
 * 
 * Attaches event listener to a collection of elements representing buttons for adding new notes.
 * when button is clicked, it triggers the creation of a new note through the client interface.
*/

const $noteCreateBtns = document.querySelectorAll('[data-note-create-btn]');

addEventOnElement($noteCreateBtns, 'click', function() {
    const modal = NoteModel();
    modal.open();

    // Handle the submittion of the new note to the database and client
    modal.onSubmit(noteObj => {
        const activeNotebookId = document.querySelector('[data-notebook].active').dataset.notebook;

        const newNote = db.post.note(activeNotebookId, noteObj);

        client.note.create(newNote)
        

        modal.close();
    })
});