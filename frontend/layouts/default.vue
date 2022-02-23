<template>
  <v-app dark>
    <v-overlay :absolute="false" :value="loading" color="grey lighten-2">
      <v-progress-circular
        indeterminate
        color="light-green accent-3"
      ></v-progress-circular>
    </v-overlay>

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
import { mapMutations } from 'vuex'

export default {
  name: 'DefaultLayout',
  data() {
    return {
      fixed: false,
    }
  },
  computed: {
    loading() {
      return this.$store.state.general.loading
    },
  },
  mounted() {
    this.setWidth(window.innerWidth)

    window.addEventListener('resize', () => {
      this.setWidth(window.innerWidth)
    })
  },
  methods: {
    ...mapMutations({
      setWidth: 'general/setWidth',
      setLoading: 'general/setLoading',
    }),
  },
}
</script>
