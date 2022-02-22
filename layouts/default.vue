<template>
  <v-app dark>
    <v-app-bar fixed app>
      <v-app-bar-title>
        <img src="../assets/logoscs.png" alt="" width="30px">
        Sistema de Control de Asientos
      </v-app-bar-title>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; Gerizim {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      fixed: false,
    }
  },
}
</script>
