<template>
  <v-dialog :value="true" persistent max-width="290">
    <v-card>
      <v-card-title class="text-h5">
        Asiento {{ chair.position }}
      </v-card-title>

      <v-list dense>
        <v-list-item-group
          v-model="selectedItem"
          color="primary"
        >
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :color="colorOption(i)"
            @click="selectedOption(i)"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          color="light-green accent-3"
          text
          @click="closeDialog()"
        >
          Cerrar
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
      selectedItem: 1,
      items: [
        { icon: '', text: 'Disponible', checked: false },
        { icon: 'mdi-checkbox-marked-circle', text: 'Ocupado', checked: true },
        { icon: '', text: 'Deshabilitado', checked: false },
      ],
      positionSeat: 0,
    }
  },
  computed: {
    dialog() {
      return this.$store.state.optionchair.dialog
    },
    chair() {
      return this.$store.state.optionchair.chair
    },
  },
  mounted() {
    const chair = this.chair
    this.loadOptions(chair)
  },
  methods: {
    ...mapMutations({
      stateDialog: 'optionchair/stateDialog',
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
    }),
    ...mapActions({
      getSeats: 'general/getSeats',
      getGroups: 'general/getGroups',
    }),
    selectedOption(position) {
      this.items.forEach((option) => { option.icon = '' })
      this.items[position].icon = 'mdi-checkbox-marked-circle'
      this.saveChanges(position)
    },
    loadOptions(chair) {
      let selected = ''
      if (chair.disponible_asiento === 1) {
        selected = 'Disponible'
        this.selectedItem = 0
      } else if (chair.disponible_asiento === 0) {
        selected = 'Ocupado'
        this.selectedItem = 1
      } else {
        selected = 'Deshabilitado'
        this.selectedItem = 2
      }
      this.items.forEach((option) => {
        if (option.text === selected) option.icon = 'mdi-checkbox-marked-circle'
        else option.icon = ''
      })
    },
    closeDialog() {
      this.stateDialog(false)
    },
    colorOption(position) {
      if (position === 0) return 'green lighten-4'
      if (position === 1) return 'red lighten-4'
      return 'cyan lighten-4'
    },
    async saveChanges(position) {
      this.stateDialog(false)
      try {
        const source = 'http://' + process.env.scs_route_base
        const idSeat = this.chair.id_asiento
        const statusNew = position === 0 ? 1 : position === 1 ? 0 : 2
        this.setLoading(true)
        const response = await this.$axios({
          url: `${source}:5000/api/v1/seats/${idSeat}/disponible?disponible_asiento=${statusNew}`,
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
  },
}
</script>
