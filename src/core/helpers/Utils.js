import moment from 'moment';
import { listByCourse as lectionsByCourse, listProgressByCourse as lectionsProgressByCourse } from '../../actions/Lection';
import { comletionState } from '../../actions/Selfassignment';

export function mapStepType(type) {
  return Object.assign({
    VIDEO : {
      title: 'Video',
      mapType: 'video',
    },
    TOOLBOX : {
      title: 'Toolbox',
      mapType: 'bag',
    },
    PRACTICAL_PART : {
      title: 'Practice part',
      mapType: 'reading',
    } ,
    INFOGRAPHIC : {
      title: 'Infographic',
      mapType: 'mosaic',
    },
    SELFCHECK : {
      title: 'Teamrollen-Test',
      mapType: 'notice',
    }
  })[type] || {};
};

/**
 * Get all lections and lection progress by course
 */
export function fetchLectionsProgress(courseId, success, error) {
  lectionsByCourse(
    { courseId },
    (lections) => lectionsProgressByCourse({ courseId },
      (r) => {
        lections.forEach((lection, key) => {
          Object.assign(lection, {
            progress: r.filter(
              (progress) => progress.lectionId == lection.id
            )[0] || { percentageOfFinish: 0 }
          });
          // Check lection availability
          Object.assign(lection, { available:
            (key > 0) ? lections[key - 1].progress.percentageOfFinish === 100 : true
          });
        });
        success(lections);
      },
      (e) => error(e)
    ),
    (e) => error(e)
  );
};

export function germanDateFormater(value, unit, suffix, date) {
  switch (unit) {
    case 'second':
      suffix = (value === 1) ? 'Sekunde' : 'Sekunden';
    break;

    case 'minute':
      suffix = (value === 1) ? 'Minute' : 'Minuten';
    break;

    case 'hour':
      suffix = (value === 1) ? 'Stunde' : 'Stunden';
    break;

    case 'day':
      suffix = (value === 1) ? 'Tag' : 'Tagen';
    break;

    case 'week':
      suffix = (value === 1) ? 'Woche' : 'Tagen';
    break;

    case 'month':
      suffix = (value === 1) ? 'Monat' : 'Monaten';
    break;
  }

  return `Vor ${value} ${suffix}`;
};

export const bigCalendarGermanLocale = {
  weekDays: [
    'Sonntag',
    'Montag',
    'Dienstag',
    'Mittwoch',
    'Donnerstag',
    'Freitag',
    'Samstag'
  ],
  weekdayFormat: (date) => {
    return bigCalendarGermanLocale.weekDays[moment(date).day()];
  },
  dayFormat: (date) => {
    return `${bigCalendarGermanLocale.weekDays[moment(date).day()]} ${moment(date).format('DD.MM')}`;
  }
};

export function selfAssignmentCompletion(onCompleted, onIncompleted, onFail) {

  return comletionState(
    (r) => {
      let allKeyExists = true;
      let lastCompleted = '';

      ['questions', 'thermometer', 'texts', 'goals'].forEach((key) => {
          if (r.hasOwnProperty(key)) {
            lastCompleted = key;
          }
          else {
            allKeyExists = false;
          }
      });

      // Call success or fail function depends of completion
      allKeyExists ? onCompleted(r) : onIncompleted(lastCompleted, r);
    },
    (e) => onFail(e)
  );
};
