const inputsTextColor = document.querySelectorAll(
  'input[type="color"].text-color',
);
const inputsBackgroundColor = document.querySelectorAll(
  'input[type="color"].background-color',
);
const elemsCollapsible = document.querySelectorAll('div.collapsible');

inputsTextColor.forEach((input) => {
  input.addEventListener('input', function () {
    changeColor(this, 'color');

    let containerTextColor = this.closest('.container-text-color');
    if (containerTextColor) {
      containerTextColor.style.borderBottomColor = this.value;
    }
  });
  input.addEventListener('change', function () {
    changeColorOnServer(this, 'change-text-color');
  });
  input.previousElementSibling.addEventListener('click', function (event) {
    event.stopPropagation();
    changeColorSpan(event.target, input, 'color');
  });
});
inputsBackgroundColor.forEach((input) => {
  input.addEventListener('input', function () {
    changeColor(this, 'backgroundColor');
  });
  input.addEventListener('change', function () {
    changeColorOnServer(this, 'change-background-color');
  });
  input.previousElementSibling.addEventListener('click', function (event) {
    event.stopPropagation();
    changeColorSpan(event.target, input, 'backgroundColor');
  });
});

document.body.addEventListener('click', function (event) {
  let elem = event.target.closest('button.btn-collapsible');

  if (!elem) {
    hideAllElemsCollapsible(event.target.closest('div.collapsible'));
    return;
  }

  let elemCollapsible = elem.closest('div.card-footer').nextElementSibling;
  hideAllElemsCollapsible(elemCollapsible);

  if (elemCollapsible.classList.contains('active')) {
    hideElemCollapsible(elemCollapsible);
  } else {
    elemCollapsible.classList.add('active');
    elemCollapsible.style.display = 'block';
    elemCollapsible.style.height = '100%';

    appendColorsPreviousElem(
      elemCollapsible.querySelector('input[type="color"].text-color'),
    );
    appendColorsPreviousElem(
      elemCollapsible.querySelector('input[type="color"].background-color'),
    );
  }
});

function changeColor(input, style) {
  let card = input.closest('div.card');
  card.style[style] = input.value;
}

function changeColorOnServer(input, operation) {
  let id = input.closest('div.wrapper-card').dataset.taskId;
  let color = input.value.slice(1);
  appendColorsPreviousElem(input);

  let typeColor = 'color';

  if (operation === 'change-background-color') {
    typeColor = 'background-color';
  } else if (operation !== 'change-text-color') {
    operation = 'change-text-color';
  }

  fetch(`/tasks/${id}?operation=${operation}&${typeColor}=${color}`);
}

function changeColorSpan(span, input, style) {
  if (!span || !input || !span.classList.contains('color-used')) {
    return;
  }

  input.value = rgbToHex(span.style.backgroundColor);

  if (style === 'color') {
    changeColor(input, style);
    changeColorOnServer(input, 'change-text-color');
  } else if (style === 'backgroundColor') {
    changeColor(input, style);
    changeColorOnServer(input, 'change-background-color');
  }
}

function hideAllElemsCollapsible(besides = null) {
  elemsCollapsible.forEach((elem) => {
    if (elem !== besides) {
      hideElemCollapsible(elem);
    }
  });
}

function hideElemCollapsible(elem) {
  if (!elem.classList.contains('active')) {
    return;
  }

  elem.classList.remove('active');
  elem.style.display = 'none';
  elem.style.height = '0';

  elem.querySelectorAll('.colors-used').forEach((elemColorsContainer) => {
    elemColorsContainer.innerHTML = '';
  });
}

function appendColorsPreviousElem(input) {
  if (!input) {
    return;
  }

  let elemColorsContainer = input.previousElementSibling;
  let arrColors = [];

  elemColorsContainer.innerHTML = '';

  if (input.classList.contains('text-color')) {
    inputsTextColor.forEach((input) => {
      if (!arrColors.includes(input.value)) {
        arrColors.push(input.value);
      }
    });
  } else {
    inputsBackgroundColor.forEach((input) => {
      if (!arrColors.includes(input.value)) {
        arrColors.push(input.value);
      }
    });
  }

  arrColors.sort().forEach((color) => {
    elemColorsContainer.append(createElemSpanColor(color));
  });
}

function createElemSpanColor(color) {
  let elemSpanColor = document.createElement('span');

  elemSpanColor.classList.add('color-used');
  elemSpanColor.style.backgroundColor = color;

  return elemSpanColor;
}

function rgbToHex(strRGB) {
  let nums = strRGB.replace(/[^\d,]/g, '').split(',');
  let hex = '#';

  nums.forEach((num) => {
    num = parseInt(num).toString(16);
    hex += num.length > 1 ? num : '0' + num;
  });

  return hex;
}
