<template>
    <!--
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
    -->
  <div>
    <div id="top_div" style="height: 100%">
      <h2>Test carte</h2>
        Marker is placed at {{ currentStopover.startLat }}, {{ currentStopover.startLng }}
      </br>
      <div id="description" class="col-4">
        <h2> Étape </h2>
        <h3> {{ currentStopover.title }}</h3>
        <p v-html="stopoverDescription"></p>
        <button @click="previousStepover"> Précédent </button>
        <button @click="nextStepover"> Suivant </button>
      </div>
      <v-map style="height: 90%" :zoom="zoom" :center="currentCenter">
        <v-tilelayer :url="url" :attribution="attribution"></v-tilelayer>
        <v-marker :lat-lng="[currentStopover.startLat, currentStopover.startLng]"></v-marker>
      </v-map>
    </div>
  </div>
</template>

<script>
  import Vue2Leaflet from 'vue2-leaflet'
  export default {
    name: 'homepage',
    components: {
      'v-map': Vue2Leaflet.Map,
      'v-tilelayer': Vue2Leaflet.TileLayer,
      'v-marker': Vue2Leaflet.Marker
    },
    data () {
      return {
        zoom:10,
        center: L.latLng(-33.9188, 18.4233),
        url:'https://api.mapbox.com/styles/v1/ronanlp/cj2ol4jdo00342smt0zcjn2ne/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoicm9uYW5scCIsImEiOiJjajJvbDFrMTYwMDRpMzNxb2N1YXZoZmZxIn0.2p4QVjbpSOP1GtgkTWpzLg',
        attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        stopovers: [],
        index: 0,
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'

      }
    },
    computed: {
      currentStopover: function () {
        if (this.stopovers.length > 0) {
          return this.stopovers[this.index]
        }
        if (this.stopovers.length === 0) {
          return {
            title: '',
            description: '',
            startLat: 0,
            startLng: 0
          }
        }
      },
      currentCenter: function () {
        if (this.stopovers.length > 0) {
          return L.latLng(
            this.stopovers[this.index].startLat,
            this.stopovers[this.index].startLng
          )
        }
        if (this.stopovers.length === 0) {
          return L.latLng(-33.9188, 18.4233)
        }
      }
    },
    created: function () {
      // Getting the list of stopovers
      this.$http.get('stopover/list').then(response => {
        this.stopovers = response.body
        console.log(response.body)
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
  /*
  .container {
    width: 100%;
  }
  #map {
    height: 100%;
    width: 100%;
    padding: 0px;
  }
  */
  </style>
