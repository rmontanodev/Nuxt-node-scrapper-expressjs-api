<template>
  <v-app>
    <Navbar/>
    <v-content>
    <v-layout row wrap>
      <v-flex xs6><imgurl :imagensrc="Buscador"/></v-flex>
      <v-flex xs6> <h1>  </h1> </v-flex>

      </v-layout>
    </v-content>
  </v-app>
</template>

<script>
import Navbar from '../../components/Navbar'
// import imgurl from '../../components/imagen.vue'
// const axios = require('axios')
export default {
  name: 'productID',
  components: {
    Navbar
    },
  data () {
    return {
      enlace: ''
      //
    }
  }
  /* buscarcom () {
    axios
      .post(
        'http://localhost:3902/json/buscar',
        {
          modelo: this.buscar }
      )
      .then(res => {
        this.resultado = res.data
      })
  } */
}
</script>
