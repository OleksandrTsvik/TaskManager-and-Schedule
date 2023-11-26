const SettingsModel = require('../models/settings.model');
const ScheduleModel = require('../models/schedule.model');
const {
  ENCRYPTION_FIELDS,
  SETTINGS_KEYS,
  OPTIONAL_SETTINGS_KEYS,
} = require('../config/db.conf');
const crypt = require('../utils/encryption.util');
const ApiError = require('../utils/api-error.util');

const getSettingsValueByKey = async (key) => {
  let data = await SettingsModel.findOne({ key });

  if (!data) {
    return null;
  }

  if (ENCRYPTION_FIELDS.includes(key)) {
    return crypt.decryption(data.value);
  }

  return data.value;
};

const getSettings = async (req, res, next) => {
  const inputNames = {};

  for (let param of Object.values(SETTINGS_KEYS)) {
    let settingsValue = await getSettingsValueByKey(param);

    if (settingsValue) {
      inputNames[param] = settingsValue;
    } else {
      inputNames[param] = '';
    }
  }

  let selectiveSubjects = await ScheduleModel.find({ selective: true }).lean();

  return {
    inputNames,
    selectiveSubjects,
  };
};

const createOrUpdateSettings = async (req, res, next) => {
  const arrExpectedParams = Object.keys(SETTINGS_KEYS);

  for (let param of arrExpectedParams) {
    if (req.body.hasOwnProperty(param)) {
      let bodyValue = req.body[param];

      if (bodyValue || OPTIONAL_SETTINGS_KEYS.includes(param)) {
        if (ENCRYPTION_FIELDS.includes(param)) {
          bodyValue = crypt.encryption(bodyValue);
        }

        await SettingsModel.findOneAndUpdate(
          {
            key: param,
          },
          {
            key: param,
            value: bodyValue,
          },
          {
            upsert: true,
          },
        );
      }
    }
  }
};

const toggleShowScheduleByGroup = async (req, res, next) => {
  let { group } = req.query;
  let selected = req.query.selected === 'true';

  if (!group) {
    throw ApiError.BadRequest('Bad request');
  }

  let arrGroups = await getSettingsValueByKey(SETTINGS_KEYS.arrayGroups);
  let arrSubjects = await getSettingsValueByKey(SETTINGS_KEYS.arraySubjects);

  arrGroups.forEach((item) => {
    if (item.group === group) {
      item.selected = selected;
    }
  });

  await SettingsModel.updateOne(
    { key: SETTINGS_KEYS.arrayGroups },
    { value: arrGroups },
  );

  await ScheduleModel.updateMany(
    {
      subject: {
        $in: arrSubjects
          .filter((item) => item.selected)
          .map((item) => item.subject),
      },
      groups: {
        $in: arrGroups
          .filter((item) => item.selected)
          .map((item) => item.group),
      },
      selective: false,
    },
    { show: true },
  );

  await ScheduleModel.updateMany(
    {
      subject: {
        $in: arrSubjects
          .filter((item) => item.selected)
          .map((item) => item.subject),
      },
      $and: [
        { groups: { $ne: [] } },
        {
          groups: {
            $nin: arrGroups
              .filter((item) => item.selected)
              .map((item) => item.group),
          },
        },
      ],
      selective: false,
    },
    { show: false },
  );
};

const toggleShowScheduleBySubjectName = async (req, res, next) => {
  let { subject } = req.query;
  let selected = req.query.selected === 'true';

  if (!subject) {
    throw ApiError.BadRequest('Bad request');
  }

  let arrSubjects = await getSettingsValueByKey(SETTINGS_KEYS.arraySubjects);
  let arrGroups = await getSettingsValueByKey(SETTINGS_KEYS.arrayGroups);

  arrSubjects.forEach((item) => {
    if (item.subject === subject) {
      item.selected = selected;
    }
  });

  await SettingsModel.updateOne(
    { key: SETTINGS_KEYS.arraySubjects },
    { value: arrSubjects },
  );

  await ScheduleModel.updateMany(
    {
      subject,
      $or: [
        { groups: { $eq: [] } },
        {
          groups: {
            $in: arrGroups
              .filter((item) => item.selected)
              .map((item) => item.group),
          },
        },
      ],
      selective: false,
    },
    { show: selected },
  );
};

const toggleShowScheduleBySubjectId = async (req, res, next) => {
  let { id } = req.params;
  let show = req.query.show === 'true';

  if (!id) {
    throw ApiError.BadRequest('Bad request');
  }

  await ScheduleModel.updateOne({ _id: id }, { show: show });
};

module.exports = {
  getSettingsValueByKey,
  getSettings,
  createOrUpdateSettings,
  toggleShowScheduleByGroup,
  toggleShowScheduleBySubjectName,
  toggleShowScheduleBySubjectId,
};
