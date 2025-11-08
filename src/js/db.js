
'use strict';

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
            

            writeDB();
        }
    }
}