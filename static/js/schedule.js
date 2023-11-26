(function () {
  const displaySubjects = document.querySelector(
    '#tabs-display .display-subjects',
  );

  const classSelectedDisplaySubject = 'table-dark';

  displaySubjects.addEventListener('click', (event) => {
    let elem = event.target;
    let trSelectiveSubject = elem.closest('tr');

    if (trSelectiveSubject) {
      trSelectiveSubject.classList.toggle(classSelectedDisplaySubject);

      fetch(
        `/settings/subject` +
          `/${trSelectiveSubject.dataset.subjectId}` +
          `?show=${trSelectiveSubject.classList.contains(
            classSelectedDisplaySubject,
          )}`,
        {
          method: 'PUT',
        },
      );
    }
  });
})();
