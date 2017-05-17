<template>
  <div>
    <div id="top_div" style="height: 100%">
      <h2>Simple map</h2>
        Marker is placed at {{ marker.lat }}, {{ marker.lng }}
      </br>
      <v-map style="height: 90%" :zoom="zoom" :center="center">
        <v-tilelayer :url="url" :attribution="attribution"></v-tilelayer>
        <v-marker :lat-lng="marker"></v-marker>
        <v-marker :lat-lng="marker2"></v-marker>
      </v-map>
    </div>
  </div>
</template>

<script>
import Vue2Leaflet from 'vue2-leaflet';

export default {
  name: 'example',
  components: {
    'v-map': Vue2Leaflet.Map,
    'v-tilelayer' :Vue2Leaflet.TileLayer,
    'v-marker': Vue2Leaflet.Marker
  },
  data () {
    return {
      zoom:10,
      center: L.latLng(47.413220, -1.219482),
      url:'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      marker: L.latLng(47.413220, -1.219482),
      marker2: L.latLng(47.413220, -1.119482),
    }
  }
}
</script>
