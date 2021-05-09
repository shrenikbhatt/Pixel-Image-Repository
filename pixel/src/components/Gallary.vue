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
          label="Search tag here"
          prepend-icon="mdi-magnify"
          single-line
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
          <span>Insert new Image</span>
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
        class="overflow-y-auto"
        max-height="600"
      >
        <v-container style="height: 1500px;">
          <v-row>
            <v-col
              v-for="n in images.length"
              :key="n-1"
              class="d-flex child-flex"
              cols="4"
            >
              <!-- <v-img
                :src="`https://picsum.photos/500/300?image=${n * 5 + 10}`"
                :lazy-src="`https://picsum.photos/10/6?image=${n * 5 + 10}`"
                aspect-ratio="1"
                class="grey lighten-2"
              > -->
              <v-img
                :src="images[n-1]"
                aspect-ratio="1"
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
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">
          Use Google's location service?
        </v-card-title>

        <v-card-text>
          Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            Disagree
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            Agree
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
      }
    },

    data: () => ({
      images: [],
      length: 0,
      dialog: false,
    }),
  }
</script>
