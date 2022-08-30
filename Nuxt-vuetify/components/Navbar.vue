<template>
  <v-toolbar dark color="primary">
    <v-toolbar-title class="white--text">
      <user/>
    </v-toolbar-title>

    <v-spacer></v-spacer>
    <nuxt-link to="/">
      <v-btn icon>
        <v-icon>home</v-icon>
      </v-btn>
    </nuxt-link>

    <nuxt-link to="/register">
      <v-btn icon>
        <v-icon>fas fa-user-plus</v-icon>
      </v-btn>
    </nuxt-link>
    <nuxt-link to="/login">
      <v-btn icon>
        <v-icon>fas fa-sign-in-alt</v-icon>
      </v-btn>
    </nuxt-link>
  </v-toolbar>
</template>
<script>
import user from "./User-navbar";
export default {
  components: {
    user
  }
};
</script>
<style>
</style>