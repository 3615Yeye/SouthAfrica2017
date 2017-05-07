<template>
  <div class="hello">
    <h2> Admin </h2>
    <h3>Étapes</h3>
    <div v-for="stopover of stopovers">
      <p> {{ stopover.title }} </p>
      <p v-html="stopover.description"></p>
      <button :data-index="stopover.id" @click="deleteStopover"> Supprimer </button>
    </div>
    <div>
      <p> <strong> Ajouter une étape </strong> </p>
      <span>Titre :</span>
      <input type="text" id="title" name="title" v-model="newStopoverTitle"></input>
      <br/>
      <p>Description :</p>
      <ckeditor v-model="newStopoverDescription" :config="config"></ckeditor>
      <p>Gallerie photos :</p>
      <form id="upload-widget" method="post" action="admin/upload" class="dropzone">
        <div class="dz-preview dz-file-preview">
          <div class="dz-image">
            <img data-dz-thumbnail />
          </div>
          <div class="dz-details">
            <div class="dz-size">
              <span data-dz-size></span>
            </div>
            <div class="dz-filename">
              <span data-dz-name></span>
            </div>
          </div>
          <div class="dz-progress">
            <span class="dz-upload" data-dz-uploadprogress></span>
          </div>
          <div class="dz-error-message">
            <span data-dz-errormessage></span>
          </div>
          <div class="dz-success-mark">
            <svg>REMOVED FOR BREVITY</svg>
          </div>
          <div class="dz-error-mark">
            <svg>REMOVED FOR BREVITY</svg>
          </div>
        </div>
        <div class="fallback">
          <input name="file" type="file" multiple />
        </div>
      </form>
      <button @click="createStopover">Ajouter</button>
    </div>
  </div>
</template>

<script>
  import Ckeditor from 'vue-ckeditor2'

  export default {
    name: 'hello',
    data () {
      return {
        stopovers: {},
        newStopoverTitle: '',
        newStopoverDescription: '',
        config: {
          toolbar: [
            [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript' ]
          ],
          height: 300
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
      createStopover: function () {
        this.$http.post(
          'admin/stopover/new',
          {title: this.newStopoverTitle, description: this.newStopoverDescription}
        )
          .then(
            function (response) {
              this.stopovers = response.body
            }
          )
      },
      deleteStopover: function (el) {
        var id = el.target.attributes[1].value

        this.$http.post(
          'admin/stopover/delete',
          {id: id}
        )
          .then(
            function (response) {
              this.stopovers = response.body
              this.newStopoverTitle = ''
              this.newStopoverDescription = ''
            }
          )
      }
    },
    components: { Ckeditor }
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
