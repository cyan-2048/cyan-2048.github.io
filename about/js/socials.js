((window) => {
	window.socials = {};
	fetch("https://cyan-socials.herokuapp.com/")
		.then((e) => e.json())
		.then((e) => {
			window.socials = e;
			if (window.socials.telegram) {
				fetch(window.socials.telegram.avatar)
					.then((b) => b.blob())
					.then((b) => (window.socials.telegram.avatar = URL.createObjectURL(b)));
			}
		});
})(window);
