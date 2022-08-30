<template>
  <v-card>
    <v-list v-if="getLogin">
      <h3 class="headline ma-2">Lista de avisos</h3>
      <v-list-tile v-for="item in productoss.producto" :key="item.modelo" avatar>
        <v-list-tile-avatar>
          <img :src="item.img">
        </v-list-tile-avatar>
        <v-subheader>Modelo</v-subheader>
        <v-flex class="box" xs12 sm5 md4>
          <v-list-tile-content>
            <v-list-tile-title v-html="item.modelo"></v-list-tile-title>
          </v-list-tile-content>
        </v-flex>
        <v-subheader>Precio</v-subheader>
        <v-flex class="box" xs12 sm5 md4>
          <v-text-field
            v-model="item.precioCliente"
            :label="'Precio más bajo actual del producto: '+item.precio"
            :disabled="modificar"
            v-if="(!item.error)"
            @keydown="CheckPrice(productoss,item.precio,item.modelo,precio)"
            @keyup="CheckPrice(productoss,item.precio,item.modelo,precio)"
            :error="item.error"
          ></v-text-field>
          <v-text-field
            v-model="item.elprecio"
            v-if="(item.error)"
            @keydown="CheckPrice(productoss,item.precio,item.modelo,precio)"
            @keyup="CheckPrice(productoss,item.precio,item.modelo,precio)"
            :error-messages="item.errormsg"
          />
          <!-- {{item.precioCliente}} -->
        </v-flex>
        <!-- <v-subheader> Precio actual </v-subheader>
        <v-flex class="box" xs12 sm6 md1>
          {{item.precio}}
        </v-flex>-->
        <v-btn
          :disabled="eror"
          color="error"
          v-show="true"
          v-on:click="eliminaraviso(productoss,item.modelo)"
        >Eliminar aviso</v-btn>
      </v-list-tile>
    </v-list>
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
export default {
  data() {
    return {
      deseados: [],
      error: "",
      eror: false,
      sepuede: false,
      ready: false,
      modificar: true,
      snackbar: false,
      y: "bottom",
      x: null,
      mode: "",
      timeout: 0,
      text: ""
    };
  },
  methods: {
    changevalues(data) {
      this.$store.dispatch("modProd", data);
    },
    CheckPrice(productoss, preciomin, modelo, precio) {
      console.log(precio);
      let elprecio = parseFloat(this.precio);
      let minprice = preciomin;
      let onlynumbers = /[-+]?([0-9]*\.[0-9]+|[0-9]+)/;
      if (onlynumbers.test(parseFloat(this.precio))) {
        console.log(this.precio);
        if (elprecio > minprice) {
          console.log("YO TMB ENTRO");
          let a = [];
          a.push(true);
          a.push(
            "El precio no debe ser superior al precio minimo actual del producto"
          );
          productoss.producto.forEach((element, index) => {
            if (productoss.producto[index].modelo == modelo) {
              a.push(index);
              this.changevalues(a);
            }
          });
        } else if (elprecio < minprice && elprecio > 0) {
          console.log("ESTOY ENTRANDO LOCO");
          let a = [];
          a.push(false);
          a.push("");
          productoss.producto.forEach((element, index) => {
            if (productoss.producto[index].modelo == modelo) {
              a.push(index);
              this.changevalues(a);
            }
          });
          this.ready = true;
        } else if (elprecio < minprice && elprecio < 0.01) {
          let a = [];
          a.push(true);
          a.push("No puede ser inferior a 0.01");
          productoss.producto.forEach((element, index) => {
            if (productoss.producto[index].modelo == modelo) {
              a.push(index);
              this.changevalues(a);
            }
          });
        }
      } else if (!onlynumbers.test(elprecio)) {
        let a = [];
        a.push(true);
        a.push("Debes introducir numeros");
        productoss.producto.forEach((element, index) => {
          if (productoss.producto[index].modelo == modelo) {
            a.push(index);
            this.changevalues(a);
          }
        });
        this.precio = "";
      }
    },
    eliminaraviso(productoss, modelo) {
      productoss.producto.forEach((item, index) => {
        if (productoss.producto[index].modelo === modelo) {
          let b = productoss.producto[index].sn;
          let elindice = index;
          console.log(b + " modelo =>" + modelo);
          axios
            .post("http://localhost:3902/eliminarprod", {
              idcons: this.getUserId,
              sn: b,
              modelo: modelo
            })
            .then(res => {
              this.snackbar = res.data.deleted;
              this.text = res.data.msg;
              this.setproductos(elindice);
              sessionStorage.setItem(
                "session",
                JSON.stringify({
                  email: this.getemail,
                  imgAvatar: this.getimgAvatar,
                  productos: this.productoss,
                  token: this.gettoken,
                  userid: this.getUserId
                })
              );
            });
        }
      });
    },
    setproductos(data) {
      this.$store.dispatch("setProductoss", data);
    }
  },
  computed: {
    productoss() {
      return this.$store.getters.getProductos;
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