'use strict';

let days = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

/**
 * Возвращает объект shedule со временем в UTC.
 * @param {shedule} shedule
 */
function getUTCShedule(shedule) {
  let res = {};
  for (let key in shedule) {
    res[key] = shedule[key];
  }

  for(let person in res) {
    for(let time of res[person]) {
      time.from = rawToUtcDate(time, 'from');
      time.to = rawToUtcDate(time, 'to');
    }
  }
  return res;
  /**
   * Переводит представление времени из задачи в UTC, начиная с 2020-06-01 (Это понедельник и так удобно ориентироваться)
   * @param {object} raw 
   * @returns {Date} Utc raw_date
   */
  function rawToUtcDate(raw, fromOrTo) {
      let raw_date = raw[fromOrTo];
      let day = '0' + (days.indexOf(raw_date.split(' ')[0]) + 1);
      let time = raw_date.split(' ')[1].split('+')[0];
      let offset = raw_date.split(' ')[1].split('+')[1];
      let dateWithoutOffset = new Date(Date.parse(`5000-12-${day}T${time}:00`));
      let oldDateMinutes = dateWithoutOffset.getUTCMinutes(); // Какого-то хуя сдвигает на -5 часов (часовой пояс екб)

      // Привести все к оффсет = 0
      // Сначала сдвигаем оффсет, который задан в задаче. Потом убираем локальный оффсет. new Date() сразу добавляет оффсет региона, поэтому его нужно вычитать
      // ТОЛЬКО ВОТ СНИЗУ КАКОГО-ТО ХУЯ НЕ НУЖНО СДВИГАТЬ????????????????
      let res = new Date(dateWithoutOffset.setMinutes(oldDateMinutes - offset * 60 - new Date().getTimezoneOffset()));

      return res;
    }
}

/**
 * @param {Object} schedule Расписание Банды
 * @param {number} duration Время на ограбление в минутах
 * @param {Object} workingHours Время работы банка
 * @param {string} workingHours.from Время открытия, например, "10:00+5"
 * @param {string} workingHours.to Время закрытия, например, "18:00+5"
 * @returns {Object}
 */
function getAppropriateMoment(schedule, duration, workingHours) {
  let bankOffset = workingHours['from'].split('+')[1];
  if(bankOffset < 10) bankOffset = '0' + bankOffset;

  // Расписание первых 3 дней работы банка в UTC
  let utcBankShedule = getUTCShedule(
    { Bank:  
      [ 
        { from: `ПН ${workingHours.from}`, to: `ПН ${workingHours.to}` },
        { from: `ВТ ${workingHours.from}`, to: `ВТ ${workingHours.to}` },
        { from: `СР ${workingHours.from}`, to: `СР ${workingHours.to}` } 
      ] 
    })['Bank'];
  // Расписание участников в UTC (0 сдвиг)
  let utcPersonsShedule = getUTCShedule(schedule);
  // Количество минут в рабочем дне банка
  let minutsInBankDay = (utcBankShedule[0]['to'] - utcBankShedule[0]['from'])/60000;
  // Во сколько минут начался рабочий день банка
  let bankOLDMinutes = utcBankShedule[0]['from'].getUTCMinutes();
  // Есть ли нужный свободный временной интервал и когда он начинается, если есть
  let isSucces = false;
  let successStartTime;
  // Цикл идет по дням, когда работает банк. В каждом из дней смотрит на каждую минуту работы банка и проверяет занят ли кто-то в эту минуту.
  // Если занят (isIntersectIntervals = true), то обнулить счеткик успешных минут, если нет - прибавить количество успешных минут.
  for(let day of utcBankShedule) {
    let successMinutes = 0;
    for(let dayMinutesCounter = 0; dayMinutesCounter < minutsInBankDay; dayMinutesCounter++ ) {
      if(isSucces) break;
      // Этот итерМомент нужно будет сравнивать со всеми интервалами челов. Если он попадает в хоть один из интервалов хоть одного из челиков, то successMinutes обнулить
      let iterMoment = new Date(new Date(day.from).setMinutes(bankOLDMinutes + dayMinutesCounter)); // дата со сдвигом в минутах от начала рабочего дня банка 
      // в new Date(day.from) создается новая ссылка чтобы не изменять время изначального расписания банка 
      // (таким образом минуты прибавляются к начальному времени, а не к измененному предыдущей итерацией)
      // потом оборачиваем timeStamp в Date

      let isIntersectIntervals = false;
      let nonIntersectMoment;
      for(let person in utcPersonsShedule) {
        for(let interval of utcPersonsShedule[person]) {
          if(iterMoment >= interval.from && iterMoment < interval.to) {
            isIntersectIntervals = true;
          }
          else nonIntersectMoment = iterMoment;
        }
      }

      if(isIntersectIntervals) {
        successMinutes = 0;
      }
      else {
        if(successMinutes === 0) {
          // Если это начало нового непересекающегося интервала
          successStartTime = iterMoment;
        }
        successMinutes++;

        if(successMinutes === duration) {
          successStartTime = new Date(successStartTime.setMinutes(successStartTime.getUTCMinutes() + bankOffset * 60)); // Переводим successStartTime в часовой пояс банка
          isSucces = true;
          break;
        }
      }
    }
  }

  return {
    /**
     * Найдено ли время
     * @returns {boolean}
     */
    exists() {
      return isSucces;
    },

    /**
     * Возвращает отформатированную строку с часами
     * для ограбления во временной зоне банка
     *
     * @param {string} template
     * @returns {string}
     *
     * @example
     * ```js
     * getAppropriateMoment(...).format('Начинаем в %HH:%MM (%DD)') // => Начинаем в 14:59 (СР)
     * ```
     */
    format(template) {
      if(!isSucces) return "";
      let day = days[successStartTime.getUTCDay() - 1];
      let hours = successStartTime.getUTCHours();
      let minutes = successStartTime.getUTCMinutes();
      if(minutes < 10) minutes = '0' + minutes;

      return template.replace('%DD', day).replace('%HH', hours).replace('%MM', minutes);
    },

    /**
     * Попробовать найти часы для ограбления позже [*]
     * @note Не забудь при реализации выставить флаг `isExtraTaskSolved`
     * @returns {boolean}
     */
    tryLater() {
      return false;
    }
  };
}

module.exports = {
  getAppropriateMoment
};
