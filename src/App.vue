<template>
  <div id="app">
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
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
