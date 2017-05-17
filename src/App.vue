<template>
  <div id="app">
    <h1>Afrique du Sud 2017</h1>
    <router-view></router-view>
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
  }
}
</script>

<style>
/*
html, body, #app, #homepage, #homepage .container, #homepage .row {
  height: 100%;
  margin: 0;
  overflow:hidden;
}
*/
h1 {
  text-align: center;
}

</style>
