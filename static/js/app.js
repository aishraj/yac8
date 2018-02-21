let canvas = document.getElementById("canvas");
let context = canvas.getContext('2d');
context.scale(10,10);

const keypadMap = {
  49: 0x1, 50: 0x2, 51: 0x3, 52: 0xc, 81: 0x4, 87: 0x5, 69: 0x6, 82: 0xd, 65: 0x7, 83: 0x8, 68: 0x9, 70: 0xe, 90: 0xa, 88: 0x0, 67: 0xb, 86: 0xf
};

// Returns an object containing functions that can be called in from Rust.
function imports() {

  function clear_screen() {
    //Clear the screen, draw the blank grid with random cells here.
    context.clearRect(0, 0, 640, 320);
  }

  function draw_pixel(x,y) {
    context.fillRect(x,y,1,1);
  }

  function get_random() {
    return Math.random();
  }

  let imports =  { clear_screen, draw_pixel};
  return imports;
}

fetch('wasm/yac8.wasm').then(response => 
  response.arrayBuffer()
).then(bytes =>
  WebAssembly.instantiate(bytes, {env: imports()})
).then(results => {
  let module = {}
  let mod = results.instance;
  module.read_and_process_instruction = mod.exports.read_and_process_instruction;
  module.on_key_down = mod.exports.on_key_down;
  module.on_key_up = mod.exports.on_key_up;
  module.redraw = mod.exports.redraw;
  module.decrement_timers = mod.exports.decrement_timers;

  let start = null;
  let prevTimestamp = null;
  let drawAndUpdateState = (timestamp) => {
    if (!prevTimestamp) {
      start = timestamp;
      prevTimestamp = timestamp;
      window.requestAnimationFrame(drawAndUpdateState);
      return;
    }
    for (let i = 0; i < 9; i++) {
      module.read_and_process_instruction();
    }
    module.decrement_timers();
    module.redraw();
    window.requestAnimationFrame(drawAndUpdateState);
  };

  document.addEventListener('keydown', event => {
    if (keypadMap[event.keyCode] != undefined) {
    module.on_key_down(keypadMap[event.keyCode]);
    }
  });
  
  document.addEventListener('keyup', event => {
    if (keypadMap[event.keyCode] != undefined) {
      module.on_key_up(keypadMap[event.keyCode]);
    }
  });

  drawAndUpdateState();

});


