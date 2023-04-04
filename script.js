const board = document.getElementById('board');
const ratio = document.getElementById('ratio');
const buttons = document.getElementsByTagName('button');

const theme = buttons[0]
const decrease = buttons[1];
const increase = buttons[2];
const reset = buttons[3];
const grid = buttons[4];
const black = buttons[5];
const rand = buttons[6];
const gray = buttons[7];
const dark = buttons[8];
const bright = buttons[9];
const rainbow = buttons[10]
const fire = buttons[11];
const ice = buttons[12];

const custom = document.getElementById('colorPicker');

let squares = 16;
let modus = 'Black';
let reverse = false;
let red = 255, green = 255, blue = 255;
let hue = 0, sat = 100, lit = 100;

theme.addEventListener('click', changeTheme);

decrease.addEventListener('click', decreaseRatio);
increase.addEventListener('click', increaseRatio);
reset.addEventListener('click', resetBoard);
grid.addEventListener('click', gridToggle);

rand.addEventListener('click', toggleModi);
gray.addEventListener('click', toggleModi);
dark.addEventListener('click', toggleModi);
bright.addEventListener('click', toggleModi);
rainbow.addEventListener('click', toggleModi);
fire.addEventListener('click', toggleModi);
ice.addEventListener('click', toggleModi);

custom.addEventListener("click", changeColor);
custom.addEventListener("change", changeColor);

board.addEventListener('pointerdown', ev => {
  ev.preventDefault();
  selectModus(ev);
});

board.style.gap = '1px';
drawDivs();
setRatioText();

function changeTheme() {

}

function drawDivs() {
  board.style.gridTemplateColumns = `repeat(${squares}, 1fr)`;
  board.style.gridTemplateRows = `repeat(${squares}, 1fr)`;

  for (let i = 0; i < squares**2; i++) {
    const newDiv = document.createElement('div');
    newDiv.setAttribute('class', 'pixel');
    newDiv.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
    newDiv.addEventListener('pointerenter', selectModus);
    newDiv.addEventListener('pointerleave', () => setTimeout(() => newDiv.classList.toggle('recent'), 250));
    board.appendChild(newDiv);
  }
}

function clearBoard() {
  const removeDivs = document.getElementsByClassName('pixel');
  for (let i = removeDivs.length -1; i >= 0; i--) {
    board.removeChild(removeDivs[i]);
  }
  document.querySelectorAll('.modus').forEach( (m) => {
    m.classList.remove('toggle-on');
    m.addEventListener('click', toggleModi);
  });
  red = 255, green = 255, blue = 255;
  modus = 'Black';
  black.classList.add('toggle-on')
  black.removeEventListener('click', toggleModi);
}

function setRatioText() {
  ratio.innerText = `${squares} X ${squares}`;
}

function decreaseRatio() {
  if (squares > 8) {
    squares -= 8;
    clearBoard();
    setRatioText();
    drawDivs();
  }
}

function increaseRatio() {
  if (squares < 96) {
    squares += 8;
    clearBoard();
    setRatioText();
    drawDivs();
  }
}

function resetBoard() {
  clearBoard();
  drawDivs();
}

function gridToggle() {
  if (board.style.gap === '1px') {
    board.style.gap = 0;
  } else {
    board.style.gap = '1px';
  }
  grid.classList.toggle('toggle-on');
}

function toggleModi() {
  document.querySelectorAll('.modus').forEach( (m) => {
    m.classList.remove('toggle-on');
    m.addEventListener('click', toggleModi);
  });
  this.classList.add('toggle-on')
  this.removeEventListener('click', toggleModi);
  modus = this.innerText;
}

function changeColor() {
  document.querySelectorAll('.modus').forEach( (m) => {
    m.classList.remove('toggle-on');
    m.addEventListener('click', toggleModi);
  });
  modus = document.getElementsByTagName('label')[0].innerText;
  red = Number('0x' + custom.value.slice(1,3));
  green = Number('0x' + custom.value.slice(3,5));
  blue = Number('0x' + custom.value.slice(5));
}

function blackColor(e) {
  if (e.pressure !== 0 && e.buttons === 1) {
    red = 0, green = 0, blue = 0;
    e.target.classList.toggle('recent');
    e.target.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
  }
}

function randomColor(e) {
  if (e.pressure !== 0 && e.buttons === 1) {
    red = Math.random() * 256;
    green = Math.random() * 256;
    blue = Math.random() * 256;
    e.target.classList.toggle('recent');
    e.target.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
  }    
}  

function grayColor(e) {
  if (e.pressure !== 0 && e.buttons === 1) {
    if (reverse) {
      if (red < 55) {
        red = 50;
        reverse = false;
      } else {
        red -=5;
      }
    } else {
      if (red > 200) {
        red = 205;
        reverse = true;
      } else {
        red += 5;
      }
    }
    e.target.classList.toggle('recent');
    e.target.style.backgroundColor = `rgb(${red}, ${red}, ${red})`;
  }
}

function darken(e) {
  if (e.pressure !== 0 && e.buttons === 1) {
    [red, green, blue] = [...e.target.style.backgroundColor.split(/[^0-9]/).filter( (a) => a !== "")];
    red = Number(red) < 25 ? 0 : Number(red) - 25;
    green = Number(green) < 25 ? 0 : Number(green) - 25;
    blue = Number(blue) < 25 ? 0 : Number(blue) - 25;
    e.target.classList.toggle('recent');
    e.target.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
  }
}

function brighten(e) {
  if (e.pressure !== 0 && e.buttons === 1) {
    [red, green, blue] = [...e.target.style.backgroundColor.split(/[^0-9]/).filter( (a) => a !== "")];
    red = Number(red) > 230 ? 255 : Number(red) + 25;
    green = Number(green) > 230 ? 255 : Number(green) + 25;
    blue = Number(blue) > 230 ? 255 : Number(blue) + 25;
    e.target.classList.toggle('recent');
    e.target.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
  }
}

function rainbowColor(e) {

}

function fireColor(e) {
  if (e.pressure !== 0 && e.buttons === 1) {
    if (reverse) {
      if (green < 5) {
        green = 0;
        reverse = false;
      } else {
        green -=5;
      }
    } else {
      if (green > 250) {
        green = 255;
        reverse = true;
      } else {
        green += 5;
      }
    }
    e.target.classList.toggle('recent');
    e.target.style.backgroundColor = `rgb(${255}, ${green}, ${0})`;
  }
}

function iceColor(e) {
  if (e.pressure !== 0 && e.buttons === 1) {
    if (reverse) {
      if (green < 5) {
        green = 0;
        reverse = false;
      } else {
        green -=5;
      }
    } else {
      if (green > 250) {
        green = 255;
        reverse = true;
      } else {
        green += 5;
      }
    }
    e.target.classList.toggle('recent');
    e.target.style.backgroundColor = `rgb(${0}, ${green}, ${255})`;
  }
}

function customColor(e) {
  if (e.pressure !== 0 && e.buttons === 1) {
    if (reverse) {
      if (red < 20 || green < 20 || blue < 20) {
        reverse = false;
      } else {
        red -=5;
        green -=5;
        blue -=5;
      }
    } else {
      if (red > 235 || green >235 || blue > 235) {
        reverse = true;
      } else {
        red += 5;
        green += 5;
        blue += 5;
      }
    }
    e.target.classList.toggle('recent');
    e.target.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
  }
}

function selectModus(e) {
  switch(modus) {
    case 'Black':
      blackColor(e);
      break;
    case 'Random':
      randomColor(e);
      break;
    case 'Grayscale':
      grayColor(e);
      break;
    case 'Darken':
      darken(e);
      break;
    case 'Brighten':
      brighten(e);
      break;
    case 'Rainbow':
      rainbowColor(e);
      break;
    case 'Fire':
      fireColor(e);
      break;
    case 'Ice':
      iceColor(e);
      break;
    case 'Custom':
      customColor(e);
      break;
  }
}
