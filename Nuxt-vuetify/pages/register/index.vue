<template>
  <v-app>
    <Usernavbar/>
    <v-container fill-height>
      <Registro v-if="!isloged"/>
    </v-container>
  </v-app>
</template>

<script>
import Usernavbar from "../../components/user-navbar";
import Registro from "../../components/Registro";
// const axios = require('axios')
export default {
  name: "App",
  components: {
    Usernavbar,
    Registro
  },
  data() {
    return {
      respuesta: []
    };
  },
  computed: {
    isloged() {
      return this.$store.getters.getLogin;
    }
  }
};
</script>
