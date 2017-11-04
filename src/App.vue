<template>
  <div id="app">
    <nav id="navbar" class="navbar navbar-light">
      <div class="imgfond"></div>
      <h1 id="titre" class="navbar-brand mb-0">Afrique du Sud 2017</h1>
      <p id="nav-buttons">
        <b-button @click="currentView='homepage'"
          v-show="currentView=='admin'"
          variant="outline-success"
          > Accueil
        </b-button>
        <b-button @click="currentView='admin'"
          v-show="currentView=='homepage'"
          variant="outline-success"
          > Admin
        </b-button>
      </p>
    </nav>
    <div id="main">
      <component :is="currentView"></component>
    </div>
  </div>
</template>

<script>
import Homepage from './components/Homepage'
import Admin from './components/Admin'

export default {
  name: 'app',
  components: {
    Homepage,
    Admin
  },
  data () {
    return {
      currentView: 'homepage'
    }
  }
}
</script>

<style>
html, body {
  height: 100%;
}
h1#titre {
  font-family: 'Permanent Marker', cursive;
  color: #1a4e6f;
  font-size: 3rem;
  text-align: center;
}
#nav-buttons {
    position: absolute;
    right: 5%;
    margin-bottom: 0px;
}
#app {
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#navbar {
  height: 10%;
}
#main {
  height: 90%;
}
@import "../node_modules/leaflet/dist/leaflet.css";
</style>
