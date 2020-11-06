'use strict';

const days = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

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
   * @returns {Date} Utc date
   */
  function rawToUtcDate(raw, fromOrTo) {
      let date = raw[fromOrTo];
      let day = '0' + (days.indexOf(date.split(' ')[0]) + 1);
      let time = date.split(' ')[1].split('+')[0];
      let offset = date.split(' ')[1].split('+')[1];
      if(offset < 10) offset = '0' + offset;

      return new Date(Date.parse(`2020-06-${day}T${time}:00+${offset}:00`));
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
  // Расписание участников в UTC
  let utcPersonsShedule = getUTCShedule(schedule);
  // Количество минут в рабочем дне банка
  let minutsInBankDay = (utcBankShedule[0]['to'] - utcBankShedule[0]['from'])/60000;
  // Есть ли нужный временной интервал и когда он начинается, если есть
  let isSucces = false;
  let successStartTime;

  for(let day of utcBankShedule) {
    let successMinutes = 0;

    // !!!!!!! НИХУЯ НЕ ПОНЯТНО !!!!!!!!
    // Почему-то если = 1; <=, то у интервалов (у всех, кроме 1) добавляется +1 минута.
    // !!!!!!!!!!! ПОФИКСИЛ !!!!!!!!!!!!!!
    // <= включает в себя минуту, когда банк уже закрылся!!!! А это не так!!!

    for(let dayMinutesCounter = 0; dayMinutesCounter < minutsInBankDay; dayMinutesCounter++ ) {
      if(isSucces) break;
      // Этот итерМомент нужно будет сравнивать со всеми интервалами челов. Если он попадает в хоть один из интервалов хоть одного из челиков, то successMinutes обнулить
      let iterMoment = new Date(new Date(day.from).setMinutes(dayMinutesCounter)); // дата со сдвигом в минутах от начала рабочего дня банка 
      // в new Date(day.from) создается новая ссылка чтобы не изменять время изначального расписания банка 
      // (таким образом минуты прибавляются к начальному времени, а не к измененному предыдущей итерацией)
      // потом оборачиваем timeStamp в Date

      // когда минуты начинаются не с 0 хуево считает походу 

      let isIntersectIntervals = false;
      let nonIntersectMoment = null;

      for(let person in utcPersonsShedule) {
        for(let interval of utcPersonsShedule[person]) {
          // console.log(interval, iterMoment);
          // где-то здесь ошибка. я думаю. Наверное мы считаем что человек занят ОТ (>=) ДО (<), те в ласт минуту в 14 00 (к примеру) он уже не занят, так?
          // Сука, почему-то когда делаем одно из этого, половина чего-то ломается ААААААААААА
          if(iterMoment >= interval.from && iterMoment < interval.to) {  // Так же нужно проверять что интервал попадает во время работы банка????
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
          successStartTime = iterMoment;
          // console.log(successStartTime)
        }
        successMinutes++;
        // console.log('Нашли непересекающуюся минуту ', nonIntersectMoment, ' стало ', successMinutes)
        // console.log('было ', successMinutes);

        if(successMinutes === duration) {
          // console.log('Зашли ', successStartTime.getUTCMinutes());
          isSucces = true;
          break;
        }
      }
    }
  }

  // console.log(isSucces);
  // console.log(duration)

  // console.log(utcBankShedule, utcPersonsShedule);

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
      let bankStartTime = new Date(successStartTime.setMinutes(successStartTime.getUTCMinutes() + bankOffset * 60));
      let day = days[bankStartTime.getUTCDay() - 1];
      let hours = bankStartTime.getUTCHours();
      let minutes = bankStartTime.getUTCMinutes();
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
