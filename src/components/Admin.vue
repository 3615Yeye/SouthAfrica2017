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
          <div v-for="(stopover, indexB) of stopovers">
            <p><b> {{ stopover.sorting }} {{ stopover.title }} </b></p>
            <p v-html="stopover.description"></p>
            <b-button variant="secondary" :data-index="indexB" @click="editStopoverAction"> Éditer </b-button>
            <b-button variant="danger" :data-id="stopover.id" @click="deleteStopoverAction(indexB)"> Supprimer </b-button>
          </div>
          </draggable>
        </div>
        <div class="col-6">

          <div id="createStepover" v-show="currentAction">
            <p> <strong> Ajouter une étape </strong> </p>
            <span>Titre :</span>
            <input type="text" id="title" name="title" v-model="newStopover.title"></input>
            <br/>
            <p>Description :</p>
            <ckeditor v-model="newStopover.description" :config="config"></ckeditor>
            <p>Gallerie photos :</p>
            <dropzone id="myVueDropzone" url="/admin/upload" maxFileSizeInMB="20" v-on:vdropzone-success="showSuccess">
              <input type="hidden" name="token" value="xxx">
            </dropzone>
            <b-button variant="primary" @click="createStopoverAction">Ajouter</b-button>
          </div>
          <div id="editStepover">
            <p> <strong> Éditer une étape </strong> </p>
            <span>Titre :</span>
            <input type="text" id="editTitle" name="title" v-model="editStopover.title"></input>
            <br/>
            <p>Description :</p>
            <ckeditor v-model="editStopover.description" :config="config"></ckeditor>
            <input type="hidden" id="id" name="id" v-model="editStopover.id"></input>
            <b-button @click="updateStopoverAction">Éditer</b-button>
          </div>
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
        description: ''
      },
      editStopover: {
        id: -1,
        title: '',
        description: ''
      },
      editIndex: -1,
      newStopoverTitle: '',
      newStopoverDescription: '',
      config: {
        toolbar: [
          [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript' ]
        ],
        height: 300
      },
      options: {
        dropzoneSelector: 'ul',
        draggableSelector: 'li',
        excludeOlderBrowsers: true,
        multipleDropzonesItemsDraggingEnabled: false,
        onDrop: function (event) { console.log(event) },
        onDragstart: function (event) { console.log(event) }
      }
    }
  },
  created: function () {
    // Getting the list of stopovers
    this.$http.get('stopover/list').then(response => {
      console.log(response.body)
      this.stopovers = response.body
    })
  },
  methods: {
    createStopoverAction: function () {
      this.$http.post(
        'admin/stopover/new',
        {
          title: this.newStopover.title,
          description: this.newStopover.description
        }
      )
        .then(
          function (response) {
            this.stopovers = response.body
            this.newStopover.title = ''
          }
        )
    },
    editStopoverAction: function (el) {
      this.editIndex = el.target.attributes[1].value

      this.editStopover.id = this.stopovers[this.editIndex].id
      this.editStopover.title = this.stopovers[this.editIndex].title
      this.editStopover.description = this.stopovers[this.editIndex].description
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
            this.newStopoverTitle = ''
            this.newStopoverDescription = ''
          }
        )
    },
    updateStopoverAction: function () {
      this.$http.post(
        'admin/stopover/update',
        {
          id: this.editStopover.id,
          title: this.editStopover.title,
          description: this.editStopover.description
        }
      )
        .then(
          function (response) {
            this.stopovers = response.body
            this.editStopover.id = -1
            this.editStopover.title = ''
            this.editStopover.description = ''
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
    'showSuccess': function (file) {
      console.log('A file was successfully uploaded')
      console.log(file)
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
</style>
