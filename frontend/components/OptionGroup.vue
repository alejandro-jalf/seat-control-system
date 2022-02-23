<template>
  <v-dialog :value="true" persistent max-width="390" width="390">
    <v-card>
      <v-card-title class="text-h5">
        Datos de Grupo "{{ group.name }}"
      </v-card-title>

      <v-card-text>
        <v-text-field
          label="Filas"
          hint="Numero de filas"
          type="number"
          :value="group.rows"
        ></v-text-field>
        <v-text-field
          label="Columnas"
          hint="Las columnas se agregan y se quitan de la derecha"
          type="number"
          :value="group.cols"
        ></v-text-field>

        <br><br>

        <v-btn outlined color="amber darken-3" block>
          <v-icon>mdi-arrow-left</v-icon>
          Agregar columna a la izquierda
        </v-btn>
        <br>
        <v-btn outlined color="amber darken-3" block>
          Agregar columna a la derecha
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
      </v-card-text>

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
import { mapMutations } from 'vuex'

export default {
  computed: {
    dialog() {
      return this.$store.state.optiongroup.dialog
    },
    group() {
      return this.$store.state.optiongroup.group
    },
  },
  methods: {
    ...mapMutations({
      setStatusDialog: 'optiongroup/setStatusDialog',
    }),
    closeDialog() {
      this.setStatusDialog(false)
    },
  }
}
</script>

<style scoped>
.container-form {
  padding: 39px;
  background: rgb(192, 113, 113);
}
</style>
