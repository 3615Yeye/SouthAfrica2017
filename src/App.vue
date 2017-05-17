<template>
  <div class="container">
    <a href="#" @click="currentView='homepage'">Accueil</a>
    <a href="#" @click="currentView='admin'">Admin</a>
    <component :is="currentView"></component>
  </div>
</template>

<script>

import Simple from './components/Simple';
import Example from './components/Example';
import MultiMap from './components/MultiMap';
import CustomPath from './components/CustomPath';
import CustomUrlParams from './components/CustomUrlParams';
import SetBounds from './components/SetBounds';
import GeometryTest from './components/GeometryTest';
import PopupOnGeometryTest from './components/PopupOnGeometryTest';
import WorldCopyJump from './components/WorldCopyJump';
import GeoJSON from './components/GeoJSON';
import WMSLayers from './components/WMSLayers';
import CRSAndImageOverlay from './components/CRSAndImageOverlay';
import Homepage from './components/Homepage';
import Admin from './components/Admin';

export default {
  name: 'app',
  components: {
    Homepage,
    Admin,
    Simple,
    Example,
    MultiMap,
    CustomPath,
    CustomUrlParams,
    SetBounds,
    GeometryTest,
    PopupOnGeometryTest,
    WorldCopyJump,
    'geo-json': GeoJSON,
    'wms-layers': WMSLayers,
    'crs': CRSAndImageOverlay,
  },
  data () {
    return {
      currentView: 'homepage'
    }
  }
}
</script>

<style>
.leaflet-fake-icon-image-2x {
  background-image: url(../node_modules/leaflet/dist/images/marker-icon-2x.png);
}
.leaflet-fake-icon-shadow {
  background-image: url(../node_modules/leaflet/dist/images/marker-shadow.png);
}
@import "../node_modules/leaflet/dist/leaflet.css";

#top_div {
  position: absolute;
  overflow-x: auto;
  top: 0;
  right: 0;
  left: 200px;
  bottom: 50%;
}

#bottom_div {
  position: absolute;
  top: 50%;
  right: 0;
  left: 200px;
  bottom: 0;
}
</style>
