<template>
  <v-app>
    <Usernavbar/>
    <v-content>
      <Buscador/>
    </v-content>
  </v-app>
</template>

<script>
import Buscador from "../components/Buscador";
import Usernavbar from "../components/user-navbar";
const axios = require("axios");
export default {
  data() {
    return {};
  },
  name: "App",
  components: {
    Buscador,
    Usernavbar
  },
  methods: {
    getsession() {
      this.$store.dispatch("getSession");
    },
    ProdRepe() {
      return this.$store.getters.getProductorepe;
    }
  },
  mounted() {
    this.getsession();
    this.ProdRepe();
  }
};
</script>
