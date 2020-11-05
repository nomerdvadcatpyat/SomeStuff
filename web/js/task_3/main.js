const localBankTime = { "from": "09:00+3", "to": "18:00+3" };
const utcBankTime =  { };

let bankOffset = localBankTime['from'].split('+')[1];
if(bankOffset < 10) bankOffset = '0' + bankOffset;

const shedule = {
    "Danny": [
        { "from": "ПН 12:00+5", "to": "ПН 17:00+5" },
        { "from": "ВТ 13:00+5", "to": "ВТ 16:00+5" }
    ],
    "Rusty": [
        { "from": "ПН 03:30+5", "to": "ПН 16:30+5" },
        { "from": "ВТ 13:00+5", "to": "ВТ 16:00+5" }
    ],
    "Linus": [
        { "from": "ПН 09:00+3", "to": "ПН 14:00+3" },
        { "from": "ПН 21:00+3", "to": "ВТ 09:30+3" },
        { "from": "СР 09:30+3", "to": "СР 15:00+3" }
    ]
}


const days = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

/**
 * Возвращает объект, содержащий имена и их свободный график в UTC.
 * Пока что только переводит время, когда они заняты в ЮТС
 * @param {shedule} shedule
 */
function getUTCFreeTimeShedule(shedule) {
    for(person in shedule) {
        console.log(person)
        for(time of shedule[person]) {
            console.log(time)
            time.from = rawToUtcDate(time, 'from');
            time.to = rawToUtcDate(time, 'to');
        }
    }

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

getUTCFreeTimeShedule(shedule);
// console.log((shedule['Danny'][0]['to'] - shedule['Danny'][0]['from'])/(60000)); // перевод в минуты

console.log(shedule['Danny'][0]['to'], shedule['Danny'][0]['to'].getUTCHours());

// ПН 00 И СР 23 59 по времени банка в UTC
let minBankDate = new Date(Date.parse(`2020-06-01T00:00:00+${bankOffset}:00`));
let maxBankDate = new Date(Date.parse(`2020-06-03T23:59:00+${bankOffset}:00`));

// Получает дату банка в ЮТС времени, буду в него все приводить и считать.
/**
 * @param {string} fromOrTo 
 */
function getBankUTCDate(fromOrTo) {
    let splitOnTimeAndOffset = localBankTime[fromOrTo].split('+');
    let bankTimeFrom = splitOnTimeAndOffset[0].split(':');
    return new Date(Date.parse(`2020-06-01T${bankTimeFrom[0]}:${bankTimeFrom[1]}:00+${bankOffset}:00`));
}

console.log(minBankDate, maxBankDate, getBankUTCDate('from'), getBankUTCDate('to')); // Можно сравнивать даты, должно помочь




