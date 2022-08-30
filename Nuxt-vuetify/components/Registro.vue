<template>
<v-layout justify-center>
      <v-flex xs12 md7>
  <v-card>
      <v-container> 
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
  >
    <v-text-field
      v-model="name"
      :counter="30"
      :rules="[rulemail.nombrevalido]"
      label="Nombre"
      required
    ></v-text-field>
    <v-text-field
      v-model="apellido"
      label="apellido"
      :rules="[rulemail.apellidovalido]"
      required
    ></v-text-field>
    <v-text-field
      v-model="email"
      label="E-mail"
      :rules="[rulemail.emailvalido]"
      required
    ></v-text-field>

    <v-checkbox
      v-model="valid"
      :rules="[v => !!v || 'You must agree to continue!']"
      label="Do you agree?"
      required
    ></v-checkbox>

    <v-btn
      :disabled="!valid && !clicked"
      color="info"
      v-on:click="registrame"
      :loading="valid && loading"
    >
      Registrame!
    </v-btn>
  </v-form>
      </v-container>
  </v-card>
<div :v:if="newuser"><v-alert
      :value="newuser"
      color="success"
      transition="scale-transition"
    >
      {{msg}}
    </v-alert></div>
    <div v:else>
    <v-alert 
      :value="newuser"
      color="danger"
      transition="scale-transition"
    >
      {{msg}}
    </v-alert>
    </div>
  </v-flex>
</v-layout>
</template>
<script>
var axios = require('axios')
export default {
  data () {
    return {
      msg: '',
      newuser: false,
      loading: false,
      name: '',
      apellido: '',
      email: '',
      password: '',
      valid: Boolean,
      show1: false,
      clicked: false,
      rulemail: {
        emailvalido (email) {
          if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            return true
          }
          return 'Debes introducir un email valido'
        },
        nombrevalido (name) {
          if (/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(name)) {
            return true
          }
          return 'Introduce un nombre valido'
        },
        apellidovalido (apellido) {
          if (/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(apellido)) {
            return true
          }
          return 'Introduce un apellido valido'
        }
      }
    }
  },
  methods: {
    registrame () {
      this.loading = true
      axios.post('http://localhost:3902/registrame', {
        nombre: this.name,
        apellido: this.apellido,
        email: this.email
      }).then((response, err) => {
        this.loading = true
        if (err) {
          console.log('Algo ha ido mal')
        } else {
          if (response.data.respuesta === 1) {
            this.newuser = true
            this.loading = false
            this.clicked = true
            this.msg = 'Se te ha enviado un enlace, confirma el correo'
          } else {
            this.loading = false
            this.msg = 'Correo ya registrado'
            console.log('Usuario ya registrado')
          }
        }
      })
    }
  }
}
</script>
<style>

</style>
