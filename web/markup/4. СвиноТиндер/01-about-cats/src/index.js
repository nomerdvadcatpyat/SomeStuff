function listenSwipes(element){
  let startX;
  let startY;

  element.addEventListener('touchstart', function(e){
      startX = e.changedTouches[0].pageX
      startY = e.changedTouches[0].pageY
  })

  element.addEventListener('touchend', function(e){
      let dx = e.changedTouches[0].pageX - startX;
      let dy = e.changedTouches[0].pageY - startY;
      if (Math.abs(dx) > 100 && Math.abs(dy) < 100){
          if(dx > 0) element.children[1].children[0].dispatchEvent(new MouseEvent('click')) // Нажатие на лейбл лайка / свайп вправо
          else element.children[1].children[2].dispatchEvent(new MouseEvent('click')) // Нажатие на лейбл дизлайка / свайп влево
      }
      else if (Math.abs(dy) > 100 && Math.abs(dx) < 100){
          if(dy < 0) element.children[1].children[1].dispatchEvent(new MouseEvent('click')) // супер-лайк / свайп вверх
      }
  })
} 

let len = document.getElementsByClassName('pig-card').length;

for(let i = 0; i < len; i++) 
  listenSwipes(document.getElementsByClassName('pig-card')[i]);


function removeCard(event) {
  console.log(event)
  setTimeout(() =>  { event.target.parentNode.parentNode.style.display = 'none'; }, 500);
}

let buttonsSections = document.getElementsByClassName('buttons');
for(let i = 0; i < buttonsSections.length; i++) {
  let buttons = buttonsSections[i].children;
  for(let button of buttons) 
    button.addEventListener('click', removeCard);
}
  