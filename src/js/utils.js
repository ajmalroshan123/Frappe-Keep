
'use strict';


/**
 * 
 * @param {Array<HTMLElement>} $elements - An array of HTML elements to attach the event listeners to.
 * @param {String} eventType - The type of event to listen for (eg - 'click', 'mouseover').
 * @param {Function} callback - The function to be executed when event occurs
 */

const addEventOnElement = function ($elements, eventType, callback)
{
    $elements.forEach($element => $element.addEventListener(eventType, callback));
}

/**
 * Generate a greeting message based on current hour of the day.
 */

const getGreetinMsg = function(currentHour) {
    const greeting = 
    currentHour < 5 ? 'Night' :
    currentHour < 12 ? 'Morning' :
    currentHour < 15 ? 'Noon' :
    currentHour < 17 ? 'Afternoon' :
    currentHour < 20 ? 'Evening' :
    'Night';

    return `Good ${greeting}`;
   
}

let $lastActiveNavItem;

/** Activates a navigation item by adding the 'active class 
 * and deactivates the previously active item
*/

const activeNotebook = function() {
    $lastActiveNavItem?.classList.remove("active");
    this.classList.add('active'); // this: $navItem
    $lastActiveNavItem = this;
}


const makeEleEditable = function($element) {
    $element.setAttribute('contenteditable', true);
    $element.focus();
}

/**
 * Generate an Unique Id based on current timestamp
 */
const generateID = function() {
    return new Date().getTime().toString();
}

/** 
 * Find notebook in the database by its ID
 */
const findNotebook = function(db, notebookId) {
    return db.notebooks.find(notebook => notebook.id === notebookId);
}

/**
 * Finds the index of notebook in the array of Notebooks by itss ID
 */
const findNotebookIndex = function(db, notebookId) {
    return db.notebooks.findIndex(notebook => notebook.id === notebookId);
}

export {
    addEventOnElement,
    getGreetinMsg,
    activeNotebook,
    makeEleEditable,
    generateID,
    findNotebook,
    findNotebookIndex
}