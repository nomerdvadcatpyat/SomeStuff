'use strict';

const fetch = require('node-fetch');
const Headers = fetch.Headers;

const API_KEY = require('./key.json');
const headers = new Headers({'X-Yandex-API-Key': API_KEY.key});



/**
 * @typedef {object} TripItem Город, который является частью маршрута.
 * @property {number} geoid Идентификатор города
 * @property {number} day Порядковое число дня маршрута
 */

class TripBuilder {

  constructor(geoids) {
    this.geoids = geoids;
    this.conditions = []; // Массив объектов условий вида { condition: 'cloudy', days: 2 } 
    this.maxDays = Infinity; // Максимальное количество дней, проведенное в 1 городе
    this.forecasts = {}; // Объект вида { id: Number, forecast: [cloudy, sunny, ...] };
  }

  /**
   * Метод, добавляющий условие наличия в маршруте
   * указанного количества солнечных дней
   * Согласно API Яндекс.Погоды, к солнечным дням
   * можно приравнять следующие значения `condition`:
   * * `clear`;
   * * `partly-cloudy`.
   * @param {number} daysCount количество дней
   * @returns {object} Объект планировщика маршрута
   */
  sunny(daysCount) {
    for(let i = 0; i < daysCount; i ++)
      this.conditions.push('sunny');
    return this;
  }

  /**
   * Метод, добавляющий условие наличия в маршруте
   * указанного количества пасмурных дней
   * Согласно API Яндекс.Погоды, к солнечным дням
   * можно приравнять следующие значения `condition`:
   * * `cloudy`;
   * * `overcast`.
   * @param {number} daysCount количество дней
   * @returns {object} Объект планировщика маршрута
   */
  cloudy(daysCount) {
    for(let i = 0; i < daysCount; i ++)
    this.conditions.push('cloudy');
    return this;
  }

  /**
   * Метод, добавляющий условие максимального количества дней.
   * @param {number} daysCount количество дней
   * @returns {object} Объект планировщика маршрута
   */
  max(daysCount) {
    this.maxDays = daysCount;
    return this;
  }

  /**
   * Метод, возвращающий Promise с планируемым маршрутом.
   * @returns {Promise<TripItem[]>} Список городов маршрута
   */
  async build() {
    
    this.forecasts = await getForecasts(this.geoids);

    let validDays = getValidDays(this.conditions, this.forecasts);

    const nodes = [];
    for(let i = 0; i < validDays.length; i++) {
        nodes[i] = [];
    }

    // заполняю 1 день
    for(let day of validDays[0]) { 
        nodes[0].push(new Node(day, [day]));
    }

    // АЛГОРИТМ. Начиная со второго дня: просматриваем все родительские ноды (города, в которых челы были в предыдущий день),
    // если челы уже были в этом городе (и сейчас не там), то добавить на текущий слой новую ноду (город, который удовлетворяет условию и челы в нем в текущий день)
    for(let i = 1; i < validDays.length; i++) {
      for (let j = 0; j < validDays[i].length; j++) {
        for(let parent_node of nodes[i - 1]) {
          const node = new Node(validDays[i][j]);
          node.path = [...parent_node.path];
          node.visited = [...parent_node.visited];
          if(parent_node.path[parent_node.path.length - 1] !== node.value) // Если челы сменили город, то добавить его в список посещенных
              node.visited.push(parent_node.value);
          if(!parent_node.visited.includes(node.value)) { // если челы еще не посещали этот город (не уехали из него)
            const lastMaxDays = parent_node.path.slice(-this.maxDays);
            if(lastMaxDays.length < this.maxDays || lastMaxDays.length !== lastMaxDays.filter(n => n === node.value).length) {
                // Если путешевствие длиться меньше, чем MAX_DAYS или последние <=MAX_DAYS дней челы были в городе node.value, то посетить город
                node.path.push(node.value); 
                nodes[i].push(node); // добавить город на текущий слой (день) 
            }
          }
        } 
      }
    }
    let sortNodes = nodes[nodes.length - 1].sort((n1,n2) => n1.visited.length < n2.visited.length ? -1 : 1);

    let resNode;
    if(sortNodes.length === 0) throw new Error('Не могу построить маршрут!');
      resNode = sortNodes[0];
      resNode.path = resNode.path.map((value, index) => {
        return {geoid: parseInt(value), day: index + 1}
      });

    return resNode.path;
  }
}

class Node {
  constructor(value, path, visited) {
    this.value = value;
    this.path = path ? path : [];
    this.visited = visited ? visited : []; // id городов, которые челы уже посетили (не считая этого). Всегда не включает в себя конечный город.
  }
}

function getValidDays(conditions, forecasts) {
  // validDays - каждый элемент массива - id городов, которые подходят под условие condition[i] в i-й день
  const validDays = [];
  let dayNumber = 0; // номер дня
  for(let condition of conditions) {
    validDays[dayNumber] = [];
    if(condition === 'sunny') {
      for(let cityID in forecasts)  {
        if(forecasts[cityID][dayNumber] === 'clear' || forecasts[cityID][dayNumber] === 'partly-cloudy') {
          validDays[dayNumber].push(cityID);
        }
      }
    }
    else if(condition === 'cloudy') {
      for(let cityID in forecasts) {
        if(forecasts[cityID][dayNumber] === 'cloudy' || forecasts[cityID][dayNumber] === 'overcast') {
          validDays[dayNumber].push(cityID);
        }
      }
    }
    dayNumber++;
  }
  return validDays;
}

async function getForecasts(geoids) {
  const requests = [];
  for(let geoid of geoids) {
    requests.push(fetch(`https://api.weather.yandex.ru/v2/forecast?geoid=${geoid}&hours=false&limit=7`, { headers: headers}));
  }
  
  const forecasts = {};
  await Promise.all(requests)
  .then( responses => {
    return Promise.all(responses.map(res => res.json()))
  })
  .then( jsonWithAllCities => {
    geoids.forEach( (geoid, i) => {
      forecasts[geoid] = [];
      // В этом фориче проходим по i-му городу из запроса (Promise.all сохраняет последовательность, поэтому можно юзать индексы geoids) 
      jsonWithAllCities[i].forecasts.forEach( day => { 
        forecasts[geoid].push(day.parts.day_short.condition);
      });
    });
  });
  return forecasts;
}

/**
 * Фабрика для получения планировщика маршрута.
 * Принимает на вход список идентификаторов городов, а
 * возвращает планировщик маршрута по данным городам.
 *
 * @param {number[]} geoids Список идентификаторов городов
 * @returns {TripBuilder} Объект планировщика маршрута
 * @see https://yandex.ru/dev/xml/doc/dg/reference/regions-docpage/
 */
function planTrip(geoids) {
  return new TripBuilder(geoids);
}

module.exports = {
  planTrip
};


// planTrip([10,25,20,4,51])
// .sunny(2)
// .cloudy(1)
// .max(1)
// .build()
// .then(console.log);


