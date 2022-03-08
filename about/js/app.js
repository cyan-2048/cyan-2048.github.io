let tabs = [],
	volume = 1;

const apps = ["vscode", "about", "traits", "minecraft", "jspaint"],
	cachedApps = {},
	isMobile =
		(navigator.userAgentData && navigator.userAgentData.mobile) || /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase());

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
		if (getHighestZ() && getHighestZ() == a) el.classList.add("active");
		el.onclick = function () {
			a.click();
		};
		if (a.dataset.icon) el.style.backgroundImage = `url(${a.dataset.icon})`;
		else if (a.classList.contains("iframe-app")) {
			if (a.qs("img").naturalWidth == 0)
				a.qs("img").addEventListener("load", function load() {
					a.qs("img").removeEventListener("load", load);
					el.style.backgroundImage = `url(${a.qs("img").src})`;
				});
			else el.style.backgroundImage = `url(${a.qs("img").src})`;
		} else el.style.backgroundImage = "url(./css/app.ico)";
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
		startLostFocus();
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

function runApp(g) {
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

function playAudio(a) {
	let audio = new Audio(`./audio/${a}.mp3`);
	audio.volume = volume;
	audio.play();
}

function showError(msg, info) {
	return getTemplate(
		"error",
		(e) => {
			playAudio("error");
			unfocusAll();
			e.qs(".title-bar-controls").classList.remove("notfocused");
			e.qs("details").style.display = info ? "block" : "none";
			e.qs("pre").innerHTML = info;
			e.qs("img+div").insertAdjacentText("afterbegin", msg);
			document.body.appendChild(e);
			makeWindowsDrag();
			updateTabs();
		},
		{
			class: "error no-resize",
			style: {
				top: (() => {
					let getto = getHighestZ("#error");
					if (getto && Number(getto.style.top.split("px")[0]) + 20 < window.innerHeight - 40) {
						return Number(getto.style.top.split("px")[0]) + 20 + "px";
					} else return window.innerHeight / 2 - 78 + "px";
				})(),
				left: (() => {
					let getto = getHighestZ("#error");
					if (getto && Number(getto.style.top.split("px")[0]) + 20 < window.innerHeight - 40) {
						return Number(getto.style.left.split("px")[0]) + 20 + "px";
					} else return window.innerWidth / 2 - 205 + "px";
				})(),
				zIndex: highestZ() + 2,
			},
		}
	);
}

var aeroSnap = null;

function makeWindowsDrag() {
	let cursorCSS = () => (document.body.style.cursor = "url(./css/cursor/aero_arrow.png), auto");

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
		cursor: false,
		drag: (e) => {
			const aero = getId("aero_snap"),
				{ clientX, clientY } = getClientXY(),
				iffunc = () => {
					clearTimeout(aeroSnap);
					Object.assign(aero.style, {
						opacity: 1,
						visibility: "visible",
						zIndex: highestZ() - 1,
					});
					Object.assign(getId("aero_anim").style, {
						top: clientY - 32.5 + "px",
						left: clientX - 32.5 + "px",
					});
				},
				elsefunc = () => {
					aero.style.opacity = 0;
					aero.style.visibility = "hidden";
					aero.className = "";
				},
				faildow = e.target;
			if (faildow.classList.contains("ui-resizable")) {
				if (window.innerWidth - 9 > Number(faildow.style.left.split("px")[0]) && clientX > window.innerWidth - 9) {
					iffunc();
					aero.className = "snap_right";
				} else if (Number(faildow.style.left.split("px")[0]) < 0 && clientX < 3) {
					iffunc();
					aero.className = "snap_left";
				} else if (Number(faildow.style.top.split("px")[0]) < 0 && clientY < 1) {
					iffunc();
					aero.className = "snap";
				} else elsefunc();
			} else elsefunc();
		},
		stop: (e) => {
			cursorCSS();
			const target = e.target;
			// when windows goes to top or bottom way too far?? not sure
			const top = Number(target.style.top.split("px")[0]),
				left = Number(target.style.left.split("px")[0]);

			if (top < 0) {
				target.style.top = "0px";
			} else if (top > window.innerHeight - 67) {
				target.style.top = window.innerHeight - 67 + "px";
			}

			if (left > window.innerWidth + 1) {
				target.style.left = window.innerWidth - target.offsetWidth + "px";
			} else if (left < -1) {
				target.style.left = "0px";
			}

			var aero = getId("aero_snap");
			if (aero.style.opacity == 1) {
				switch (aero.className) {
					case "snap":
						e.target.qs("[aria-label='Maximize'],[aria-label='Restore']").click();
						break;
					case "snap_left":
						aero.style.transition = "all ease 0s";
						Object.assign(target.style, {
							left: "0px",
							right: "auto",
							top: "0px",
							width: "50vw",
							height: "calc(100vh - 40px)",
						});
						break;
					case "snap_right":
						aero.style.transition = "all ease 0s";
						Object.assign(target.style, {
							left: "auto",
							right: "0px",
							top: "0px",
							width: "50vw",
							height: "calc(100vh - 40px)",
						});
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

	$(".window:not(.no-resize)").resizable({
		handles: "all",
		containment: "body",
		minWidth: 229,
		minHeight: 113,
		cursor: false,
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
		stop: cursorCSS,
	});

	$(".window#vscode, .window#minecraft").resizable({
		handles: "all",
		containment: "body",
		minWidth: 576,
		minHeight: 380,
		cursor: false,
		stop: cursorCSS,
	});

	$(".window#traits").resizable({
		handles: "all",
		minWidth: 400,
		minHeight: 317,
		cursor: false,
		stop: cursorCSS,
	});

	qsa(".window.ui-resizable .title-bar").forEach((a) => {
		a.ondblclick = function (e) {
			a.qs("[aria-label='Maximize'],[aria-label='Restore']").click();
		};
	});
}

window.onresize = () => {
	qsa(".window").forEach((target) => {
		const top = Number(target.style.top.split("px")[0]),
			left = Number(target.style.left.split("px")[0]);

		if (top < 0) {
			target.style.top = "0px";
		} else if (top > window.innerHeight - 67) {
			target.style.top = window.innerHeight - 67 + "px";
		}

		if (left > window.innerWidth + 1) {
			target.style.left = window.innerWidth - target.offsetWidth + "px";
		} else if (left < -1) {
			target.style.left = "0px";
		}
	});
};

function startLostFocus() {
	getId("start_menu").style.display = "none";
	toggleStart();
}
function toggleStart() {
	if (getId("start_menu").style.display == "") {
		getId("start_menu").setAttribute("style", "display: block;");
		getId("menu-button").style.backgroundImage = "url(css/start-selected.png)";
		if (!isMobile) getId("start_input").focus();
	} else {
		getId("menu-button").removeAttribute("style");
		getId("start_menu").removeAttribute("style");
	}
}

getId("menu-button").onclick = () => {
	if (!getId("start_menu").style.display == "") getId("start_menu").style.display = "block";
	else getId("start_menu").removeAttribute("style");
	toggleStart();
};

toggleStart();

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
	let indexu = tabs.indexOf(a);
	if (indexu != -1) getId("taskbar-items").children[indexu].classList.add("closing");
	unfocusAll();
	setTimeout(() => {
		if (a.classList.contains("iframe-app")) {
			let b = a.qs("iframe").onabort;
			if (b) b();
		}
		a.remove();
		let getto = getHighestZ();
		if (getto) {
			getto.qs(".title-bar-controls").classList.remove("notfocused");
		}
		if (indexu != -1) getId("taskbar-items").children[indexu].remove();
		updateTabs();
	}, 300);
}
$(document).on("focusout", function () {
	setTimeout(() => {
		// using the 'setTimout' to let the event pass the run loop
		if (actEl() instanceof HTMLIFrameElement) {
			// Do your logic here..
			console.log("heya unfocus moment");
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

window.onmessage = function (e) {
	const obj = e.data,
		parent = Array.from(qsa("iframe"))
			.find((a) => a.contentWindow == e.source)
			.closest(".window"),
		data = obj.data,
		hmm = () => console.warn("unknown message from an iframe... so spooky ", e);
	if ("object" != typeof obj) return hmm(e);
	if (parent) {
		if (parent.id == "jspaint") {
			switch (obj.func) {
				case "title":
					parent.qs(".title-bar-text").innerText = data;
					break;
				case "wallpaper":
					setWallpaper(data, obj.repeat.toString(), true);
					break;
				case "open":
					window._jspaint = data;
					runApp("jspaint");
					break;
				default:
					hmm();
					break;
			}
		}
	} else hmm();
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
			const canvafunc = (function (t) {
				var e,
					a,
					r,
					n = document.createElement("canvas"),
					g,
					d = n.getContext && n.getContext("2d"),
					h = -4,
					u = { r: 0, g: 0, b: 0 },
					b = 0;
				if (!d) return null;
				(r = n.height = t.height), (a = n.width = t.width), d.drawImage(t, 0, 0);

				if (localStorage.forceBlur == "true") {
					d.globalAlpha = 0.3;
					let offset = 7;
					for (var i = 1; i <= 8; i += 1) {
						d.drawImage(n, offset, 0, n.width - offset, n.height, 0, 0, n.width - offset, n.height);
						d.drawImage(n, 0, offset, n.width, n.height - offset, 0, 0, n.width, n.height - offset);
					}

					n.toBlob((blob) => {
						document.body.style.setProperty("--backdrop", `url("${URL.createObjectURL(blob)}") 0 / cover fixed`, "important");
					});
					return null;
				} else {
					try {
						e = d.getImageData(0, 0, a, r);
					} catch (t) {
						return null;
					}
					for (g = e.data.length; (h += 80) < g; ) ++b, (u.r += e.data[h]), (u.g += e.data[h + 1]), (u.b += e.data[h + 2]);
					return (u.r = ~~(u.r / b)), (u.g = ~~(u.g / b)), (u.b = ~~(u.b / b)), "rgb(" + u.r + "," + u.g + "," + u.b + ")";
				}
			})(img);

			if (canvafunc) document.body.style.setProperty("--backdrop", canvafunc, "important");
		};
	}

	if (storage) {
		localStorage["wallpaper-repeat"] = repeat;
		localforage.setItem("wallpaper-data", file);
	}
}
(() => {
	let wallpaper_repeat = localStorage["wallpaper-repeat"];
	localforage.getItem("wallpaper-data", function (err, value) {
		if (err) return console.error(err);
		if (value) setWallpaper(value, wallpaper_repeat || false);
	});
})();

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
	let { clientX, clientY } = getClientXY();
	el.style.left = clientX + "px";
	el.style.top = clientY + "px";
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

if (!CSS.supports("backdrop-filter", "blur(15px)")) {
	document.body.style.setProperty("--backdrop", 'url("marble_blur.jpeg") 0 / cover fixed');
	showError("Aero glass won't work if backdrop-filter is not working...");
}

showError("this website is under construction, may or may never be finished....");

runApp("traits");
