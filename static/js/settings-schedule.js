(function () {
  const tabsSchedule = document.querySelector('#tabs-schedule');
  const groups = tabsSchedule.querySelector('.groups');
  const subjects = tabsSchedule.querySelector('.subjects');
  const selectiveSubjects = tabsSchedule.querySelector('.selective-subjects');

  const classSelectedGroup = 'btn-dark';
  const classNotSelectedGroup = 'btn-light';

  const classSelectedSubject = 'btn-dark';
  const classNotSelectedSubject = 'btn-light';

  const classSelectedSelectiveSubject = 'table-dark';

  groups.addEventListener('click', (event) => {
    let elem = event.target;
    let btnGroup = elem.closest('button.btn');

    if (btnGroup) {
      if (btnGroup.classList.contains(classSelectedGroup)) {
        btnGroup.classList.remove(classSelectedGroup);
        btnGroup.classList.add(classNotSelectedGroup);
      } else {
        btnGroup.classList.remove(classNotSelectedGroup);
        btnGroup.classList.add(classSelectedGroup);
      }

      fetch(
        `/settings/group` +
          `?group=${btnGroup.textContent.trim()}` +
          `&selected=${btnGroup.classList.contains(classSelectedGroup)}`,
        {
          method: 'PUT',
        },
      );
    }
  });

  subjects.addEventListener('click', (event) => {
    let elem = event.target;
    let btnSubject = elem.closest('button.btn');

    if (btnSubject) {
      if (btnSubject.classList.contains(classSelectedSubject)) {
        btnSubject.classList.remove(classSelectedSubject);
        btnSubject.classList.add(classNotSelectedSubject);
      } else {
        btnSubject.classList.remove(classNotSelectedSubject);
        btnSubject.classList.add(classSelectedSubject);
      }

      fetch(
        `/settings/subject` +
          `?subject=${btnSubject.textContent.trim()}` +
          `&selected=${btnSubject.classList.contains(classSelectedSubject)}`,
        {
          method: 'PUT',
        },
      );
    }
  });

  selectiveSubjects.addEventListener('click', (event) => {
    let elem = event.target;
    let trSelectiveSubject = elem.closest('tr');

    if (trSelectiveSubject) {
      trSelectiveSubject.classList.toggle(classSelectedSelectiveSubject);

      fetch(
        `/settings/subject` +
          `/${trSelectiveSubject.dataset.subjectId}` +
          `?show=${trSelectiveSubject.classList.contains(
            classSelectedSelectiveSubject,
          )}`,
        {
          method: 'PUT',
        },
      );
    }
  });
})();
