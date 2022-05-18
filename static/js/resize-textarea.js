let resizeTextareas = document.querySelectorAll('textarea.resize-none');

resizeTextareas.forEach(textarea => {
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';

        this.removeAttribute('rows');
    });
});