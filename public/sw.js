const cacheName = 'bingo-20220322';
const contentToCache = [
	'/',
	'/192x192.png',
	'/512x512.png',
	'/apple-touch-icon.png',
	'/assets/css/style.min.css',
	'/assets/img/algerian.png',
	'/assets/img/allegro.png',
	'/assets/img/amelia.png',
	'/assets/img/american-typewriter.png',
	'/assets/img/anna.png',
	'/assets/img/antique-olive.png',
	'/assets/img/archer.png',
	'/assets/img/arial.png',
	'/assets/img/arnold-boecklin.png',
	'/assets/img/avant-garde.png',
	'/assets/img/avenir.png',
	'/assets/img/balloon.png',
	'/assets/img/bank-gothic.png',
	'/assets/img/bauhaus.png',
	'/assets/img/berlin.png',
	'/assets/img/bodoni.png',
	'/assets/img/bookman.png',
	'/assets/img/broadway.png',
	'/assets/img/brody.png',
	'/assets/img/brush.png',
	'/assets/img/candice.png',
	'/assets/img/chiller.png',
	'/assets/img/christie.png',
	'/assets/img/clearview.png',
	'/assets/img/comic-sans.png',
	'/assets/img/cooper.png',
	'/assets/img/copperplate.png',
	'/assets/img/corsiva.png',
	'/assets/img/courier.png',
	'/assets/img/curlz.png',
	'/assets/img/dauphin.png',
	'/assets/img/dom.png',
	'/assets/img/elephant.png',
	'/assets/img/eras.png',
	'/assets/img/eurostile.png',
	'/assets/img/forte.png',
	'/assets/img/franklin.png',
	'/assets/img/freestyle.png',
	'/assets/img/french-script.png',
	'/assets/img/futura.png',
	'/assets/img/garamond.png',
	'/assets/img/gigi.png',
	'/assets/img/gill-sans.png',
	'/assets/img/glaser.png',
	'/assets/img/gotham.png',
	'/assets/img/harlow.png',
	'/assets/img/helvetica.png',
	'/assets/img/hobo.png',
	'/assets/img/impact.png',
	'/assets/img/interstate.png',
	'/assets/img/jazz-poster.png',
	'/assets/img/jokerman.png',
	'/assets/img/kashmir.png',
	'/assets/img/kaufmann.png',
	'/assets/img/kristen.png',
	'/assets/img/lithos.png',
	'/assets/img/magneto.png',
	'/assets/img/marker.png',
	'/assets/img/matisse.png',
	'/assets/img/matura.png',
	'/assets/img/mistral.png',
	'/assets/img/neutraface.png',
	'/assets/img/niagara.png',
	'/assets/img/old-english.png',
	'/assets/img/optima.png',
	'/assets/img/papyrus.png',
	'/assets/img/peignot.png',
	'/assets/img/playbill.png',
	'/assets/img/rage-italic.png',
	'/assets/img/ravie.png',
	'/assets/img/rockwell.png',
	'/assets/img/rosewood.png',
	'/assets/img/script.png',
	'/assets/img/serpentine.png',
	'/assets/img/showcard-gothic.png',
	'/assets/img/snap.png',
	'/assets/img/stencil.png',
	'/assets/img/trajan.png',
	'/assets/img/trixie.png',
	'/assets/img/wide-latin.png',
	'/assets/img/zapfino.png',
	'/assets/js/functions.min.js',
	'/favicon.ico',
	'/favicon.png',
	'/favicon.svg',
	'/index.html',
	'/sw.js',
];

// Installing Service Worker
self.addEventListener('install', (e) => {
	console.log('[Service Worker] Install');
	e.waitUntil((async () => {
		const cache = await caches.open(cacheName);
		console.log('[Service Worker] Caching all: app shell and content');
		await cache.addAll(contentToCache);
	})());
});

// Fetching content using Service Worker
self.addEventListener('fetch', (e) => {
	e.respondWith((async () => {
		const r = await caches.match(e.request);
		console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
		if (r) return r;
		const response = await fetch(e.request);
		const cache = await caches.open(cacheName);
		console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
		cache.put(e.request, response.clone());
		return response;
	})());
});
