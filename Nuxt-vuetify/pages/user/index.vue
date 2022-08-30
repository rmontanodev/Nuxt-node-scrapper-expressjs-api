<template>
  <v-app>
    <Usernavbar/>
    <v-container bg fill-height grid-list-md text-xs-center>
      <v-layout row wrap align-center>
        <v-flex xs4 sm-left>
          <Userdata/>
        </v-flex>
        <v-flex xs8 xs-right>
          <ListaAvisos/>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import Usernavbar from "../../components/user-navbar";
import Userdata from "../../components/user-data";
import ListaAvisos from "../../components/ListaAvisos";
const axios = require("axios");
export default {
  name: "App",
  components: {
    Usernavbar,
    Userdata,
    ListaAvisos
  },
  methods: {
    Redirigit() {
      if (this.getLogin == false) {
        this.$router.push("/");
      }
    }
  },
  computed: {
    getLogin() {
      return this.$store.getters.getLogin;
    }
  },
  mounted() {
    this.Redirigit();
  }
};
</script>
