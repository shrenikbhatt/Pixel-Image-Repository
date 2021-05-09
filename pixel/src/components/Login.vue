<template>
  <v-dialog v-model="dialog" persistent max-width="600px" min-width="360px">
    <div>
      <v-tabs v-model="tab" show-arrows background-color="purple accent-4" icons-and-text dark grow>
          <v-tabs-slider color="purple darken-4"></v-tabs-slider>
          <v-tab v-for="i in tabs" :key="tabs[i]">
              <v-icon large>{{ i.icon }}</v-icon>
              <div class="caption py-1">{{ i.name }}</div>
          </v-tab>
          <v-tab-item>
              <v-card class="px-4">
                  <v-card-text>
                      <v-form ref="loginForm" v-model="valid" lazy-validation>
                          <v-row>
                              <v-col cols="12">
                                  <v-text-field v-model="loginUsername" :rules="loginUsernameRules" label="Username" required></v-text-field>
                              </v-col>
                              <v-col cols="12">
                                  <v-text-field v-model="loginPassword" :append-icon="show1?'eye':'eye-off'" :rules="[rules.required, rules.min]" :type="show1 ? 'text' : 'password'" name="input-10-1" label="Password" hint="At least 8 characters" counter @click:append="show1 = !show1"></v-text-field>
                              </v-col>
                              <v-col class="d-flex" cols="12" sm="6" xsm="12">
                              </v-col>
                              <v-spacer></v-spacer>
                              <v-col class="d-flex" cols="12" sm="3" xsm="12" align-end>
                                  <v-btn x-large block :disabled="!valid" color="purple" dark @click="validate"> Login </v-btn>
                              </v-col>
                          </v-row>
                      </v-form>
                  </v-card-text>
              </v-card>
          </v-tab-item>
          <v-tab-item>
              <v-card class="px-4">
                  <v-card-text>
                      <v-form ref="registerForm" v-model="valid" lazy-validation>
                          <v-row>
                              <v-col>
                                  <v-text-field v-model="username" :rules="usernameRules" label="Username" required></v-text-field>
                              </v-col>
                              <v-col cols="12">
                                  <v-text-field v-model="password" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :rules="[rules.required, rules.min]" :type="show1 ? 'text' : 'password'" name="input-10-1" label="Password" hint="At least 8 characters" counter @click:append="show1 = !show1"></v-text-field>
                              </v-col>
                              <v-col cols="12">
                                  <v-text-field block v-model="verify" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :rules="[rules.required, passwordMatch]" :type="show1 ? 'text' : 'password'" name="input-10-1" label="Confirm Password" counter @click:append="show1 = !show1"></v-text-field>
                              </v-col>
                              <v-spacer></v-spacer>
                              <v-col class="d-flex ml-auto" cols="12" sm="3" xsm="12">
                                  <v-btn x-large block :disabled="!valid" color="purple" dark @click="validate">Register</v-btn>
                              </v-col>
                          </v-row>
                      </v-form>
                  </v-card-text>
              </v-card>
          </v-tab-item>
      </v-tabs>
    </div>
  </v-dialog>
</template>

<script>
  // import axios from 'axios';
  export default {
    name: 'Login',

    computed: {
    passwordMatch() {
      return () => this.password === this.verify || "Password must match";
    }
  },
  methods: {
    validate() {
      if (this.$refs.loginForm.validate()) {
        let username = this.loginUsername;
        let password = this.loginPassword;
        this.$store
            .dispatch("login", { username, password })
            .then(() => this.$router.push("/"))
            .catch(err => console.log(err));
        // const body = {
        //   username: this.loginUsername,
        //   password: this.loginPassword
        // }
        // axios.post('http://localhost:3000/login/', body)
        // .then((result) => {
        //   localStorage.token = result.data.token;
        // })
        // .catch((err)=> {
        //   console.log(err)}
        // );
      }
      else if (this.$refs.registerForm.validate()) {
        let username = this.username;
        let password = this.password;
        this.$store
            .dispatch("register", { username, password })
            .then(() => this.$router.push("/"))
            .catch(err => console.log(err));
        // const body = {
        //   username: this.username,
        //   password: this.password
        // }
        // // console.log("here")
        // axios.post('http://localhost:3000/users/', body)
        // .then((result) => {
        //   localStorage.token = result.data.token;
        // })
        // .catch((err)=> {
        //   console.log(err)}
        // );
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    }
  },
  data: () => ({
    dialog: true,
    tab: 0,
    tabs: [
        {name:"Login", icon:"mdi-account"},
        {name:"Register", icon:"mdi-account-outline"}
    ],
    valid: true,
    
    username: "",
    password: "",
    verify: "",
    loginPassword: "",
    loginUsername: "",
    loginUsernameRules: [
      v => !!v || "Required",
      v => v.length >= 4 || "Username must be more than 4 characters",
      v => v.length < 50 || "Username must be less than 50 characters"
    ],
    usernameRules: [
      v => !!v || "Required",
      v => v.length >= 4 || "Username must be more than 4 characters",
      v => v.length < 50 || "Username must be less than 50 characters"
    ],

    show1: false,
    rules: {
      required: value => !!value || "Required.",
      min: v => (v && v.length >= 8) || "Min 8 characters"
    }
  })
  }
</script>
