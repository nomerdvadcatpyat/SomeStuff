'use strict';

// ОБЕЩАЮ СЕБЕ ЧТО ВСЕ СЛЕЛУЮЩИЕ ТАСКИ Я БУДУ ПИСАТЬ В АДЕКВАТНОМ СОСТОЯНИИ, ПРЕДВАРИТЕЛЬНО НАКИДАВ СХЕМУ.


// НЕ СМОТРЕТЬ!!!!!!!!!!!

// мапа Name => { phones: [], emails: [] }
/**
 * Телефонная книга
 */
const phoneBook = new Map();


// const phoneOrEmail = /(телефон \d{10})|(почту [^ ]+@[^ ]+\.[^ ]+)/g;
const phoneOrEmail = /(телефон \d{10})|(почту [^ ]+)/g;
// const full = /(^((телефон \d{10})|(почту [^ ]+@[^ ]+\.[^ ]+)))((( и телефон \d{10})|( и почту [^ ]+@[^ ]+\.[^ ]+)))* для контакта /g;
const full = /(^((телефон \d{10})|(почту [^ ]+)))((( и телефон \d{10})|( и почту [^ ]+)))* для контакта /g;

// const phoneOrEmail = /(телефон \d{10})|(почту [-.\w]+@([\w-]+\.)+[\w-]+)/g;
// const full = /^((телефон \d{10})|(почту [-.\w]+@([\w-]+\.)+[\w-]+))((( и телефон \d{10})|( и почту [-.\w]+@([\w-]+\.)+[\w-]+)))* для контакта /g;
// const phoneOrEmailOrName = /(телефоны )|(почты )|(имя )/g;
// const reg = /^((телефоны )|(почты )|(имя ))((и телефоны )|(и почты )|(и имя ))*для контактов, где есть /g;

let concatShows = [];

let number_command = 0;
let current_command = null;

const commands = [
    'Создай контакт ',
    'Удали контакты, где есть ',
    'Добавь ',
    'Удали контакт ',
    'Удали ',
    'Покажи '
];



/**
 * Вызывайте эту функцию, если есть синтаксическая ошибка в запросе
 * @param {number} lineNumber – номер строки с ошибкой
 * @param {number} charNumber – номер символа, с которого запрос стал ошибочным
 */
function syntaxError(lineNumber, charNumber) {
    throw new Error(`SyntaxError: Unexpected token at ${lineNumber}:${charNumber}`);
}


/**
 * Выполнение запроса на языке pbQL
 * @param {string} query
 * @returns {string[]} - строки с результатами запроса
 */
function run(query) {
    let query_commands = query.split(';');  
    // console.log('Полный запрос: ' + query_commands + '\n'); // последний аргумент должен быть пустой строкой - тогда последняя команда верная.
    
    for(let i = 0; i < query_commands.length; i++) {
        number_command++;
        // if(i === 0) {
            // phoneBook.clear(); // если новый pbql.run (я понятия не имею нужно ли так делать)
            // concatShows = [];
            // number_command = 1;
            // console.log('clear');
        // }

        let lastWrong = false;
        if(i === query_commands.length - 1) {
            if (query_commands[i] === '') break;
            else {
                // console.log('Последняя команда без точки с запятой');
                lastWrong = true;
             } // Если дошли до последней команды и она оказалась верная, НО В НЕЙ НЕТ ТОЧКИ С ЗАПЯТОЙ!!!!! (бля, тогда ж ее не нужно экзикутить, потом подумаю)
        } //      Скорее всего должно быть единственное место, где syntaxError() вызывается не через findErrorInBeginCommand()

        let raw_command = query_commands[i];
        let command = null;
        let arg = null;
        // console.log(raw_command);
        for(let i = 0; i < commands.length; i++) {
            if(raw_command.startsWith(commands[i])) {
                if(raw_command.startsWith('Удали контакты,') && (commands[i] === 'Удали ' || commands[i] === 'Удали контакт')) continue;
                command = commands[i];
                // console.log('command ', command)
                arg = raw_command.substr(command.length);

                break;
            }
        }

        current_command = raw_command;
        // console.log(arg);
        if(arg === '') continue;
        if(command !== null) exec(command, arg);
        else findErrorInBeginCommand(current_command); // Если не совпала команда

        if(lastWrong) syntaxError(i + 1, query_commands[i].length + 1);
    }

    return concatShows;
}



/**
 * Выполняет команду
 * @param {String} command  Номер команды, с которой начинается ошибка синтаксиса
 * @param {String} arg Номер символа, с которого начинается ошибка синтаксиса
 * @returns {String[]} Массив строк с ответом
 */
function exec(command, arg) {
    // console.log(`команда '${command}'`);
    // console.log(`аргумент '${arg}'\n`);
    // start_commands.forEach(cmd => {
        // if(arg.includes(cmd)) {
            // console.log(arg.split(cmd)[0]);
            // syntaxError(number_command, command.length + arg.split(cmd)[0].length + 1 )
        // }
    // });
    // console.log(arg);
    switch(command) {
        case commands[0]: {
            if(phoneBook.get(arg) !== undefined) break;
            checkName(command, arg);
            phoneBook.set(arg, { phones: [], emails: [] });
            break;
        } // Создай контакт    
        case commands[3]: {
            if(phoneBook.get(arg) === undefined) break;
            checkName(command, arg);
            phoneBook.delete(arg); 
            break;
         } // Удали контакт 
        case commands[2]: 
        case commands[4]: {
            addOrDeletePhoneEmail(command,arg);
            checkName(command, arg);
            break;
         } // Добавь телефон <телефон> и почту <почта> для контакта <имя> // Удали телефон <телефон> и почту <почта> для контакта <имя>
        case commands[5]: show(arg); break; // 'Покажи '
        case commands[1]: deleteContact(arg); break; // Удали контакты, где есть <запрос>
    }

    // if(wrongCommand) findErrorInBeginCommand(command, arg);
    // console.log(number_command);
}

function checkName(command, arg) {
    // if( arg.includes('для контакта') && (arg.split('для контакта ')[1].split(' ').length > 1) ) {
    //     syntaxError(number_command, command.length + arg.split('для контакта ')[0].length + 14 + arg.split('для контакта ')[1].split(' ')[0].length);
    // }
    // else if(!arg.includes('для контакта') && arg.split(' ').length > 1) {
    //     syntaxError(number_command, command.length + arg.split(' ')[0].length + 1);
    // }
}

/**
 * Добавляет <телефон> в спискок телефонов и <почту> в список почт для контакта <имя>
 * @param {string} arg 
 */
function addOrDeletePhoneEmail(command, arg) {
    // console.log('Enter addOrDeletePhoneEmail');
    let match = arg.match(full);
    if(match === null) {
        if(arg.startsWith('для контакта')) return;
        let index = findErrorInBeginCommand(current_command); // Если команда отработала, значит трабла в аргументах
        // console.log(arg);
        findErrorInRegexOrEndCommandForAddOrDelete(index, arg);
        // console.log('Ошибка. Выход из addOrDeletePhoneEmail\n');
        return;
    }
    else {
        // console.log(match);
        let matchStr = match.pop(); // обрабатывается случай только если паттерн встретился 1 раз (Иное означает ошибку НАВЕРНОЕ)
        let name = arg.substr(matchStr.length);
        // console.log('addOrDeletePhoneEmail match ' + matchStr + 'с именем ' + name);
        if(typeof phoneBook.get(name) === "undefined") return;
        
        let phonesAndEmails = arg.match(phoneOrEmail);
        if(command === 'Добавь ') {
            // console.log('In Добавь');
            phonesAndEmails.forEach(str => {
                if(str.includes('телефон')) {
                    // console.log('phones ', phoneBook.get(name)['phones'].has(str.split('телефон ')[1]))
                    // console.log('Добавь телефон ' + str.split('телефон ')[1] + ' в ' + phoneBook.get(name)['phones']);
                    // console.log(`добавь '${str.split('телефон ')[1]}' в `);
                    // console.log(phoneBook.get(name)['phones']);
                    if(!phoneBook.get(name)['phones'].includes(str.split('телефон ')[1])) {
                        // console.log('Зашли')
                        phoneBook.get(name)['phones'].push(str.split('телефон ')[1]);
                    }
                }
                if(str.includes('почту')) {
                    // console.log('Добавь мыло ' + str.split('почту ')[1] + ' в ' + phoneBook.get(name)['phones']);
                    // console.log('emails ', phoneBook.get(name)['emails'].has(str.split('почту ')[1]))
                    // console.log(`добавь '${str.split('почту ')[1]}' в `);
                    // console.log(phoneBook.get(name)['emails']);
                    if(!phoneBook.get(name)['emails'].includes(str.split('почту ')[1])) {
                        // console.log('Зашли')
                        phoneBook.get(name)['emails'].push(str.split('почту ')[1]);
                    }
                }
            });
        } else {
            // console.log('In Удали мыло или телефон');
            phonesAndEmails.forEach(str => {
                if(str.includes('телефон')) {
                    // console.log('phones ', phoneBook.get(name)['phones'].has(str.split('телефон ')[1]))
                    // console.log('Удали телефон ' + str.split('телефон ')[1] + ' из ' + phoneBook.get(name)['phones']);
                    // console.log(`удали '${str.split('телефон ')[1]}' из`);
                    // console.log(phoneBook.get(name)['phones']);
                    let phones = phoneBook.get(name)['phones'];
                    if(phones.includes(str.split('телефон ')[1])) {
                            // console.log('Зашли')
                            phones.splice(phones.indexOf(str.split('телефон ')[1]), 1);
                        }
                }
                if(str.includes('почту')) {
                    // console.log('emails ', phoneBook.get(name)['emails'].has(str.split('почту ')[1]))
                    // console.log('Удали мыло ' + str.split('почту ')[1] + ' из ' + phoneBook.get(name)['emails']);
                    // console.log(`удали '${str.split('почту ')[1]}' из `);
                    // console.log(phoneBook.get(name)['emails']);
                    let emails = phoneBook.get(name)['emails'];
                    if(emails.includes(str.split('почту ')[1])) {
                        // console.log('Зашли')
                        emails.splice(emails.indexOf(str.split('почту ')[1]), 1);
                    }
                }
            });
        }
    }

    // console.log('Out from addOrDeletePhoneEmail\n');
}


/**
 * 
 * @param {string} str - запрос 
 */
function show(str) {
    // console.log('In show');
    const phoneOrEmailOrName = /(телефоны )|(почты )|(имя )/g;
    const reg = /^((телефоны )|(почты )|(имя ))((и телефоны )|(и почты )|(и имя ))*для контактов, где есть /g;
    // console.log(str.match(reg))
    if(str.match(reg) === null) {
        let index = findErrorInBeginCommand(current_command); // Если команда отработала, значит трабла в аргументах
        // console.log(str);
        findErrorInRegexOrEndCommandForShow(index, str);
        // console.log('Ошибка. Выход из addOrDeletePhoneEmail\n');
        return;
    } 

    let strCommand = str.match(reg).pop();
    // console.log('Что показать? ' + strCommand);

    let query = str.substr(strCommand.length);
    // console.log('Фильтр для имени контакта: ' + query);
    if(query === '') {
        // console.log('пустой запрос');
        return;
    }

    let groups = str.match(phoneOrEmailOrName);
    // console.log('Найденные группы: ' + groups);

    for(let enry of phoneBook) {
        if(findQueryInContact(enry, query)) {
            // console.log('Найден пользователь ' + enry[0]);
            let resStr = '';
            groups.forEach(group => {
                switch(group) {
                    case 'имя ': resStr += `${enry[0]};`; break;
                    case 'телефоны ': {
                        let tempStr = '';
                        enry[1]['phones'].forEach(phone => tempStr += `+7 (${phone.substr(0,3)}) ${phone.substr(3,3)}-${phone.substr(6,2)}-${phone.substr(8,2)},`);
                        if(tempStr === '') resStr += ';';
                        else resStr += tempStr.replace(/,$/, ';');
                        break;
                    }
                    case 'почты ': {
                        let tempStr = '';
                        enry[1]['emails'].forEach(email => tempStr += `${email},`);
                        if(tempStr === '') resStr += ';';
                        else resStr += tempStr.replace(/,$/, ';');
                        break;
                    }
                }
            });
            // console.log('show for User: ' +  resStr);
            concatShows.push(resStr.replace(/;$/, ''));
        };
    }

    // console.log('concat shows: ');
    // console.log(concatShows);
    
    // console.log('Out from show\n');
}

/**
 * 
 * @param {string} query 
 */
function deleteContact(query) {
    if(query === '') return;
    for(let enry of phoneBook) {
        if(findQueryInContact(enry, query)) {
            phoneBook.delete(enry[0]);
        }
    }
}

/**
 * 
 * @param {Array} contact 
 * @param {string} query 
 */
function findQueryInContact(contact, query) {
    // console.log('Проверка запроса ' + query + ' у пользователя ');
    // console.log(contact);
    let inName = contact[0].includes(query);
    let inPhones = false;
    let inEmail = false;
    contact[1]['phones'].forEach(ph => { if(ph.includes(query)) inPhones = true; });
    contact[1]['emails'].forEach(email => { if(email.includes(query)) inEmail = true; });

    return inName || inPhones || inEmail;
}

/**
 * Поиск ошибки в начале команды (до всяких регулярок и тд)
 * @param {string} error_command - команда 
 * @returns {number} - возвращает индекс, в котором возникла ошика (С ЕДИНИЦЫ!!!1!)
 */
function findErrorInBeginCommand(error_command) {
    // console.log(`findErrorInBeginCommand in comand: "${error_command}"`);
    for(let cmd of commands) {
        let index = 1;
        let cmd_split = cmd.split(' ').slice(0,cmd.split(' ').length - 1);
        // console.log('cmd split:');
        // console.log(cmd_split);
        let er_cmd_split = error_command.split(' ');
        // console.log('err cmd split:');
        // console.log(er_cmd_split);

        if(cmd_split[0] === er_cmd_split[0]) index+=er_cmd_split[0].length + 1;
        if(index > 1) {
            if(cmd_split[0] === 'Удали' && (er_cmd_split[1] === 'телефон') ||(er_cmd_split[1] === 'почту') || (er_cmd_split[1] === 'имя')) return index; // Если это Удали и дальше идет регекс, то проблема не в начале команды
            
            for(let i = 1; i < cmd_split.length; i++) {  // Если этот цикл завершился, то значит проблема НЕ В НАЧАЛЕ КОМАНДЫ
                if(cmd_split[i] !== er_cmd_split[i]) syntaxError(number_command, index);  
                else index+=er_cmd_split[i].length + 1;
            }
            return index;
        }
    }
    syntaxError(number_command, 1);
}

/**
 * @param {int} index - Индекс, с которого начинаются аргументы (регексы и конец команды).
 * @param {string} arg
 */
function findErrorInRegexOrEndCommandForAddOrDelete(indx, arg) {
    // console.log('in find error regex');
    let index = indx;
    // console.log(index);
    let arg_split = arg.split(' ');
    // console.log(arg_split);
    
    // ОШИБКА В НАЧАЛЕ РЕГЕКСА (До ... и ... и ...)    
    let test = arg_split.shift();
    if(test === 'телефон') {
        index += 8;
        let argForTest = arg_split.shift();
        if(argForTest.match(/^\d{10}$/) === null) syntaxError(number_command, index);
        else index += 11;
    } else if (test === 'почту') {
        index += 6;
        let argForTest = arg_split.shift();
        if(argForTest.match(/[^ ]+/) === null) syntaxError(number_command, index);
        else index += argForTest.length + 1;
    } else syntaxError(number_command, index);
    
    // ЗНАЧИТ ОШИБКА В КОНЦЕ РЕГЕКСА ИЛИ В СЛОВАХ ДЛЯ КОНТАКТА  

    while(arg_split.length > 0) {
        test = arg_split.shift();
        // console.log(index);
        // console.log(test);
        if(test === 'и') {
            index += 2;
            test = arg_split.shift();
            if(test === 'почту') {
                index += 6;
                test = arg_split.shift();
                if(test.match(/[^ ]+/)) {
                    index += test.length + 1;
                    continue;
                }
            }
            else if(test === 'телефон') {
                index += 8;
                test = arg_split.shift();
                if(test.match(/^\d{10}$/)) {
                    index += 11;
                    continue;
                }
            }
            syntaxError(number_command, index);
        } else if (test === 'для') {
            index += 4;
            test = arg_split.shift();
            if(test === 'контакта') {
                index += 9;
                continue;
            }
        }
        
        syntaxError(number_command, index);
    }
}


/**
 * 
 * @param {number} index 
 * @param {string} arg 
 */
function findErrorInRegexOrEndCommandForShow(indx, arg) {
    // console.log('in find error regex');
    let index = indx;
    // console.log(index);
    let arg_split = arg.split(' ');
    // console.log(arg_split);
    
    let test = arg_split.shift();
    while (arg_split.length > 0) {
        if(test === 'имя' || test === 'почты' || test === 'телефоны') {
            index += test.length + 1;
            test = arg_split.shift();
            if(test === 'и') {
                index += 2;
                test = arg_split.shift();
                continue;
            } else if(test === 'для') {
                index += 4;
                test = arg_split.shift();
                if(test === 'контактов,') {
                    index += 11;
                    test = arg_split.shift();
                    if(test === 'где') {
                        index += 4;
                        test = arg_split.shift();
                        if (test === 'есть') {
                            index += 5;
                            continue;
                        }
                    }
                }
            }
        }
        syntaxError(number_command, index);
    }
}


module.exports = { phoneBook, run };