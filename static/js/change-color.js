import { checkBtn } from "/static/js/utils.js";

const inputsTextColor = document.querySelectorAll('input[type="color"].text-color');
const inputsBackgroundColor = document.querySelectorAll('input[type="color"].background-color');

inputsTextColor.forEach(input => {
    input.addEventListener('input', function () {
        changeColor(this, 'color');
    });
    input.addEventListener('change', function () {
        let id = this.parentNode.parentNode.dataset.taskId;
        let color = this.value.slice(1);

        fetch(`/task/${id}?operation=change-text-color&color=${color}`);
    });
});
inputsBackgroundColor.forEach(input => {
    input.addEventListener('input', function () {
        changeColor(this, 'backgroundColor');
    });
    input.addEventListener('change', function () {
        let id = this.parentNode.parentNode.dataset.taskId;
        let color = this.value.slice(1);

        fetch(`/task/${id}?operation=change-background-color&background-color=${color}`);
    });
});

document.body.addEventListener('click', function(event) {
    let elem = checkBtn(event.target, 'btn-collapsible');

    if (!elem) {
        return;
    }

    let elemCollapsible = elem.parentNode.parentNode.nextElementSibling;
    elemCollapsible.classList.toggle('active');

    if (elemCollapsible.classList.contains('active')) {
        elemCollapsible.style.display = 'block';
        elemCollapsible.style.height = '100%';
    } else {
        elemCollapsible.style.display = 'none';
        elemCollapsible.style.height = '0';
    }
});

function changeColor(elem, style) {
    let card = elem.parentNode.parentNode.parentNode;
    card.style[style] = elem.value;
}