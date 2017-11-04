<template>
  <div id="create-stopover">
    <p> <strong> Ajouter une étape </strong> </p>
    <span>Titre :</span>
    <input type="text" id="title" name="title" v-model="newStopover.title"></input>
    <br/>
    <p>Description :</p>
    <ckeditor
        id="ckeditor-new"
        v-model="newStopover.description"
        :config="ckeditorConfig"
        ></ckeditor>
    <p>Position GPS (latitude, longitude) :</p>
    <input type="text" name="startLat" v-model="newStopover.startLat"></input>
    <input type="text" name="startLng" v-model="newStopover.startLng"></input>
    <ul class="uploadGallery">
      <draggable v-model="newStopover.gallery" :options="{group:'people'}" @start="drag=true" @end="drag=false">
      <li v-for="(img, index) in newStopover.gallery">
        <img :src="img.path" />
        <b-form-input v-model="img.description" type="text" placeholder="Description"></b-form-input>
        <b-form-input v-model="img.sorting = index" type="hidden"></b-form-input>
      </li>
      </draggable>
    </ul>
    <vue-clip class="gallery-upload" :options="uploadOptions" :on-complete="addedPhotoCreate">
      <template slot="clip-uploader-action">
        <div>
          <div class="dz-message"><p>Cliquer ou déposer des photos ici</p></div>
        </div>
      </template>
    </vue-clip>
    <b-button variant="primary" @click="createStopoverAction">Ajouter</b-button>
  </div>
</template>

<script>
import Ckeditor from 'vue-ckeditor2'
import draggable from 'vuedraggable'
export default {
  name: 'new-stopover',
  props: {
    newStopover: {},
    ckeditorConfig: {},
    uploadOptions: {}
  },
  components: {
    Ckeditor,
    draggable
  },
  methods: {
    createStopoverAction: function () {
      this.$http.post(
        'admin/stopover/new',
         this.newStopover
      )
        .then(
          function (response) {
            this.$emit('update:stopoversList')
            this.newStopover.title = ''
            this.newStopover.startLat = 0
            this.newStopover.startLng = 0
            this.newStopover.gallery = []
          }
        )
    },
    'addedPhotoCreate': function (file, status, xhr) {
      var response = JSON.parse(file.xhrResponse.response)
      this.newStopover.gallery.push(
        {
          'path': '/' + response.path,
          'width': response.width,
          'height': response.height
        }
      )
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .uploadGallery img {
      max-width: 200px;
      max-height: 200px;
  }
</style>
