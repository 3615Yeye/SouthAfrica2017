<template>
  <div id="app">
    <hello></hello>
    <admin></admin>
  </div>
</template>

<script>
import Hello from './components/Hello'
import Admin from './components/Admin'

export default {
  name: 'app',
  components: {
    Hello,
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
