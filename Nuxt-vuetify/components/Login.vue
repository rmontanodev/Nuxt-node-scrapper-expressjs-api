<template>
  <v-layout justify-center>
    <v-flex md5>
      <v-card>
        <v-container>
          <v-form v-model="valid" ref="form">
            <v-text-field v-model="email" label="E-mail" :rules="[rulemail.emailvalido]" required></v-text-field>
            <v-text-field
              v-model="password"
              :type="show1 ? 'text' : 'password'"
              label="password"
              :rules="[rulpassword.passwordvalido]"
              :counter="50"
              v-on:keyup.enter="handleLogin"
              required
            ></v-text-field>
            <v-btn :disabled="!valid" color="success" v-on:click="handleLogin">Entrar!</v-btn>
            <v-dialog :value="logerror" width="500">
              <v-card>
                <v-card-title class="headline grey lighten-2" primary-title>Failed</v-card-title>
                <v-card-text>Usuario y/o contraseña erroneo</v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" flat @click="logerror = false">I accept</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-form>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
var axios = require("axios");
var jwt = require("jsonwebtoken");
export default {
  data() {
    return {
      name: "",
      apellido: "",
      email: "",
      password: "",
      valid: false,
      show1: false,
      logerror: false,
      rulemail: {
        emailvalido(email) {
          if (
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
              email
            )
          ) {
            return true;
          }
          return "Debes introducir un email valido";
        }
      },
      rulpassword: {
        passwordvalido(password) {
          if (/.{5,50}/.test(password)) {
            return true;
          }
          return "At least 5 caracters";
        }
      }
    };
  },
  methods: {
    loginSession: function(data) {
      this.$store.dispatch("loginSession", data);
    },
    async handleLogin() {
      try {
        const { data } = await axios.post("http://localhost:3902/login", {
          email: this.email,
          password: this.password
        });
        if (data.login === false) {
          this.logerror = true;
        } else {
          this.$router.push("/user");
          this.loginSession(data);
        }
      } catch (err) {
        console.log(err);
        console.log("=D");
      }
    },
    getsession() {
      this.$store.dispatch("getSession");
    }
  },
  mounted() {
    this.getsession();
  }
};
</script>
<style>
</style>
