<template>
  <v-app dark>
    <AlertDialog v-if="show" />
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

      <v-spacer></v-spacer>

      <v-btn icon class="mr-3" @click="logout($router)">
        <v-icon>mdi-account-circle</v-icon>
        Salir
      </v-btn>
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
import { mapMutations ,mapActions } from 'vuex'
import AlertDialog from '../components/AlertDialog'

export default {
  name: 'DefaultLayout',
  components: {
    AlertDialog,
  },
  data() {
    return {
      fixed: false,
    }
  },
  computed: {
    show() {
      return this.$store.state.general.alert.show
    },
    loading() {
      return this.$store.state.general.loading > 0
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
    ...mapActions({
      logout: 'general/logout',
    }),
  },
}
</script>
