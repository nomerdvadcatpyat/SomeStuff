
const debounce = (fn, ms) => {
  let timeout;
  return function () {
    const fnCall = () => { fn.apply(this, arguments) }
    clearTimeout(timeout); // clearTimeout от undefinded ничего не сделает
    timeout = setTimeout(fnCall, ms);
  }
}

function inputHandler() {
  const query = this.value;
  if(query) {
    document.querySelector('.suggests').classList.remove('hidden');
    getData(query)
    .then(rawData => {
      clearSuggests();
      if(rawData.length === 0) return;
      parseResponse(rawData)
      .forEach(airport => {
        addSuggest(airport.city, airport.name, airport.code)
      });
    })
    .catch(console.error);
  }
  else clearSuggests();
}

document.querySelector('.content__input-request').addEventListener('input', debounce(inputHandler, 200), false);


async function getData(query) {
  return await (await fetch(`http://autocomplete.travelpayouts.com/places2?term=${query}&locale=ru&types[]=airport,city&max=5`)).json();
}

function addSuggest(suggestCity, suggestAirport, suggestCode) {
  const section = document.createElement('section');
  section.classList.add('suggest');
  section.setAttribute('tabindex', 0);

  const city = document.createElement('h4');
  city.classList.add('suggest__city');
  city.textContent = suggestCity;

  const airportCode = document.createElement('p');
  airportCode.classList.add('suggest__airport-code');
  if(suggestAirport)
    airportCode.textContent = suggestCode + ' «' + suggestAirport + '»';
  else airportCode.textContent = suggestCode;

  section.append(city);
  section.append(airportCode);

  document.querySelector('.suggests').append(section);
}

function clearSuggests() {
  const suggests = document.querySelector('.suggests');
  while (suggests.firstChild) {
    suggests.removeChild(suggests.firstChild);
  }
}

function parseResponse(response) {
  console.log(response);
  return response.map(json => {
    if(json.type === "airport") return { city: json.city_name, name: json.name, code: json.code }; // аэропорт
    if(json.type === "city") {
      if(json.main_airport_name)
        return { city: json.name, name: json.main_airport_name, code: json.code }; // Город, в котором один аэропорт
      
      return { city: json.name, code: json.code } // Город, где нет главного аэропорта (их несколько)
    }
  })
}

// Обработка событий клика и нажатия стрелок и enter

document.querySelector('.suggests').addEventListener('mousedown', function(e) {
  const focused = document.querySelector('.focused');
  if(focused) focused.classList.remove('focused');
  let suggest;
  if(e.target.classList.contains('suggest'))
    suggest = e.target;
  else if (e.target.parentElement.classList.contains('suggest')) 
    suggest = e.target.parentElement;

  suggest.classList.add('focused');
  document.querySelector('.content__input-request').value = suggest.firstElementChild.textContent;

  document.querySelector('.suggests').classList.add('hidden');
})

window.addEventListener('keydown', function(e) {
  const suggests = document.querySelector('.suggests');
  // Если подсказка скрыта или она пустая
  if(suggests.classList.contains('hidden') || suggests.children.length === 0) return;

  let focusedSuggest = document.querySelector('.focused');
  if(e.code === "ArrowDown" || e.code === "ArrowUp") {
    e.preventDefault(); // Отменяем переход каретки в начало input, если есть подсказки
    if(focusedSuggest === null) { // Если еще ни разу не нажали кнопочку вниз или вверх
      if(e.code === "ArrowDown") focusedSuggest = suggests.firstChild;
      else if (e.code === "ArrowUp") focusedSuggest = suggests.lastChild;
      focusedSuggest.classList.add('focused');
    }
    else { // Если уже есть подсказка с фокусом
      focusedSuggest.classList.remove('focused');
      let nextSuggest;
      if(e.code === "ArrowDown") nextSuggest = focusedSuggest.nextElementSibling || suggests.firstChild;
      else if(e.code === "ArrowUp") nextSuggest = focusedSuggest.previousElementSibling || suggests.lastChild;
      nextSuggest.classList.add('focused');
    }
  }
  else if(e.code === "Enter") {
    if(focusedSuggest) {
      document.querySelector('.content__input-request').value = focusedSuggest.firstElementChild.textContent;
      document.querySelector('.suggests').classList.add('hidden');
    }
  }
});

