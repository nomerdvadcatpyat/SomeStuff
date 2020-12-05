
function listenSwipes(element, i){
  let startX;
  let startY;

  element.addEventListener('touchstart', function(event){
      startX = event.changedTouches[0].pageX;
      startY = event.changedTouches[0].pageY;
  })

  element.addEventListener('touchend', function(event){
      let dx = event.changedTouches[0].pageX - startX;
      let dy = event.changedTouches[0].pageY - startY;
      if (Math.abs(dx) > 50 && Math.abs(dy) < 50){
        console.log(document.querySelector(`.pig${i}-like`))
          if(dx > 0) document.querySelector(`.pig${i}-like`).dispatchEvent(new MouseEvent('click')); // Нажатие на лейбл лайка / свайп вправо
          else document.querySelector(`.pig${i}-dislike`).dispatchEvent(new MouseEvent('click')); // Нажатие на лейбл дизлайка / свайп влево
      }
      else if (Math.abs(dy) > 50 && Math.abs(dx) < 50){
          if(dy < 0) document.querySelector(`.pig${i}-super-like`).dispatchEvent(new MouseEvent('click')); // супер-лайк / свайп вверх
      }
  })
} 

let len = document.querySelectorAll('.pig-card').length;

for(let i = 0; i < len; i++) 
  listenSwipes(document.querySelectorAll('.pig-card')[i], i + 1);


function removeCard(event) {
  setTimeout(() =>  { event.target.parentNode.parentNode.style.display = 'none'; }, 500);
}

let buttonsSections = document.querySelectorAll('.buttons');
for(let i = 0; i < buttonsSections.length; i++) {
  let buttons = buttonsSections[i].children;
  for(let button of buttons) 
    button.addEventListener('click', removeCard);
}

// Фаерфокс (мб и другие какие-то браузеры, но не хром) по-умолчанию при перезагрузке не чистит кэш и там остаются отмеченные радиокнопки и все ломается.
// Не придумал как по-другому исправить.
let radios = document.querySelectorAll('.overlook-pig-radio');
for(let radio of radios) {
  radio.checked = false;
}
  