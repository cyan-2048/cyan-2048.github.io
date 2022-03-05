let start_open = false,
	tabs = [];

const apps = ["vscode", "about", "traits", "minecraft", "jspaint"],
	cachedApps = {};

/*
		Welcome!!! here's some functions
*/

const getId = (e) => document.getElementById(e),
	actEl = () => document.activeElement,
	qs = (e) => document.querySelector(e),
	qsa = (e) => document.querySelectorAll(e);

Element.prototype.qs = Element.prototype.querySelector;
Element.prototype.qsa = Element.prototype.querySelectorAll;

function updateTabs() {
	tabs = [];
	const taskbar = getId("taskbar-items");
	taskbar.innerHTML = "";
	qsa(".window").forEach((a, i) => {
		tabs.push(a);
		let el = document.createElement("div");
		el.className = "open";
		el.onclick = function () {
			a.click();
		};
		taskbar.appendChild(el);
	});
}

function getTemplate(file, cb, opt) {
	let element = null;
	if (Object.keys(cachedApps).includes(file)) {
		let parser = document.createElement("div");
		parser.innerHTML = cachedApps[file];
		element = parser.firstChild;
		parse();
	} else {
		fetch("js/templates/" + file + ".html")
			.then((res) => res.text())
			.then((res) => {
				let parser = document.createElement("div");
				parser.innerHTML = res;
				element = parser.firstChild;
				cachedApps[file] = res;
				parse();
			})
			.catch((err) => {
				cb(null, err);
			});
	}
	function parse() {
		if (opt) {
			if (opt.style) Object.assign(element.style, opt.style);
			if (opt.class) {
				let clas = opt.class,
					arr = [];
				if (typeof clas == "string") {
					if (/ /.test(clas)) arr = clas.split(" ");
					else arr.push(clas);
				} else if (clas instanceof Array) arr = clas;
				arr.forEach((a) => element.classList.add(a));
			}
		}
		cb(element);
	}
}

setTimeout(updateTabs, 500);

function runApp(g) {
	startLostFocus();
	let left = "35px",
		top = "35px",
		getto = getHighestZ("#" + g);
	if (getto && Number(getto.style.top.split("px")[0]) + 20 < window.innerHeight - 40) {
		left = Number(getto.style.left.split("px")[0]) + 20 + "px";
		top = Number(getto.style.top.split("px")[0]) + 20 + "px";
	}

	if (apps.includes(g)) getTemplate(g, next, { style: { top, left, zIndex: highestZ() + 1 } });

	function next(el, err) {
		if (err) {
			console.error("error occured", err);
			return;
		}
		document.body.appendChild(el);
		unfocusAll();
		el.qs(".title-bar-controls").classList.remove("notfocused");
		makeWindowsDrag();
		if (g == "traits") makeTabsWorkAgain();
		updateTabs();
	}
}

function showError(msg, info) {
	return getTemplate(
		"error",
		(e) => {
			unfocusAll();
			e.qs(".title-bar-controls").classList.remove("notfocused");
			e.qs("details").style.display = info ? "block" : "none";
			e.qs("pre").innerHTML = info;
			e.qs("img+div").insertAdjacentText("afterbegin", msg);
			document.body.appendChild(e);
			makeWindowsDrag();
		},
		{ class: "error no-resize", style: { top: window.innerHeight / 2 - 78 + "px", left: window.innerWidth / 2 - 205 + "px", zIndex: highestZ() + 1 } }
	);
}

var aeroSnap = null;

function makeWindowsDrag() {
	qsa(".window").forEach(
		(e) =>
			(e.onclick = function () {
				if (this != getHighestZ()) {
					console.log(this);
					unfocusAll();
					this.style.zIndex = highestZ() + 1;
					this.qs(".title-bar-controls").classList.remove("notfocused");
				}
				const taskbar = getId("taskbar-items"),
					indexu = tabs.indexOf(this);
				for (const s of taskbar.children) {
					s.classList.remove("active");
				}
				if (indexu != -1) {
					taskbar.children[indexu].classList.add("active");
				}
				startLostFocus();
			})
	);
	$(".window").draggable({
		handle: ".title-bar",
		stack: ".window",
		start: (e) => {
			startLostFocus();
			unfocusAll();
			if (e.target.classList.contains("maximu")) {
				e.target.classList.remove("maximu");
				e.target.qs('[aria-label="Restore"]').outerHTML = '<button onclick="maxsBtn(this)" aria-label="Maximize"></button>';
			}
			e.target.qs(".title-bar-controls").classList.remove("notfocused");
			e.target.click();
		},
		drag: (e) => {
			var aero = getId("aero_snap");
			var iffunc = () => {
				clearTimeout(aeroSnap);
				aero.style.opacity = 1;
				aero.style.visibility = "visible";
			};
			var elsefunc = () => {
				aero.style.opacity = 0;
				aero.style.visibility = "hidden";
				aero.className = "";
			};
			// console.log(`ClientX : ${e.clientX} - ClientY : ${e.clientY}`);
			var faildow = e.target;
			if (faildow.classList.contains("ui-resizable")) {
				if (window.innerWidth - 9 > Number(faildow.style.left.split("px")[0]) && e.clientX > window.innerWidth - 9) {
					iffunc();
					aero.className = "snap_right";
				} else if (Number(faildow.style.left.split("px")[0]) < 0 && e.clientX < 1) {
					iffunc();
					aero.className = "snap_left";
				} else if (Number(faildow.style.top.split("px")[0]) < 0 && e.clientY < 1) {
					iffunc();
					aero.className = "snap";
				} else elsefunc();
			} else elsefunc();
		},
		stop: (e) => {
			for (let fail of qsa(".window")) {
				var top = Number(fail.style.top.split("px")[0]);
				if (top < 0) {
					fail.style.top = "0px";
				} else if (top > window.innerHeight - 67) {
					fail.style.top = window.innerHeight - 67 + "px";
				}
			}
			var aero = getId("aero_snap");
			if (aero.style.opacity == 1) {
				switch (aero.className) {
					case "snap":
						e.target.qs("[aria-label='Maximize'],[aria-label='Restore']").click();
						break;
					case "snap_left":
						aero.style.transition = "all ease 0s";
						e.target.style.left = "0px";
						e.target.style.right = "auto";
						e.target.style.top = "0px";
						e.target.style.width = "50vw";
						e.target.style.height = "calc(100vh - 40px)";
						break;
					case "snap_right":
						aero.style.transition = "all ease 0s";
						e.target.style.left = "auto";
						e.target.style.right = "0px";
						e.target.style.top = "0px";
						e.target.style.width = "50vw";
						e.target.style.height = "calc(100vh - 40px)";
						break;
				}
				aero.style.opacity = 0;
				aero.style.visibility = "hidden";
				aero.className = "";
				setTimeout(() => {
					aero.style.transition = "";
				}, 500);
			}
		},
	});

	for (let object of qsa(".window")) {
		var initX, initY, firstX, firstY;

		object.addEventListener(
			"touchstart",
			function (e) {
				e.preventDefault();
				initX = this.offsetLeft;
				initY = this.offsetTop;
				var touch = e.touches;
				firstX = touch[0].pageX;
				firstY = touch[0].pageY;

				this.addEventListener("touchmove", swipeIt, false);

				window.addEventListener(
					"touchend",
					function (e) {
						e.preventDefault();
						object.removeEventListener("touchmove", swipeIt, false);
					},
					false
				);
			},
			false
		);

		function swipeIt(e) {
			var contact = e.touches;
			this.style.left = initX + contact[0].pageX - firstX + "px";
			this.style.top = initY + contact[0].pageY - firstY + "px";
		}
	}

	$(".window:not(.no-resize)").resizable({
		handles: "all",
		containment: "body",
		minWidth: 229,
		minHeight: 113,
		start: (e) => {
			const target = e.target;
			if (target.classList.contains("maximu")) {
				target.style.width = window.innerWidth + "px";
				target.style.top = "1px";
				target.style.left = "1px";
				target.style.height = window.innerHeight + "px";
				target.classList.remove("maximu");
				target.qs('[aria-label="Restore"]').outerHTML = '<button onclick="maxsBtn(this)" aria-label="Maximize"></button>';
			}
		},
	});

	$(".window#vscode, .window#minecraft").resizable({
		handles: "all",
		containment: "body",
		minWidth: 576,
		minHeight: 380,
	});

	$(".window#traits").resizable({
		handles: "all",
		minWidth: 400,
		minHeight: 317,
	});

	qsa(".window.ui-resizable .title-bar").forEach((a) => {
		a.ondblclick = function (e) {
			a.qs("[aria-label='Maximize'],[aria-label='Restore']").click();
		};
	});
}

function startLostFocus() {
	start_open = false;
	toggleStart();
}

function maxsBtn(e) {
	console.log(e);
	var a = e.closest(".window");
	if (!a.classList.contains("window")) return console.error("parent x3 not window");
	a.classList.add("maximu");

	setTimeout(() => {
		e.outerHTML = '<button onclick="resBtn(this)" aria-label="Restore"></button>';
	}, 100);
}
function resBtn(e) {
	var a = e.closest(".window");
	if (!a.classList.contains("window")) return console.error("parent x3 not window");
	var b = a.id;
	a.classList.remove("maximu");
	setTimeout(() => {
		e.outerHTML = '<button onclick="maxsBtn(this)" aria-label="Maximize"></button>';
	}, 1);
}
function closBtn(e) {
	var a = e.closest(".window");
	if (!a.classList.contains("window")) return console.error("parent x3 not window");
	console.log(`closing: ${a.id}`);
	a.classList.add("closing");
	setTimeout(() => {
		let getto = getHighestZ();
		if (getto) {
			getto.qs(".title-bar-controls").classList.remove("notfocused");
		}
		if (a.classList.contains("iframe-app")) {
			let b = a.qs("iframe").onabort;
			if (b) b();
		}
		a.remove();
		updateTabs();
	}, 300);
}
$(document).on("focusout", function () {
	setTimeout(() => {
		// using the 'setTimout' to let the event pass the run loop
		if (actEl() instanceof HTMLIFrameElement) {
			// Do your logic here..
			unfocusAll();
			actEl().closest(".window").style.zIndex = highestZ() + 1;
			actEl().closest(".window").qs(".title-bar-controls").classList.remove("notfocused");
		}
	}, 0);
});

// Tabs

function makeTabsWorkAgain() {
	var tabButtons = qsa("[role=tab]");
	tabButtons.forEach((tabButton) => {
		tabButton.addEventListener("click", (e) => {
			e.preventDefault();
			const tabContainer = e.target.parentElement.parentElement.parentElement;
			const targetId = e.target.getAttribute("aria-controls");
			tabContainer.qsa("button[role='tab']").forEach((_tabButton) => _tabButton.setAttribute("aria-selected", false));
			tabButton.setAttribute("aria-selected", true);
			tabContainer.qsa("[role=tabpanel]").forEach((tabPanel) => tabPanel.setAttribute("hidden", true));
			tabContainer.qs(`[role=tabpanel]#${targetId}`).removeAttribute("hidden");
		});
	});
}

makeTabsWorkAgain();
function updateTime() {
	var e = new Date(),
		t = e.getHours(),
		n = e.getMinutes(),
		m = t >= 12 ? "PM" : "AM",
		a = (t = (t %= 12) || 12) + ":" + (n = n < 10 ? "0" + n : n) + " " + m;
	qs("#datetime .time").innerText = a;
	qs("#datetime .date").innerText = e.toLocaleDateString();
}
updateTime();

function repeatEvery(func, interval) {
	var now = new Date(),
		delay = interval - (now % interval);

	function start() {
		func();
		setInterval(func, interval);
	}

	setTimeout(start, delay);
}

repeatEvery(updateTime, 60000);

function unfocusAll() {
	for (let a of qsa(".title-bar-controls")) {
		a.classList.add("notfocused");
	}
}

if (!CSS.supports("backdrop-filter", "blur(15px)")) {
	document.body.style.setProperty("--backdrop", 'url("marble_blur.jpeg") 0 / cover fixed');
	showError("Aero glass won't work if backdrop-filter is not working...");
}
var toggler = 0;
function toggleFullscreen() {
	if (toggler == 0) {
		toggler = 1;
		document.documentElement.requestFullscreen();
	} else {
		toggler = 0;
		document.exitFullscreen();
	}
}

document.body.ondblclick = function (e) {
	if (e.target !== this) return;
	toggleFullscreen();
};

qs("#start_input").addEventListener("keypress", function (e) {
	if (e.key === "Enter") {
		window.open(`http://www.google.com/search?q=${encodeURIComponent(e.target.value)}`, "_blank");
	}
});

function highestZ() {
	let highest = 0;
	qsa(".window").forEach((a) => {
		const z = Number(a.style.zIndex);
		if (a.style.zIndex !== "" && z !== NaN && z > highest) highest = z;
	});
	return highest;
}

function getHighestZ(a) {
	let highest = null;
	qsa(".window" + (a || "")).forEach((b) => {
		const z = Number(b.style.zIndex);
		if (b.style.zIndex !== "" && z !== NaN) {
			if (!highest || z > Number(highest.style.zIndex)) highest = b;
		}
	});
	return highest;
}

getId("menu-button").onclick = () => {
	if (start_open) {
		start_open = false;
	} else {
		start_open = true;
	}
	toggleStart();
};

toggleStart();

function toggleStart() {
	if (start_open) {
		getId("start_menu").setAttribute("style", "display: block;");
		getId("menu-button").style.backgroundImage = "url(css/start-selected.png)";
		getId("start_input").focus();
	} else {
		getId("menu-button").removeAttribute("style");
		getId("start_menu").removeAttribute("style");
	}
}

window.onmessage = function (e) {
	const obj = e.data,
		parent = Array.from(qsa("iframe"))
			.find((a) => a.contentWindow == e.source)
			.closest(".window"),
		data = obj.data;
	if ("object" != typeof obj) return;
	if (parent) {
		if (parent.id == "jspaint") {
			switch (obj.func) {
				case "title":
					parent.qs(".title-bar-text").innerText = data;
					break;
				case "wallpaper":
					setWallpaper(data, obj.repeat.toString(), true);
					break;
			}
		}
	}
};

function setWallpaper(file, repeat, storage) {
	const blob_url = URL.createObjectURL(file),
		body = document.body;

	body.style.backgroundImage = `url(${blob_url})`;
	body.style.backgroundRepeat = repeat == "true" ? "repeat" : "no-repeat";
	body.style.backgroundSize = repeat == "true" ? "auto" : "cover";

	if (!CSS.supports("backdrop-filter", "blur(15px)")) {
		let img = new Image();
		img.src = blob_url;
		img.onload = (e) => {
			document.body.style.setProperty(
				"--backdrop",
				(function getAverageRGB(t) {
					var e,
						a,
						r,
						g,
						n = document.createElement("canvas"),
						d = n.getContext && n.getContext("2d"),
						h = -4,
						u = { r: 0, g: 0, b: 0 },
						b = 0;
					if (!d) return null;
					(r = n.height = t.height), (a = n.width = t.width), d.drawImage(t, 0, 0);
					try {
						e = d.getImageData(0, 0, a, r);
					} catch (t) {
						return null;
					}
					for (g = e.data.length; (h += 80) < g; ) ++b, (u.r += e.data[h]), (u.g += e.data[h + 1]), (u.b += e.data[h + 2]);
					return (u.r = ~~(u.r / b)), (u.g = ~~(u.g / b)), (u.b = ~~(u.b / b)), "rgb(" + u.r + "," + u.g + "," + u.b + ")";
				})(img)
			);
		};
	}

	if (storage) {
		localStorage["wallpaper-repeat"] = repeat;
		localforage.setItem("wallpaper-data", file);
	}
}
var wallpaper_repeat = localStorage["wallpaper-repeat"];
localforage.getItem("wallpaper-data", function (err, value) {
	if (err) return console.error(err);
	if (value) setWallpaper(value, wallpaper_repeat || false);
});

// stolen from 98.js.org

document.onmousedown = function (e) {
	const k = e.target;
	if (e.buttons == 2 && !/INPUT/.test(k.tagName)) {
		console.log(k);
		k.oncontextmenu = () => {
			k.oncontextmenu = null;
			return false;
		};
		if (k == document.body) openMenuDesktop(e);
	}
};

runApp("about");

getId("taskbar-items").onwheel = function (e) {
	e.preventDefault();
	this.scrollLeft += e.deltaY;
};

function openMenuDesktop(e) {
	if (!e instanceof Event) throw new TypeError("argument not an Event, needs event so that we can locate the mouse");
	let el = getId("context_menu");
	el.style.left = e.clientX + "px";
	el.style.top = e.clientY + "px";
}

function crel(t, opt) {
	let el = document.createElement(t);
	if (typeof opt !== "object") return el;
	if (opt.html && typeof opt.html == "string") el.innerHTML = opt.html;
	if (opt.class) el.className = opt.class instanceof Array ? opt.class.join(" ") : opt.class;

	if (opt.style) Object.assign(document.querySelector("#taskbar-items>div").style, opt.style);
	if (opt.dataset) Object.keys(opt.dataset).forEach((a) => (el.dataset[a] = opt.dataset[a]));
	return el;
}
