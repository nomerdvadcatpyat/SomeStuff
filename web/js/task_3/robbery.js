'use strict';

let days = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
let bankOffset;



class TimeMoment {
  /** 
  * Представление момента времени (до минуты)
  * @param {number} day - индекс дня из массива days
  * @param {number} hours - часы от 0 до 23
  * @param {number} minutes - минуты от 0 до 59
  */
  constructor(day, hours, minutes) {
    this.day = day;
    this.hours = hours;
    this.minutes = minutes;
  }

  addMinute() {
    this.minutes = this.minutes + 1;
    if(this.minutes === 60) {
      this.minutes = 0;
      this.hours = this.hours + 1;
      if(this.hours === 24) {
        this.hours = 0;
        this.day = this.day + 1;
      }
    }
  }

  lt(other) {
    let res = false;
    if(this.day < other.day) res = true;
    else if(this.day === other.day && this.hours < other.hours) res = true;
    else if(this.day === other.day && this.hours === other.hours && this.minutes < other.minutes) res = true;
    return res;
  }

  gt(other) {
    let res = false;
    if(this.day > other.day) res = true;
    else if(this.day === other.day && this.hours > other.hours) res = true;
    else if(this.day === other.day && this.hours === other.hours && this.minutes > other.minutes) res = true;
    return res;
  }

  lq(other) {
    let res = false;
    if(this.day < other.day) res = true;
    else if(this.day === other.day && this.hours < other.hours) res = true;
    else if(this.day === other.day && this.hours === other.hours && this.minutes <= other.minutes) res = true;
    return res;
  }

  gq(other) {
    let res = false;
    if(this.day > other.day) res = true;
    else if(this.day === other.day && this.hours > other.hours) res = true;
    else if(this.day === other.day && this.hours === other.hours && this.minutes >= other.minutes) res = true;
    return res;
  }
}


class TimeInterval {
  /**
   * Временной интервал в часовом поясе банка
   * @param {string} from - строка вида "ПН 12:00+5"
   * @param {string} to  - строка вида "ПН 12:00+5"
   */
  constructor(from, to) {
    this.from = parseIntoTimeMoment(from);
    this.to = parseIntoTimeMoment(to);

    /**
     * @param {string} raw_time_moment - строка вида "ПН 12:00+5"
     * @returns {TimeMoment} - Представление даты из строки В ЧАСОВОМ ПОЯСЕ БАНКА в видео объекта TimeMoment
     */
    function parseIntoTimeMoment(raw_time_moment) {
      // console.log(raw_time_moment)
      let day = days.indexOf(raw_time_moment.split(' ')[0]);
      // console.log(day)
      let time = raw_time_moment.split(' ')[1].split('+')[0];
      // console.log(time)
      let hours = Number(time.split(':')[0]);
      // console.log(hours)
      let minutes = Number(time.split(':')[1]);
      // console.log(minutes)
      let offset = Number(raw_time_moment.split(' ')[1].split('+')[1]);
      // console.log(offset)
      // console.log(bankOffset)
  
      if(offset !== bankOffset) {
        function div(val, by) { // целочисленное деление
          return (val - val % by) / by;
        }
  
        function addMomentTimeToBankOffset() { // Если офсет чела меньше офсета банка
          let hoursDif = Math.abs(bankOffset - offset); // разница между часовыми поясами чела и банка в часах
          // console.log('hoursDif', hoursDif)
          hours = hours + hoursDif; // часы чела в часовом поясе банка
          // console.log('hours', hours)
          if(hours > 23) { // Если часы ушли на следующий день
            let addDay = div(hours, 24); // Тогда добавить hours/24 дней 
            // console.log('addDay', addDay)
            day = day + addDay;
            // console.log('newDay', day)
            hours = hours % 24;
            // console.log('hours', hours)
            if(day > 2) {
              day = 2;
              hours = 23;
              minutes = 59;
            }
            else if(day < 0) {
              day = 0;
              hours = 0;
              minutes = 0;
            }
          }
        }

        function subtractMomentTimeToBankOffset() { // Если офсет чела больше офсета банка
          let hoursDif = Math.abs(bankOffset - offset); // разница между часовыми поясами чела и банка в часах
          hours = hours - hoursDif; // часы чела в часовом поясе банка
          if(hours < 0) { // Если часы ушли на прошлый день
            let subtractDay = -(div(hours, 24)) + 1; // Тогда количество дней, которые нужно вычесть = априори 1 день назад + количество полных дней назад
            day = day - subtractDay; // из начального дня вычетаем эту муть
            hours = 24 + (hours % 24); // часы = 24 - сдвиг часов
            
            if(day < 0) { // Если время ушло за ПН 00:00 банка, то его нет смысла рассматривать
              day = 0;
              hours = 0;
              minutes = 0;
            }
            else if(day > 2) {
              day = 2;
              hours = 23;
              minutes = 59;
            }
          }
        }
  
        if(offset < bankOffset) addMomentTimeToBankOffset();
        else if(offset > bankOffset) subtractMomentTimeToBankOffset();
      }
  
      return new TimeMoment(day, hours, minutes);
    }
  }
}



// /**
//  * Возвращает объект shedule со временем в UTC.
//  * @param {Object} shedule
//  */
// function getUTCShedule(shedule) {
//   let res = {};
//   for (let key in shedule) {
//     res[key] = shedule[key];
//   }

//   for(let person in res) {
//     for(let time of res[person]) {
//       time.from = rawToUtcDate(time, 'from');
//       time.to = rawToUtcDate(time, 'to');
//     }
//   }
//   return res;
//   /**
//    * Переводит представление времени из задачи в UTC, начиная с 2020-06-01 (Это понедельник и так удобно ориентироваться)
//    * @param {Object} raw 
//    * @returns {Date} Utc raw_date
//    */
//   function rawToUtcDate(raw, fromOrTo) {
//       let raw_date = raw[fromOrTo];
//       let day = '0' + (days.indexOf(raw_date.split(' ')[0]) + 1);
//       let time = raw_date.split(' ')[1].split('+')[0];
//       let offset = raw_date.split(' ')[1].split('+')[1];
//       let dateWithoutOffset = new Date(Date.parse(`5000-12-${day}T${time}:00`));
//       let oldDateMinutes = dateWithoutOffset.getUTCMinutes(); // Какого-то хуя сдвигает на -5 часов (часовой пояс екб)

//       // Привести все к оффсет = 0
//       // Сначала сдвигаем оффсет, который задан в задаче. Потом убираем локальный оффсет. new Date() сразу добавляет оффсет региона, поэтому его нужно вычитать
//       // ТОЛЬКО ВОТ СНИЗУ КАКОГО-ТО ХУЯ НЕ НУЖНО СДВИГАТЬ????????????????
//       let res = new Date(dateWithoutOffset.setMinutes(oldDateMinutes - offset * 60 - new Date().getTimezoneOffset()));

//       return res;
//     }
// }

/**
 * @param {Object} schedule Расписание Банды
 * @param {number} duration Время на ограбление в минутах
 * @param {Object} workingHours Время работы банка
 * @param {string} workingHours.from Время открытия, например, "10:00+5"
 * @param {string} workingHours.to Время закрытия, например, "18:00+5"
 * @returns {Object}
 */
function getAppropriateMoment(schedule, duration, workingHours) {
  bankOffset = workingHours['from'].split('+')[1];
  // if(bankOffset < 10) bankOffset = '0' + bankOffset;

  // Расписание первых 3 дней работы банка
  let bankShedule =
      [ 
        new TimeInterval(`ПН ${workingHours.from}`, `ПН ${workingHours.to}`),
        new TimeInterval(`ВТ ${workingHours.from}`, `ВТ ${workingHours.to}`),
        new TimeInterval(`СР ${workingHours.from}`, `СР ${workingHours.to}`)
      ];

  if((bankShedule[0].to.hours * 60 + bankShedule[0].to.minutes) <= (bankShedule[0].from.hours * 60 + bankShedule[0].from.minutes))
      return {
        exists() { return false; },
        format(template) { return ""; },
        tryLater() { return false; }
      };
      
  // Расписание участников в часовом поясе банка
  for(let person in schedule) {
    for(let i = 0; i < schedule[person].length; i ++) {
      schedule[person][i] = new TimeInterval(schedule[person][i]['from'], schedule[person][i]['to']);
    }
  }
  // console.log(bankShedule)
  // for(let person in schedule) console.log(person, schedule[person])

  // [
  //   TimeInterval {
  //     from: TimeMoment { day: 0, hours: 10, minutes: 0 },
  //     to: TimeMoment { day: 0, hours: 12, minutes: 0 }
  //   },
  //   TimeInterval {
  //     from: TimeMoment { day: 1, hours: 10, minutes: 0 },
  //     to: TimeMoment { day: 1, hours: 12, minutes: 0 }
  //   },
  //   TimeInterval {
  //     from: TimeMoment { day: 2, hours: 10, minutes: 0 },
  //     to: TimeMoment { day: 2, hours: 12, minutes: 0 }
  //   }
  // ]

  // Rusty [
  //   TimeInterval {
  //     from: TimeMoment { day: 0, hours: 7, minutes: 30 },
  //     to: TimeMoment { day: 0, hours: 12, minutes: 30 }
  //   },
  //   TimeInterval {
  //     from: TimeMoment { day: 1, hours: 9, minutes: 0 },
  //     to: TimeMoment { day: 1, hours: 12, minutes: 0 }
  //   }
  // ]

  let isSucces = false;
  let successStartTime = {};

  let bankWorkingMinutes = (bankShedule[0].to.hours * 60 + bankShedule[0].to.minutes) - (bankShedule[0].from.hours * 60 + bankShedule[0].from.minutes)

  // смотрим на все дни работы банка и на каждую минуту в них, прибавляя bankDay.from до bankDay.to по минуте.
  for(let bankDay of bankShedule) {
    if(isSucces) break;
    let successMinutes = 0;
    for(let i = 0; i < bankWorkingMinutes; i++) {
      if(isSucces) break;

      let isIntersectIntervals = false;
      for(let person in schedule) {
        for(let interval of schedule[person]) {
          if(bankDay.from.gq(interval.from) && bankDay.from.lt(interval.to)) {
            isIntersectIntervals = true;
            break;
          }
        }
      }

      if(isIntersectIntervals) {
        // console.log('intersect',bankDay.from);
        successMinutes = 0;
      }
      else {
        if(successMinutes === 0) {
          // Если это начало нового непересекающегося интервала => клонируем итерируемый объект в саццес старт тайм
          for(let timeMoment in bankDay.from) {
            successStartTime[timeMoment] = bankDay.from[timeMoment];
          }
        }
        successMinutes++;

        if(successMinutes >= duration) {
          isSucces = true;
          break;
        }
      }

      bankDay.from.addMinute(); // в конце итерации
    }
  }

  return {
    /**
     * Найдено ли время
     * @returns {boolean}
     */
    exists() { return isSucces; },

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
      if(successStartTime.hours < 10) successStartTime.hours = '0' + successStartTime.hours;
      if(successStartTime.minutes < 10) successStartTime.minutes = '0' + successStartTime.minutes;
      return template
            .replace('%DD', days[successStartTime.day])
            .replace('%HH', successStartTime.hours)
            .replace('%MM', successStartTime.minutes);
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
