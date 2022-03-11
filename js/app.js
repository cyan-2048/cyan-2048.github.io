let doge = "";

document.querySelectorAll("#doge img").forEach((a, i) => {
	a.setAttribute("title", a.getAttribute("alt"));
	a.addEventListener("dragstart", (e) => {
		e.preventDefault();
	});
	a.addEventListener("click", () => {
		if ([i] == 14) {
			toggleDoge(doge);
			doge = "";
		} else {
			doge += [i] + "-";
		}
		console.log(doge);
	});
});

if (localStorage["dark_mode"] == null) {
	if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
		localStorage["dark_mode"] = true;
	} else {
		localStorage["dark_mode"] = false;
	}
}

document.getElementById("switch").checked = localStorage["dark_mode"] == "true";
document.body.setAttribute(
	"style",
	localStorage["dark_mode"] == "true"
		? "--primary-color: #1f1f1f; --secondary-color: #ffffff; --shadow-darken: rgba(255, 255, 255, 0.2);"
		: "--primary-color: #ffffff; --secondary-color: #000000; --shadow-darken: rgba(0, 0, 0, 0.4);"
);

const toggle = document.getElementById("toggle");
toggle.addEventListener("click", (e) => {
	document.getElementById("switch").click();
});
toggle.onmouseover = () => (document.querySelector(".toggle").style.opacity = 0.6);

toggle.onmouseout = () => document.querySelector(".toggle").removeAttribute("style");

document.getElementById("switch").addEventListener("click", () => {
	if (document.getElementById("switch").checked) localStorage["dark_mode"] = true;
	else localStorage["dark_mode"] = false;
	document.body.setAttribute(
		"style",
		localStorage["dark_mode"] == "true"
			? "--primary-color: #1f1f1f; --secondary-color: #ffffff; --shadow-darken: rgba(255, 255, 255, 0.2);"
			: "--primary-color: #ffffff; --secondary-color: #000000; --shadow-darken: rgba(0, 0, 0, 0.4);"
	);
});

function toggleDoge(a) {
	let d = false;
	switch (a) {
		case "0-1-2-3-4-5-6-7-8-9-10-11-12-13-":
			return (window.location = "/css/doge/bonk-it.jpg");
			break;
		case "2-3-5-9-":
			d = "https://www.youtube.com/watch?v=3IMItGHeOpE";
			break;
		case "4-13-":
			d = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
			break;
		case "8-10-12-":
			d = "https://www.youtube.com/watch?v=fmOEKOjyDxU";
			break;
	}

	return d ? window.open(d, "_blank") : null;
}

document.getElementById("about").onclick = () => {
	document.body.style.opacity = 0;
	document.body.style.overflow = "hidden";
	setTimeout(() => (location.href = "/about"), 500);
};
