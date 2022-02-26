<template>
  <v-dialog :value="true" persistent max-width="390" width="390">
    <v-card>
      <v-card-title class="text-h6">
        Datos de Grupo "{{ group.name_grupo }}"
      </v-card-title>

      <v-card-text>
        <v-text-field
        v-model="cols"
          label="Columnas"
          hint="Las columnas se agregan y se quitan de la derecha"
          type="number"
        ></v-text-field>
        <v-text-field
          v-model="rows"
          label="Filas"
          hint="Numero de filas"
          type="number"
        ></v-text-field>

        <br><br>

        <v-btn outlined color="red lighten-4" block class="mb-2" @click="changeAviableAll(0)">
          <v-icon>mdi-seat</v-icon>
          <span v-if="width > 434"> Ocupar todas </span>
          <span v-else> Ocupar </span>
        </v-btn>
        <v-btn outlined color="lime lighten-1" block class="mb-2" @click="changeAviableAll(1)">
          <v-icon>mdi-seat</v-icon>
          <span v-if="width > 434"> Liberar todas </span>
          <span v-else> Liberar </span>
        </v-btn>
        <v-btn outlined color="blue-grey lighten-4" block @click="changeAviableAll(2)">
          <v-icon>mdi-seat</v-icon>
          <span v-if="width > 434"> Deshabilitar todas </span>
          <span v-else> Deshab. </span>
        </v-btn>

        <br><br>

        <v-btn outlined color="amber darken-3" block class="mb-2" @click="addColRight">
          <span v-if="width > 434"> Agregar columna a la derecha </span>
          <span v-else> <v-icon>mdi-table-column-plus-after</v-icon> </span>
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
        <v-btn outlined color="amber darken-3" block @click="addColLeft">
          <v-icon>mdi-arrow-left</v-icon>
          <span v-if="width > 434"> Agregar columna a la izquierda </span>
          <span v-else> <v-icon>mdi-table-column-plus-before</v-icon> </span>
        </v-btn>

        <br><br>

        <v-btn outlined color="red accent-2" block class="mb-2" @click="deleteColRight">
          <span v-if="width > 434"> Borrar columna de la derecha </span>
          <span v-else>
            <v-icon>mdi-table-column</v-icon>
            <v-icon>mdi-trash-can-outline</v-icon>
          </span>
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
        <v-btn outlined color="red accent-2" block @click="deleteColLeft">
          <v-icon>mdi-arrow-left</v-icon>
          <span v-if="width > 434"> Borrar columna de la izquierda </span>
          <span v-else>
            <v-icon>mdi-trash-can-outline</v-icon>
            <v-icon>mdi-table-column</v-icon>
          </span>
        </v-btn>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          color="light-green accent-3"
          text
          @click="setStatusDialog(false)"
        >
          Cerrar
        </v-btn>

        <v-btn
          color="light-green accent-3"
          text
          @click="updateGroup()"
        >
          Guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'

export default {
  data() {
    return {
      cols: 0,
      rows: 0,
    }
  },
  computed: {
    width() {
      return this.$store.state.general.width
    },
    dialog() {
      return this.$store.state.optiongroup.dialog
    },
    group() {
      return this.$store.state.optiongroup.group
    },
  },
  mounted() {
    this.setDataInitial()
  },
  methods: {
    ...mapMutations({
      setStatusDialog: 'optiongroup/setStatusDialog',
      showAlertDialog: 'general/showAlertDialog',
      setLoading: 'general/setLoading',
    }),
    ...mapActions({
      getSeats: 'general/getSeats',
      getGroups: 'general/getSeats',
    }),
    setDataInitial() {
      const sillas =
        this.$store.state.general.dataSeats.data.filter((seat) => seat.grupo_asiento === this.group.id_grupo)
      let rowMax = 1;
      let rowMin = 1;
      let colMax = 10;
      let colMin = 10;

      sillas.forEach((seat, index) => {
          if (index === 0) {
              rowMax = seat.row_asiento;
              rowMin = seat.row_asiento;
              colMax = seat.col_asiento;
              colMin = seat.col_asiento;
          } else {
              if (seat.row_asiento > rowMax) rowMax = seat.row_asiento;
              if (seat.row_asiento < rowMin) rowMin = seat.row_asiento;
              if (seat.col_asiento > colMax) colMax = seat.col_asiento;
              if (seat.col_asiento < colMin) colMin = seat.col_asiento;
          }
      });
      const rowsTotal = (rowMax - rowMin) + 1
      const colsTotal = (colMax - colMin) + 1
      this.cols = colsTotal
      this.rows = rowsTotal
    },
    validateDatosUpdate() {
      if (this.cols.toString().trim() === '') {
        this.showAlertDialog(['Columnas no puede quedar vacio'])
        return false
      }
      if (parseInt(this.cols).toString() === 'NaN') {
        this.showAlertDialog(['Columnas debe ser un numero'])
        return false
      }
      if (parseInt(this.cols) <= 0) {
        this.showAlertDialog(['Columnas debe ser mayor que cero'])
        return false
      }
      if (this.rows.toString().trim() === '') {
        this.showAlertDialog(['Filas no puede quedar vacio'])
        return false
      }
      if (parseInt(this.rows).toString() === 'NaN') {
        this.showAlertDialog(['Filas debe ser un numero'])
        return false
      }
      if (parseInt(this.rows) <= 0) {
        this.showAlertDialog(['Filas debe ser mayor que cero'])
        return false
      }
      return true
    },
    async updateGroup() {
      if (!this.validateDatosUpdate()) return false
      this.setStatusDialog(false)
      try {
        this.setLoading(true)
        const response = await this.$axios({
          url: `http://localhost:5000/api/v1/grupos/` + this.group.id_grupo,
          method: 'put',
          data: {
            cols_grupo: this.cols,
            rows_grupo: this.rows,
          }
        })
        this.setLoading(false)
        if (response.data.success) {
          await this.getSeats()
          await this.getGroups()
          this.showAlertDialog([response.data.message, 'Exito', 'success'])
        } else
          this.showAlertDialog([response.data.message])
      } catch (error) {
        this.setLoading(false)
        if (error.response)
          this.showAlertDialog([error.response.data.message])
        else
          this.showAlertDialog(['Error con el servidor de base de datos', 'Advertencia', 'danger'])
      }
    },
    async addColRight() {
      this.setStatusDialog(false)
      try {
        this.setLoading(true)
        const response = await this.$axios({
          url: `http://localhost:5000/api/v1/seats/grupos/` + this.group.id_grupo + '/right',
          method: 'post',
        })
        this.setLoading(false)
        if (response.data.success) {
          await this.getSeats()
          await this.getGroups()
        } else
          this.showAlertDialog([response.data.message])
      } catch (error) {
        this.setLoading(false)
        if (error.response)
          this.showAlertDialog([error.response.data.message])
        else
          this.showAlertDialog(['Error con el servidor de base de datos', 'Advertencia', 'danger'])
      }
    },
    async addColLeft() {
      this.setStatusDialog(false)
      try {
        this.setLoading(true)
        const response = await this.$axios({
          url: `http://localhost:5000/api/v1/seats/grupos/` + this.group.id_grupo + '/left',
          method: 'post',
        })
        this.setLoading(false)
        if (response.data.success) {
          await this.getSeats()
          await this.getGroups()
        } else
          this.showAlertDialog([response.data.message])
      } catch (error) {
        this.setLoading(false)
        if (error.response)
          this.showAlertDialog([error.response.data.message])
        else
          this.showAlertDialog(['Error con el servidor de base de datos', 'Advertencia', 'danger'])
      }
    },
    async deleteColRight() {
      this.setStatusDialog(false)
      try {
        this.setLoading(true)
        const response = await this.$axios({
          url: `http://localhost:5000/api/v1/seats/grupos/` + this.group.id_grupo + '/right',
          method: 'delete',
        })
        this.setLoading(false)
        if (response.data.success) {
          await this.getSeats()
          await this.getGroups()
        } else
          this.showAlertDialog([response.data.message])
      } catch (error) {
        this.setLoading(false)
        if (error.response)
          this.showAlertDialog([error.response.data.message])
        else
          this.showAlertDialog(['Error con el servidor de base de datos', 'Advertencia', 'danger'])
      }
    },
    async deleteColLeft() {
      this.setStatusDialog(false)
      try {
        this.setLoading(true)
        const response = await this.$axios({
          url: `http://localhost:5000/api/v1/seats/grupos/` + this.group.id_grupo + '/left',
          method: 'delete',
        })
        this.setLoading(false)
        if (response.data.success) {
          await this.getSeats()
          await this.getGroups()
        } else
          this.showAlertDialog([response.data.message])
      } catch (error) {
        this.setLoading(false)
        if (error.response)
          this.showAlertDialog([error.response.data.message])
        else
          this.showAlertDialog(['Error con el servidor de base de datos', 'Advertencia', 'danger'])
      }
    },
    async changeAviableAll(aviable) {
      this.setStatusDialog(false)
      try {
        this.setLoading(true)
        const response = await this.$axios({
          url: `http://localhost:5000/api/v1/seats/grupos/ ${this.group.id_grupo}/disponible?disponible_asiento=${aviable}`,
          method: 'put',
        })
        this.setLoading(false)
        if (response.data.success) {
          await this.getSeats()
          await this.getGroups()
        } else
          this.showAlertDialog([response.data.message])
      } catch (error) {
        this.setLoading(false)
        if (error.response)
          this.showAlertDialog([error.response.data.message])
        else
          this.showAlertDialog(['Error con el servidor de base de datos', 'Advertencia', 'danger'])
      }
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
