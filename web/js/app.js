let canvas = document.getElementById("canvas");
let context = canvas.getContext('2d');
context.scale(10,10);


// var c = document.getElementById("myCanvas");
// var ctx = c.getContext("2d");
// ctx.scale(10,10);
// ctx.fillRect(63, 31,1,1);

// Returns an object containing functions that can be called in from Rust.
function imports() {

  function clear_screen() {
    //Clear the screen, draw the blank grid with random cells here.
    context.clearRect(0, 0, 640, 320);
  }

  function draw_pixel(x,y) {
    context.fillRect(x,y,1,1);
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
  module.perform_action = mod.exports.perform_action;

  let start = null;
  let prevTimestamp = null;
  let drawAndUpdateState = (timestamp) => {
    //console.log("Current timestamp is", timestamp); //TODO Maybe get rid of this or display it in the canvas.
    //Initialize state
    if (!prevTimestamp) {
      start = timestamp;
      prevTimestamp = timestamp;
      window.requestAnimationFrame(drawAndUpdateState);
      //setTimeout(function() {drawAndUpdateState(10);});
      return;
    }

    module.perform_action();
    window.requestAnimationFrame(drawAndUpdateState);
  };

  drawAndUpdateState();

})
