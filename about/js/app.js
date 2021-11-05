var window_styles = new Object();

$(".window#traits").resizable({
	handles: "all",
	containment: "body",
	minWidth: 400,
	minHeight: 317,
});

$(".window").draggable({
	handle: ".title-bar",
	containment: "body",
	stack: ".window",
	snap: true,
});

$(".window").on("click", (e) => {
	$(e.target).parents(".window")[0].style["z-index"] =
		Number($(e.target).parents(".window")[0].style["z-index"]) + 10;
});

function maxsBtn(e) {
	console.log(e);
	var a = e.parentElement.parentElement.parentElement;
	console.log("hmmm");
	window_styles[a.id] = a.getAttribute("style");
	a.style = "top: 0px; left: 1px; width: 99.7vw; height: 99.9vh;";
	setTimeout(() => {
		e.outerHTML =
			'<button onclick="resBtn(this)" aria-label="Restore"></button>';
	}, 100);
}

function resBtn(e) {
	console.log(e);
	var a = e.parentElement.parentElement.parentElement;
	var b = a.id;
	if (window_styles[b]) {
		console.log(window_styles[b]);
		a.setAttribute("style", window_styles[b]);
		setTimeout(() => {
			e.outerHTML =
				'<button onclick="maxsBtn(this)" aria-label="Maximize"></button>';
		}, 100);
	}
}
// Tabs
const tabButtons = document.querySelectorAll("[role=tab]");
tabButtons.forEach((tabButton) => {
	tabButton.addEventListener("click", (e) => {
		e.preventDefault();
		const tabContainer = e.target.parentElement.parentElement;
		const targetId = e.target.getAttribute("aria-controls");
		tabButtons.forEach((_tabButton) =>
			_tabButton.setAttribute("aria-selected", false)
		);
		tabButton.setAttribute("aria-selected", true);
		tabContainer
			.querySelectorAll("[role=tabpanel]")
			.forEach((tabPanel) => tabPanel.setAttribute("hidden", true));
		tabContainer
			.querySelector(`[role=tabpanel]#${targetId}`)
			.removeAttribute("hidden");
	});
});

updateTime = function () {
	datetime = new Date();
	if (datetime.getMinutes() < 10) {
		minutes = "0" + datetime.getMinutes();
	} else {
		minutes = datetime.getMinutes();
	}
	time = datetime.getHours() + ":" + minutes;
	date =
		datetime.getMonth() +
		1 +
		"/" +
		datetime.getDate() +
		"/" +
		datetime.getFullYear();
	$("#datetime > .time").text(time);
	$("#datetime > .date").text(date);
};

updateTime();
setInterval(updateTime, 60000);
