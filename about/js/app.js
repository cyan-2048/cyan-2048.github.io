var window_styles = new Object();

$(".window").resizable({
	handles: "all",
	containment: "body",
	minWidth: 400,
	minHeight: 317,
});

$(".window").draggable({
	handle: ".title-bar",
	containment: "body",
});

for (let v of document.querySelectorAll("[aria-label='Maximize']")) {
	v.addEventListener("click", (e) => {
		console.log(e.target);
		var a = e.target.parentElement.parentElement.parentElement;
		console.log(a);
		window_styles[a.id] = a.getAttribute("style");
		a.style = "top: 0px; left: 1px; width: 99.7vw; height: 99.9vh;";
		setTimeout(() => {
			e.target.setAttribute("aria-label", "Restore");
		}, 1000);
	});
}

for (let q of document.querySelectorAll("[aria-label='Restore']")) {
	q.addEventListener("click", (e) => {
		console.log(e.target);
		var a = e.target.parentElement.parentElement.parentElement;
		if (window_styles[a.id]) {
			a.setAttribute("style", window_styles[a.id]);
			setTimeout(() => {
				e.target.setAttribute("aria-label", "Maximize");
			}, 1000);
		}
	});
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
