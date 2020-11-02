'use strict';

/**
 * Складывает два целых числа
 * @param {Number} a Первое целое
 * @param {Number} b Второе целое
 * @throws {TypeError} Когда в аргументы переданы не числа
 * @returns {Number} Сумма аргументов
 */
function abProblem(a, b) {
    if(typeof(a) !== "number" || typeof(b) !== "number" || !Number.isInteger(a) || !Number.isInteger(b)) throw new TypeError();
    return a + b;
}

/**
 * Определяет век по году
 * @param {Number} year Год, целое положительное число
 * @throws {TypeError} Когда в качестве года передано не число
 * @throws {RangeError} Когда год – отрицательное значение
 * @returns {Number} Век, полученный из года
 */
function centuryByYearProblem(year) {
    if(typeof(year) !== "number" || !Number.isInteger(year)) throw new TypeError();
    if(year < 0) throw new RangeError();
    return Math.ceil(year/100);
}

/**
 * Переводит цвет из формата HEX в формат RGB
 * @param {String} hexColor Цвет в формате HEX, например, '#FFFFFF'
 * @throws {TypeError} Когда цвет передан не строкой
 * @throws {RangeError} Когда значения цвета выходят за пределы допустимых
 * @returns {String} Цвет в формате RGB, например, '(255, 255, 255)'
 */
function colorsProblem(hexColor) {
    if(typeof(hexColor) !== "string") throw new TypeError();
    if (!(hexColor.match(/^#([0-9A-H]{6}$)/i) || hexColor.match(/^#([0-9A-H]{3}$)/i))) throw new RangeError();

    if(hexColor.length === 4) hexColor = hexColor + hexColor.substr(1);

    return `(${('0x'+hexColor[1]+hexColor[2])*1}, ${('0x'+hexColor[3]+hexColor[4])*1}, ${('0x'+hexColor[5]+hexColor[6])*1})`;
}

/**
 * Находит n-ое число Фибоначчи
 * @param {Number} n Положение числа в ряде Фибоначчи
 * @throws {TypeError} Когда в качестве положения в ряде передано не число
 * @throws {RangeError} Когда положение в ряде не является целым положительным числом
 * @returns {Number} Число Фибоначчи, находящееся на n-ой позиции
 */
function fibonacciProblem(n) {
    if(typeof(n) !== "number") throw new TypeError();
    if(!Number.isInteger(n) || n < 1) throw new RangeError();
    let a = 1;
    let b = 1;
    for (let i = 3; i <= n; i++) {
      let temp = a + b;
      a = b;
      b = temp;
    }
    return b;
}

/**
 * Транспонирует матрицу
 * @param {(Any[])[]} matrix Матрица размерности MxN
 * @throws {TypeError} Когда в функцию передаётся не двумерный массив
 * @returns {(Any[])[]} Транспонированная матрица размера NxM
 */
function matrixProblem(matrix) {
    if(!Array.isArray(matrix) || matrix.length === 0) throw new TypeError();

    let m = matrix.length;
    let n = matrix[0].length;
    if(n === 0) return matrix;

    for(let i = 0; i < matrix.length; i++) {
        if(!Array.isArray(matrix[i]) || matrix[i].length !== n) throw new TypeError();
        // for(let j = 0; j < matrix[i].length; j++)
            // if(typeof(matrix[i][j]) !== "number") throw TypeError;
    }


    let res = new Array(n);
    for(let i = 0; i < n; i++) res[i] = new Array(m); 

    for(let i = 0; i < m; i++)
        for(let j = 0; j < n; j++) 
            res[j][i] = matrix[i][j];
        
    return res;
}

/**
 * Переводит число в другую систему счисления
 * @param {Number} n Число для перевода в другую систему счисления
 * @param {Number} targetNs Система счисления, в которую нужно перевести (Число от 2 до 36)
 * @throws {TypeError} Когда переданы аргументы некорректного типа
 * @throws {RangeError} Когда система счисления выходит за пределы значений [2, 36]
 * @returns {String} Число n в системе счисления targetNs
 */
function numberSystemProblem(n, targetNs) {
    if(typeof(n) !== "number" || typeof(targetNs) !== "number") throw new TypeError();
    if(targetNs > 36 || targetNs < 2) throw new RangeError();
    return n.toString(targetNs);
}

/**
 * Проверяет соответствие телефонного номера формату
 * @param {String} phoneNumber Номер телефона в формате '8–800–xxx–xx–xx'
 * @throws {TypeError} Когда в качестве аргумента передаётся не строка
 * @returns {Boolean} Если соответствует формату, то true, а иначе false
 */
function phoneProblem(phoneNumber) {
    if(typeof(phoneNumber) !== "string") throw new TypeError();
    return (phoneNumber.match(/^8-800-[0-9]{3}-[0-9]{2}-[0-9]{2}$/) !== null);
}

/**
 * Определяет количество улыбающихся смайликов в строке
 * @param {String} text Строка в которой производится поиск
 * @throws {TypeError} Когда в качестве аргумента передаётся не строка
 * @returns {Number} Количество улыбающихся смайликов в строке
 */
function smilesProblem(text) {
    if(typeof(text) !== "string") throw new TypeError();
    let res = text.match(/(:-\))|(\(-:)/g);
    if(res !== null) return res.length;
    return 0;
}

/**
 * Определяет победителя в игре "Крестики-нолики"
 * Тестами гарантируются корректные аргументы.
 * @param {(('x' | 'o')[])[]} field Игровое поле 3x3 завершённой игры
 * @returns {'x' | 'o' | 'draw'} Результат игры
 */
function ticTacToeProblem(field) {
    if (isWinner('x')) return 'x';
    else if(isWinner('o')) return 'o';
    else return 'draw';

    function isWinner(symbol) {
        if(isLineWinner(field) || isLineWinner(matrixProblem(field)) || isDiagonalWinner()) return true;

        function isDiagonalWinner() {
            return (field[0][0] === symbol && field[1][1] === symbol && field[2][2] === symbol) ||
                        (field[2][0] === symbol && field[1][1] === symbol && field[0][2] === symbol)
        }

        function isLineWinner(field) {
            for(let i = 0; i < field.length; i++) {
                let c = 0;
                let row = field[i];
                for(let j = 0; j < row.length; j++) {
                    if(row[j] === symbol) {
                        c++;
                        if(c === 3) return true;
                    }
                    else break;
                }
            }
        }
    }
}

module.exports = {
    abProblem,
    centuryByYearProblem,
    colorsProblem,
    fibonacciProblem,
    matrixProblem,
    numberSystemProblem,
    phoneProblem,
    smilesProblem,
    ticTacToeProblem
};