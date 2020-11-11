// Use a cacheName for cache versioning
var cacheName = 'v1:static';

// During the installation phase, you'll usually want to cache static assets.
self.addEventListener('install', function(e) {
    // Once the service worker is installed, go ahead and fetch the resources to make this work offline.
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll([
              './art/ui/settings/sound_on_hilite.png',
              './art/ui/settings/sound_off.png',
              './art/ui/settings/Settings_button.png',
              './art/ui/settings/sound_off_hilite.png',
              './art/ui/settings/sound_on.png',
              './art/ui/map_editor/td_maps_hilite.png',
              './art/ui/map_editor/erase_tile_hilite.png',
              './art/ui/map_editor/td_maps.png',
              './art/ui/map_editor/save_hilite.png',
              './art/ui/map_editor/erase_tile.png',
              './art/ui/map_editor/save.png',
              './art/ui/pieces/piece_spawn_hilite.png',
              './art/ui/pieces/piece_tile.png',
              './art/ui/pieces/piece_socket_hilite.png',
              './art/ui/pieces/piece_curve_2_hilite.png',
              './art/ui/pieces/piece_base_hilite.png',
              './art/ui/pieces/piece_curve_2.png',
              './art/ui/pieces/piece_curve_3.png',
              './art/ui/pieces/piece_curve_1.png',
              './art/ui/pieces/piece_curve_3_hilite.png',
              './art/ui/pieces/piece_spawn.png',
              './art/ui/pieces/piece_base.png',
              './art/ui/pieces/piece_curve_1_hilite.png',
              './art/ui/pieces/piece_tile_hilite.png',
              './art/ui/pieces/piece_socket.png',
              './art/ui/titles/sds_logo_black.png',
              './art/ui/titles/REclaimer.png',
              './art/ui/titles/sds_logo_edge.png',
              './art/ui/titles/sds_logo.png',
              './art/ui/mesh_editor/scale.png',
              './art/ui/mesh_editor/profile_hilite.png',
              './art/ui/mesh_editor/scale_hilite.png',
              './art/ui/mesh_editor/mirror_none_hilite.png',
              './art/ui/mesh_editor/mirror_y_hilite.png',
              './art/ui/mesh_editor/cross_hilite.png',
              './art/ui/mesh_editor/mirror_xy.png',
              './art/ui/mesh_editor/meshes_hilite.png',
              './art/ui/mesh_editor/rotate.png',
              './art/ui/mesh_editor/mirror_xy_hilite.png',
              './art/ui/mesh_editor/pre_translate.png',
              './art/ui/mesh_editor/rotate_hilite.png',
              './art/ui/mesh_editor/mirror_x.png',
              './art/ui/mesh_editor/node.png',
              './art/ui/mesh_editor/mirror_y.png',
              './art/ui/mesh_editor/mirror_x_hilite.png',
              './art/ui/mesh_editor/cross.png',
              './art/ui/mesh_editor/profile.png',
              './art/ui/mesh_editor/meshes.png',
              './art/ui/mesh_editor/node_hilite.png',
              './art/ui/mesh_editor/mirror_none.png',
              './art/ui/mesh_editor/pre_translate_hilite.png',
              './art/ui/towers/shockwave.png',
              './art/ui/towers/freeze.png',
              './art/ui/towers/laser.png',
              './art/ui/towers/electric.png',
              './art/ui/towers/flame.png',
              './art/ui/towers/cannon.png',
              './art/ui/towers/flak.png',
              './art/ui/towers/acid.png',
              './art/ui/tower_actions/check.png',
              './art/ui/tower_actions/cancel.png',
              './art/ui/tower_actions/upgrade.png',
              './art/ui/tower_actions/trash.png',
              './art/textures/particle_solid_01.png',
              './art/textures/grid.png',
              './art/textures/particle_smoke_01.png',
              './art/textures/back_grid.png',
              './art/textures/skybox_09.png',
              './art/textures/spacebox_03.png',
              './art/textures/spacebox_02.png',
              './art/textures/shadow.png',
              './art/app_icons/icon-192.png',
              './art/app_icons/icon-512.png'
            ]).then(function() {
                self.skipWaiting();
            });
        })
    );
});

// when the browser fetches a URL…
self.addEventListener('fetch', function(event) {
    // … either respond with the cached object or go ahead and fetch the actual URL
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