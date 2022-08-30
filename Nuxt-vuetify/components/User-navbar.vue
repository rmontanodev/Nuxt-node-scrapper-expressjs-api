<template>
  <v-toolbar dark color="primary">
    <v-toolbar-title class="white--text">
      <v-flex v-if="isloged">
        <nuxt-link to="/user">
          <v-btn icon>
            <v-avatar>
              <img :src="imgAvatar">
            </v-avatar>
          </v-btn>
        </nuxt-link>
        {{email}}
      </v-flex>
      <v-flex v-else>
        <div>Nombre pagina</div>
      </v-flex>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <div v-if="isloged">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <nuxt-link to="/">
            <v-btn icon>
              <v-icon v-on="on">home</v-icon>
            </v-btn>
          </nuxt-link>
        </template>
        <span>Home</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on:click="handleLogout">
            <v-icon v-on="on">fas fa-sign-out-alt</v-icon>
          </v-btn>
        </template>
        <span>Logout</span>
      </v-tooltip>
    </div>
    <div v-else>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <nuxt-link to="/">
            <v-btn icon>
              <v-icon v-on="on">home</v-icon>
            </v-btn>
          </nuxt-link>
        </template>
        <span>Home</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <nuxt-link to="/register">
            <v-btn icon>
              <v-icon v-on="on">fas fa-user-plus</v-icon>
            </v-btn>
          </nuxt-link>
        </template>
        <span>Register</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <nuxt-link to="/login">
            <v-btn icon>
              <v-icon v-on="on">fas fa-sign-in-alt</v-icon>
            </v-btn>
          </nuxt-link>
        </template>
        <span>Login</span>
      </v-tooltip>
      <nuxt-link to="/search_live">
        <v-btn icon>
          <v-icon>fas fa-sign-in-alt</v-icon>
        </v-btn>
      </nuxt-link>
    </div>
  </v-toolbar>
</template>

<script>
var axios = require("axios");
export default {
  methods: {
    handleLogout() {
      this.$store.dispatch("logoutSession");
    },
    getsession() {
      this.$store.dispatch("getSession");
    }
  },
  mounted() {
    this.getsession();
  },
  computed: {
    isloged() {
      return this.$store.getters.getLogin;
    },
    imgAvatar() {
      return this.$store.getters.getimgAvatar;
    },
    email() {
      return this.$store.getters.getEmail;
    }
  }
};
</script>

<style>
</style>
