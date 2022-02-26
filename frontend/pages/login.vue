<template>
  <v-card elevation="3" title max-width="500px" outlined class="card-c">
    <v-card-title class="text-h5 text-center">
      Bienvenido
    </v-card-title>
    <div class="text-center">
      <v-icon size="150px">mdi-account-circle</v-icon>
    </div>
    <v-card-text>
      <v-text-field
        v-model="form.user"
        label="Usuario"
        hint="Nombre de usuario"
        type="text"
        @keyup.enter="$refs.password.focus()"
      ></v-text-field>
      <v-text-field
        ref="password"
        v-model="form.password"
        label="Contraseña"
        hint="Contraseña"
        :type="typePassword"
        @keyup.enter="login"
      ></v-text-field>
      <v-checkbox
        v-model="form.visible"
        label="Mostrar contraseña"
        color="green darken-3"
        :value="false"
        hide-details
      ></v-checkbox>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          color="light-green accent-3"
          text
          @click="login"
        >
          Iniciar sesion
        </v-btn>
      </v-card-actions>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'

export default {
  name: 'LoginUser',
  data() {
    return {
      form: {
        user: '',
        password: '',
        visible: false,
      },
    }
  },
  computed: {
    typePassword() {
      return this.form.visible ? 'text' : 'password'
    },
  },
  methods: {
    ...mapActions({
      initSesion: 'general/initSesion',
    }),
    ...mapMutations({
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
    }),
    async login() {
      const user = this.form.user.trim()
      const password = this.form.password.trim()
      if (user === '') {
        this.showAlertDialog(['Nombre de usuario no puede quedar vacio'])
        return false
      }
      if (password === '') {
        this.showAlertDialog(['Contraseña no puede quedar vacio'])
        return false
      }
      this.setLoading(true)
      const response = await this.initSesion([user, password])
      this.setLoading(false)
      if (!response.success) this.showAlertDialog([response.message])
      else this.$router.replace({ path: '/' })
    },
  },
}
</script>

<style scoped>
.card-c {
  margin: auto;
  margin-top: 10%;
}
</style>
