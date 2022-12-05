(function () {

    const evaluateAnimations = (modal) => {

        const animationEnd = (animationEndEvent) => {
            const animationName = animationEndEvent.animationName;
            if (animationName == 'open_modal') {
                modal.classList.remove('opening');
                modal.classList.add('open');
            }
            if (animationName == 'bound_modal') {
                modal.classList.remove('bounding');
            }
            if (animationName == 'close_modal') {
                modal.classList.remove('closing');
                modal.classList.add('close');
            }
        }

        if (modal.onanimationend == null) {
            modal.onanimationend = animationEnd;
        }

        const closeModal = () => {
            if (!modal.classList.contains('closing') && !modal.classList.contains('opening') && !modal.classList.contains('bounding')) {
                modal.classList.remove('open');
                modal.classList.add('closing');
            }
        }

        const boundModal = () => {
            if (!modal.classList.contains('closing') && !modal.classList.contains('opening') && !modal.classList.contains('bounding')) {
                modal.classList.add('bounding');
            }
        }

        const btnClose = modal.querySelector('[modal-closer]');
        const canNotClickOutside = modal.hasAttribute('modal-no-click-outside');
        const modalBackground = modal.querySelector('[modal-background]');
        if (modalBackground && modalBackground.onclick == null) {
            if (canNotClickOutside && btnClose) {
                modalBackground.onclick = boundModal;
            } else {
                modalBackground.onclick = closeModal;
            }
        }
        if (btnClose && btnClose.onclick == null) {
            btnClose.onclick = closeModal;
        }
    }

    window.addEventListener('click', (event) => {
        console.log("Clicked");

        const openModal = (modalButton, modalIdentifierButton) => {
            const modal_identifier = modalButton.getAttribute('modal-opener');
            const modal = document.querySelector(`[modal-id="${modalIdentifierButton}"]`);
            if (!modal) {
                return;
            }

            modal_id = modal.getAttribute('modal-id');

            if (modal_identifier == modal_id) {
                if (!modal.classList.contains('closing') && !modal.classList.contains('opening') && !modal.classList.contains('bounding')) {
                    modal.classList.remove('close');
                    modal.classList.add('opening');
                }
                evaluateAnimations(modal);
            }



        }
        const modalButtons = document.querySelectorAll('[modal-opener]');

        modalButtons.forEach(modalButton => {
            const modalIdentifier = modalButton.getAttribute('modal-opener');
            if (modalButton.contains(event.target) && modalIdentifier != '') {
                openModal(modalButton, modalIdentifier);


            }
        });
    });

    window.addEventListener('modalVoroCloser', (event) => {
        let detail = event.detail;
        if(detail && detail.modal && (typeof detail.modal) == 'string' ){
            let modalIdentifier = detail.modal;
            let modal = document.querySelector(`[modal-id="${modalIdentifier}"]`);
            if(modal
                && !modal.classList.contains('opening')
                && !modal.classList.contains('closing')
                && !modal.classList.contains('bounding')
                && !modal.classList.contains('close')
                ){
                modal.classList.add('closing');
            }
        }
    });




})();
// var modalCloser = new CustomEvent('modalVoroCloser', {detail:{modal: 'add_account'}});