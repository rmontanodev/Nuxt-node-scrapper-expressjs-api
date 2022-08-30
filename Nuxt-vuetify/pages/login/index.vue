<script src="../../../Crawlers/PcComponentes/PcComponentesantiguo.js"></script>
<template>
  <v-app>
    <Usernavbar/>
    <v-container fill-height>
        <Login/>
    </v-container>
  </v-app>
</template>

<script>
import Usernavbar from '../../components/user-navbar'
import Login from '../../components/Login'
/* eslint-disable */
// const axios = require('axios')
export default {
  name: 'App',
  components: {
    Usernavbar,
    Login
  },
  data () {
    return {
      newuser: false
    }
  }
}
</script>
