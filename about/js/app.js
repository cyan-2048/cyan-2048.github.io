let tabs = [],
	volume = 1,
	images = [
		"/css/doge/doge1.jpg",
		"/css/doge/doge2.jpg",
		"/css/doge/doge3.jpg",
		"/css/doge/doge3_1.png",
		"/css/doge/doge4.png",
		"/css/doge/doge5.jpg",
		"/css/doge/doge6.jpg",
		"/css/doge/doge7.jpg",
		"/css/doge/doge8.jpg",
		"/css/doge/doge9.png",
		"/css/doge/doge10.jpg",
		"/css/doge/doge11.jpg",
		"/css/doge/doge12.jpg",
		"/css/doge/doge13.jpg",
		"/css/doge/doge14.jpg",
		"/css/doge/doge15.jpg",
	];

const apps = ["run", "vscode", "about", "traits", "minecraft", "jspaint", "photo_viewer"],
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

function animCur(cur) {
	document.body.removeAttribute("class");
	if (cur == "stop") return (document.body.style.cursor = "url(./css/cursor/aero_arrow.png), auto");
	switch (cur) {
		case "busy":
			document.body.className = "cursor-busy";
			break;
		case "working":
			document.body.className = "cursor-working";
			break;
	}
}

function updateTabs() {
	tabs = [];
	const taskbar = getId("taskbar-items");
	taskbar.innerHTML = "";

	qsa(".window:not(.sys-win)").forEach((a, i) => {
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
		} else if (a.qs(".title-bar img")) el.style.backgroundImage = `url(${a.qs(".title-bar img").src})`;
		else el.style.backgroundImage = "url(./css/app.ico)";
		taskbar.appendChild(el);
	});
}

function getTemplate(file, cb, opt) {
	let element = null;
	animCur("working");
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
		animCur("stop");
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
	if (g == "run") {
		left = "8px";
		top = window.innerHeight - 255 + "px";
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
		if (el.classList.contains("iframe-app")) {
			animCur("busy");
			el.qs("iframe").addEventListener("load", function load() {
				this.removeEventListener("load", load);
				animCur("stop");
			});
		}
		updateTabs();
	}
}

function playAudio(a, url = false) {
	let audio;
	function wavy(b) {
		if (!(window.AudioContext || window.webkitAudioContext)) return showError("audioContext is not available, please tell Cyan so that they can do something about it...");
		const audioContext = new (window.AudioContext || window.webkitAudioContext)();
		function filterData(audioBuffer) {
			const rawData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
			const samples = Number(audio.duration.toFixed()) / 0.01; // Number of samples we want to have in our final data set
			const blockSize = Math.floor(rawData.length / samples); // the number of samples in each subdivision
			const filteredData = [];
			for (let i = 0; i < samples; i++) {
				let blockStart = blockSize * i; // the location of the first sample in the block
				let sum = 0;
				for (let j = 0; j < blockSize; j++) {
					sum = sum + Math.abs(rawData[blockStart + j]); // find the sum of all the samples in the block
				}
				filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
			}
			const multiplier = Math.pow(Math.max(...filteredData), -1);
			return filteredData.map((n) => n * multiplier);
		}
		audio.ontimeupdate = () => (audio.volume = volume);
		let vol_attr = qs("#volume-bar").getAttribute("style");
		if (vol_attr == null || vol_attr == "") {
			qs("#volume-bar").setAttribute("style", "");
			fetch(b)
				.then((response) => response.arrayBuffer())
				.then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
				.then((audioBuffer) => {
					const data = filterData(audioBuffer);
					data.forEach((a, i) => {
						data[i] = a * 100;
					});
					let index = Number(audio.currentTime.toFixed()) / 0.01;
					function wave() {
						const sync = Number(audio.currentTime.toFixed() / 0.01).toFixed() - index;
						if (sync > 40 || sync < -40) index = Number(audio.currentTime.toFixed()) / 0.01;
						audio.volume = volume;
						const bar = qs("#volume-bar");
						if (!audio.paused && data[index] != 0 && data[index] != undefined) {
							index++;
							if (getId("volume").style.display == "block") bar.style.setProperty("--wave", data[index] + "%");
							else bar.removeAttribute("style");
							setTimeout(wave, 10);
						} else {
							bar.removeAttribute("style");
						}
					}
					if (!audio.paused) {
						wave();
						audio.onplaying = wave;
					}
				})
				.catch(console.error);
		}
	}
	function play(url) {
		audio = new Audio(url);
		audio.volume = volume;
		audio.load();
		audio.play();
	}
	// if it's a url we load it up to ram instead of making it buffer again and again...
	if (url) {
		// rejecting for some reason creates a dom exception
		return new Promise(function (resolve, reject) {
			fetch(a)
				.then((res) => res.blob())
				.then((res) => {
					const url = URL.createObjectURL(res);
					play(url);
					console.log(url);
					wavy(url);
					audio.onended = () => URL.revokeObjectURL(url);
					resolve(audio);
				});
		});
	} else {
		const url = `./audio/${a}.mp3`;
		play(url);
		wavy(url);
	}
	return audio;
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

	qsa(".sys-win").forEach(
		(e) =>
			(e.onclick = () => {
				e.style.zIndex = highestZ() + 1;
				startLostFocus(e);
			})
	);

	qsa(".window:not(.sys-win)").forEach(
		(e) =>
			(e.onclick = function () {
				if (this != getHighestZ()) {
					unfocusAll();
					this.style.zIndex = highestZ() + 1;
					this.classList.add("focus");
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
	$(".window:not(.sys-win)").draggable({
		handle: ".title-bar",
		stack: ".window",
		start: (e) => {
			e.target.style.zIndex = Number(e.target.style.zIndex) + 5;
			startLostFocus();
			unfocusAll();
			e.target.classList.add("focus");
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
			if (top < 0) target.style.top = "0px";
			else if (top > window.innerHeight - 67) target.style.top = window.innerHeight - 67 + "px";
			if (left > window.innerWidth + 1) target.style.left = window.innerWidth - target.offsetWidth + "px";
			else if (left < -target.offsetWidth) target.style.left = "0px";

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
	$(".window#photo_viewer").resizable({
		handles: "all",
		minWidth: 425,
		minHeight: 336,
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
	qsa(".window:not(.sys-win)").forEach((target) => {
		const top = Number(target.style.top.split("px")[0]),
			left = Number(target.style.left.split("px")[0]);
		if (top < 0) target.style.top = "0px";
		else if (top > window.innerHeight - 67) target.style.top = window.innerHeight - 67 + "px";
		if (left > window.innerWidth + 1) target.style.left = window.innerWidth - target.offsetWidth + "px";
		else if (left < -target.offsetWidth) target.style.left = "0px";
	});
};

function startLostFocus(target) {
	["volume", "start_menu"].forEach((a) => {
		if (target && a == target.id) return;
		getId(a).style.display = "none";
	});
	toggleStart();
}
function toggleStart() {
	if (getId("start_menu").style.display == "") {
		getId("start_menu").setAttribute("style", "display: block;");
		getId("menu-button").style.backgroundImage = "url(css/start-selected.png)";
		if (!isMobile) getId("start_input").focus();
	} else {
		["menu-button", "start_menu"].forEach((a) => {
			const _attr = getId(a).getAttribute.style;
			if (_attr != null || _attr != "") {
				getId(a).removeAttribute("style");
			}
		});
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
	for (let a of qsa(".window")) {
		a.classList.remove("focus");
	}
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
	qsa(".window:not(.sys-win)").forEach((a) => {
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
			const canvafunc = colorOrBlur(img);
			if (canvafunc) document.body.style.setProperty("--backdrop", canvafunc, "important");
		};
	}

	if (storage) {
		localStorage["wallpaper-repeat"] = repeat;
		localforage.setItem("wallpaper-data", file);
	}
}

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

runApp("about");

window.addEventListener("load", function load() {
	window.removeEventListener("load", load);
	function init() {
		console.log("LOADED");
		const bat = getId("battery_btn"),
			int = getId("internet");
		let social_tries = 0;
		(function hmm() {
			social_tries++;
			try {
				getId("start_avatar").src = socials.discord.avatar + "?size=48";
				setTimeout(() => {
					int.className = int.className.replace("0", "1");
				}, 1000);
				return;
			} catch (e) {
				setTimeout(hmm, 1000 * social_tries);
			}
			console.log("socials not found, tried: " + social_tries);
		})();

		function changeBat(e) {
			bat.style.setProperty("--percent", e.level * 100 + "%");
			bat.className = e.charging ? "charging" : "";
		}
		if (navigator.getBattery) navigator.getBattery().then(changeBat);
		else bat.remove();
		int.className = "lan0";
		try {
			let a = navigator.connection.type;
			if (a && !/none|ethernet/.test(a)) int.className = "wlan0";
		} catch (e) {
			if (isMobile) int.className = "wlan0";
		}

		getId("whalecum").style.opacity = "0";
		getId("whalecum").style.visibility = "hidden";
		let a = new Audio("audio/startup.mp3");
		a.load();
		var promise = a.play();
		if (promise) {
			promise.catch((_) => {
				showError("please consider enabling autoplay on this website so that audio can play properly", _);
			});
		}

		setTimeout(() => {
			showError("this website is under construction, may or may never be finished....");
			if (!CSS.supports("backdrop-filter", "blur(15px)")) {
				setTimeout(() => showError("Aero glass won't work if backdrop-filter is not working..."), 100);
			}
		}, 3000);
		runApp("run");
	}
	init();
	if (!CSS.supports("backdrop-filter", "blur(15px)")) {
		document.body.style.setProperty("--backdrop", 'url("marble_blur.jpeg") 0 / cover fixed');
	}
	// stolen from 98.js.org
	let wallpaper_repeat = localStorage["wallpaper-repeat"];
	localforage.getItem("wallpaper-data", function (err, value) {
		if (err) return console.error(err);
		if (value) setWallpaper(value, wallpaper_repeat || false);
	});
});

function photoViewer(e) {
	const parent = e.closest(".window"),
		paE = e.parentElement;
	e.parentElement.onmousedown = function (e) {
		const target = e.target;
		if (target == this) return;
		if (target.id.includes("spacer")) return;
		target.setAttribute("clicked", "");
		function removeClick() {
			target.removeAttribute("clicked");
		}
		document.body.addEventListener("mouseup", function mouseu(e) {
			document.body.removeEventListener("mouseup", mouseu);
			removeClick();
		});
	};
	e.remove();

	(function () {
		let e,
			o,
			t,
			f,
			s = parent.qs("#images"),
			n = !1,
			l = () => (n = !1);
		(s.onmousemove = (l) => {
			if ((l.preventDefault(), !n)) return;
			const p = l.pageX - s.offsetLeft - e,
				u = l.pageY - s.offsetTop - t;
			(s.scrollTop = f - u), (s.scrollLeft = o - p);
		}),
			(s.onmousedown = function (l) {
				l.preventDefault(), (n = !0), (e = l.pageX - s.offsetLeft), (o = s.scrollLeft), (t = l.pageY - s.offsetTop), (f = s.scrollTop);
			}),
			(s.onmouseup = l),
			(s.onmouseleave = l);
	})();

	let arr = [0, 90, 180, 270],
		index = 0;

	function back() {
		paE.qs("input").value = 0;
		parent.qs("#images img").removeAttribute("style");
	}
	function zoom3x(a) {
		back();
		if (a == -1) index = index == 0 ? 3 : index + a;
		else index = index == 3 ? 0 : index + a;
		parent.qs("#images img").className = "rotate" + arr[index];
	}

	function cycle(a) {
		if (images.length == 1) paE.qsa(".footer>*[id^='go']").forEach((a) => a.setAttribute("disabled", ""));
		if (images.length == 0) {
			parent.qs(".title-bar-text").innerText = "Windows Photo Viewer";
			parent.qs("#images img").dataset.index = 0;
			parent.qs("#images img").src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E";
			paE.qsa(".footer>*:not([id^='spacer'])").forEach((a) => a.setAttribute("disabled", ""));
			return;
		}
		let index = Number(parent.qs("#images img").dataset.index),
			lastI = (e) => e.length - 1,
			last = (e) => e[e.length - 1];
		back();
		if (index > lastI(images)) {
			parent.qs("#images img").dataset.index = 0;
			cycle(a);
			return;
		}
		if (a == -1) index = index == 0 ? lastI(images) : index + a;
		else index = index == lastI(images) ? 0 : index + a;
		parent.qs("#images img").dataset.index = index;
		parent.qs("#images img").src = images[index];
		parent.qs(".title-bar-text").innerText = last(images[index].split("/")) + " - Windows Photo Viewer";
	}
	cycle(0);
	paE.qs("#rotate1").onclick = () => zoom3x(-1);
	paE.qs("#rotate2").onclick = () => zoom3x(1);
	paE.qs("#back").onclick = back;
	paE.qs("#zoom").onmousedown = function (e) {
		if (this.getAttribute("disabled") !== null) return;
		paE.qs("#spacer69").classList.toggle("goaway");
	};
	paE.qs("input").oninput = function () {
		const image = parent.qs("#images img"),
			value = this.value;
		if (value == 0) return back();
		image.style.width = `calc(${image.naturalWidth}px + ${value * 2}vw)`;
	};
	paE.qs("#goback").onclick = () => cycle(-1);
	paE.qs("#goforward").onclick = () => cycle(1);

	function del() {
		const index = Number(parent.qs("#images img").dataset.index);
		if (index > -1 && index < images.length && images.length != 0) {
			images.splice(index, 1);
			cycle(1);
		}
	}
	parent.qsa("#menu_del, .footer #del").forEach((e) => (e.onclick = del));
}

function runAppGUI(g) {
	if (/eval:/.test(g)) window.eval(g.split("eval:")[1]);
	else if (/func:/.test(g)) {
		let a = g.split("func:")[1].split(":");
		if (a == "eval") return console.warn("you're not supposed to use eval...");
		window[a[0]](a[1]);
	} else if (/jspaint|mspaint/.test(g)) runApp("jspaint");
	else if (/photos|photo_viewer/.test(g)) runApp("photo_viewer");
	else if (/traits|run|minecraft|vscode/.test(g)) runApp(g);
	else if (/about|winver/.test(g)) runApp("about");
	else {
		showError(`Windows cannot find '${g}'. Make sure you typed the name correctly, and then try again.`);
		runApp("run");
	}
}

(function inp_val() {
	const target = qs("#volume_slider input");
	const value = target.value;
	const mute = qs("#volume #volume_button").dataset.mute == "true";
	volume = value / 100;
	target.closest(".window-body").qs(".bar").style.height = value + "%";
	getId("volume_btn").onclick = () => {
		getId("volume").style.display = getId("volume").style.display == "block" ? "none" : "block";
		getId("volume").click();
	};
	if (mute) qs("#volume #volume_button").dataset.mute = false;
	getId("bar1").style.opacity = 1;
	target.oninput = inp_val;
	let vol = 3;
	if (value == 0) vol = 0;
	else if (value < 33) vol = 1;
	else if (value < 65) vol = 2;
	getId("volume_btn").className = "_" + vol;
	target.onchange = () => playAudio("ding");
	qs("#volume #volume_button").onclick = function () {
		let _mute = this.dataset.mute;
		let ismute = _mute == "true" ? false : true;
		this.dataset.mute = ismute;
		if (ismute) {
			volume = 0;
			getId("volume_btn").className = "";
			getId("bar1").style.opacity = 0;
		} else {
			getId("bar1").style.opacity = 1;
			((value) => {
				let vol = 3;
				if (value == 0) vol = 0;
				else if (value < 33) vol = 1;
				else if (value < 65) vol = 2;
				getId("volume_btn").className = "_" + vol;
				volume = value / 100;
			})(qs("#volume_slider input").value);
		}
	};
})();

function colorOrBlur(t, blur = false, blur_callback = false) {
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

	if (localStorage.forceBlur == "true" || blur) {
		d.globalAlpha = 0.3;
		let offset = 7;
		for (var i = 1; i <= 8; i += 1) {
			d.drawImage(n, offset, 0, n.width - offset, n.height, 0, 0, n.width - offset, n.height);
			d.drawImage(n, 0, offset, n.width, n.height - offset, 0, 0, n.width, n.height - offset);
		}

		n.toBlob((blob) => {
			if (blur_callback) blur_callback(blob);
			else document.body.style.setProperty("--backdrop", `url("${URL.createObjectURL(blob)}") 0 / cover fixed`, "important");
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
}

function newTab(url) {
	// creating a element instead of window.open does not cause prevent popup
	// ...i think
	const a = document.createElement("a");
	a.href = url;
	a.target = "_blank";
	a.click();
}

// e has to be a blob
function openImagePaint(e) {
	const fr = new FileReader();
	fr.readAsDataURL(e);
	fr.onloadend = function () {
		window._jspaintOpen = this.result;
		console.log(this.result);
		runApp("jspaint");
	};
}

function convertToBlobPaint(el) {
	const src = el.closest(".window").qs("#images img").src;
	fetch(src)
		.then((e) => e.blob())
		.then(openImagePaint);
}
