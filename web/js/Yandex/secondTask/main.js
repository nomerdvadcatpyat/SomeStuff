const { phoneBook } = require('./pbqlREWORKED.js');
const pbql = require('./pbqlREWORKED.js');


// let res = pbql.run('Создай контакт Григорий;Создай контакт Артемий;Создай контакт Что-тосий;Создай контакт ий;' + 
// 'Добавь телефон 5556667788 и почту 123gr_i-sh@examp132le.com для контакта Григорий;' +
// // 'Удали контакты, где есть 0000000000;' + 
// 'Покажи имя и почты и телефоны для контактов, где есть ий;');

let res = pbql.run(
    'Создай контакт Григорий;' +
    'Добавь телефон 5556667787 и почту 1223 и телефон 5556627782 и почту 213 и телефон 1234567890 и почту 123 для контакта Григорий;' +
    'Добавь телефон 5556667787 и почту grisha@example.com для контакта Григорий;' +
    'Покажи имя и телефоны и почты для контактов, где есть ий;'
)




// Либо Удали телефон <телефон> и почту <почта> для контакта <имя>
// либо Покажи почты и телефоны для контактов, где есть <запрос>
// либо Удали контакты, где есть <запрос>

console.log(res);
console.log(phoneBook);

