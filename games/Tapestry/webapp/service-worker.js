// Service-work cache name
var cacheName = '2021_12_01__01_16:static';

// Cache assets on install
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll([
        './assets/app_icons/android-chrome-192x192.png',
        './assets/app_icons/android-chrome-512x512.png',
        './assets/app_icons/apple-touch-icon.png',
        './assets/app_icons/browserconfig.xml',
        './assets/app_icons/favicon-16x16.png',
        './assets/app_icons/favicon-32x32.png',
        './assets/app_icons/favicon.ico',
        './assets/app_icons/mstile-150x150.png',
        './assets/app_icons/safari-pinned-tab.svg',
        './assets/audio/daemon-portal-30secs.mp3',
        './assets/audio/daemon-portal-30secs.ogg',
        './assets/backgrounds/graph_paper.png',
        './assets/backgrounds/grid.png',
        './assets/fonts/Aero.ttf',
        './assets/fonts/Armwarmer.ttf',
        './assets/fonts/leaguegothic.ttf',
        './assets/fonts/MontserratBlack.ttf',
        './assets/fonts/MontserratExtrabold.ttf',
        './assets/textures/Asteroid01.png',
        './assets/textures/backgrounds/back_grid.png',
        './assets/textures/backgrounds/fill_white.png',
        './assets/textures/backgrounds/graph_paper.png',
        './assets/textures/backgrounds/grid.png',
        './assets/textures/effects/glow.png',
        './assets/textures/effects/rim.png',
        './assets/textures/effects/shadow.png',
        './assets/textures/particles/particle_smoke_01.png',
        './assets/textures/particles/particle_solid_01.png',
        './assets/textures/planets/pl_gas_01.png',
        './assets/textures/planets/pl_gas_02.png',
        './assets/textures/planets/pl_gas_03.png',
        './assets/textures/planets/pl_gas_04.png',
        './assets/textures/planets/pl_gas_05.png',
        './assets/textures/planets/pl_gas_06.png',
        './assets/textures/planets/pl_gas_07.png',
        './assets/textures/planets/pl_gas_08.png',
        './assets/textures/planets/pl_gas_09.png',
        './assets/textures/planets/pl_gas_10.png',
        './assets/textures/planets/pl_gas_11.png',
        './assets/textures/planets/pl_gas_12.png',
        './assets/textures/planets/pl_gas_13.png',
        './assets/textures/planets/pl_gas_14.png',
        './assets/textures/planets/pl_gas_15.png',
        './assets/textures/planets/pl_rock_01.png',
        './assets/textures/planets/pl_rock_02.png',
        './assets/textures/planets/pl_rock_03.png',
        './assets/textures/planets/pl_rock_04.png',
        './assets/textures/planets/pl_rock_05.png',
        './assets/textures/planets/pl_rock_06.png',
        './assets/textures/planets/pl_rock_07.png',
        './assets/textures/planets/pl_rock_08.png',
        './assets/textures/planets/pl_rock_09.png',
        './assets/textures/planets/pl_rock_10.png',
        './assets/textures/planets/pl_rock_11.png',
        './assets/textures/planets/pl_rock_12.png',
        './assets/textures/planets/pl_rock_13.png',
        './assets/textures/planets/pl_rock_14.png',
        './assets/textures/planets/pl_rock_15.png',
        './assets/textures/planets/pl_rock_16.png',
        './assets/textures/planets/pl_rock_17.png',
        './assets/textures/planets/pl_rock_18.png',
        './assets/textures/planets/pl_sol_earth.png',
        './assets/textures/planets/pl_sol_jupiter.png',
        './assets/textures/planets/pl_sol_mars.png',
        './assets/textures/planets/pl_sol_mercury.png',
        './assets/textures/planets/pl_sol_moon.png',
        './assets/textures/planets/pl_sol_neptune.png',
        './assets/textures/planets/pl_sol_pluto.png',
        './assets/textures/planets/pl_sol_saturn.png',
        './assets/textures/planets/pl_sol_uranus.png',
        './assets/textures/planets/pl_sol_venus.png',
        './assets/textures/planets/sun_01.png',
        './assets/textures/rings/rng_01.png',
        './assets/textures/rings/rng_02.png',
        './assets/textures/rings/rng_03.png',
        './assets/textures/rings/rng_04.png',
        './assets/textures/rings/rng_05.png',
        './assets/textures/rings/rng_06.png',
        './assets/textures/rings/rng_sol_saturn.png',
        './assets/textures/rings/rng_sol_uranus.png',
        './assets/textures/skyboxes/skybox_01.png',
        './assets/textures/skyboxes/skybox_02.png',
        './assets/textures/skyboxes/skybox_03.png',
        './assets/textures/skyboxes/skybox_04.png',
        './assets/textures/skyboxes/skybox_05.png',
        './assets/textures/skyboxes/skybox_06.png',
        './assets/textures/skyboxes/skybox_07.png',
        './assets/textures/skyboxes/skybox_08.png',
        './assets/textures/skyboxes/skybox_09.png',
        './assets/textures/skyboxes/skybox_10.png',
        './assets/textures/skyboxes/spacebox_01.png',
        './assets/textures/skyboxes/spacebox_02.png',
        './assets/textures/skyboxes/spacebox_03.png',
        './assets/ui/components/lunar_mining.png',
        './assets/ui/components/mask.png',
        './assets/ui/components/moon_base.png',
        './assets/ui/components/space_elevator.png',
        './assets/ui/components/upgrade_hilite.png',
        './assets/ui/controls/body_view.png',
        './assets/ui/controls/body_view_hilite.png',
        './assets/ui/controls/construction_ship.png',
        './assets/ui/controls/construction_ship_hilite.png',
        './assets/ui/controls/defense_ship.png',
        './assets/ui/controls/defense_ship_hilite.png',
        './assets/ui/controls/mining_ship.png',
        './assets/ui/controls/mining_ship_hilite.png',
        './assets/ui/controls/sector_view.png',
        './assets/ui/controls/sector_view_hilite.png',
        './assets/ui/controls/system_view.png',
        './assets/ui/controls/system_view_hilite.png',
        './assets/ui/controls/zoom.png',
        './assets/ui/controls/zoom_hilite.png',
        './assets/ui/info/arrow.png',
        './assets/ui/info/cancel.png',
        './assets/ui/info/cancel_hilite.png',
        './assets/ui/info/can_upgrade.png',
        './assets/ui/info/cost.png',
        './assets/ui/info/info.png',
        './assets/ui/info/info_hilite.png',
        './assets/ui/info/not_cost.png',
        './assets/ui/info/not_requirement.png',
        './assets/ui/info/requirement.png',
        './assets/ui/info/result.png',
        './assets/ui/info/upgrade.png',
        './assets/ui/info/upgrade_hilite.png',
        './assets/ui/info/upgrade_invalid.png',
        './assets/ui/settings/Settings_button.png',
        './assets/ui/settings/sound_off.png',
        './assets/ui/settings/sound_off_hilite.png',
        './assets/ui/settings/sound_on.png',
        './assets/ui/settings/sound_on_hilite.png',
        './assets/ui/stats/biomatter.png',
        './assets/ui/stats/con_ship.png',
        './assets/ui/stats/def_ship.png',
        './assets/ui/stats/energy.png',
        './assets/ui/stats/exotic.png',
        './assets/ui/stats/metal.png',
        './assets/ui/stats/min_ship.png',
        './assets/ui/stats/population.png',
        './assets/ui/stats/silica.png',
        './assets/ui/stats/time.png',
        './assets/ui/stats/tritium.png',
        './assets/ui/titles/manta_engine.png',
        './assets/ui/titles/sds_logo.png',
        './assets/ui/titles/tapestry.png',
        './assets/ui/titles/tapestry_title.png'
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
