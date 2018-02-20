all:
	cargo clean
	cargo +nightly build --target=wasm32-unknown-unknown --release
	wasm-gc ./target/wasm32-unknown-unknown/release/yac8.wasm ./static/wasm/yac8.wasm
