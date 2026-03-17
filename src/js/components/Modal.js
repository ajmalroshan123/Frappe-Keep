
'use strict';


const $overlay = document.createElement('div');
$overlay.classList.add('overlay', 'modal-overlay');


/**
 * Creates and manages a modal for adding and editing notes.
 */
const NoteModel = function(title = 'Untitled', text = 'Add your note here...', time = '') {

    const $modal = document.createElement('div');
    $modal.classList.add('modal');

    $modal.innerHTML = `
            <button class="icon-btn large" aria-label="Close modal" data-close-btn>
            <span class="material-symbols-rounded" aria-hidden="true">close</span>

            <div class="state-layer"></div>
            </button>

            <input type="text" placeholder="Untitled" value="${ title }" 
            class="modal-title text-title-medium" data-note-field>

            <textarea placeholder="Take a note..." class="modal-text 
            text-body-large custom-scrollbar" data-note-field> ${text} </textarea>

            <div class="modal-footer">
                <span class="time text-label-large">${ time }</span>

                <button class="btn text" data-submit-btn>
                    <span class="text-label-large">Save</span>

                    <div class="state-layer"></div>
                </button>
            </div>
    `;

    const $submitBtn = $modal.querySelector('[data-submit-btn]');
    $submitBtn.disabled = true;

    const [$titleField, $textField] = $modal.querySelectorAll('[data-note-field]');

    const enableSubmit = function() {
        $submitBtn.disabled = !$titleField.value && !$textField.value;
    }

    $textField.addEventListener('keyup', enableSubmit);
    $titleField.addEventListener('keyup', enableSubmit);
    
    


    /** 
     * Opens the note modal by appending it to the document body and setting focus on the title field 
    */
    const open = function() {
        document.body.appendChild($modal);
        document.body.appendChild($overlay);
        $overlay.addEventListener('click', close);
        enableSubmit(); // enable Save if fields already have content (e.g. defaults)
        $titleField.focus();
    }

    /** Close the note modal by removing it from document body */
    const close = function() {
        $overlay.removeEventListener('click', close);
        document.body.removeChild($modal);
        document.body.removeChild($overlay);
    }

    const $closeBtn = $modal.querySelector('[data-close-btn]');
    $closeBtn.addEventListener('click', close);

    /** 
     * Handles the submission of the note modal
     * @param {Function} callback - The callback function to execute on submission
     */

    const onSubmit = function(callback) {
        $submitBtn.addEventListener('click', function() {
            const /** {Object} */ noteData = {
                title: $titleField.value,
                text: $textField.value
            }

            callback(noteData);
        })
    }

    return { open, close, onSubmit };

}

/**
 * Creates and manages a delete confirmation modal for deleting a notebook.
 * @param {string} title 
 */
const DeleteConfirmModal = function(title) {
    const $modalEl = document.createElement('div');
    $modalEl.classList.add('modal', 'modal--compact');

    $modalEl.innerHTML = `
        <h3 class="modal-title text-title-medium">
            Are you sure you want to delete <strong>"${ title }"</strong>?
        </h3>

        <div class="modal-footer">
            <button class="btn text" data-action-btn="false">
                <span class="text-label-large">Cancel</span>

                <div class="state-layer"></div>
            </button>

            <button class="btn fill" data-action-btn="true">
                <span class="text-label-large">Delete</span>

                <div class="state-layer"></div>
            </button>
        </div>
        `;

        // opens the Delete confirmation modal by appending it to the document body
        const open = function() {
            document.body.appendChild($modalEl);
            document.body.appendChild($overlay);
            $overlay.addEventListener('click', close);
        }

        // closes the Delete confirmation modal by removing it from the document body
        const close = function() {
            $overlay.removeEventListener('click', close);
            document.body.removeChild($modalEl);
            document.body.removeChild($overlay);
        }

        const $actionBtns = $modalEl.querySelectorAll('[data-action-btn]');
        /**
         * Handles the submission of delete confirmation
         * @param {Funciton} callback - The callback function to execute with confirmation result
         * (true for confirm, false for cancel)
         */
        const onSubmit = function(callback) {
            $actionBtns.forEach($btn => $btn.addEventListener('click', function(){

                const isConfirm = this.dataset.actionBtn === "true" ? true : false ;

                callback(isConfirm);
                // Do not close here — callback must call model.close() to avoid double removeChild
            })
        );}

        return { open, close, onSubmit };
        
}


export { DeleteConfirmModal, NoteModel };