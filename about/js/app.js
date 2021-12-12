var window_styles = new Object();

$('.window#traits').resizable({
	handles: 'all',
	containment: 'body',
	minWidth: 400,
	minHeight: 317,
});

var tabs = [];

function updateTabs() {
	tabs = [];
	for (let g of $('.window')) {
		tabs.push(g);
	}
}

setTimeout(updateTabs, 500);

function runApp(g) {
	switch (g) {
		case 'minecraft':
			$('body').append(
				`<div class="window glass" id="minecraft" style="left:346px;width:674px;top:61px;height:474px;z-index:${
					highestZ() + 1
				}"><div class="title-bar"><img src="css/vscode_iframe/crafting.png" style="width:18px;height:18px;position:absolute;left:6px"><div class="title-bar-text">Minecraft</div><div class="title-bar-controls"><button aria-label="Minimize"></button> <button onclick="maxsBtn(this)" aria-label="Maximize"></button> <button aria-label="Close" onclick="closBtn(this)"></button></div></div><div class="window-body"><iframe src="https://classic.minecraft.net"></iframe></div></div>`
			);
			break;
		case 'vscode':
			$('body').append(
				`<div class="window" id="vscode" style="left:346px;width:674px;top:61px;height:474px;z-index:${
					highestZ() + 1
				}"><div class="title-bar"><div class="vscode_icon"></div><div class="title-bar-text">Visual Studio Code</div><div class="title-bar-controls"><button aria-label="Minimize"></button> <button onclick="maxsBtn(this)" aria-label="Maximize"></button> <button aria-label="Close" onclick="closBtn(this)"></button></div></div><iframe src="https://vscode.dev/"></iframe></div>`
			);
			break;
		case 'traits':
			$('body').append(
				`<div class="window glass" id="traits" style="left:723px;width:400px;top:87px;height:317px;z-index:${
					highestZ() + 1
				}"><div class="title-bar"><div class="title-bar-text">Another window with contents</div><div class="title-bar-controls"><button aria-label="Minimize"></button> <button onclick="maxsBtn(this)" aria-label="Maximize"></button> <button aria-label="Close" onclick="closBtn(this)"></button></div></div><div class="window-body"><menu role="tablist"><button role="tab" aria-controls="music" aria-selected="true">Music</button> <button role="tab" aria-controls="dogs">Dogs</button> <button role="tab" aria-controls="food">Food</button></menu><article role="tabpanel" id="music"><p>Set your listening preferences</p><fieldset><legend>Today's mood</legend><div class="field-row"><input id="radio25" type="radio" name="fieldset-example2"><label for="radio25">Nicki Minaj</label></div><div class="field-row"><input id="radio26" type="radio" name="fieldset-example2"><label for="radio26">Bell Towers</label></div><div class="field-row"><input id="radio27" type="radio" name="fieldset-example2"><label for="radio27">The Glamorous Monique</label></div><div class="field-row"><input id="radio28" type="radio" name="fieldset-example2"><label for="radio28">EN. V</label></div></fieldset><section class="field-row"><button>Reset Alarm...</button><label>Try this to get some attention</label></section></article><article role="tabpanel" hidden id="dogs"><img style="width:100%" src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUTExMWFhMVFxgYGBgYGBgYFRcdGxgYFhYdGBoYHiggGBslGxoXIjEiJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGislHyUtLS0tLS0uLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLTctN//AABEIAKUBMgMBIgACEQEDEQH/xAAcAAEAAwEBAQEBAAAAAAAAAAAABQYHBAMCAQj/xAA2EAABAwIEBAMIAgEEAwAAAAABAAIRAyEEBTFBBhJRcSJhkQcTMoGhscHw0eFCFCNS8RVygv/EABkBAQADAQEAAAAAAAAAAAAAAAACAwQBBf/EAB8RAQEAAgMBAAMBAAAAAAAAAAABAhEDITESMkFRBP/aAAwDAQACEQMRAD8Aw1ERAREQEREBERAREQERSfD2VnE1204dB+LliQJA38yEHNluDdWqNY0ElxAW15TwJSpAEMvF/Pr5eYPVTfDfBNDDhpaHc1p5oP4sOytrcOJVWWScij5twu2qwtLBe3cDYnvp81lOfcHPpVOUbuhp2IOnSCv6TGHB2UVnuSio2w8QMg/dJk7p/Nj+GcQ14Y5oExcEOF+karmzHJK1H42ROlwT6Bf0ZSyBjL8oNoGm2nZR+N4covPM9rSRpOy79ufL+cyI1X4tF9oeTYWn42SHx8LAIO0k/uizpTl2jZoREXXBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQFffZRgXHFgyRLTsCIkjxTuCFUsjwJrVmNAOokjbp2kr+huCsg9x4nQXQBOpHlMbaKGd60njFtoMgD8roaxfK534wfJZss9LccduqoQAuSvjA34tFz1MU4iWsLvsuWu+Z5p54kACw6qu8v8WTj/AKkjTDrhcuJoxtZfuV1SWCRBuPTTVdrzKuxu4qymqqeaZPSqjxNafOAsn484cp0GlzaZDuoNra2W34ujOipPFdMmm4P0g/t5lTxukbNsGRe+NphtRzWyQDAnX6LwV6oRFN8PcN1cU5nKP9tzw0ukW6x2F0EPTplxAaCSdABJPyC+jhngElrgBE2Np0lbvwtwbSwjg6mLlsFzvE4m+g0bYx8lPVshpPAaYB0mLnrfqq7nE/h/MqLXOPeA6RHvKIFOoBZjR4XQTrHwmI9FktRhaSCIIMEHUHeVOXaNmnyiIuuCIiAiIgIiICIiAiIgIiICIiAiIgIiIC6stwpqVGtAm4np8+65VePZZgPfYggkBrRJH+R6X6Lluo7JutD4MwFMhobhx4YvygCe5M+q0PCUiNV4YGgGi0AKSA5RO6otXSPDFPIB6/gr4w+FBhztBsvEnmgk6xbyC7mEabKnGfV2svU0rPEnGNDBEc5EmzW/fsuPB8WCtL2C29pjudhdeXF/BBxL3Fjy3nADo0Nw479Wt9FI8P8ADNLDUi14B08Tm9BA7aLmXFf6sxzxk8e1HOmnl6kgKTNaFk+c5u3DV3OY0+F3w3cHEui1wGiLyfqrzw/nIxWHp1+UsDwZab6EtkHcGJB6Fdxl12hySb6SuJfKovHmIaKLi4bfNWurWgwT/BWV+1jNmmKTTJkT5d/5VmHdVXqMzcbr8RFqUPXC0C97WDVxA9VvfCmUsw9JjWCwJMnc6T5WWIcP0+bEUxE3/C/oPJnHkAMWFlXyVPCJdoheGIqr15rLnrRCy2r5EFm7XczXDrczBB9Fm3tGyHlcMQwDlNnx12NtFpWa1+Vpt4db7LKuNs9NQim0kDfYEadbq3i3tHk1pT0RFpZxERAREQEREBERAREQEREBERAREQEREBal7I30mtcY/wB0u18gstWmeynDv5+QMME8xdHh0sPM/sbqvk/FPj9bhlbi65ELvxTJEdl4YKlygBe7qkC6z29aXxD5k8sIC9mYi1omP3RcuYVOaTFpXJzuANyCLT5bfhVYZaq647j6xOZ1Wmw7A6LizLOa4pEHD+8ndr2Bo+bivSvmZiH8rjtLQD9IKr2NxTnH/bZ6kx6Cfup3lRnGo3E2CrOfemIcb8rpA7SBPorzkOMZRw7KYgBjdNurvqSouvlNao/mdvsP7UxQyQRB03C592+Fx17ULnvEDj4G2ib6lZpxIXFwc687/wArW8ZkbB8LBKo/EmVASC2+1wrOO6qvObigovqoyCR0XytbKufs8yf3jzVc0kCzbiPOeh0+q2HK8OQ0Rttqs09lD+YPb0dp5G/3Wt4emABCz8uXa7CdPWbLkxFTWy7XGy4MQ8CSdLhURarPElaGOAbJj90WKZpXL6riYkGLaWstX48zBzMM6HN6AyQ6+3Q6BY8StPFP2p5L+n4iIrlQiIgIiICIiAiIgIiICIiAiIgIiICIiCx8J8P/AOoe0uBLZsP+Ufid+/Rb9wnkjaDNBOwGg/krOPZLjqLwWGA9gAiwnzHVbCx4gALLy5dtHHj07KR3XzX0QVbLmfidlRlVsjnrNkQuHGjlPcfZd5eI1XFinTrt6qKcrkZhGv1C7aOXNAiAmGpKQapYxHK1w1aQaNLBceJqAC0Luxg1XBVZI0Oi7cnJEVWqyqlxXgxVpkAwdj0/pWjEuAMecKHzOmBM7+i5jlqpXHpmlTg7FQS0Nf2cJ26x1UZislxFP46NQDrykj1FlrmWsnsrFhqIV0/0Xfaq8E/TL/ZHiQMRUYdXNBHWxM/dbOx0KOGUUXPD3MaKjZLXADnE2Nxde4p1Gu5YkO0M6dwo55fXcMMddPWriFAZzmopjxGxC8M+z+nh3uY/4htab3kLO+I+JBUOttmjqmGNrudkRfF2dOrv5f8AEf36KvL6qPkk9SvlbJNTTLbuiIi64IiICIiAiIgIiICIiAiIgIiICIiAiIg6MDjH0XtqU3FrmmQVsPCPtAOIZy1IFVu3XS4H48liykMgw5qYmiwEgue0W11vp5KvkwmU7WYZ3Gt4ocVS4zA+evZe7eIqbrA36HX0UbxHw9SLA4DlfoC2w0kBw/Ko1bB12H4jExP73Cw3j1fW2ZyzxpZzll/ELea8nZ6wG5n7LPKGEqk3JIU/gsqJABkjoVC7iUkqx4DiJnveQ2BNr6lWUY9p0OvT7qnUMmboSJ2+v1XJUdXoEkXHlHMY0HZdxyv7Ryxl8W/E1yNP+1A43MHM+E7aahVrEcWYho5fdHmPb9hV/GcQYhxPhAO86qXxvxyXXqbzTG1fi0Ciq+bufDSbNUNicbVqfG4x5aL8w7YgKfxpz72veRVZAkgT11Vpwbp1VSyPSI2Vnw0Hc230+yovq1Kl/KPsuDE5idBrr6L5q1iNXCFGY7GhokdTO56KWNu0MpNM746x5e0DlEucXOd/lrAE9I+6pSv/ABFh21XmGxLfoBaB3kqgL0OPxi5fRERWKxERAREQEREBERAREQEREBERAREQEREBERAXvgsU6lUbUYYcwhw7heCIP6CyrNW4zC06ouHNAeJ+Fw+Kel9F61QASGwQBcRM389/4Cx3gfiQ4OqeafdVAA4bA7OjykrS8TX5XNfB5XXEaHzlZs8NVowy3EiMMwnmbcaRuNtLLowYERMRY9frsuPCYtsSHTNiNxuJtK/Pfkus60GOb+e6oyi6VMNdy/CLev3XE6sCTzanroo1uaNJLXyNt489d91418WOaGgO8unWyr0m+sXQaZdzCe30BKrOIwgEkjXrqpyq4Hrr8MgQdel1GZkfDG5+itxQqt1S2bBe+EoS4fui8qxbTP7qpDJKZceYqV8cizZbTMWU4y1r/YKOwAspZoPIdOW09fkqNLdozMKsA3/fmq5jK7jqZHeI81KZ2bgNP7877KpZhiw0QdzMwCSNldhgryyfeZYpnM0tNwINrRqOvl9VQyrFiarix55YsddQq4teEZM6IiKaAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiIC2/gykMTl1EgFzqbC2BE+GQJ+ixBbD7GKp/0lcXtUsNrtb91Xyfinx+vHMa5okcoIkwb3kC9vRR1POXz4Z0sNb/ALsrXnOXcwJdEuJMekd/+1B5LkHNWbLgXahoEn5nQLLLtq1opDE4iAXco1iBrupLD5O9kHmkkHTW1yrjhcsFGXEa7QDNly4pji0+7DWkTrJD9df6UMr2lPFZbTbygNIJGokc3zB0vIUdmFQATeR5Kfr0BUHjaG1Lx5EbAqm8VF1ORo52rZsPMKeM2hldISvVbWqy3QffdWrLKENsqXkR9Zur/lFIkD9ClyTXTmF32lMFSMSphlHwkTcx21XzhMPa66sVoYCpkWWqFxbUsTflBAA/j5qjHGh1QHl+HSevVafnmC5wBAt6g91Qv/GgVi13Xt8/ur8bqK7Nudpc8QbgCPz9yo3NcjdSaHtkt3Gpb3jZX7CZKIkQepGny+QXfVwkCSByEwBsbaf9rs5dVHLj3GNIrbxZkIpj3rWwDsNP6VSWmWWbjPZoREXXBERAREQEREBERAREQEREBERAREQEREBERAWwew9o91XJJPjHhm3wi8dfPyWPrU/YhjfFXomIhrx1/wCJ+Wnqocn4pYerxmmFmSL+Ui2y9eEcL4yS2/b0E6+fyXTmGunaFI8OUOVpcZknfpEBY8fWq/i6ceNoEeWnZQ9dnIy0z9ZU1jHh23z8lE46QNdCNdNv7UbN13G9ITMGGo0NFjqDvP7Kp3FpDqR95aowa7+RHUK9Y7DujUc2v8KkcVVxUYWuADgCCNiFZgjkpnC8OJm5ladktKAFlXCuIDa0GLrXsreICnzTtDjvSewxAF1+V6wNhquR1RefvFStc+ZPHLBGosenUHyVVfTBeCRIBB7jX7KbzKpKgG1IeB5wpXxyRZcE0BpDSLttHUm4jay9K7ZY1ms7R6LxylliXW81INpcxmAQ3rbdV5LIgMza145SwiLEH9+/kqDn3DJbL6QMbt3HZajmjg958MFsAbnv2/lcx5CPEJCs4+SxDk45WIEL8V14v4faJq07eWoKpS245bm2OzQiIuuCIiAiIgIiICIiAiIgIiICIiAiIgIiIC1D2KUBzV37+Fo67k3+YWXrQ/Y5XIr1WzYsBjqQdfRRz/FLD1ruMp88CY0U7RbytHZV11eHt/8AYT9VOPqSFj202eOKrXIJnRRdarqXnQHsu/nBMfvX97rjzGg0tvOt436KGKVV3MMe7nJeS3TQaf0qBxzmPNBbY6EjdaXmGHABJdzWtN/rH0WS8Y1hJadT+Cr+Odqs70rNN5aQRqDK1rhrM+djepAn0WRLSfZ/Wa5gAN22PVW8s3FfHdVdzVsvqo0wjCOYDbVMViQO/wBlkaoicS6/r9FBZjSDSpXGB3KTsTt3v+FGVxzTI0XYV3ZBmUt5SbAyf30VpbUBi8CFj3/mP9PXe0XYSNP8Vccjz73vNUZ8LbAG0mPxb1U8+PU2hjnu6WbM6RID2G4IMdRvO65areWmSD8ILiNYXHSqVeVrwNZ67GNOm6/cyzBvKWP8NXTw/C7aCT1Cpnq6+IjF4xr2OBIgg6/n5rNcdR5HuaNAVbsyc2k13i1mJBm1jbcdiqXUfJJ6rbxTpj5fXyiIrVQiIgIiICIiAiIgIiICIiAiIgIiICIiApThvOH4Su2qwAn4SDuDr2RFyuz1t2CxJq1GSLFzbT2d+Fa8ZUgGOiIsN8a/3EM6s7msY0/fouTF1jyxO32CIq8VmStZtjnspCDJ1n/6hZbn2IL6pnUflEWzhZeVGqb4Sxz6dcBps7UbWBIRFbl5VWPrWMFWJBedY+y+qniI6nX9/dURYW18YxvKz5H8qu8RHkY0t1db8oinghkzbHVC6o4nWf6XrgszqUrNd4d27GdV+otmumXa6uzqryNfMTcj0sofPc4qObLrk7yQZ6+ZhEVGOM+l9yvyrVXEPd8Tie5leSItDOIiICIiAiIgIiICIiD/2Q=="></article><article role="tabpanel" hidden id="food"><p>You create the content for each tab by using an <code>article</code> tag.</p></article><section class="field-row" style="justify-content:flex-end"><button>OK</button> <button>Cancel</button></section></div></div>`
			);
			break;
	}

	makeWindowsDrag();

	updateTabs();
}

function makeWindowsDrag() {
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
				window.innerWidth - e.target.offsetWidth + 'px'
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

	$('.window#vscode, .window#minecraft').resizable({
		handles: 'all',
		containment: 'body',
		minWidth: 576,
		minHeight: 380,
	});
}

makeWindowsDrag();

function maxsBtn(e) {
	console.log(e);
	var a = e.parentElement.parentElement.parentElement;
	console.log('hmmm');
	a.classList.add('maximu');
	window_styles[a.id] = a.getAttribute('style');
	if (a.id == 'vscode') {
		a.style = `top: 0px; left: -1px; width: 100vw; height: calc(-40px + 100vh); z-index: ${a.style.zIndex};`;
	} else {
		a.style = `top: -2px; left: -1px; width: 100.4vw; height: calc(100vh - 42px); z-index: ${a.style.zIndex};`;
	}
	setTimeout(() => {
		e.outerHTML =
			'<button onclick="resBtn(this)" aria-label="Restore"></button>';
	}, 100);
}

function closBtn(e) {
	var a = e.parentElement.parentElement.parentElement;
	console.log(`closing: ${a.id}`);
	$(a).addClass('closing');
	setTimeout(() => {
		$(a).remove();
		updateTabs();
	}, 400);
}

$(document).on('focusout', function () {
	setTimeout(function () {
		// using the 'setTimout' to let the event pass the run loop
		if (document.activeElement instanceof HTMLIFrameElement) {
			// Do your logic here..
			$(document.activeElement).closest('.window')[0].style['z-index'] =
				highestZ() + 1;
			for (let a of document.querySelectorAll('.title-bar-controls')) {
				a.classList.add('notfocused');
			}
		}
	}, 0);
});

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

document
	.querySelector('#start_input')
	.addEventListener('keypress', function (e) {
		if (e.key === 'Enter') {
			window.open(
				`http://www.google.com/search?q=${encodeURIComponent(e.target.value)}`,
				'_blank'
			);
		}
	});
