<template>
  <div class="admin">
    <h2> Admin </h2>
    <h3>Étapes</h3>
    <div class="leftColumn">
      <draggable v-model="stopovers" :options="{group:'people'}" v-on:change="updateSorting" @start="drag=true" @end="drag=false">
        <div v-for="(stopover, indexB) of stopovers">
          <p><b> {{ stopover.sorting }} {{ stopover.title }} </b></p>
          <p v-html="stopover.description"></p>
          <button :data-index="indexB" @click="editStopoverAction"> Éditer </button>
          <button :data-id="stopover.id" @click="deleteStopoverAction(indexB)"> Supprimer </button>
        </div>
      </draggable>
  </div>
    <div class="rightColumn">

      <div id="createStepover">
        <p> <strong> Ajouter une étape </strong> </p>
        <span>Titre :</span>
        <input type="text" id="title" name="title" v-model="newStopover.title"></input>
        <br/>
        <p>Description :</p>
        <ckeditor v-model="newStopover.description" :config="config"></ckeditor>
        <!--
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
        -->
        <button @click="createStopoverAction">Ajouter</button>
      </div>
      <div id="editStepover">
        <p> <strong> Éditer une étape </strong> </p>
        <span>Titre :</span>
        <input type="text" id="editTitle" name="title" v-model="editStopover.title"></input>
        <br/>
        <p>Description :</p>
        <ckeditor v-model="editStopover.description" :config="config"></ckeditor>
        <input type="hidden" id="id" name="id" v-model="editStopover.id"></input>
        <button @click="updateStopoverAction">Éditer</button>
      </div>
    </div>
  </div>
</template>

<script>
import Ckeditor from 'vue-ckeditor2'
import draggable from 'vuedraggable'

export default {
  name: 'admin',
  data () {
    return {
      stopovers: [],
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
    }
  },
  components: {
    Ckeditor,
    draggable
  }
}
  </script>

  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  .leftColumn {
    width: 45%;
    display: inline-block;
  }
  .rightColumn {
    width: 45%;
    float: right;
    display: inline-block;
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
