<template>
  <div id="editStopover">
    <p> <strong> Éditer une étape </strong> </p>
    <span>Titre :</span>
    <input type="text" id="editTitle" name="title" v-model="editStopover.title"></input>
    <br/>
    <p>Description :</p>
    <ckeditor v-model="editStopover.description" :config="ckeditorConfig"></ckeditor>
    <p>Position GPS (latitude, longitude) :</p>
    <input type="text" name="startLat" v-model="editStopover.startLat"></input>
    <input type="text" name="startLng" v-model="editStopover.startLng"></input>
    <input type="hidden" id="id" name="id" v-model="editStopover.id"></input>
    <ul class="uploadGallery">
      <draggable v-model="editStopover.gallery" :options="{group:'people'}" @start="drag=true" @end="drag=false">
      <li v-for="(img, index) in editStopover.gallery">
        <img :src="img.path" />
        <b-form-input v-model="img.description" type="text" placeholder="Description"></b-form-input>
        <b-form-input v-model="img.sorting = index" type="hidden"></b-form-input>
      </li>
      </draggable>
    </ul>
    <vue-clip :options="uploadOptions" :on-complete="addedPhotoUpdate">
      <template slot="clip-uploader-action">
        <div>
          <div class="dz-message"><p>Cliquer ou déposer des photos ici</p></div>
        </div>
      </template>
    </vue-clip>
    <b-btn 
           v-b-toggle.collapseAdminEdit 
           variant="secondary" 
           @click="updateStopoverAction"
           >Éditer</b-btn>
  </div>
</template>

<script>
import Ckeditor from 'vue-ckeditor2'
import draggable from 'vuedraggable'
export default {
  name: 'edit-stopover',
  props: {
    editStopover: {},
    ckeditorConfig: {},
    uploadOptions: {}
  },
  components: {
    Ckeditor,
    draggable
  },
  methods: {
    updateStopoverAction: function () {
      this.$http.post(
        'admin/stopover/update',
        this.editStopover
      )
        .then(
          function (response) {
            this.$emit('update:stopoversList')
            this.editStopover.id = -1
            this.editStopover.title = ''
            this.editStopover.description = ''
          }
        )
    },
    'addedPhotoUpdate': function (file, status, xhr) {
      this.editStopover.gallery.push(
        {
          'path': '/' + JSON.parse(file.xhrResponse.response).path
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
