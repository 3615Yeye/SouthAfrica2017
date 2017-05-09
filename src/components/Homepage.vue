<template>
  <div id="homepage">
    <h2> Étape </h2>
    <h3> {{ stopovers[index].title }} </h3>
    <p v-html="stopovers[index].description"></p>
    <button @click="previousStepover"> Précédent </button>
    <button @click="nextStepover"> Suivant </button>
  </div>
</template>

<script>
export default {
  name: 'homepage',
  data () {
    return {
      stopovers: {},
      index: 0
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
#homepage {
  margin-top: 60px;
  margin: auto 30rem;
}
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
