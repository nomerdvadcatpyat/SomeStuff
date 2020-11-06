let robbery = require('./index.js');

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

console.info(moment.exists());
console.info(moment.format('Метим на %DD, старт в %HH:%MM!'));