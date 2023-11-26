const listMultipleSelects = document.querySelectorAll('.multiple-select');

const ATTRIBUTE_NAME_FOR_FUNC_DATA = 'data-name-func-get-data';
const ATTRIBUTE_NAME_FOR_FUNC_SHOW = 'data-name-func-show-selected';
const STYLE_TOP_CLOSED = '-180px';
const STYLE_TOP_OPEN = '32px';
const TOGGLE_TIME_MULTIPLE_SELECT = 500;

listMultipleSelects.forEach((multipleSelect) => {
  initMultipleSelect(multipleSelect);
  addFieldsToMultipleSelect(multipleSelect);
  updateSelectedItems(multipleSelect);
});

function initMultipleSelect(elementMultipleSelect) {
  // -> Container Multiple Select
  let divContainer = document.createElement('div');
  divContainer.classList.add('container-multiple-select');
  // <- Container Multiple Select

  // -> Show Selected
  let divShowSelected = document.createElement('div');
  divShowSelected.classList.add(
    'form-control',
    'd-flex',
    'align-content-center',
    'justify-content-between',
  );
  divShowSelected.timeout = null;
  divShowSelected.addEventListener('click', toggleMultipleSelect);

  let divSelectedItems = document.createElement('div');
  divSelectedItems.classList.add('d-flex', 'gap-05', 'overflow-hidden');

  let divArrow = document.createElement('div');
  divArrow.classList.add('multiple-select-arrow');

  let iArrow = document.createElement('i');
  iArrow.classList.add('fas', 'fa-caret-down');

  divArrow.append(iArrow);
  divShowSelected.append(divSelectedItems, divArrow);
  // <- Show Selected

  // -> Container Data Items
  let divDataItems = document.createElement('div');
  divDataItems.classList.add('multiple-select-list');
  divDataItems.style.display = 'none';
  divDataItems.style.top = STYLE_TOP_CLOSED;
  divDataItems.addEventListener('click', toggleInputChecked);
  // <-Container Data Items

  divContainer.append(divShowSelected, divDataItems);
  elementMultipleSelect.append(divContainer);
}

function addFieldsToMultipleSelect(elementMultipleSelect) {
  let resultFunc = checkAndCallFuncGetData(elementMultipleSelect);
  let containerFields = elementMultipleSelect.querySelector(
    'div.container-multiple-select div.multiple-select-list',
  );

  resultFunc.forEach((option) => {
    let divElem = document.createElement('div');
    let inputElem = document.createElement('input');
    let labelElem = document.createElement('label');

    inputElem.type = 'checkbox';

    labelElem.append(inputElem);
    labelElem.innerHTML += option;

    divElem.append(labelElem);
    containerFields.append(divElem);
  });

  selectAll(containerFields);
}

function toggleMultipleSelect() {
  let elementMultipleSelect = this.closest('.multiple-select');
  let elementMultipleSelectList = elementMultipleSelect.querySelector(
    'div.multiple-select-list',
  );

  elementMultipleSelect.classList.toggle('active-multiple-select');

  if (this.timeout) {
    clearTimeout(this.timeout);
  }

  if (elementMultipleSelect.classList.contains('active-multiple-select')) {
    elementMultipleSelectList.style.display = 'block';
    this.timeout = setTimeout(
      () => (elementMultipleSelectList.style.top = STYLE_TOP_OPEN),
      1,
    );
  } else {
    elementMultipleSelectList.style.top = STYLE_TOP_CLOSED;
    this.timeout = setTimeout(
      () => (elementMultipleSelectList.style.display = 'none'),
      TOGGLE_TIME_MULTIPLE_SELECT,
    );
  }
}

function toggleInputChecked(event) {
  event.preventDefault();

  let elementMultipleSelect = this.closest('.multiple-select');
  let elem = event.target.closest('div');
  let input = elem.querySelector('input[type="checkbox"]');
  let textSelectItem = elem.textContent.trim();

  input.checked = !input.checked;

  if (elem && input.checked) {
    elem.classList.add('checked');

    if (textSelectItem === 'All') {
      selectAll(this);
    }
  } else {
    elem.classList.remove('checked');

    if (textSelectItem === 'All') {
      selectOnlyOne(this);
    }
  }

  updateSelectedItems(elementMultipleSelect);
  checkAndCallFuncShowSelectedItems(elementMultipleSelect);
}

function updateSelectedItems(elementMultipleSelect) {
  let elemShowSelected = elementMultipleSelect.querySelector(
    'div.form-control div.d-flex',
  );
  let elemDataItems = elementMultipleSelect.querySelector(
    'div.multiple-select-list',
  );

  let countSelectedItems = 0;
  let isSelectedAll = false;
  let arrDataItems = Array.from(elemDataItems.children);

  elemShowSelected.innerHTML = '';

  arrDataItems.forEach((child) => {
    let title = child.textContent.trim();

    if (child.classList.contains('checked')) {
      let divElem = document.createElement('div');
      divElem.innerHTML = title;

      elemShowSelected.append(divElem);
      countSelectedItems++;

      if (title === 'All') {
        isSelectedAll = true;
      }
    }
  });

  if (isSelectedAll && countSelectedItems === arrDataItems.length - 1) {
    for (let i = 0; i < arrDataItems.length; i++) {
      if (arrDataItems[i].textContent.trim() === 'All') {
        arrDataItems[i].classList.remove('checked');
        arrDataItems[i].querySelector('input[type="checkbox"]').checked = false;

        break;
      }
    }

    updateSelectedItems(elementMultipleSelect);
  } else if (
    countSelectedItems === 0 ||
    countSelectedItems === arrDataItems.length - 1
  ) {
    selectAll(
      elementMultipleSelect.querySelector(
        'div.container-multiple-select div.multiple-select-list',
      ),
    );
    updateSelectedItems(elementMultipleSelect);
  } else if (isSelectedAll && countSelectedItems === arrDataItems.length) {
    elemShowSelected.innerHTML = '';

    let divElem = document.createElement('div');
    divElem.innerHTML = 'All';
    elemShowSelected.append(divElem);
  }
}

function selectAll(elementMultipleSelectList) {
  Array.from(elementMultipleSelectList.children).forEach((child) => {
    child.classList.add('checked');
    child.querySelector('input[type="checkbox"]').checked = true;
  });
}

function selectOnlyOne(elementMultipleSelectList) {
  let flag = true;

  Array.from(elementMultipleSelectList.children).forEach((child) => {
    if (child.textContent.trim() !== 'All' && flag) {
      child.classList.add('checked');
      child.querySelector('input[type="checkbox"]').checked = true;

      flag = false;
    } else {
      child.classList.remove('checked');
      child.querySelector('input[type="checkbox"]').checked = false;
    }
  });
}

function checkAndCallFuncGetData(elementMultipleSelect) {
  if (!elementMultipleSelect.hasAttribute(ATTRIBUTE_NAME_FOR_FUNC_DATA)) {
    throw new Error(
      `Missing function name in date attribute("${ATTRIBUTE_NAME_FOR_FUNC_DATA}") to retrieve data!`,
    );
  }

  let nameFunc = elementMultipleSelect.getAttribute(
    ATTRIBUTE_NAME_FOR_FUNC_DATA,
  );
  if (typeof window[nameFunc] !== 'function') {
    throw new Error('No function to retrieve data!');
  }

  let resultFunc = window[nameFunc]();
  if (!Array.isArray(resultFunc)) {
    throw new Error('The function must return a one-dimensional data array!');
  }

  return resultFunc;
}

function checkAndCallFuncShowSelectedItems(elementMultipleSelect) {
  if (!elementMultipleSelect.hasAttribute(ATTRIBUTE_NAME_FOR_FUNC_SHOW)) {
    throw new Error(
      `Missing function name in date attribute("${ATTRIBUTE_NAME_FOR_FUNC_SHOW}") to show selected data! ` +
        'The first parameter is the select element on which it is called.',
    );
  }

  let nameFunc = elementMultipleSelect.getAttribute(
    ATTRIBUTE_NAME_FOR_FUNC_SHOW,
  );
  if (typeof window[nameFunc] !== 'function') {
    throw new Error('No function to show selected data!');
  }

  window[nameFunc](elementMultipleSelect);
}

/***** Functions that are passed to the date attributes of the element MultipleSelect *****/
function getDataForMultipleSelect() {
  let containerData = document.querySelector('div.container-draggable');
  let options = new Set();

  options.add('All');

  Array.from(containerData.children).forEach((child) => {
    options.add(child.querySelector('div.card-header h5').textContent.trim());
  });

  return Array.from(options);
}

function showSelectedItems(elementMultipleSelect) {
  let containerData = document.querySelector('div.container-draggable');
  let selectedItems = elementMultipleSelect.querySelector(
    'div.form-control div.d-flex',
  );

  let arrContainerData = Array.from(containerData.children);
  selectedItems = Array.from(selectedItems.children).map((item) =>
    item.textContent.trim(),
  );

  if (selectedItems.includes('All')) {
    arrContainerData.forEach((child) => (child.style.display = 'block'));
  } else {
    arrContainerData.forEach((child) => {
      let title = child.querySelector('div.card-header h5').textContent.trim();

      if (selectedItems.includes(title)) {
        child.style.display = 'block';
      } else {
        child.style.display = 'none';
      }
    });
  }
}

/***** Functions that are passed to the date attributes of the element MultipleSelect *****/
