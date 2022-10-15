function capitalize(s) {
	return s.replace(/(?:^|\s)\S/g, (a) => (a.toUpperCase()));
}

function clickButton(e) {
	e.target.classList.toggle('clicked');
}

function generateBoard() {
	const board = document.getElementById('article');
	if (!board) {
		return;
	}

	const filenames = [
		'algerian', 'allegro', 'amelia', 'american-typewriter', 'anna',
		'antique-olive', 'archer', 'arial', 'arnold-boecklin', 'avant-garde',
		'avenir', 'balloon', 'bank-gothic', 'bauhaus', 'berlin', 'bodoni',
		'bookman', 'broadway', 'brody', 'brush', 'candice', 'chiller', 'christie',
		'clearview', 'comic-sans', 'cooper', 'copperplate', 'corsiva', 'courier',
		'curlz', 'dauphin', 'dom', 'elephant', 'eras', 'eurostile', 'forte',
		'franklin', 'freestyle', 'french-script', 'futura', 'garamond', 'gigi',
		'gill-sans', 'glaser', 'gotham', 'harlow', 'hobo', 'impact', 'interstate',
		'jazz-poster', 'jokerman', 'kashmir', 'kaufmann', 'kristen', 'lithos',
		'magneto', 'marker', 'matisse', 'matura', 'mistral', 'neutraface',
		'niagara', 'old-english', 'optima', 'papyrus', 'peignot', 'playbill',
		'rage-italic', 'ravie', 'rockwell', 'rosewood', 'script', 'serpentine',
		'showcard-gothic', 'snap', 'stencil', 'trajan', 'trixie', 'wide-latin',
		'zapfino',
	];
	const numImages = filenames.length;
	const numCells = 25;
	let i;
	let num;
	let font;
	let fontName;
	let button;
	let img;
	const fragment = document.createDocumentFragment();

	for (i = 0; i < numCells; i += 1) {
		if (i === 12) {
			font = 'helvetica';
		} else {
			do {
				num = Math.floor(Math.random() * Math.floor(numImages));
			} while (filenames[num] === undefined);
			font = filenames[num];
			delete filenames[num];
		}
		fontName = capitalize(font.replace(/-/g, ' '));

		button = document.createElement('button');
		button.setAttribute('class', 'button');
		button.addEventListener('click', clickButton);
		fragment.appendChild(button);

		img = document.createElement('img');
		img.setAttribute('alt', fontName);
		img.setAttribute('src', `/assets/img/${font}.png`);
		img.setAttribute('height', 100);
		img.setAttribute('width', 100);
		button.appendChild(img);
	}

	board.innerText = '';
	board.appendChild(fragment);
}

function clickRefreshButton() {
	if (document.querySelector('.clicked') && !window.confirm('Are you sure? You will lose your current board.')) { // eslint-disable-line no-alert
		return;
	}

	generateBoard();
}

function init() {
	generateBoard();

	const refresh = document.getElementById('refresh');
	if (refresh) {
		refresh.addEventListener('click', clickRefreshButton);
	}

	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('/sw.js');
	}
}

init();
