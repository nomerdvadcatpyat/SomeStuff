var robbery = require("./robbery.js");
// let date = new Date(Date.parse(`2020-06-01T12:20`));
// let timezoneOffset = new Date().getTimezoneOffset();
// let minutes = date.getUTCMinutes();
// console.log(new Date(date.setUTCMinutes(minutes - timezoneOffset)))
// таким хуем можно вывести изначальную дату, пиздец


// console.log(new Date(Date.parse(`5000-12-01T23:59:00`)).getUTCDay());
// console.log(new Date(Date.parse(`2020-06-01T23:59:00`)).getUTCDay());

const gangSchedule = {
    Danny: [{ from: 'ПН 12:00+5', to: 'ПН 17:00+5' }, { from: 'ВТ 13:00+5', to: 'ВТ 16:00+5' }],
    Rusty: [{ from: 'ПН 11:30+5', to: 'ПН 16:30+5' }, { from: 'ВТ 13:00+5', to: 'ВТ 16:00+5' }],
    Linus: [
    { from: 'ПН 09:00+3', to: 'ПН 14:00+3' },
    { from: 'ПН 21:00+3', to: 'ВТ 09:30+3' },
    { from: 'СР 09:30+3', to: 'СР 15:00+3' }
    ]
};
    
const bankWorkingHours = {
    from: '10:00+5',
    to: '18:00+5'
};
const moment = robbery.getAppropriateMoment(gangSchedule, 90, bankWorkingHours);

console.log(moment.exists())
console.log(moment.format('Метим на %DD, старт в %HH:%MM!'))
console.log(moment.exists())
console.log(moment.format('Метим на %DD, старт в %HH:%MM!'))
console.log(moment.exists())
console.log(moment.format('Метим на %DD, старт в %HH:%MM!'))
console.log(moment.exists())
console.log(moment.format('Метим на %DD, старт в %HH:%MM!'))

const gangSchedule1 = {
    Danny: [{ from: 'ПН 12:00+5', to: 'ПН 17:00+5' }, { from: 'ВТ 13:00+5', to: 'ВТ 16:00+5' }],
    Rusty: [{ from: 'ПН 11:30+5', to: 'ПН 16:30+5' }, { from: 'ВТ 13:00+5', to: 'ВТ 16:00+5' }],
    Linus: [
    { from: 'ПН 05:00+3', to: 'ПН 14:00+3' },
    { from: 'ПН 26:00+3', to: 'ВТ 09:30+3' },
    { from: 'СР 07:30+3', to: 'СР 15:00+3' }
    ]
};
    
const bankWorkingHours1 = {
    from: '10:00+5',
    to: '10:00+5'
};
const moment1 = robbery.getAppropriateMoment(gangSchedule1, 90, bankWorkingHours1);

console.log(moment1.exists())
console.log(moment1.format('Метим на %DD, старт в %HH:%MM!'))
console.log(moment1.exists())
console.log(moment1.format('Метим на %DD, старт в %HH:%MM!'))
console.log(moment1.exists())