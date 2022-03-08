// this script requires to be defer -ed
(function (window) {
	let x = 0,
		y = 0;
	if ("ontouchstart" in window) {
		let clicked = (e) => {
			var br = document.body.getBoundingClientRect();
			// x & y are relative to the clicked element
			x = e.touches[0].clientX - br.left;
			y = e.touches[0].clientY - br.top;
		};
		document.body.addEventListener("touchmove", clicked);
		document.body.addEventListener("touchstart", clicked);
	} else {
		document.body.addEventListener("mousemove", function (e) {
			x = e.clientX;
			y = e.clientY;
		});
	}

	window.getClientXY = function () {
		return { clientX: x, clientY: y };
	};
})(window);
