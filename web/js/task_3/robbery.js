'use strict';

const isExtraTaskSolved = true;
let bankOffset;
let dur;
const bankDays = ['ПН', 'ВТ', 'СР'];

/**
 * @param {Object} schedule Расписание Банды
 * @param {number} duration Время на ограбление в минутах
 * @param {Object} workingHours Время работы банка
 * @param {string} workingHours.from Время открытия, например, "10:00+5"
 * @param {string} workingHours.to Время закрытия, например, "18:00+5"
 * @returns {Object}
 */
function getAppropriateMoment(schedule, duration, workingHours) {
    bankOffset = parseInt(workingHours.from.substring(6));
    dur = duration;
    let isSuccess = false;
    let bankSchedule = [
        {
            from: getMinutesFromStringDate(`ПН ${workingHours.from}`),
            to: getMinutesFromStringDate(`ПН ${workingHours.to}`)
        },
        {
            from: getMinutesFromStringDate(`ВТ ${workingHours.from}`),
            to: getMinutesFromStringDate(`ВТ ${workingHours.to}`)
        },
        {
            from: getMinutesFromStringDate(`СР ${workingHours.from}`),
            to: getMinutesFromStringDate(`СР ${workingHours.to}`)
        }
    ];
    let newPersonsSchedule = getNewPersonsSchedule(schedule);

    let successIntervals = getSuccessIntervals(newPersonsSchedule, bankSchedule);
    if(successIntervals.length > 0) isSuccess = true;

    return {

        /**
         * Найдено ли время
         * @returns {boolean}
         */
        exists() {
            return isSuccess;
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
            if (!isSuccess) {
                return '';
            }

            let successDate = {
                day: bankDays[Math.floor(successIntervals[0].from / (60 * 24))],
                hours: Math.floor(successIntervals[0].from / 60) % 24,
                minutes: successIntervals[0].from % 60
            }

            if(successDate.day < 10) successDate.day = '0' + successDate.day;
            if(successDate.hours < 10) successDate.hours = '0' + successDate.hours;
            if(successDate.minutes < 10) successDate.minutes = '0' + successDate.minutes;

            return template.replace('%DD', successDate.day).replace('%HH', successDate.hours).replace('%MM', successDate.minutes);
        },


 
        /**
         * Попробовать найти часы для ограбления позже [*]
         * @note Не забудь при реализации выставить флаг `isExtraTaskSolved`
         * @returns {boolean}
         */
        tryLater() {
            if (successIntervals.length === 0) {
                return false;
            }

            if (successIntervals[0].to - successIntervals[0].from >= duration + 30) {
                successIntervals[0].from += 30;

                return true;
            }

            if (successIntervals.length > 1) {
                successIntervals.shift();

                return true;
            }

            return false;
        }
    };
}

function getSuccessIntervals(newPersonsSchedule, bankSchedule) {
    let invertedSchedule = invertSchedule(newPersonsSchedule);

    let freeIntervals = getIntervalIntersections(invertedSchedule['Danny'], invertedSchedule['Rusty'] );
    freeIntervals = getIntervalIntersections(getIntervalIntersections(freeIntervals, invertedSchedule['Linus']), bankSchedule);

    return freeIntervals.filter(t => t.to - t.from >= dur);
}

function invertSchedule(schedule) {
    let res = {};
    for(let person in schedule) {
        schedule[person].sort((a, b) => a.from - b.to);

        let minTime = getMinutesFromStringDate(`СР 23:59+${bankOffset}`);
        let maxTime = getMinutesFromStringDate(`ПН 00:00+${bankOffset}`);
        res[person] = [];
        for(let interval of schedule[person]) {
            res[person].push({ from: maxTime, to: interval.from });
            maxTime = interval.to;
        }
        res[person].push({ from: maxTime, to: minTime });
    }

    return res;
}

function getIntervalIntersections(firstTime, secondTime) {
    var commonTimes = [];
    for(let first of firstTime) {
        for(let second of secondTime) {
            if ((first.from < second.from && first.to > second.to || second.from < first.from && second.to > first.to) ||
                first.to >= second.from && second.to >= first.from) {
                let maxFrom = first.from > second.from ? first.from : second.from;
                let minTo = first.to < second.to ? first.to : second.to;
                commonTimes.push({
                    from: maxFrom,
                    to: minTo
                });
            }
        }
    }
    return commonTimes.filter(date => date !== undefined);
}

function getNewPersonsSchedule(schedule) {
    let DannyNewSchedule = [];
    for(let interval of schedule.Danny) {
        DannyNewSchedule.push({
            from: getMinutesFromStringDate(interval.from),
            to: getMinutesFromStringDate(interval.to)
        });
    }
    let RustyNewSchedule = [];
    for(let interval of schedule.Rusty) {
        RustyNewSchedule.push({
            from: getMinutesFromStringDate(interval.from),
            to: getMinutesFromStringDate(interval.to)
        });
    }
    let LinusNewSchedule = [];
    for(let interval of schedule.Linus) {
        LinusNewSchedule.push({
            from: getMinutesFromStringDate(interval.from),
            to: getMinutesFromStringDate(interval.to)
        });
    }
    return {
        Danny: DannyNewSchedule,
        Rusty: RustyNewSchedule,
        Linus: LinusNewSchedule
    };
}

function getMinutesFromStringDate(raw_date) {
    let day = bankDays.indexOf(raw_date.substring(0, 2)) * 24;
    return parseInt(raw_date.substring(6, 8)) + (day + (parseInt(raw_date.substring(3, 5)) - parseInt(raw_date.substring(9)) + bankOffset)) * 60;
}

module.exports = {
    getAppropriateMoment,
    isExtraTaskSolved
};