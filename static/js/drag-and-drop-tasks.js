import { checkBtn } from '/static/js/utils.js';

const divsGripDraggable = document.querySelectorAll('div.grip-draggable');
const container = document.querySelector('div.container-draggable');

if (divsGripDraggable && container) {
    divsGripDraggable.forEach((div) => {
        div.addEventListener('mousedown', (event) => {
            let elem = checkBtn(event.target, 'DIV', 'grip-draggable');

            if (!elem) {
                return;
            }

            let currentDraggableElem = elem.closest('div.wrapper-card');
            currentDraggableElem.draggable = true;

            currentDraggableElem.ondragstart = () => {
                currentDraggableElem.classList.add('dragging');
            };
            currentDraggableElem.ondragend = () => {
                currentDraggableElem.classList.remove('dragging');
                currentDraggableElem.draggable = false;

                let res = [];
                Array.from(container.children).forEach((card, index) => {
                    let id = card.dataset.taskId;

                    res.push({ _id: id, position: index });
                });

                fetch('/tasks/sort', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify(res)
                });
            };
        });
    });

    container.addEventListener('dragover', (event) => {
        event.preventDefault();

        let elemDraggable = document.querySelector('div.dragging');
        let elemOver = event.target.closest('div.wrapper-card');

        if (elemOver && elemDraggable !== elemOver) {
            let position;

            if (elemOver === elemDraggable.nextElementSibling) {
                position = 'afterend';
            } else if (elemOver === elemDraggable.previousElementSibling) {
                position = 'beforebegin';
            } else {
                let rect = elemOver.getBoundingClientRect();
                let next = (event.clientX - rect.left) / (rect.right - rect.left) > 0.5;

                if (next) {
                    position = 'afterend';
                } else {
                    position = 'beforebegin';
                }
            }

            elemOver.insertAdjacentElement(position, elemDraggable);
        }
    });
}