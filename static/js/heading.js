import { checkBtn } from '/static/js/utils.js';

const modalHeading = document.querySelector('#modal-heading');
const modalTitle = modalHeading.querySelector('h5.modal-title');
const modalBtnSubmit = modalHeading.querySelector('div.modal-footer button[type="submit"]');
const modalForm = modalHeading.querySelector('#form-heading');
const modalFormInputText = modalForm.querySelector('#text');
const btnAddHeading = document.querySelector('#add-heading');

btnAddHeading.addEventListener('click', () => {
    modalForm.action = '/tasks/heading';
    modalTitle.innerHTML = 'Add heading';

    modalFormInputText.classList.remove('active');
    modalFormInputText.value = '';

    modalBtnSubmit.innerHTML = 'Add heading';
});

const modalDeleteHeading = document.querySelector('#modal-delete-heading');

if (modalDeleteHeading) {
    const modalDeleteHeadingText = modalDeleteHeading.querySelector('div.modal-body h4');
    const modalDeleteHeadingLink = modalDeleteHeading.querySelector('div.modal-footer a[type="button"]');

    const classes = {
        'btn-edit': headingEdit,
        'btn-delete': headingDelete
    };

    const keysClasses = Object.keys(classes);

    document.body.addEventListener('click', function(event) {
        for (let i = 0; i < keysClasses.length; i++) {
            let elem = checkBtn(event.target,'BUTTON',  keysClasses[i]);

            if (elem) {
                let id = elem.parentNode.dataset.headingId;
                let text = elem.parentNode.previousElementSibling.textContent.trim();

                classes[keysClasses[i]](elem, id, text);

                break;
            }
        }
    });

    function headingEdit(btn, id, text) {
        modalForm.action = `/tasks/heading?edit=${id}`;
        modalTitle.innerHTML = 'Edit heading';
        modalFormInputText.value = text;
        modalBtnSubmit.innerHTML = 'Save';
    }

    function headingDelete(btn, id, text) {
        modalDeleteHeadingText.innerHTML = text;
        modalDeleteHeadingLink.href = `/tasks/heading/delete/${id}`;
    }
}