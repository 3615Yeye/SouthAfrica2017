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
            <new-stopover 
              :newStopover="newStopover"
              :ckeditorConfig="ckeditorConfig"
              :uploadOptions="uploadOptions"
              ></new-stopover>
          </b-collapse>
          <b-collapse id="collapseAdminEdit">
            <edit-stopover 
              :editStopover="editStopover"
              :ckeditorConfig="ckeditorConfig"
              :uploadOptions="uploadOptions"
              ></edit-stopover>
          </b-collapse>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Ckeditor from 'vue-ckeditor2'
import draggable from 'vuedraggable'
import newStopover from './admin/NewStopover'
import editStopover from './admin/EditStopover'

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
        startLng: 0,
        gallery: []
      },
      editIndex: -1,
      newStopoverTitle: '',
      newStopoverDescription: '',
      ckeditorConfig: {
        toolbar: [
          [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript' ]
        ],
        height: 300
      },
      uploadOptions: {
        url: '/admin/upload/image',
        paramName: 'file'
      }
    }
  },
  created: function () {
    // Getting the list of stopovers
    this.$http.get('/admin/stopover/list').then(response => {
      this.stopovers = response.body.stopovers
    })
  },
  methods: {
    editStopoverAction: function (el) {
      this.editIndex = el.currentTarget.getAttribute('data-index')
      console.log(this.editIndex)

      this.editStopover.id = this.stopovers[this.editIndex].id
      this.editStopover.title = this.stopovers[this.editIndex].title
      this.editStopover.description = this.stopovers[this.editIndex].description
      this.editStopover.startLat = this.stopovers[this.editIndex].startLat
      this.editStopover.startLng = this.stopovers[this.editIndex].startLng
      this.editStopover.gallery = this.stopovers[this.editIndex].gallery
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
    }
  },
  components: {
    Ckeditor,
    draggable,
    newStopover,
    editStopover
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
