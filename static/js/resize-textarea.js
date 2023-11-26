let resizeTextareas = document.querySelectorAll('textarea.resize-none');

resizeTextareas.forEach((textarea) => {
  textarea.addEventListener('input', function () {
    this.removeAttribute('rows');

    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
  });
});
