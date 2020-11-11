'use strict';


const isStar = true;
let bankOffset;
const days =  ['ПН', 'ВТ', 'СР']

/**
 * @param {Object} schedule – Расписание Банды
 * @param {Number} duration - Время на ограбление в минутах
 * @param {Object} workingHours – Время работы банка
 * @param {String} workingHours.from – Время открытия, например, "10:00+5"
 * @param {String} workingHours.to – Время закрытия, например, "18:00+5"
 * @returns {Object}
 */
function getAppropriateMoment(schedule, duration, workingHours) {
    console.info(schedule, duration, workingHours);
    bankOffset = Number(workingHours['from'].split('+')[1]);
    workingHours = 
    [
        {
            from: getMinutesWithBankOffset(`ПН ${workingHours.from}`),
            to: getMinutesWithBankOffset(`ПН ${workingHours.to}`)
        },
        {
            from: getMinutesWithBankOffset(`ВТ ${workingHours.from}`),
            to: getMinutesWithBankOffset(`ВТ ${workingHours.to}`)
        },
        {
            from: getMinutesWithBankOffset(`СР ${workingHours.from}`),
            to: getMinutesWithBankOffset(`СР ${workingHours.to}`)
        }
    ];


    
    for(let person in schedule) {
        for(let i = 0; i < schedule[person].length; i ++) {
            schedule[person][i] = {
                from: getMinutesWithBankOffset(schedule[person][i].from),
                to: getMinutesWithBankOffset(schedule[person][i].to)
            };
        }
    }

    let robberyTimes = getRobberyTimes(schedule, workingHours)
        .filter(t => t.to - t.from >= duration);

    return {

        /**
         * Найдено ли время
         * @returns {Boolean}
         */
        exists: function () {
            return robberyTimes.length > 0;
        },

        /**
         * Возвращает отформатированную строку с часами для ограбления
         * Например, "Начинаем в %HH:%MM (%DD)" -> "Начинаем в 14:59 (СР)"
         * @param {String} template
         * @returns {String}
         */
        format: function (template) {
            if (robberyTimes.length === 0) {
                return '';
            }

            return formatDate(createCustomDateObject(robberyTimes[0].from), template);
        },

        /**
         * Попробовать найти часы для ограбления позже [*]
         * @star
         * @returns {Boolean}
         */
        tryLater: function () {
            if (robberyTimes.length === 0) {
                return false;
            }
            var currentPeriod = robberyTimes[0];
            if (currentPeriod.to - currentPeriod.from >= duration + 30) {
                robberyTimes[0].from += 30;

                return true;
            }

            if (robberyTimes.length > 1) {
                robberyTimes.shift();

                return true;
            }

            return false;
        }
    };
}

// function getRobberyTimes(schedule, workingHours) {

//     // попробовать переделать на инверШедул
//     const invertSchedule = invertPeriods(schedule);
//     console.log(invertSchedule)
//     let possibleTimes = getTimeIntersections(invertSchedule, workingHours);

//     return possibleTimes;
// }

function getRobberyTimes(schedule, workingHours) {
    const invertSchedule = invertPeriods(schedule);

    // let possibleTimes = getTimeIntersections(invertSchedule['Danny'], invertSchedule['Linus']);
    // possibleTimes = getTimeIntersections(possibleTimes, invertSchedule['Rusty']);
    // possibleTimes = getTimeIntersections(possibleTimes, workingHours);
    // console.log('pos', possibleTimes);

    let possibleTimes = getScheduleAndWorkingHoursIntersections(invertSchedule, workingHours);
    console.log('pos', possibleTimes);
    return possibleTimes;
}

function invertPeriods(schedule) {

    let rightBorder;
    let leftBorder;

    let newPeriods = {};
    for(let person in schedule) {
        let periods = schedule[person];

        periods.sort((a, b) => a.from - b.to);

        rightBorder = getMinutesWithBankOffset(`СР 23:59+${bankOffset}`);
        leftBorder = getMinutesWithBankOffset(`ПН 00:00+${bankOffset}`);

        periods.forEach(period => {
            if(newPeriods[person] === undefined) newPeriods[person] = new Array();
            newPeriods[person].push({ from: leftBorder, to: period.from });
            leftBorder = period.to;
        });
        newPeriods[person].push({ from: leftBorder, to: rightBorder });
    }

    return newPeriods;
}

function getScheduleAndWorkingHoursIntersections(schedule, workingHours) {
    let possibleTimes = getTimeIntersections(schedule['Danny'], schedule['Linus']);
    possibleTimes = getTimeIntersections(possibleTimes, schedule['Rusty']);
    possibleTimes = getTimeIntersections(possibleTimes, workingHours);

    return possibleTimes;

    function getTimeIntersections(firstTime, secondTime) {
        var commonTimes = [];
        firstTime.forEach(first => {
            secondTime.forEach(second => {
                commonTimes.push(getPeriodsIntersection(first, second));
            });
        });
        commonTimes = commonTimes.filter(date => date !== undefined);
        
        return commonTimes.filter(date => date !== undefined);
    }
}



function getPeriodsIntersection(first, second) {
    if (first.from < second.from && first.to > second.to || second.from < first.from && second.to > first.to) {
        return {
            from: Math.max(first.from, second.from),
            to: Math.min(first.to, second.to)
        };
    }

    if (first.to >= second.from && second.to >= first.from) {
        return {
            from: Math.max(first.from, second.from),
            to: Math.min(first.to, second.to)
        };
    }
}

function formatDate(customDate, template) {
    const addLeadingZero = (number) => number.toString().length === 1 ? `0${number}` : number;

    return template
        .replace('%HH', addLeadingZero(customDate.hours))
        .replace('%MM', addLeadingZero(customDate.minutes))
        .replace('%DD', addLeadingZero(customDate.day));
}

function createCustomDateObject(minutes) {
    const dayNames = ['ПН', 'ВТ', 'СР'];

    return {
        day: dayNames[Math.floor(minutes / (60 * 24))],
        hours: Math.floor(minutes / 60) % 24,
        minutes: minutes % 60
    };
}

function getMinutesWithBankOffset(dateString) {
    let day = dateString.split(' ')[0];

    let time = dateString.split(' ')[1].split('+')[0];
    let offset = dateString.split(' ')[1].split('+')[1];
    let hours = Number(time.split(':')[0]) - Number(offset) + bankOffset;
    let minutes = Number(time.split(':')[1]);

    return minutes + 60 * (days.indexOf(day) * 24 + hours); // а если индексоф = -1?
}

module.exports = {
    getAppropriateMoment,

    isStar
};