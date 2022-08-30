
<template>
  <v-alert :value="seratrue" :type="type">{{msg}}</v-alert>
</template>
<script>
export default {
  props: ["seratrue", "type", "msg"]
};
</script>
<style>
</style>