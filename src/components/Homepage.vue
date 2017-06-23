<template>
  <div id="homepage" class="row">
    <div id="carte" class="col-8">
      <v-map id="mapid" :zoom="zoom" :center="currentCenter">
        <v-tilelayer :url="url" :attribution="attribution"></v-tilelayer>
        <v-marker :lat-lng="[currentStopover.startLat, currentStopover.startLng]"></v-marker>
      </v-map>
    </div>
    <div id="description" class="col-4">
      <h2> {{ currentStopover.title }}</h2>
      <div id="content">
          <p v-html="currentStopover.description"></p>
          <gallery
            :images="currentStopover.gallery"
          ></gallery>
      </div>
      <div id="nav-buttons">
        <b-button @click="previousStepover" variant="outline-secondary"> Précédent </b-button>
        <b-button @click="nextStepover" variant="outline-primary"> Suivant </b-button>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue2Leaflet from 'vue2-leaflet'
  import vueImages from 'vue-images'
  import Gallery from './Gallery'
  export default {
    name: 'homepage',
    components: {
      'v-map': Vue2Leaflet.Map,
      'v-tilelayer': Vue2Leaflet.TileLayer,
      'v-marker': Vue2Leaflet.Marker,
      vueImages: vueImages,
      gallery: Gallery
    },
    data () {
      return {
        zoom: 10,
        center: [-33.9188, 18.4233],
        url: 'https://api.mapbox.com/styles/v1/ronanlp/cj2ol4jdo00342smt0zcjn2ne/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoicm9uYW5scCIsImEiOiJjajJvbDFrMTYwMDRpMzNxb2N1YXZoZmZxIn0.2p4QVjbpSOP1GtgkTWpzLg',
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        stopovers: [],
        index: 0,
        galleryConfig: {
          modalclose: true,
          keyinput: true,
          mousescroll: true,
          showclosebutton: true,
          showcaption: true,
          imagecountseparator: 'sur',
          showimagecount: true,
          showthumbnails: true
        }
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
            startLng: 0,
            gallery: []
          }
        }
      },
      currentCenter: function () {
        if (this.stopovers.length > 0) {
          return [
            this.stopovers[this.index].startLat,
            this.stopovers[this.index].startLng
          ]
        }
        if (this.stopovers.length === 0) {
          return [-33.9188, 18.4233]
        }
      }
    },
    created: function () {
      // Getting the list of stopovers
      this.$http.get('stopover/list').then(response => {
        this.stopovers = response.body.stopovers
        console.log(this.stopovers[0].gallery)
      })
    },
    methods: {
      nextStepover: function () {
        if (this.index < this.stopovers.length - 1) {
          this.index++
        }
      },
      previousStepover: function () {
        if (this.index > 0) {
          this.index--
        }
      }
    }
  }
  </script>

  <!-- Add "scoped" attribute to limit CSS to this component only -->
@import 'vue-image-lightbox/dist/vue-image-lightbox.min.css'
<style scoped>
#homepage {
  height: 100%;
  margin: 0px;
}
div.container {
  width: 100%;
}
#carte {
  padding: 0;
  max-height: 100%;
}
#mapid { 
  height: 100%; 
  min-height: 300px;
}
#description {
  font-family: 'Indie Flower', cursive;
  text-align: left;
  max-height: 100%;
}
#content {
    overflow: scroll;
    max-height: 85%;
}
#nav-buttons {
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translate(-50%, 0);
  margin-bottom: 2%;
}
</style>
