<template>
  <v-dialog :value="true" persistent max-width="290">
    <v-card outlined>
      <v-card-title class="text-h6" :color="colorType">
        {{ alert.title }}
      </v-card-title>

      <v-card-text>
        {{ alert.message }}
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          :color="colorType"
          text
          @click="hideAlertDialog"
        >
          Aceptar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  computed: {
    alert() {
      return this.$store.state.general.alert
    },
    colorType() {
      const type = this.$store.state.general.alert.type
      if (type === 'success') return 'light-green accent-3'
      if (type === 'warning') return 'amber lighten-1'
      if (type === 'danger') return 'red accent-1'
      if (type === 'info') return 'cyan accent-1'
      if (type === 'primary') return 'light-blue lighten-1'
      return 'light-green accent-3'
    },
  },
  methods: {
    ...mapMutations({
      hideAlertDialog: 'general/hideAlertDialog',
    }),
  },
}
</script>
