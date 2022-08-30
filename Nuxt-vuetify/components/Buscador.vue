<template>
  <v-container>
    <v-layout text-xs-center wrap>
      <v-combobox
        v-model="buscar"
        :items="items"
        item-text="modelo"
        label="Introduce nombre producto"
        v-on:keyup.enter="buscarcom"
        eager=true
      >
        <template slot="item" slot-scope="data">
          <span>
            <v-avatar color="grey lighten-4">
              <img :src="data.item.img" alt="avatar" />
            </v-avatar>
            {{data.item.model}} {{data.item.price}}€
          </span>
        </template>
      </v-combobox>
      <v-btn color="success" v-on:click="buscarcom">Mostrar</v-btn>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12>
        <!-- <pricehistory :chartdata="resultado" /> -->
        <notificador
          :preciomin="lowest"
          :vamos="show"
          :producto="buscar.sn"
          :modelo="buscar.model"
        />
        <lista :items="resultado" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import imagen from "./imagen.vue";
import lista from "./lista.vue";
import pricehistory from "./historialprecios";
import notificador from "./Notificador";
const axios = require("axios");

export default {
  data() {
    return {
      items: [],
      buscar: [],
      resultado: [],
      lowest: 0,
      show: false
      // chartready : false
    };
  },
  mounted() {
    axios
      .get("http://localhost:3902/json/autocompletar")
      .then(res => {
        for (let index = 0; index < res.data.length; index++) {
          this.items.push(res.data[index]);
        }
      })
      .catch(err => {
        /* eslint-disable */
        console.log("Ha ido mal: " + err);
      });
  },
  components: {
    imagen,
    lista,
    pricehistory,
    notificador
  },
  methods: {
    buscarcom() {
      axios
        .post("http://localhost:3902/json/buscar", {
          modelo: this.buscar
        })
        .then(res => {
          this.resultado = res.data;
          this.lowest = this.resultado[0].price;
        });
      this.show = true;
    }
  },
  computed: {
    isloged() {
      return this.$store.getters.getLogin;
    }
  }
};
</script>

<style>
</style>
