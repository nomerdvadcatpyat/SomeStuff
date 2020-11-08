var assert = require("assert");
var robbery = require("./robbery.js");

describe("Можно ли грабить банк и во сколько? (Нормальные сдвиги)", function(){

    it("Удачное ограбление во ВТ 11:30", function(){
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
    
        assert.strictEqual(moment.exists(), true);
        assert.strictEqual(moment.format('Метим на %DD, старт в %HH:%MM!'), 'Метим на ВТ, старт в 11:30!')
    });

    it("Неудачное ограбление (без приколов)", function(){
        const gangSchedule = {
            Danny: [
                { from: 'ПН 12:00+5', to: 'ПН 17:00+5' }, 
                { from: 'ВТ 13:00+5', to: 'ВТ 16:00+5' }
            ],
            Rusty: [
                { from: 'ПН 11:30+5', to: 'ПН 16:30+5' }, 
                { from: 'ВТ 13:00+5', to: 'ВТ 16:00+5' }
            ],
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
        const moment = robbery.getAppropriateMoment(gangSchedule, 121, bankWorkingHours);

        assert.strictEqual(moment.format('Метим на %DD, старт в %HH:%MM!'), '');
        assert.strictEqual(moment.exists(), false);

    });

    it("Все свободны. Метим на ПН, старт в 10:30", function(){
        const gangSchedule = {
            Danny: [{ from: 'ПН 10:00+500', to: 'ПН 17:00+500' }, { from: 'ВТ 06:03+500', to: 'ВТ 16:00+500' }],
            Rusty: [{ from: 'ПН 09:30+500', to: 'ПН 15:30+500' }, { from: 'ВТ 04:30+500', to: 'ВТ 06:59+500' }],
            Linus: [
                { from: 'ПН 09:00+500', to: 'ПН 14:00+500' },
                { from: 'ПН 21:00+500', to: 'ВТ 09:30+500' },
                { from: 'СР 09:30+500', to: 'СР 15:00+500' }
            ]
            };
            const bankWorkingHours = {
                from: '10:30+1',
                to: '20:20+1'
            };
            const moment = robbery.getAppropriateMoment(gangSchedule, 60, bankWorkingHours);
    
            assert.strictEqual(moment.format('Метим на %DD, старт в %HH:%MM!'), 'Метим на ПН, старт в 10:30!');
            assert.strictEqual(moment.exists(), true);

    });

    // ОХУЕННО. В джс не обрабатывается сдвиг больше чем на 23:59
    // Нужно придумать что-то другое
    // Например брать старые минуты, потом сет минутес(сдвиг * 60 + старые минуты)
    
    it("Все заняты. Неудачно", function(){
        const gangSchedule = {
            Danny: [{ from: 'ПН 00:00+555', to: 'СР 23:59:00+555' }],
            Rusty: [{ from: 'ПН 00:00+555', to: 'СР 23:59:00+555' }],
            Linus: [
                { from: 'ПН 00:00+555', to: 'СР 23:59:00+555' }
            ]
            };
            const bankWorkingHours = {
                from: '10:00+555',
                to: '22:00+555'
            };
            const moment = robbery.getAppropriateMoment(gangSchedule, 5, bankWorkingHours);
    
            assert.strictEqual(moment.exists(), false);
            assert.strictEqual(moment.format('Метим на %DD, старт в %HH:%MM!'), '');
    });

    it("На ограбление 1 минута. Метим на СР 23:58", function(){
        const gangSchedule = {
            Danny: [{ from: 'ПН 00:00+555', to: 'СР 23:57+555' }],
            Rusty: [{ from: 'ПН 00:00+555', to: 'СР 23:57+555' }],
            Linus: [
                { from: 'ПН 00:00+555', to: 'СР 23:57+555' },
                { from: 'СР 23:58+555', to: 'ВС 23:57+555' }
            ]
            };
            const bankWorkingHours = {
                from: '23:57+555',
                to: '23:59+555'
            };
            const moment = robbery.getAppropriateMoment(gangSchedule, 1, bankWorkingHours);
    
            assert.strictEqual(moment.exists(), true);
            assert.strictEqual(moment.format('Метим на %DD, старт в %HH:%MM!'), 'Метим на СР, старт в 23:57!');
    });

    it("На ограбление 1 минута. Неудачно", function(){
        const gangSchedule = {
            Danny: [{ from: 'ПН 00:00+555', to: 'СР 23:59+555' }],
            Rusty: [],
            Linus: []};
            const bankWorkingHours = {
                from: '23:55+555',
                to: '23:56+555'
            };
            const moment = robbery.getAppropriateMoment(gangSchedule, 1, bankWorkingHours);
    
            assert.strictEqual(moment.exists(), false);
            assert.strictEqual(moment.format('Метим на %DD, старт в %HH:%MM!'), '');
    });

    it("Не хватает 1 минуты", function(){
        // Потенциальный успешный отрезок тут 10:30 - 11:00, но из-за Rusty и его ВТ 10:31+1 не получается
        const gangSchedule = {
            Danny: [
                { from: 'ПН 00:00+1', to: 'ПН 23:59+1' },
                { from: 'ВТ 00:00+1', to: 'ВТ 05:15+1' },
                { from: 'ВТ 11:00+1', to: 'СР 23:59+1' }
            ],
            Rusty: [
                { from: 'ПН 00:00+1', to: 'ПН 23:59+1' },
                { from: 'ВТ 10:00+1', to: 'ВТ 10:31+1' },
                { from: 'ВТ 11:00+1', to: 'СР 23:59+1' }
            ],
            Linus: [
                { from: 'ПН 00:00+1', to: 'ПН 23:59+10' },
                { from: 'ВТ 03:00+1', to: 'ВТ 07:21+1' },
                { from: 'ВТ 11:00+1', to: 'СР 23:59+1' }
            ]
            };
            const bankWorkingHours = {
                from: '10:15+1',
                to: '20:17+1'
            };
            const moment = robbery.getAppropriateMoment(gangSchedule, 30, bankWorkingHours);
    
            assert.strictEqual(moment.format('Метим на %DD, старт в %HH:%MM!'), '');
            assert.strictEqual(moment.exists(), false);
    });

    
    it("Расписания участников пустые", function(){
        const gangSchedule = {
            Danny: [],
            Rusty: [],
            Linus: []
            };
            const bankWorkingHours = {
                from: '10:17+884321',
                to: '14:27+884321'
            };
            const moment = robbery.getAppropriateMoment(gangSchedule, 30, bankWorkingHours);
    
            assert.strictEqual(moment.format('Метим на %DD, старт в %HH:%MM!'), 'Метим на ПН, старт в 10:17!');
            assert.strictEqual(moment.exists(), true);
    });

    it("Конец ограбления выпадает на закрытие банка. Неудача.", function(){
        const gangSchedule = {
            Danny: [{ from: 'ПН 00:00+555', to: 'ВТ 23:58+555' }],
            Rusty: [{ from: 'ПН 00:00+555', to: 'ВТ 23:58+555' }],
            Linus: [
                { from: 'ПН 00:00+555', to: 'ВТ 23:58+555' },
                { from: 'ПН 00:00+555', to: 'ВТ 23:58+555' },
                { from: 'СР 00:00+555', to: 'СР 22:00+555' }
            ]
            };
            const bankWorkingHours = {
                from: '22:00+555',
                to: '22:59+555'
            };
            const moment = robbery.getAppropriateMoment(gangSchedule, 60, bankWorkingHours);
    
            assert.strictEqual(moment.exists(), false);
            assert.strictEqual(moment.format('Метим на %DD, старт в %HH:%MM!'), '');
    });

    it("На ограбление нужно больше времени, чем работает банк. Неудача.", function(){
        const gangSchedule = {
            Danny: [],
            Rusty: [],
            Linus: []
            };
            const bankWorkingHours = {
                from: '12:00+555',
                to: '22:00+555'
            };
            const moment = robbery.getAppropriateMoment(gangSchedule, 601, bankWorkingHours);
    
            assert.strictEqual(moment.exists(), false);
            assert.strictEqual(moment.format('Метим на %DD, старт в %HH:%MM!'), '');
    });

    it("Банк работает 1 минуту. Неудача.", function(){
        const gangSchedule = {
            Danny: [],
            Rusty: [],
            Linus: []
            };
            const bankWorkingHours = {
                from: '12:00+555',
                to: '12:01+555'
            };
            const moment = robbery.getAppropriateMoment(gangSchedule, 600, bankWorkingHours);
    
            assert.strictEqual(moment.exists(), false);
            assert.strictEqual(moment.format('Метим на %DD, старт в %HH:%MM!'), '');
    });

    it("Банк работает 1 минуту. На ограбление нужно 0 минут. Метим на ПН 12:00.", function(){
        const gangSchedule = {
            Danny: [],
            Rusty: [],
            Linus: []
            };
            const bankWorkingHours = {
                from: '12:00+555',
                to: '12:01+555'
            };
            const moment = robbery.getAppropriateMoment(gangSchedule, 0, bankWorkingHours);
    
            assert.strictEqual(moment.exists(), true);
            assert.strictEqual(moment.format('Метим на %DD, старт в %HH:%MM!'), 'Метим на ПН, старт в 12:00!');
    });

    it("Банк работает 0 минут. Неудача.", function(){
        const gangSchedule = {
            Danny: [],
            Rusty: [],
            Linus: []
            };
            const bankWorkingHours = {
                from: '12:00+555',
                to: '12:00+555'
            };
            const moment = robbery.getAppropriateMoment(gangSchedule, 1, bankWorkingHours);
    
            assert.strictEqual(moment.exists(), false);
            assert.strictEqual(moment.format('Метим на %DD, старт в %HH:%MM!'), '');
    });

    
    it("Ограбление выпадает на время, после закрытия банка. Неудача", function(){
        const gangSchedule = {
            Danny: [
                { from: 'ПН 00:00+1', to: 'ПН 19:00+1' },
                { from: 'ВТ 00:00+1', to: 'СР 23:59+1' }
            ],
            Rusty: [],
            Linus: []
            };
            const bankWorkingHours = {
                from: '10:00+1',
                to: '20:00+1'
            };
            const moment = robbery.getAppropriateMoment(gangSchedule, 100, bankWorkingHours);
    
            assert.strictEqual(moment.format('Метим на %DD, старт в %HH:%MM!'), '');
            assert.strictEqual(moment.exists(), false);
    });

    it("Ограбление выпадает на несколько дней. Неудача", function(){
        const gangSchedule = {
            Danny: [
                { from: 'ПН 00:00+1', to: 'ПН 19:00+1' },
                { from: 'СР 00:00+1', to: 'СР 23:59+1' }
            ],
            Rusty: [],
            Linus: []
            };
            const bankWorkingHours = {
                from: '20:00+1',
                to: '23:59+1'
            };
            const moment = robbery.getAppropriateMoment(gangSchedule, 400, bankWorkingHours);
    
            assert.strictEqual(moment.format('Метим на %DD, старт в %HH:%MM!'), '');
            assert.strictEqual(moment.exists(), false);
    });

});

describe("Сдвиги", function() {
    it("Время банка сдвинуто на неделю вперед. Удачное ограбление во ВТ 11:30", function(){
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
            from: '10:00+173',
            to: '18:00+173'
        };
        const moment = robbery.getAppropriateMoment(gangSchedule, 90, bankWorkingHours);
    
        assert.strictEqual(moment.exists(), true);
        assert.strictEqual(moment.format('Метим на %DD, старт в %HH:%MM!'), 'Метим на ПН, старт в 10:00!')
    });
});

describe("Можно ли грабить через пол часа?", function() {
    // тестирование tryLater()
});