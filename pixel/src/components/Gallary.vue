<template>
  <v-container>
    <v-card class="overflow-hidden">
      <v-app-bar
        absolute
        color="purple accent-4"
        dark
        elevate-on-scroll
        scroll-target="#scrolling-techniques-7"
      >
        <v-toolbar-title>Welcome {{username}}</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-text-field
          v-model="search"
          label="Search tag here"
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
      <v-sheet
        id="scrolling-techniques-7"
        class="overflow-y-auto pt-14"
        max-height="600"
      >
        <v-container>
          <v-row>
            <v-col
              v-for="n in images.length"
              :key="n-1"
              class="d-flex child-flex"
              cols="4"
            >
              <v-img
                :src="images[n-1]"
                max-height="500"
                max-width="500"
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
            </v-col>
          </v-row>
        </v-container>
      </v-sheet>
    </v-card>
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
  </v-container>
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
        this.$http.get('http://localhost:3000/images')
        .then(response => {
          this.images = []
          response.data.forEach(item => {
            this.images.push(item.path);
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
          this.$http.post('http://localhost:3000/images/tag', body)
            .then(response => {
              this.images = []
              response.data.forEach(item => {
                this.images.push(item.path);
            });
          })
        }
      }
    },

    data: () => ({
      search: '',
      images: [],
      length: 0,
      dialog: false,
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
