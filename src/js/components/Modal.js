
'use strict';


const $overlay = document.createElement('div');
$overlay.classList.add('overlay', 'modal-overlay');

/**
 * Creates and manages a delete confirmation modal for deleting a notebook.
 * @param {string} title 
 */
const DeleteConfirmModal = function(title) {
    const $model = document.createElement('div');
    $model.classList.add('model');

    $model.innerHTML = `
        <h3 class="model-title text-title-medium">
            Are you sure you want to delete <strong> "${ title }" </strong>?
        </h3>

        

        <div class="model-footer">

            <button class="btn text" data-action-btn="false" >
                <span class="text-label-large">Cancel</span>

                <div class="state-layer"></div>
            </button>

            <button class="btn fill" data-action-btn="true" >
                <span class="text-label-large">Delete</span>

                <div class="state-layer"></div>
            </button>
        </div>
        `;

        // opens the Delete confirmation modal by appending it to the document body
        const  open = function() {
            document.body.appendChild($model);
            document.body.appendChild($overlay);
        }

        // closes the Delete confirmation modal by removing it from the document body
        const  close = function() {
            document.body.removeChildChild($model);
            document.body.removeChildChild($overlay);
        }

        /**
         * Handles the submission of delete confirmation
         * @param {Funciton} callback - The callback function to execute with confirmation result
         * (true for confirm, false for cancel)
         */
        const onSubmit = function(callback) {
            $actionBtns.forEach($btn => $btn.addEventListener('click', function(){

                const isConfirmed = this.dataset.actionBtn === "true" ? true : false ;
            })
        );}

        return { open, close, onSubmit };
        
}


export { DeleteConfirmModal };