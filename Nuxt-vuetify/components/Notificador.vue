<template>
  <v-flex xs12 sm8>
    <v-layout>
      <v-flex xs1>
        <v-text-field
          v-model="precio"
          v-if="vamos && !eror && getloged"
          label="Mas bajo de:"
          type="text"
          :error="comprobacion"
          v-on:keyup="CheckPrice"
        ></v-text-field>
        <v-text-field
          v-model="precio"
          v-if="(vamos && eror)"
          v-on:keyup="CheckPrice"
          :error-messages="error"
        ></v-text-field>
      </v-flex>
      <v-flex xs1>
        <v-dialog width="500">
          <template v-slot:activator="{ on }">
            <v-btn :disabled="eror" v-on="on" :color="color" v-show="vamos && ready">Avisame!</v-btn>
          </template>
          <v-card>
            <v-card-title class="headline grey lighten-2" primary-title>Confirmación</v-card-title>

            <v-card-text>Si aceptas se enviara un correo cuando baje el precio de {{precio}}</v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="success" flat v-on:click="Notificar(getToken)">Confirmo</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
      </v-flex>
    </v-layout>
  </v-flex>
</template>
<script>
var axios = require("axios");
export default {
  data() {
    return {
      error: "",
      eror: false,
      modal: false,
      color: "warning",
      ready: false,
      comprobacion: false,
      repetido: false,
      snackbar: false,
      y: "bottom",
      x: null,
      mode: "",
      timeout: 0,
      text: ""
    };
  },
  props: ["preciomin", "vamos", "precio", "producto", "modelo"],
  methods: {
    CheckPrice() {
      let onlynumbers = /^[-+]?[0-9]*(\.|,)?[0-9]+$/;
      if (onlynumbers.test(this.precio)) {
        if (this.preciomin < this.precio) {
          this.error = "El precio no debe ser superior al producto";
          this.eror = true;
        } else if (this.precio < this.preciomin && this.precio > 0) {
          this.eror = false;
          this.ready = true;
        } else if (this.precio < this.preciomin && this.precio < 0.01) {
          this.error = "No puede ser inferior a 0.01";
          this.eror = true;
        }
        this.comprobacion = false;
      } else if (!onlynumbers.test(this.precio)) {
        this.error = "Debes introducir numeros";
        this.comprobacion = true;
        this.precio = "";
        this.eror = true;
      }
    },
    Notificar(token) {
      axios
        .post("http://localhost:3902/deseado", {
          token: token,
          modelo: this.producto,
          precio: this.precio
        })
        .then(res => {
          console.log(res.data);
          if (res.data == false) {
            this.text =
              "Ya tienes este producto en tu lista de avisos, si quieres cambiar el precio puedes hacerlo desde el panel de control";
            this.snackbar = true;
          } else {
            this.text = "Producto añadido!";
            this.snackbar = true;
            this.ProductoAdd({
              img: "http://localhost:3902/imagenes/" + this.producto + ".jpg",
              precioCliente: this.precio,
              precio: this.preciomin,
              modelo: this.modelo
            });
            sessionStorage.setItem(
              "session",
              JSON.stringify({
                email: this.getemail,
                imgAvatar: this.getimgAvatar,
                productos: this.getProductos,
                token: this.getToken,
                userid: this.getUserId
              })
            );
          }
          console.log(this.snackbar);
          this.ProductoRepe(res.data);
        });
    },
    ProductoRepe(data) {
      this.$store.dispatch("setRepeProduct", data);
    },
    ProductoAdd(data) {
      this.$store.dispatch("addProd", data);
    }
  },
  computed: {
    getToken() {
      return this.$store.getters.getToken;
    },
    getloged() {
      return this.$store.getters.getLogin;
    },
    getemail() {
      return this.$store.getters.getEmail;
    },
    getimgAvatar() {
      return this.$store.getters.getimgAvatar;
    },
    getProductos() {
      return this.$store.getters.getProductos;
    },
    getUserId() {
      return this.$store.getters.getUserId;
    }
  }
};
</script>
<style>
</style>