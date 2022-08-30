<template>
  <v-layout>
    <v-flex xs12 sm12>
      <v-card>
        <v-list subheader>
          <v-list-tile v-for="item in items" :key="item.price" avatar>
            <v-list-tile-avatar>
              <img :src="item.img">
            </v-list-tile-avatar>
            <v-subheader>Modelo</v-subheader>
            <v-flex class="box" xs12 sm3 md2>
              <v-list-tile-content>
                <v-list-tile-title>{{item.modelo}}</v-list-tile-title>
              </v-list-tile-content>
            </v-flex>
            <v-subheader>Precio</v-subheader>
            <v-flex class="box" xs12 sm6 md4>
              <v-list-tile-content>
                <v-list-tile-title v-html="item.price"></v-list-tile-title>
              </v-list-tile-content>
            </v-flex>
            <v-subheader>
              <v-avatar>
                <img v-if="item.provedor == 'Pccom-'" src="../imagenes/pccomponentes.jpg">
                <img v-else-if="item.provedor == 'Xtrem-'" src="../imagenes/xtremmedia.jpg">
              </v-avatar>
            </v-subheader>
            <v-subheader>{{item.provedor}}</v-subheader>
            <v-flex class="box" xs12 sm6 md8>
              <v-flex>
                <v-rating :value="item.rating" medium></v-rating>
              </v-flex>
            </v-flex>
            <v-flex class="box" xs12 sm6 md8>
              <v-list-tile-content>
                <v-list-tile-title v-html="item.reviews"></v-list-tile-title>
              </v-list-tile-content>
            </v-flex>
            <v-subheader>Stock</v-subheader>
            <v-flex class="box" xs12 sm6 md4>
              <v-list-tile-content>
                <v-list-tile-title v-html="item.enviollegada"></v-list-tile-title>
              </v-list-tile-content>
            </v-flex>
            <v-flex class="box" xs12 sm6 md4>
              <v-list-tile-content>
                <v-btn :href="item.url" color="info">Ir a la oferta!</v-btn>
              </v-list-tile-content>
            </v-flex>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  data() {
    return {
      length: 5
    };
  },
  props: ["items"]
};
</script>
<style>
</style>