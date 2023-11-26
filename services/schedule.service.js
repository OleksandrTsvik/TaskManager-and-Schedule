const ScheduleModel = require('../models/schedule.model');
const SettingsModel = require('../models/settings.model');
const { SETTINGS_KEYS } = require('../config/db.conf');
const parsingSchedule = require('../utils/parsing/schedule.parsing');
const parsingOptionalSubjects = require('../utils/parsing/google-excel.parsing');
const parsingCabinetSchedule = require('../utils/parsing/cabinet-schedule.parsing');
const { SCHEDULE_TIMES, MS_PER_DAY } = require('../utils/constants');
const settingsService = require('./settings.service');

const getSchedule = async (req, res, next) => {
  let errors = {};
  let schedule = await ScheduleModel.find({})
    .sort({ week: 'asc', weekday: 'asc' })
    .lean();

  let displaySchedule = schedule.filter((item) => item.show);

  let sortDisplaySchedule = [];

  let countWeek = displaySchedule.reduce((schedule, current) =>
    schedule.week > current.week ? schedule : current,
  ).week;

  let countDay = displaySchedule.reduce((schedule, current) =>
    schedule.weekday > current.weekday ? schedule : current,
  ).weekday;

  let nowDate = new Date();
  let firstWeekScheduleDate = new Date(
    await settingsService.getSettingsValueByKey(
      SETTINGS_KEYS.dateFirstWeekSchedule,
    ),
  );

  let timeDifference = nowDate - firstWeekScheduleDate;
  let numberWeek = Math.floor(timeDifference / (MS_PER_DAY * 7)) + 1;

  let currentWeekday = nowDate.getDay();
  if (currentWeekday === 0) {
    currentWeekday = 7;
  }

  let currentWeek = numberWeek % countWeek;
  if (currentWeek === 0) {
    currentWeek = countWeek;
  }

  let cabinetData;

  if (currentWeekday > countDay) {
    cabinetData = false;

    currentWeekday = 1;
    currentWeek = currentWeek >= countWeek ? 1 : currentWeek + 1;
  } else {
    try {
      cabinetData = await parsingCabinetSchedule();
    } catch (err) {
      cabinetData = false;
      errors.cabinetSchedule =
        'An error occurred while parsing the schedule from the cabinet.';
      console.log(err.message);
    }
  }

  for (let i = 1; i <= countWeek; i++) {
    let week = [];

    for (let time of SCHEDULE_TIMES) {
      let timeRow = [];

      for (let j = 1; j <= countDay; j++) {
        let subject = displaySchedule.find(
          (item) => item.week === i && item.time === time && item.weekday === j,
        );

        if (!subject) {
          subject = { week: i, weekday: j, time };
        }

        if (
          subject.week === currentWeek &&
          subject.weekday === currentWeekday
        ) {
          subject.today = true;

          if (cabinetData) {
            let cabinetSubject = cabinetData.find(
              (item) =>
                item.time === subject.time && item.subject === subject.subject,
            );

            if (cabinetSubject) {
              subject.cabinetContent = cabinetSubject.content;
            } else {
              subject.cabinetContent = 'There are no data!!!';
            }
          }
        }

        timeRow.push(subject);
      }

      week.push(timeRow);
    }

    sortDisplaySchedule.push(week);
  }

  return {
    schedule,
    countDay,
    currentWeek,
    currentWeekday,
    displaySchedule: sortDisplaySchedule,
    errors,
  };
};

const updateSchedule = async (req, res, next) => {
  let schedule = await parsingSchedule();
  let optionalSubjects = (await parsingOptionalSubjects()) || [];

  let lastArrSubjects = await settingsService.getSettingsValueByKey(
    SETTINGS_KEYS.arraySubjects,
  );

  let lastArrGroups = await settingsService.getSettingsValueByKey(
    SETTINGS_KEYS.arrayGroups,
  );

  let lastOptionalSubjects = await ScheduleModel.find({ selective: true });

  for (let subject of schedule) {
    if (
      (subject.groups.length === 0 ||
        lastArrGroups.some(
          (item) => item.selected && subject.groups.includes(item.group),
        )) &&
      lastArrSubjects.some(
        (item) => item.selected && item.subject === subject.subject,
      )
    ) {
      subject.show = true;
    }
  }

  for (let subject of optionalSubjects) {
    if (
      lastOptionalSubjects.some(
        (item) =>
          item.show &&
          item.week === subject.week &&
          item.weekday === subject.weekday &&
          item.time === subject.time &&
          item.subject === subject.subject &&
          item.teacher.filter((teacher) => !subject.teacher.includes(teacher))
            .length === 0 &&
          item.classRoom === subject.classRoom &&
          item.groups.filter((group) => !subject.groups.includes(group))
            .length === 0,
      )
    ) {
      subject.show = true;
    }
  }

  let subjects = [...schedule, ...optionalSubjects];
  let arrGroups = [],
    arrSubjects = [];

  for (let subject of schedule) {
    for (let group of subject.groups) {
      if (!arrGroups.some((item) => item.group === group)) {
        arrGroups.push({
          group,
          selected: lastArrGroups.some(
            (item) => item.selected && item.group === group,
          ),
        });
      }
    }

    if (!arrSubjects.some((item) => item.subject === subject.subject)) {
      arrSubjects.push({
        subject: subject.subject,
        selected: lastArrSubjects.some(
          (item) => item.selected && item.subject === subject.subject,
        ),
      });
    }
  }

  await ScheduleModel.deleteMany({});
  await ScheduleModel.insertMany(subjects);

  await SettingsModel.findOneAndUpdate(
    {
      key: SETTINGS_KEYS.arraySubjects,
    },
    {
      key: SETTINGS_KEYS.arraySubjects,
      value: arrSubjects,
    },
    {
      upsert: true,
    },
  );

  await SettingsModel.findOneAndUpdate(
    {
      key: SETTINGS_KEYS.arrayGroups,
    },
    {
      key: SETTINGS_KEYS.arrayGroups,
      value: arrGroups,
    },
    {
      upsert: true,
    },
  );
};

module.exports = {
  getSchedule,
  updateSchedule,
};
