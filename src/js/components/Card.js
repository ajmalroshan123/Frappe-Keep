
'use strict';

import { Tooltip } from "./Tooltip.js";
import { getRelativeTime } from "../utils.js";
import { DeleteConfirmModal, NoteModel } from "./Modal.js"; 
import { client } from "../client.js";
import { db } from "../db.js";

/**
 * Creates a Card element for a note based on provided note data.
 */
export const Card = function(noteData) {

    const {id, title, text, postedOn, notebookId} = noteData;

    const $card = document.createElement('div');
    $card.classList.add('card');
    $card.setAttribute("data-note", id);

    $card.innerHTML = `
        <h3 class="card-title text-title-medium">${title}</h3>
            <p class="car-text text-body-large">${text}</p>

            <div class="wrapper">
                <span class="card-time text-label-large">${ getRelativeTime(postedOn) }</span>

                <button class="icon-btn large" aria-label="Delete note"
                data-tooltip="Delete note" data-delete-btn>
                <span class="material-symbols-rounded" aria-hidden="true">delete</span>
                
                <div class="state-layer"></div>

                </button>

            </div>

            <div class="state-layer"></div>
    `;

    Tooltip($card.querySelector('[data-tooltip]'));


    /**
     * Note details view and edit functionality.
     */
    $card.addEventListener('click', function() {
        const modal = NoteModel(title, text, getRelativeTime(postedOn));
        modal.open();

        modal.onSubmit(function(noteData) {
            const updatedData = db.update.note(id, noteData);

            // update the note in the client UI
            client.note.update(id, updatedData);
            modal.close();
        })
    })


    // Delete note functionality
    const $deleteBtn = $card.querySelector('[data-delete-btn]');

    $deleteBtn.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent triggering the card click event

        const modal = DeleteConfirmModal(title);

        modal.open();

        modal.onSubmit(function() {
            const existedNotes = db.delete.note(notebookId, id);
            
            client.note.delete(id, existedNotes.length);
            modal.close();
        })
    })


    return $card;
}