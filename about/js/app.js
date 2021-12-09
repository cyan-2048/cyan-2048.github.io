var window_styles = new Object();

$('.window#traits').resizable({
	handles: 'all',
	containment: 'body',
	minWidth: 400,
	minHeight: 317,
});

$('.window').draggable({
	handle: '.title-bar',
	containment: 'body',
	stack: '.window',
	start: (e) => {
		if (e.target.classList.contains('maximu')) {
			resBtn(e.target.querySelector('[aria-label="Restore"]'));
			$(e.target.querySelector('.title-bar')).trigger('mouseup');
			setTimeout(() => {
				$(e.target.querySelector('.title-bar')).trigger('mousedown');
			}, 5);
			return false;
		}

		for (let a of document.querySelectorAll('.title-bar-controls')) {
			a.classList.add('notfocused');
		}
		e.target
			.querySelector('.title-bar-controls')
			.classList.remove('notfocused');
	},
	drag: (e) => {
		if (
			e.target.style.left ==
			window.innerWidth -
				document.querySelector('.window#traits').offsetWidth +
				'px'
		) {
			console.log('edge edge edge edge');
		}
		if (e.target.style.left == '0px') {
			console.log('0 edge edge edge edge');
			//	return false;
		}
		if (e.target.style.top == '0px') {
			console.log('0 top top edge edge');
		}
	},
	stop: (e) => {},
});

$('.window').on('click', (e) => {
	console.log(e);
	e.delegateTarget.style['z-index'] = highestZ() + 1;
	for (let a of document.querySelectorAll('.title-bar-controls')) {
		a.classList.add('notfocused');
	}
	e.delegateTarget
		.querySelector('.title-bar-controls')
		.classList.remove('notfocused');
});

function maxsBtn(e) {
	console.log(e);
	var a = e.parentElement.parentElement.parentElement;
	console.log('hmmm');
	a.classList.add('maximu');
	window_styles[a.id] = a.getAttribute('style');
	a.style = `top: -2px; left: -1px; width: 100.4vw; height: calc(100vh - 42px); z-index: ${a.style.zIndex};`;
	setTimeout(() => {
		e.outerHTML =
			'<button onclick="resBtn(this)" aria-label="Restore"></button>';
	}, 100);
}

function resBtn(e) {
	console.log(e);
	var a = e.parentElement.parentElement.parentElement;
	var b = a.id;
	a.classList.remove('maximu');
	if (window_styles[b]) {
		console.log(window_styles[b]);
		a.setAttribute('style', window_styles[b]);
		setTimeout(() => {
			e.outerHTML =
				'<button onclick="maxsBtn(this)" aria-label="Maximize"></button>';
		}, 100);
	}
}
// Tabs
const tabButtons = document.querySelectorAll('[role=tab]');
tabButtons.forEach((tabButton) => {
	tabButton.addEventListener('click', (e) => {
		e.preventDefault();
		const tabContainer = e.target.parentElement.parentElement;
		const targetId = e.target.getAttribute('aria-controls');
		tabButtons.forEach((_tabButton) =>
			_tabButton.setAttribute('aria-selected', false)
		);
		tabButton.setAttribute('aria-selected', true);
		tabContainer
			.querySelectorAll('[role=tabpanel]')
			.forEach((tabPanel) => tabPanel.setAttribute('hidden', true));
		tabContainer
			.querySelector(`[role=tabpanel]#${targetId}`)
			.removeAttribute('hidden');
	});
});

updateTime = function () {
	var datetime = new Date();
	if (datetime.getMinutes() < 10) {
		minutes = '0' + datetime.getMinutes();
	} else {
		minutes = datetime.getMinutes();
	}
	var pam = 'AM';
	var hour = datetime.getHours();
	if (hour > 12) {
		hour = hour - 12;
		pam = 'PM';
	}
	if (hour == 0) {
		hour = 12;
	}
	var time = hour + ':' + minutes + ' ' + pam;
	var date =
		datetime.getMonth() +
		1 +
		'/' +
		datetime.getDate() +
		'/' +
		datetime.getFullYear();
	$('#datetime > .time').text(time);
	$('#datetime > .date').text(date);
};

updateTime();

function repeatEvery(func, interval) {
	// Check current time and calculate the delay until next interval
	var now = new Date(),
		delay = interval - (now % interval);

	function start() {
		// Execute function now...
		func();
		// ... and every interval
		setInterval(func, interval);
	}

	// Delay execution until it's an even interval
	setTimeout(start, delay);
}

repeatEvery(updateTime, 60000);

for (let a of document.querySelectorAll('.title-bar-controls')) {
	a.classList.add('notfocused');
}

if (!CSS.supports('backdrop-filter', 'blur(15px)')) {
	document.body.style.setProperty(
		'--backdrop',
		'url("marble_blur.jpeg") 0 / cover fixed'
	);
	document.querySelector('#backdrop-not').style.opacity = '1';
} else {
	$('#backdrop-not').remove();
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

$('body').on('dblclick', function (e) {
	if (e.target !== this) return;
	toggleFullscreen();
});

$('.title-bar').on('dblclick', function (e) {
	e.delegateTarget
		.querySelector("[aria-label='Maximize'],[aria-label='Restore']")
		.click();
});

function highestZ() {
	var array = [];
	$('.window').each(function () {
		if (Number.isInteger(Number($(this).css('z-index')))) {
			array.push($(this).css('z-index'));
		}
	});
	var index_highest = Math.max.apply(Math, array);
	return index_highest;
}
