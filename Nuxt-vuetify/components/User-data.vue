<template>
  <v-card>
    <v-container v-if="getLogin">
      <h3 class="headline pa-2">Actualizar contraseña</h3>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="passwordan"
          :type="show1 ? 'text' : 'password'"
          label="Contraseña actual"
          required
        ></v-text-field>
        <v-text-field
          v-model="password"
          :type="show1 ? 'text' : 'password'"
          label="Nueva contraseña"
          :rules="[rulemail.passwordvalido]"
          required
        ></v-text-field>

        <v-text-field
          v-model="password2"
          :type="show1 ? 'text' : 'password'"
          label="Repite nueva contraseña"
          :rules="[passwordConfirmation]"
          required
        ></v-text-field>
        <v-btn :disabled="!valid" color="success" v-on:click="updatepasswd">Actualizar contraseña</v-btn>
      </v-form>
      <v-form ref="form" v-model="valid2" lazy-validation>
        <h3 class="headline ma-4">Actualizar email</h3>
        <v-text-field v-model="email" label="Nuevo E-mail" :rules="[rulemail.emailvalido]" required></v-text-field>
        <v-text-field
          v-model="passwordan2"
          :type="show1 ? 'text' : 'password'"
          label="Contraseña actual"
          required
        ></v-text-field>
        <v-btn :disabled="!valid2" color="success" v-on:click="updatemail">Actualizar email</v-btn>
      </v-form>
    </v-container>
    <v-snackbar
      :value="snackbar"
      :bottom="y === 'bottom'"
      :left="x === 'left'"
      :multi-line="mode === 'multi-line'"
      :right="x === 'right'"
      :timeout="timeout"
      :top="y === 'top'"
      :vertical="mode === 'vertical'"
    >
      {{ text }}
      <v-btn color="pink" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-card>
</template>
<script>
var axios = require("axios");
var sha1 = require("sha1");
export default {
  data() {
    return {
      passwordan: "",
      passwordan2: "",
      password2: "",
      password: "",
      email: "",
      valid: Boolean,
      snackbar: false,
      y: "bottom",
      x: null,
      mode: "",
      timeout: 0,
      text: "",
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
        },
        passwordvalido(password) {
          if (/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.test(password)) {
            return true;
          }
          return "Minimum eight characters, at least upper letter,lower letter and one number";
        }
      }
    };
  },
  methods: {
    updatepasswd() {
      axios
        .post("http://localhost:3902/updatepassword", {
          password: this.passwordan,
          newpasswd: this.password
        })
        .then(response => {
          this.snackbar = true;
          this.text = response.data.msg;
        });
    },
    updatemail() {
      axios
        .post("http://localhost:3902/updatemail", {
          email: this.email,
          password: this.passwordan2,
          emailantiguo: this.getemail
        })
        .then(response => {
          this.snackbar = true;
          this.text = response.data.msg;
          if (response.data.error === false) {
            this.Updatecorreo(this.email);
            sessionStorage.setItem(
              "session",
              JSON.stringify({
                email: this.email,
                imgAvatar: this.getimgAvatar,
                productos: this.getProductos,
                token: this.gettoken,
                userid: this.getUserId
              })
            );
          }
        });
    },
    Updatecorreo(data) {
      this.$store.dispatch("Updatemail", data);
    }
  },
  computed: {
    passwordConfirmation() {
      if (this.password2 === this.password) {
        return true;
      } else {
        return "No son la misma contraseña";
      }
    },
    getemail() {
      return this.$store.getters.getEmail;
    },
    getimgAvatar() {
      return this.$store.getters.getimgAvatar;
    },
    gettoken() {
      return this.$store.getters.getToken;
    },
    getProductos() {
      return this.$store.getters.getProductos;
    },
    getUserId() {
      return this.$store.getters.getUserId;
    },
    getLogin() {
      return this.$store.getters.getLogin;
    }
  }
};
</script>
<style>
</style>
