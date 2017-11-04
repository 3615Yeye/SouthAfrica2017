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
        <div class="col-3 stopovers">
          <b-card-group>
            <draggable v-model="stopovers" :options="{group:'people'}" v-on:change="updateSorting" @start="drag=true" @end="drag=false">
            <b-card
                       :title="stopover.title"
                       v-for="(stopover, index) of stopovers"
                       class="stopover-item"
                       >
                       <p class="card-text" v-html="stopover.description"></p>
                         <b-link
                            variant="secondary"
                            @click="editStopoverAction(index)"
                            >
                            <icon name="pencil"></icon>
                            Éditer
                         </b-link>
                           <b-link
                            variant="danger"
                            :data-id="stopover.id"
                            @click="deleteStopoverAction(index)"
                            >
                            <icon name="trash-o"></icon>
                            Supprimer
                           </b-link>
            </b-card>
            </draggable>
          </b-card-group>
        </div>
        <div class="col-9">
          <p>
          <b-btn
            v-b-toggle.collapseAdminCreate
             @click="closeEditStopover"
            variant="primary"
            >
            <span class="when-opened"><icon name="minus"></icon></span>
            <span class="when-closed"><icon name="plus"></icon></span>
            Ajouter une étape
          </b-btn>
          </p>

          <b-collapse
            id="collapseAdminCreate"
            v-model="showNewStopover"
            >
            <new-stopover
                      @update:stopoversList="updateStopoversList"
                      :newStopover="newStopover"
                      :ckeditorConfig="ckeditorConfig"
                      :uploadOptions="uploadOptions"
                      ></new-stopover>
          </b-collapse>
          <b-collapse
            id="collapse-admin-edit"
            v-model="showEditStopover"
            >
            <edit-stopover
                      @update:stopoversList="updateStopoversList"
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
        gallery: [],
        polyline: ''
      },
      editStopover: {
        id: -1,
        title: '',
        description: '',
        startLat: 0,
        startLng: 0,
        gallery: [],
        polyline: ''
      },
      editIndex: -1,
      showNewStopover: false,
      showEditStopover: false,
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
    updateStopoversList: function () {
      this.$http.get('/admin/stopover/list').then(response => {
        this.stopovers = response.body.stopovers
      })
    },
    editStopoverAction: function (index) {
      this.showNewStopover = false
      this.showEditStopover = true

      this.editIndex = index
      this.editStopover.id = this.stopovers[index].id
      this.editStopover.title = this.stopovers[index].title
      this.editStopover.description = this.stopovers[index].description
      this.editStopover.startLat = this.stopovers[index].startLat
      this.editStopover.startLng = this.stopovers[index].startLng
      this.editStopover.gallery = this.stopovers[index].gallery
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
    },
    closeEditStopover: function () {
      this.showEditStopover = false
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
<style>
#admin {
  height: 100%;
  margin: 0px;
}
.stopover-item {
  text-align: left;
  padding: 1rem;
}
.stopovers {
  overflow-y: scroll;
}
#create-stopover, #edit-stopover {
  padding: 1rem;
  border: solid #f7f7f9;
}
.collapsed > .when-opened,
:not(.collapsed) > .when-closed {
  display: none;
}
.gallery-upload {
  border: solid #f7f7f9;
  text-align: center;
  padding-top: 1rem;
  margin-bottom: 1rem;
}
</style>
