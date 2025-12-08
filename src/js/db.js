
'use strict';

import { generateID, findNotebook, findNotebookIndex } from './utils.js';

//Object
let notekeeperDB = {};

/**
 * Initialize the local database. If the data exists in localtorage, It is loaded.
 * Otherwise, a new empty database is created.
 */

const initDB = function() {
    const db = localStorage.getItem('notekeeperDB');

    if (db) {
        notekeeperDB = JSON.parse(db);
    }
    else {
        notekeeperDB.notebooks = [];
        localStorage.setItem('notekeeperDB', JSON.stringify(notekeeperDB));
    }
}


initDB();

/**
 * Read the database from localstorage and update the notekeeperDB object.
 */
const readDB = function() {
    notekeeperDB = JSON.parse(localStorage.getItem('notekeeperDB'));
}

/** 
 * Write the notekeeperDB object to localstorage.
 */
const writeDB = function() {
    localStorage.setItem('notekeeperDB', JSON.stringify(notekeeperDB));
}



/**
 * Collections of functions for performing database CRUD operations.
 * The database state is managed in localstorage.
 */

export const db = {

    post: {

        /**
         * Create a new notebook in the database.
         * @param {*} name 
         * returns a notebook object
         */
        notebooks(name) {
            readDB();

            const newNotebookData = {
                id: generateID(),
                name: name,
                createdAt: new Date().toISOString(),
                notes: []
            }
            
            notekeeperDB.notebooks.push(newNotebookData);
            

            writeDB();

            return newNotebookData;
        },

        /** Adds a new note to a specified notebook in the database */
        note(notebookId, object) {
            readDB();

            const notebook = findNotebook(notekeeperDB, notebookId);

            const newNoteData = {
                id: generateID(),
                notebookId,
                ...object,
                postedOn: new Date().getTime()
            }

            notebook.notes.unshift(newNoteData); // add new note at the beginning of notes array            

            writeDB();

            return newNoteData;
        }
    },

    get : {

        /** 
         * Retrieve all notebooks from the database.
         */
        notebooks() { 
            readDB();

            return notekeeperDB.notebooks;

        },

        note(notebookId) {
            readDB();

            const notebook = findNotebook(notekeeperDB, notebookId);
            return notebook.notes;
        }
    },

    update : {
        notebook(notebookId, name) {
            readDB();

            const notebook = findNotebook(notekeeperDB, notebookId);
            notebook.name = name;

            writeDB();

            return notebook;
        }
    },

    delete : {
        notebook(notebookId) {
            readDB();

            const notebookIndex = findNotebookIndex(notekeeperDB, notebookId);
            notekeeperDB.notebooks.splice(notebookIndex, 1);

            writeDB();
            
        }
    }

    
}