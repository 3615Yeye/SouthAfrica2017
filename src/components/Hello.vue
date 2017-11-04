<template>
  <div class="hello">
    <div style="height: 400px">
        <v-map :zoom=13 :center="[47.413220, -1.219482]">
            <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></v-tilelayer>
            <v-marker :lat-lng="[47.413220, -1.219482]"></v-marker>
            <v-marker :lat-lng="[46.413220, -1.219482]"></v-marker>
        </v-map>
    </div>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
