((window) => {
	window.socials = {};
	function loop() {
		fetch("https://website.cyan-2048.workers.dev/socials")
			.then((e) => e.json())
			.then((e) => {
				window.socials = e;
			})
			.catch(loop);
	}
	loop();
})(window);
