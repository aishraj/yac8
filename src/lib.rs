use std::os::raw::c_int;

extern "C" {
  fn clear_screen();
  fn draw_pixel(_: c_int, _: c_int);
}

#[no_mangle]
pub extern "C" fn perform_action() {
  unsafe {clear_screen()};
  unsafe {draw_pixel(1,1)};
}