<template>
  <v-dialog :value="true" persistent max-width="390" width="390">
    <v-card>
      <v-card-title class="text-h5">
        Datos de Grupo
      </v-card-title>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          color="light-green accent-3"
          text
          @click="closeDialog()"
        >
          Cerrar
        </v-btn>

        <v-btn
          color="light-green accent-3"
          text
          @click="closeDialog()"
        >
          Guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  computed: {
    dialog() {
      return this.$store.state.optiongroup.dialog
    },
  },
  methods: {
    closeDialog() {
      console.log('Cierra');
      // this.stateDialog(false)
    },
  }
}
</script>
