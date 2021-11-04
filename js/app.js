var doge = "";

for (let a of document.querySelectorAll(".doge img")) {
	var o = a.getAttribute("alt"),
		n = document.createAttribute("title");
	(n.value = o), a.setAttributeNode(n);

	a.addEventListener("dragstart", (e) => {
		e.preventDefault();
	});
}

for (let i = 0; i < document.querySelectorAll(".doge img").length; i++) {
	document.querySelectorAll(".doge img")[i].addEventListener("click", (e) => {
		if ([i] == 14) {
			toggleDoge(doge);
			doge = "";
		} else {
			doge += [i] + "-";
		}
	});
}

if (localStorage["dark_mode"] == null) {
	if (
		window.matchMedia &&
		window.matchMedia("(prefers-color-scheme: dark)").matches
	) {
		localStorage["dark_mode"] = true;
	} else {
		localStorage["dark_mode"] = false;
	}
}

if (localStorage["dark_mode"] == "true") {
	document.querySelector("#switch").checked = true;
} else {
	document.querySelector("#switch").checked = false;
}

toggleTheme();

function toggleTheme() {
	if (localStorage["dark_mode"] == "true") {
		document.body.style =
			"--primary-color: #1f1f1f; --secondary-color: #ffffff; --shadow-darken: rgba(255, 255, 255, 0.2);";
	} else {
		document.body.style =
			"--primary-color: #ffffff; --secondary-color: #000000; --shadow-darken: rgba(0, 0, 0, 0.4);";
	}
}

document.querySelector("#toggle").addEventListener("click", (e) => {
	document.querySelector("#switch").click();
});

document.querySelector("#switch").addEventListener("click", () => {
	if (document.querySelector("#switch").checked) {
		localStorage["dark_mode"] = true;
	} else {
		localStorage["dark_mode"] = false;
	}

	toggleTheme();
});

function toggleDoge(a) {
	function open(d) {
		window.open(d, "_blank");
	}

	dogeMap = {
		"0-1-2-3-4-5-6-7-8-9-10-11-12-13-": () => {
			window.location = "/css/doge/bonk-it.jpg";
		},
		"2-3-5-9-": () => {
			open("https://www.youtube.com/watch?v=3IMItGHeOpE");
		},
		"4-13-": () => {
			open("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
		},
		"8-10-12-": () => {
			open("https://www.youtube.com/watch?v=fmOEKOjyDxU");
		},
	};
	if (dogeMap[a]) {
		dogeMap[a]();
	}
}
