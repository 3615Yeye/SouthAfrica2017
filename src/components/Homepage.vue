<template>
  <div id="homepage">
    <div class="container">
      <div class="row">
        <div id="mapa" class="col-8">
          <v-map :zoom=9 :center="[-33.9188, 18.4233]">
            <v-tilelayer url="https://api.mapbox.com/styles/v1/ronanlp/cj2ol4jdo00342smt0zcjn2ne/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoicm9uYW5scCIsImEiOiJjajJvbDFrMTYwMDRpMzNxb2N1YXZoZmZxIn0.2p4QVjbpSOP1GtgkTWpzLg">
              <leaflet-icondefault path="static/images/"></leaflet-icondefault>`
              <v-marker :lat-lng="marker"/>
              <v-marker :lat-lng="{ lat: 40.712, lng: -4.227 }"></v-marker>
            </v-tilelayer>
          </v-map>
        </div>
        <div id="description" class="col-4">
          <h2> Étape </h2>
          <h3> {{ stopoverTitle }}</h3>
          <p v-html="stopoverDescription"></p>
          <button @click="previousStepover"> Précédent </button>
          <button @click="nextStepover"> Suivant </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue2Leaflet from 'vue2-leaflet'
  import 'leaflet/dist/leaflet.css'
  import L from 'leaflet'
  L.Icon.Default.imagePath = '.'
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
  })
  export default {
    name: 'homepage',
    components: {
      'v-map': Vue2Leaflet.Map,
      'v-tilelayer': Vue2Leaflet.TileLayer,
      'v-marker': Vue2Leaflet.Marker
    },
    data () {
      return {
        stopovers: [],
        index: 0,
        marker: L.latLng(47.413220, -1.219482),
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'

      }
    },
    computed: {
      stopoverTitle: function () {
        if (this.stopovers.length > 0) {
          return this.stopovers[this.index].title
        }
        if (this.stopovers.length === 0) {
          return ''
        }
      },
      stopoverDescription: function () {
        if (this.stopovers.length > 0) {
          return this.stopovers[this.index].description
        }
        if (this.stopovers.length === 0) {
          return ''
        }
      }
    },
    created: function () {
      // Getting the list of stopovers
      this.$http.get('stopover/list').then(response => {
        this.stopovers = response.body
      })
    },
    methods: {
      nextStepover: function () {
        this.index++
      },
      previousStepover: function () {
        this.index--
      }
    }
  }
  </script>

  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  .container {
    width: 100%;
  }
  #map {
    height: 100%;
    width: 100%;
    padding: 0px;
  }
  </style>
