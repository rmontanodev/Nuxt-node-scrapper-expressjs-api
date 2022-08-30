<template>
  <v-app>
    <Navbar/>
    <v-content>
      <Buscador/>

    </v-content>
  </v-app>
</template>

<script>
/* eslint-disable */
import Buscador from '../components/Buscador'
import Navbar from '../components/Navbar'
// const axios = require('axios')
export default {
  name: 'App',
  components: {
    Buscador,
    Navbar
  },
  data () {
    return {
      respuesta: []
    }
  }
}
</script>
