<template>
  <v-app>
    <Navbar/>
    <v-container fill-height>
        <Login/>
    </v-container>
  </v-app>
</template>

<script>
import Navbar from '../../components/Navbar'
import Login from '../../components/Login'
// const axios = require('axios')
export default {
  name: 'App',
  components: {
    Navbar,
    Login
  },
  data () {
    return {
      newuser: false
    }
  }
}
</script>
