'use strict';

(function etchASketch() {

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

  const custom = document.getElementById('color-picker');

  let squares = 16;
  let modus = 'Black';
  let reverse = false;
  let hue = 0, sat = 0, lit = 100;
  let moon = 100;

  function customColor(e) {
    if (e.pressure !== 0 && e.buttons === 1) {
      setColor(e.target);
    }
  }

  /* Thanks to: Waldman Media AB - Nicolai Waldman 
  https://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl/ */
  function rgbToHsl() {
    let [h, s, l] = [0, 0, 0];
    let [r, g, b] = [0, 0, 0];
    let rgb = [r,g,b] = [
      Number('0x' + custom.value.slice(1,3)) / 255,
      Number('0x' + custom.value.slice(3,5)) / 255,
      Number('0x' + custom.value.slice(5)) / 255
    ];
    
    rgb.sort( (p,n) => n - p);
    
    l = (rgb[0] + rgb[2]) / 2;
    
    if (rgb[0] === rgb[2]) {
      s = 0;
    } else if (l <= 0.5) {
      s = (rgb[0] - rgb[2]) / (rgb[0] + rgb[2])
    } else {
      s = (rgb[0] - rgb[2]) / (2.0 - rgb[0] - rgb[2])
    }
    
    if (rgb[0] === r) {
      h = (g - b) / (rgb[0] - rgb[2]);
    } else if (rgb[0] === g) {
      h = 2.0 + (b - r) / (rgb[0] - rgb[2]);
    } else {
      h = 4.0 + (r - g) / (rgb[0] - rgb[2]);
    }
    
    hue = Number.isNaN(h) ? 0 : Math.round(h < 0 ? h * 60 + 360 : h * 60);
    sat = Math.round(s * 100);
    lit = Math.round(l * 100);
  }

  function changeColor() {
    document.querySelectorAll('.modus').forEach( (m) => {
      m.classList.remove('toggle-on');
      m.addEventListener('click', toggleModi);
    });
    modus = document.querySelector('label').innerText;
    rgbToHsl();
  }

  function iceColor(e) {
    [sat, lit] = [100, 50];
    if (e.pressure !== 0 && e.buttons === 1) {
      if (hue > 251 || hue < 184) {
        hue = 251;
      }
      if (reverse) {
        if (hue < 187) {
          hue = 184;
          reverse = false;
        } else {
          hue -= 3;
        }  
      } else {
        if (hue > 248) {
          hue = 251;
          reverse = true;
        } else {
          hue += 3;
        }  
      }
      setColor(e.target);
    }  
  }  

  function fireColor(e) {
    [sat, lit] = [100, 50];
    if (e.pressure !== 0 && e.buttons === 1) {
      if (hue > 60) {
        hue = 0;
      }
      if (reverse) {
        if (hue < 3) {
          hue = 0;
          reverse = false;
        } else {
          hue -= 3;
        }    
      } else {
        if (hue > 57) {
          hue = 60;
          reverse = true;
        } else {
          hue += 3;
        }    
      }    
      setColor(e.target);
    }    
  }    

  function rainbowColor(e) {
    [sat, lit] = [100, 50];
    if (e.pressure !== 0 && e.buttons === 1) {
      hue = (hue + 5) % 360;
      setColor(e.target);
    }    
  }  

  function brighten(e) {
    if (e.pressure !== 0 && e.buttons === 1) {
      [hue, sat, lit] = [e.target.dataset.h, e.target.dataset.s, e.target.dataset.l];
      if(lit <= 90) {
        lit = Number(lit) + 10;
      } else {
        lit = 100;
      };
      setColor(e.target);
    }
  }

  function darken(e) {
    if (e.pressure !== 0 && e.buttons === 1) {
      [hue, sat, lit] = [e.target.dataset.h, e.target.dataset.s, e.target.dataset.l];
      if(lit >= 10) {
        lit -=10;
      } else {
        lit = 0;
      };
      setColor(e.target);
    }
  }

  function grayColor(e) {
    if (e.pressure !== 0 && e.buttons === 1) {
      if (reverse) {
        if (lit <= 55) {
          lit = 0;
          reverse = false;
        } else {
          lit -=5;
        }
      } else {
        if (lit >= 95) {
          lit = 100;
          reverse = true;
        } else {
          lit += 5;
        }
      }
      [hue, sat] = [0, 0];
      setColor(e.target);
    }
  }

  function randomColor(e) {
    if (e.pressure !== 0 && e.buttons === 1) {
      hue = Math.floor(Math.random() * 360);
      sat = Math.floor(Math.random() * 51) + 50;
      lit = Math.floor(Math.random() * 51) + 50;
      setColor(e.target);
    }    
  }  

  function blackColor(e) {
    if (e.pressure !== 0 && e.buttons === 1) {
      [hue, sat, lit] = [0, 0, moon ? 0 : 100];
      setColor(e.target);
    }
  }

  function setColor(pixel) {
    pixel.classList.toggle('current');
    [pixel.dataset.h, pixel.dataset.s, pixel.dataset.l] = [hue, sat, lit];
    pixel.style.backgroundColor = `hsl(${pixel.dataset.h}, ${pixel.dataset.s}%, ${pixel.dataset.l}%)`;
  }

  function selectModus(e) {
    switch(modus) {
      case 'Black':
      case 'White':
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

  function toggleModi() {
    document.querySelectorAll('.modus').forEach( (m) => {
      m.classList.remove('toggle-on');
      m.addEventListener('click', toggleModi);
    });
    this.classList.add('toggle-on')
    this.removeEventListener('click', toggleModi);
    modus = this.innerText;
  }

  function gridToggle() {
    board.style.gap = board.style.gap === '1px' ? 0 : '1px';
    grid.classList.toggle('toggle-on');
  }

  function resetBoard() {
    [hue, sat, lit] = [0, 0, moon];
    board.querySelectorAll('div').forEach( pixel => {
      [pixel.dataset.h, pixel.dataset.s, pixel.dataset.l] = [hue, sat, lit];
      pixel.style.backgroundColor = `hsl(${pixel.dataset.h}, ${pixel.dataset.s}%, ${pixel.dataset.l}%)`;
    });
  }

  function increaseRatio() {
    if (squares < 96) {
      squares += 8;
      setRatioText();
      drawPixel();
    }
  }

  function decreaseRatio() {
    if (squares > 8) {
      squares -= 8;
      setRatioText();
      drawPixel();
    }
  }

  function changeTheme() {
    if (theme.classList.contains('moon')) {
      moon = 100;
      theme.classList.remove('moon');
      theme.textContent = String.fromCodePoint(0x1f319);
      black.textContent = 'Black';
      document.documentElement.style.removeProperty('--black');
      document.documentElement.style.removeProperty('--white');
      document.documentElement.style.removeProperty('--background1');
      document.documentElement.style.removeProperty('--background2');
      document.documentElement.style.removeProperty('--background3');
      document.documentElement.style.removeProperty('--background4');
      document.documentElement.style.removeProperty('--background5');
      document.documentElement.style.removeProperty('--text1');
      document.documentElement.style.removeProperty('--text2');
      document.documentElement.style.removeProperty('--shadow1');
      document.documentElement.style.removeProperty('--shadow2');
      resetBoard();
    } else {
      moon = 0;
      theme.classList.add('moon');
      theme.textContent = String.fromCodePoint(0x1f506);
      black.textContent = 'White';
      document.documentElement.style.setProperty('--black', '#fff');
      document.documentElement.style.setProperty('--white', '#000');
      document.documentElement.style.setProperty('--background1', '#0f1f1f');
      document.documentElement.style.setProperty('--background2', '#3f4f4f');
      document.documentElement.style.setProperty('--background3', '#2f3f3f');
      document.documentElement.style.setProperty('--background4', '#1f2f2f');
      document.documentElement.style.setProperty('--background5', '#29bbff');
      document.documentElement.style.setProperty('--text1', '#21a2e2');
      document.documentElement.style.setProperty('--text2', '#2affff');
      document.documentElement.style.setProperty('--shadow1', '#0f0f0f');
      document.documentElement.style.setProperty('--shadow2', '#121212');
      resetBoard();
    }
  }

  function drawPixel() {
    board.querySelectorAll('div').forEach( pixel => board.removeChild(pixel));
    document.documentElement.style.setProperty('--grid', squares);
    [hue, sat, lit] = [0, 0, moon];
    
    for (let i = 0; i < squares**2; i++) {
      const pixel = document.createElement('div');
      pixel.setAttribute('data-h', `${hue}`);
      pixel.setAttribute('data-s', `${sat}`);
      pixel.setAttribute('data-l', `${lit}`);
      board.appendChild(pixel);
      pixel.style.backgroundColor = `hsl(${pixel.dataset.h}, ${pixel.dataset.s}%, ${pixel.dataset.l}%)`;
      pixel.addEventListener('pointerenter', selectModus);
      pixel.addEventListener('pointerleave', () => setTimeout(() => pixel.classList.toggle('current'), 250));
    }
    document.querySelectorAll('.modus').forEach( (m) => {
      m.classList.remove('toggle-on');
      m.addEventListener('click', toggleModi);
    });
    modus = 'Black';
    black.classList.add('toggle-on')
    black.removeEventListener('click', toggleModi);
  }

  function setRatioText() {
    ratio.innerText = `${squares} X ${squares}`;
  }

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
  setRatioText();
  drawPixel();

})();
