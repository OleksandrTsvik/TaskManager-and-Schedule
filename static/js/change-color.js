const inputsTextColor = document.querySelectorAll('input[type="color"].text-color');
const inputsBackgroundColor = document.querySelectorAll('input[type="color"].background-color');
const elemsCollapsible = document.querySelectorAll('div.collapsible');

inputsTextColor.forEach(input => {
    input.addEventListener('input', function () {
        changeColor(this, 'color');
    });
    input.addEventListener('change', function () {
        let id = this.closest('div.wrapper-card').dataset.taskId;
        let color = this.value.slice(1);

        fetch(`/task/${id}?operation=change-text-color&color=${color}`);
    });
});
inputsBackgroundColor.forEach(input => {
    input.addEventListener('input', function () {
        changeColor(this, 'backgroundColor');
    });
    input.addEventListener('change', function () {
        let id = this.closest('div.wrapper-card').dataset.taskId;
        let color = this.value.slice(1);

        fetch(`/task/${id}?operation=change-background-color&background-color=${color}`);
    });
});

document.body.addEventListener('click', function(event) {
    let elem = event.target.closest('button.btn-collapsible');

    if (!elem) {
        hideAllElemsCollapsible(event.target.closest('div.collapsible'));
        return;
    }

    let elemCollapsible = elem.parentNode.parentNode.nextElementSibling;
    hideAllElemsCollapsible(elemCollapsible);

    elemCollapsible.classList.toggle('active');

    if (elemCollapsible.classList.contains('active')) {
        elemCollapsible.style.display = 'block';
        elemCollapsible.style.height = '100%';
    } else {
        hideElemCollapsible(elemCollapsible);
    }
});

function changeColor(elem, style) {
    let card = elem.closest('div.card');
    card.style[style] = elem.value;
}

function hideAllElemsCollapsible(besides = null) {
    elemsCollapsible.forEach(elem => {
        if (elem !== besides) {
            hideElemCollapsible(elem);
        }
    });
}

function hideElemCollapsible(elem) {
    elem.classList.remove('active');
    elem.style.display = 'none';
    elem.style.height = '0';
}