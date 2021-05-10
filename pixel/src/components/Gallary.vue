<template>
  <div>
    <v-app-bar
      color="purple accent-4"
      dark
    >
      <v-toolbar-title>Welcome {{username}}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-text-field
        class="pt-5"
        v-model="search"
        label="Search tag here and press enter"
        prepend-icon="mdi-magnify"
        single-line
        @keydown.enter="getTaggedImages"
      ></v-text-field>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            @click.stop="dialog = true"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          </template>
        <span>Add Image</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            @click="logout"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-logout</v-icon>
          </v-btn>
          </template>
        <span>Logout</span>
      </v-tooltip>
    </v-app-bar>
    <v-container>
      <v-row>
        <v-col
          v-for="n in images.length"
          :key="n-1"
          class="d-flex child-flex"
          cols="4"
          @click="selectImage(n-1)"
        >
          <v-hover
            v-slot="{ hover }"
          >
            <v-card
              class="justify-center align-center"
              :elevation="hover ? 10 : 2"
            >
              <v-img
                :src="images[n-1].path"
                contain
                height="200"
                width="400"
                class="grey lighten-2"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey lighten-5"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="340"
    >
      <v-card>
        <v-card-title class="headline">
          Upload New Image
        </v-card-title>

        <v-card-text>
            <v-form ref="insertForm" v-model="valid" lazy-validation>
                <v-row>
                    <v-col cols="12">
                        <v-text-field v-model="fileName" :rules="[rules.required]" label="File Name" required></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model="tags" label="tags (seperated by comma)" :rules="[rules.required]" required></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-file-input
                        v-model="file"
                        accept="image/*"
                        label="File input"
                        :rules="[rules.required]"
                      ></v-file-input>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="red darken-1"
            text
            @click="reset"
          >
            Cancel
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            :disabled="!valid"
            @click="insertImage"
          >
            Upload
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog2"
      v-if="image"
      max-width="800"
    >
      <v-card
        class="mx-auto"
        max-width="800"
      >
        <v-img
          contain
          :src="image.path"
        ></v-img>

        <v-card-title class="justify-center">
          {{image.name}}
        </v-card-title>

        <v-card-subtitle class="text-center">
          <v-chip
            color="purple"
            class="ma-2"
            outlined
            v-for="k in image.tags.length" :key="k"
          >
            {{image.tags[k-1]}}
          </v-chip>
        </v-card-subtitle>

        <v-card-actions>
          <v-btn
            dark
            color="purple accent-4"
            @click.stop="dialog2=false"
          >
            Close
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            dark
            color="red accent-4"
            @click="deleteImage()"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Gallary',

    mounted(){
      this.getImages();
    },

    computed: {
      username: function(){
        return this.$store.getters.username
      },
    },

    methods: {
      getImages() {
        this.$http.get('/images')
        .then(response => {
          this.images = []
          response.data.forEach(item => {
            this.images.push(item);
          });
        })
      },
      logout() {
        this.$store
          .dispatch("logout")
          .then(() => this.$router.push("/login"))
          .catch(err => console.log(err));
      },
      insertImage(){
        if(this.$refs.insertForm.validate()){
          let tags = this.tags.split(',').map(item => item.trim());
          let fileName = this.fileName;
          let file = this.file
          let formData = new FormData();
          formData.append('fileName', fileName);
          formData.append('tags', JSON.stringify(tags));
          formData.append('file', file);
          this.$store
            .dispatch('insertImage', formData)
            .then(() => {
              this.getImages()
            })
            .catch(err => console.log(err));
          this.reset();
        }
      },
      reset() {
        this.dialog = false;
        this.$refs.insertForm.reset();
        this.$refs.insertForm.resetValidation();
      },
      getTaggedImages(){
        if(this.search == ''){
          this.getImages();
        }
        else{
          let body = {
            tag: this.search
          }
          this.$http.post('/images/tag', body)
            .then(response => {
              this.images = []
              response.data.forEach(item => {
                this.images.push(item);
            });
            
          })
        }
      },
      selectImage(key){
        this.$http.get('/images/'+this.images[key].image_id)
          .then(response => {
            this.image = response.data
            this.dialog2 = true
          })
          .catch(err => console.log(err))
      },
      deleteImage(){
        this.$http.delete('/images/'+this.image.image_id)
        .then(() => {
          this.images = this.images.filter((item) => {
            return item.image_id != this.image.image_id;
          })
        })
        .catch(err => {
          console.log(err)
        });
        this.dialog2=false
      }
    },

    data: () => ({
      search: '',
      images: [],
      image: null,
      length: 0,
      dialog: false,
      dialog2: false,
      tags: '',
      fileName: '',
      file: null,
      valid: true,
      rules: {
        required: value => !!value || "Required.",
      }
    }),
  }
</script>
