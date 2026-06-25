
'use strict';


/**
 * Creates and manages a modal for adding and editing notes.
 */
const NoteModel = function(title = '', text = '', time = '') {
    const $overlay = document.createElement('div');
    $overlay.classList.add('overlay', 'modal-overlay');

    const $modal = document.createElement('div');
    $modal.classList.add('modal');

    $modal.innerHTML = `
            <button class="icon-btn large" aria-label="Close modal" data-close-btn>
            <span class="material-symbols-rounded" aria-hidden="true">close</span>

            <div class="state-layer"></div>
            </button>

            <input type="text" placeholder="Title" value="${ title }" 
            class="modal-title text-title-medium" data-note-field>

            <textarea placeholder="Take a note..." class="modal-text text-body-large custom-scrollbar" data-note-field>${text}</textarea>

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
    
    


    const open = function() {
        document.body.appendChild($modal);
        document.body.appendChild($overlay);
        $titleField.focus();
    }

    let isClosed = false;

    const close = function() {
        if (isClosed) return;
        isClosed = true;
        document.body.removeChild($modal);
        document.body.removeChild($overlay);
    }

    const $closeBtn = $modal.querySelector('[data-close-btn]');

    const onSubmit = function(callback) {
        const saveAndClose = function() {
            const noteData = {
                title: $titleField.value.trim(),
                text: $textField.value.trim()
            };

            // Save if there is content
            if (noteData.title || noteData.text) {
                callback(noteData);
            } else {
                close();
            }
        };

        $closeBtn.addEventListener('click', saveAndClose);
        $overlay.addEventListener('click', saveAndClose);
        $submitBtn.addEventListener('click', saveAndClose);
    }

    return { open, close, onSubmit };

}

/**
 * Creates and manages a delete confirmation modal for deleting a notebook.
 * @param {string} title 
 */
const DeleteConfirmModal = function(title) {
    const $overlay = document.createElement('div');
    $overlay.classList.add('overlay', 'modal-overlay');

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