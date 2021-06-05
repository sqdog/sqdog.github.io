// Service-work cache name
var cacheName = '2021_06_05__09_49:static';

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
        './assets/textures\Asteroid01.png',
        './assets/textures\back_grid.png',
        './assets/textures\glow.png',
        './assets/textures\grid.png',
        './assets/textures\particle_smoke_01.png',
        './assets/textures\particle_solid_01.png',
        './assets/textures\rim.png',
        './assets/textures\shadow.png',
        './assets/textures\skybox_09.png',
        './assets/textures\spacebox_02.png',
        './assets/textures\spacebox_03.png',
        './assets/textures\planets\pl_gas_01.png',
        './assets/textures\planets\pl_gas_02.png',
        './assets/textures\planets\pl_gas_03.png',
        './assets/textures\planets\pl_gas_04.png',
        './assets/textures\planets\pl_gas_05.png',
        './assets/textures\planets\pl_gas_06.png',
        './assets/textures\planets\pl_gas_07.png',
        './assets/textures\planets\pl_gas_08.png',
        './assets/textures\planets\pl_gas_09.png',
        './assets/textures\planets\pl_gas_10.png',
        './assets/textures\planets\pl_gas_11.png',
        './assets/textures\planets\pl_gas_12.png',
        './assets/textures\planets\pl_gas_13.png',
        './assets/textures\planets\pl_gas_14.png',
        './assets/textures\planets\pl_gas_15.png',
        './assets/textures\planets\pl_rock_01.png',
        './assets/textures\planets\pl_rock_02.png',
        './assets/textures\planets\pl_rock_03.png',
        './assets/textures\planets\pl_rock_04.png',
        './assets/textures\planets\pl_rock_05.png',
        './assets/textures\planets\pl_rock_06.png',
        './assets/textures\planets\pl_rock_07.png',
        './assets/textures\planets\pl_rock_08.png',
        './assets/textures\planets\pl_rock_09.png',
        './assets/textures\planets\pl_rock_10.png',
        './assets/textures\planets\pl_rock_11.png',
        './assets/textures\planets\pl_rock_12.png',
        './assets/textures\planets\pl_rock_13.png',
        './assets/textures\planets\pl_rock_14.png',
        './assets/textures\planets\pl_rock_15.png',
        './assets/textures\planets\pl_rock_16.png',
        './assets/textures\planets\pl_rock_17.png',
        './assets/textures\planets\pl_rock_18.png',
        './assets/textures\planets\pl_sol_earth.png',
        './assets/textures\planets\pl_sol_jupiter.png',
        './assets/textures\planets\pl_sol_mars.png',
        './assets/textures\planets\pl_sol_mercury.png',
        './assets/textures\planets\pl_sol_moon.png',
        './assets/textures\planets\pl_sol_neptune.png',
        './assets/textures\planets\pl_sol_pluto.png',
        './assets/textures\planets\pl_sol_saturn.png',
        './assets/textures\planets\pl_sol_uranus.png',
        './assets/textures\planets\pl_sol_venus.png',
        './assets/textures\planets\saturnringcolor.jpg',
        './assets/textures\planets\sun_01.png',
        './assets/textures\planets\uranusringcolour.jpg',
        './assets/ui\settings\Settings_button.png',
        './assets/ui\settings\sound_off.png',
        './assets/ui\settings\sound_off_hilite.png',
        './assets/ui\settings\sound_on.png',
        './assets/ui\settings\sound_on_hilite.png',
        './assets/ui\stats\energy.png',
        './assets/ui\stats\exotic.png',
        './assets/ui\stats\helix.png',
        './assets/ui\stats\metal.png',
        './assets/ui\stats\population.png',
        './assets/ui\stats\silica.png',
        './assets/ui\stats\tritium.png',
        './assets/ui\titles\manta_engine.png',
        './assets/ui\titles\sds_logo_edge.png',
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
