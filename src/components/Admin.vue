<template>
  <div class="admin">
    <div class="container">
      <div class="row">
        <div class="col-6">
          <h2> Admin </h2>
          <h3>Étapes</h3>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <draggable v-model="stopovers" :options="{group:'people'}" v-on:change="updateSorting" @start="drag=true" @end="drag=false">
          <div v-for="(stopover, index) of stopovers">
            <p><b> {{ stopover.sorting }} {{ stopover.title }} </b></p>
            <p v-html="stopover.description"></p>
            <b-btn 
              v-b-toggle.collapseAdminEdit 
              variant="secondary" 
              :data-index="index" 
              @click="editStopoverAction"
              >Éditer</b-btn>
            <b-button 
              variant="danger" 
              :data-id="stopover.id" 
              @click="deleteStopoverAction(index)"
              > Supprimer </b-button>
          </div>
          </draggable>
        </div>
        <div class="col-6">
          <p>
            <b-btn v-b-toggle.collapseAdminCreate variant="primary">Ajouter une étape</b-btn>
          </p>

          <b-collapse id="collapseAdminCreate">
            <div id="createStepover" v-show="currentAction">
              <p> <strong> Ajouter une étape </strong> </p>
              <span>Titre :</span>
              <input type="text" id="title" name="title" v-model="newStopover.title"></input>
              <br/>
              <p>Description :</p>
              <ckeditor v-model="newStopover.description" :config="config"></ckeditor>
              <p>Position GPS (latitude, longitude) :</p>
              <input type="text" name="startLat" v-model="newStopover.startLat"></input>
              <input type="text" name="startLng" v-model="newStopover.startLng"></input>
              <ul class="uploadGallery">
                <draggable v-model="newStopover.gallery" :options="{group:'people'}" v-on:change="updateSorting" @start="drag=true" @end="drag=false">
                  <li v-for="img in newStopover.gallery">
                    <img :src="img.path" />
                    <b-form-input v-model="img.text" type="text" placeholder="Légende"></b-form-input>
                  </li>
                </draggable>
              </ul>
              <dropzone 
                id="dropzoneNew" 
                url="/admin/upload/image" 
                v-on:vdropzone-success="showSuccess"
                acceptedFileTypes="image/*"
                maxFileSizeInMB="20"
                ></dropzone>
              <b-button variant="primary" @click="createStopoverAction">Ajouter</b-button>
            </div>
          </b-collapse>
          <b-collapse id="collapseAdminEdit">
            <div id="editStepover">
              <p> <strong> Éditer une étape </strong> </p>
              <span>Titre :</span>
              <input type="text" id="editTitle" name="title" v-model="editStopover.title"></input>
              <br/>
              <p>Description :</p>
              <ckeditor v-model="editStopover.description" :config="config"></ckeditor>
              <p>Position GPS (latitude, longitude) :</p>
              <input type="text" name="startLat" v-model="editStopover.startLat"></input>
              <input type="text" name="startLng" v-model="editStopover.startLng"></input>
              <input type="hidden" id="id" name="id" v-model="editStopover.id"></input>
              <b-btn 
                v-b-toggle.collapseAdminEdit 
                variant="secondary" 
                @click="updateStopoverAction"
                >Éditer</b-btn>
              </div>
          </b-collapse>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Ckeditor from 'vue-ckeditor2'
import draggable from 'vuedraggable'
import Dropzone from 'vue2-dropzone'

export default {
  name: 'admin',
  data () {
    return {
      stopovers: [],
      currentAction: true,
      newStopover: {
        title: '',
        description: '',
        startLat: 0,
        startLng: 0,
        gallery: []
      },
      editStopover: {
        id: -1,
        title: '',
        description: '',
        startLat: 0,
        startLng: 0
      },
      editIndex: -1,
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
    this.$http.get('/stopover/list').then(response => {
      console.log(response.body)
      this.stopovers = response.body
    })
  },
  methods: {
    createStopoverAction: function () {
      this.$http.post(
        'admin/stopover/new',
         this.newStopover
      )
        .then(
          function (response) {
            this.stopovers = response.body
            this.newStopover.title = ''
          }
        )
    },
    editStopoverAction: function (el) {
      this.editIndex = el.currentTarget.getAttribute('data-index')
      console.log(this.editIndex)

      this.editStopover.id = this.stopovers[this.editIndex].id
      this.editStopover.title = this.stopovers[this.editIndex].title
      this.editStopover.description = this.stopovers[this.editIndex].description
      this.editStopover.startLat = this.stopovers[this.editIndex].startLat
      this.editStopover.startLng = this.stopovers[this.editIndex].startLng
    },
    deleteStopoverAction: function (index) {
      var id = this.stopovers[index].id
      var sorting = this.stopovers[index].sorting

      this.$http.post(
        'admin/stopover/delete',
        {
          id: id,
          sorting: sorting
        }
      )
        .then(
          function (response) {
            this.stopovers = response.body
          }
        )
    },
    updateStopoverAction: function () {
      this.$http.post(
        '/admin/stopover/update',
        this.editStopover
      )
        .then(
          function (response) {
            console.log(response)
            this.stopovers = response.body
            this.editStopover.id = -1
            this.editStopover.title = ''
            this.editStopover.description = ''
            console.log(response)
          }
        )
    },
    updateSorting: function (data) {
      console.log('Old index : ' + data.moved.oldIndex + ', new index : ' + data.moved.newIndex)
      this.$http.post(
        'admin/stopover/updateSorting',
        {
          newSorting: data.moved.newIndex,
          oldSorting: data.moved.oldIndex
        }
      )
        .then(
          function (response) {
            this.stopovers = response.body
          }
        )
    },
    'showSuccess': function (file, rawResponse) {
      console.log('A file was successfully uploaded')
      console.log(rawResponse)
      this.newStopover.gallery.push(
        {
          'path': '/' + rawResponse.path
        }
      )
    }
  },
  components: {
    Ckeditor,
    draggable,
    Dropzone
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
  .uploadGallery img {
      max-width: 200px;
      max-height: 200px;
  }
</style>
