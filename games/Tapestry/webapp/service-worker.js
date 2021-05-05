// Service-work cache name
var cacheName = '2021_05_05__01_05:static';

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
        './assets/app_icons\mstile-144x144.png',
        './assets/app_icons\mstile-150x150.png',
        './assets/app_icons\mstile-310x150.png',
        './assets/app_icons\mstile-310x310.png',
        './assets/app_icons\mstile-70x70.png',
        './assets/app_icons\safari-pinned-tab.svg',
        './assets/app_icons\site.webmanifest',
        './assets/audio\daemon-portal-30secs.mp3',
        './assets/audio\daemon-portal-30secs.ogg',
        './assets/fonts\Aero.ttf',
        './assets/fonts\Armwarmer.ttf',
        './assets/fonts\leaguegothic.ttf',
        './assets/textures\back_grid.png',
        './assets/textures\grid.png',
        './assets/textures\particle_smoke_01.png',
        './assets/textures\particle_solid_01.png',
        './assets/textures\shadow.png',
        './assets/textures\skybox_09.png',
        './assets/textures\spacebox_02.png',
        './assets/textures\spacebox_03.png',
        './assets/textures\planets\moon_01.png',
        './assets/textures\planets\moon_02.png',
        './assets/textures\planets\moon_03.png',
        './assets/textures\planets\moon_04.png',
        './assets/textures\planets\moon_05.png',
        './assets/textures\planets\pl_gas_01.png',
        './assets/textures\planets\pl_gas_02.png',
        './assets/textures\planets\pl_gas_03.png',
        './assets/textures\planets\pl_rock_01.png',
        './assets/textures\planets\pl_rock_02.png',
        './assets/textures\planets\pl_rock_03.png',
        './assets/textures\planets\pl_rock_04.png',
        './assets/textures\planets\pl_rock_05.png',
        './assets/textures\planets\pl_rock_06.png',
        './assets/textures\planets\pl_rock_07.png',
        './assets/textures\planets\sun_01.png',
        './assets/ui\map_editor\erase_tile.png',
        './assets/ui\map_editor\erase_tile_hilite.png',
        './assets/ui\map_editor\save.png',
        './assets/ui\map_editor\save_hilite.png',
        './assets/ui\map_editor\td_maps.png',
        './assets/ui\map_editor\td_maps_hilite.png',
        './assets/ui\mesh_editor\cross.png',
        './assets/ui\mesh_editor\cross_hilite.png',
        './assets/ui\mesh_editor\grid_back.png',
        './assets/ui\mesh_editor\grid_front.png',
        './assets/ui\mesh_editor\grid_left.png',
        './assets/ui\mesh_editor\grid_right.png',
        './assets/ui\mesh_editor\meshes.png',
        './assets/ui\mesh_editor\meshes_hilite.png',
        './assets/ui\mesh_editor\mirror_none.png',
        './assets/ui\mesh_editor\mirror_none_hilite.png',
        './assets/ui\mesh_editor\mirror_x.png',
        './assets/ui\mesh_editor\mirror_xy.png',
        './assets/ui\mesh_editor\mirror_xy_hilite.png',
        './assets/ui\mesh_editor\mirror_x_hilite.png',
        './assets/ui\mesh_editor\mirror_y.png',
        './assets/ui\mesh_editor\mirror_y_hilite.png',
        './assets/ui\mesh_editor\node.png',
        './assets/ui\mesh_editor\node_hilite.png',
        './assets/ui\mesh_editor\pre_translate.png',
        './assets/ui\mesh_editor\pre_translate_hilite.png',
        './assets/ui\mesh_editor\profile.png',
        './assets/ui\mesh_editor\profile_hilite.png',
        './assets/ui\mesh_editor\rotate.png',
        './assets/ui\mesh_editor\rotate_hilite.png',
        './assets/ui\mesh_editor\scale.png',
        './assets/ui\mesh_editor\scale_hilite.png',
        './assets/ui\pieces\piece_base.png',
        './assets/ui\pieces\piece_base_hilite.png',
        './assets/ui\pieces\piece_curve_1.png',
        './assets/ui\pieces\piece_curve_1_hilite.png',
        './assets/ui\pieces\piece_curve_2.png',
        './assets/ui\pieces\piece_curve_2_hilite.png',
        './assets/ui\pieces\piece_curve_3.png',
        './assets/ui\pieces\piece_curve_3_hilite.png',
        './assets/ui\pieces\piece_socket.png',
        './assets/ui\pieces\piece_socket_hilite.png',
        './assets/ui\pieces\piece_spawn.png',
        './assets/ui\pieces\piece_spawn_hilite.png',
        './assets/ui\pieces\piece_tile.png',
        './assets/ui\pieces\piece_tile_hilite.png',
        './assets/ui\settings\Settings_button.png',
        './assets/ui\settings\sound_off.png',
        './assets/ui\settings\sound_off_hilite.png',
        './assets/ui\settings\sound_on.png',
        './assets/ui\settings\sound_on_hilite.png',
        './assets/ui\titles\manta_engine.png',
        './assets/ui\titles\sds_logo_edge.png',
        './assets/ui\titles\tapestry.png',
        './assets/ui\titles\tapestry_title.png',
        './assets/ui\tower_actions\cancel.png',
        './assets/ui\tower_actions\check.png',
        './assets/ui\tower_actions\trash.png',
        './assets/ui\tower_actions\upgrade.png',
        './assets/ui\towers\acid.png',
        './assets/ui\towers\cannon.png',
        './assets/ui\towers\electric.png',
        './assets/ui\towers\flak.png',
        './assets/ui\towers\flame.png',
        './assets/ui\towers\freeze.png',
        './assets/ui\towers\laser.png',
        './assets/ui\towers\shockwave.png'
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
