// Service-work cache name
var cacheName = '2021_12_01__00_15:static';

// Cache assets on install
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll([
        './assets/app_icons\android-chrome-192x192.png',
        './assets/app_icons\android-chrome-512x512.png',
        './assets/app_icons\apple-touch-icon.png',
        './assets/app_icons\browserconfig.xml',
        './assets/app_icons\favicon-16x16.png',
        './assets/app_icons\favicon-32x32.png',
        './assets/app_icons\favicon.ico',
        './assets/app_icons\mstile-150x150.png',
        './assets/app_icons\safari-pinned-tab.svg',
        './assets/audio\daemon-portal-30secs.mp3',
        './assets/audio\daemon-portal-30secs.ogg',
        './assets/fonts\Aero.ttf',
        './assets/fonts\Armwarmer.ttf',
        './assets/fonts\leaguegothic.ttf',
        './assets/fonts\MontserratBlack.ttf',
        './assets/fonts\MontserratExtrabold.ttf',
        './assets/textures\backgrounds\back_grid.png',
        './assets/textures\backgrounds\fill_white.png',
        './assets/textures\backgrounds\graph_paper.png',
        './assets/textures\backgrounds\grid.png',
        './assets/textures\effects\glow.png',
        './assets/textures\effects\rim.png',
        './assets/textures\effects\shadow.png',
        './assets/textures\particles\particle_smoke_01.png',
        './assets/textures\particles\particle_solid_01.png',
        './assets/textures\skyboxes\skybox_01.png',
        './assets/textures\skyboxes\skybox_02.png',
        './assets/textures\skyboxes\skybox_03.png',
        './assets/textures\skyboxes\skybox_04.png',
        './assets/textures\skyboxes\skybox_05.png',
        './assets/textures\skyboxes\skybox_06.png',
        './assets/textures\skyboxes\skybox_07.png',
        './assets/textures\skyboxes\skybox_08.png',
        './assets/textures\skyboxes\skybox_09.png',
        './assets/textures\skyboxes\skybox_10.png',
        './assets/textures\skyboxes\spacebox_01.png',
        './assets/textures\skyboxes\spacebox_02.png',
        './assets/textures\skyboxes\spacebox_03.png',
        './assets/textures\sprites\BasePlate01.png',
        './assets/textures\terrain\Asteroid01.png',
        './assets/textures\terrain\ground_detail.png',
        './assets/textures\terrain\waternormals3.png',
        './assets/textures\terrain\GT\Clay_01.png',
        './assets/textures\terrain\GT\Dirt_01.png',
        './assets/textures\terrain\GT\Dirt_02.png',
        './assets/textures\terrain\GT\Dirt_03.png',
        './assets/textures\terrain\GT\Dirt_04.png',
        './assets/textures\terrain\GT\floor_01.png',
        './assets/textures\terrain\GT\floor_02.png',
        './assets/textures\terrain\GT\floor_03.png',
        './assets/textures\terrain\GT\floor_04.png',
        './assets/textures\terrain\GT\floor_05.png',
        './assets/textures\terrain\GT\Grass_01.png',
        './assets/textures\terrain\GT\Grass_02.png',
        './assets/textures\terrain\GT\Grass_03.png',
        './assets/textures\terrain\GT\Rock_01.png',
        './assets/textures\terrain\GT\Rock_02.png',
        './assets/textures\terrain\GT\Rock_03.png',
        './assets/textures\terrain\GT\Sand_01.png',
        './assets/textures\terrain\GT\Sand_02.png',
        './assets/textures\terrain\GT\Sand_03.png',
        './assets/textures\terrain\GT\Snow_01.png',
        './assets/textures\terrain\GT\Snow_02.png',
        './assets/ui\settings\Settings_button.png',
        './assets/ui\settings\sound_off.png',
        './assets/ui\settings\sound_off_hilite.png',
        './assets/ui\settings\sound_on.png',
        './assets/ui\settings\sound_on_hilite.png',
        './assets/ui\titles\manta_engine.png',
        './assets/ui\titles\sds_logo.png',
        './assets/ui\titles\tapestry.png',
        './assets/ui\titles\tapestry_title.png'
      ]).then(function() {
        self.skipWaiting();
      });
    })
  );
});

// when the browser fetches a URL...
self.addEventListener('fetch', function(event) {
  // ... either respond with the cached object or go ahead and fetch the actual URL
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        // retrieve from cache
        return response;
      }
      // fetch as normal
      return fetch(event.request);
    })
  );
});
