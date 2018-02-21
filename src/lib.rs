use std::os::raw::c_int;
use std::os::raw::c_char;
use std::os::raw::c_double;

extern "C" {
  fn clear_screen();
  fn draw_pixel(_: c_int, _: c_int);
  fn get_random() -> c_double;
}

#[no_mangle]
pub extern "C" fn read_and_process_instruction() {

}

#[no_mangle]
pub extern "C" fn redraw() {
  unsafe {clear_screen()};
  unsafe {draw_pixel(1,1)};
}


#[no_mangle]
pub extern "C" fn on_key_down(key: c_char) {
  let key = key as u8;
}

#[no_mangle]
pub extern "C" fn on_key_up(key: c_char) {
  let key = key as u8;
}

#[no_mangle]
pub extern "C" fn decrement_timers() {
}
