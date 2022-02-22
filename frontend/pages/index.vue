<template>
  <div>
    <h1 class="text-center mb-4">Registro de Asientos</h1>

    <div
      v-for="(grupo, indexGrupo) in grupos"
      :key="indexGrupo + 'btn'"
      class="header-groups"
      :class="grupo.name"
    >
      <v-btn color="amber" outlined @click="setStatusDialog(true)">Editar</v-btn>
    </div>
    <GrupoSillas
      v-for="(grupo, indexGrupo) in grupos"
      :key="indexGrupo"
      :sillas="getSillasByName(grupo.name)"
      :rows="grupo.rows"
      :cols="grupo.cols"
      :id-chair="grupo.name"
      :class="grupo.name"
    />
    <div
      v-for="(grupo, indexGrupo) in grupos"
      :key="indexGrupo + 'footer'"
      class="footer-groups"
      :class="grupo.name"
    >
      <div>
        <v-badge :content="countLibres(getSillasByName(grupo.name))" overlap bordered class="mr-3">
          <img src="../assets/seat-libre.png" alt="" width="35px">
        </v-badge>
        Libres
      </div>
      <div>
        <v-badge :content="countOcupadas(getSillasByName(grupo.name))" overlap bordered class="mr-3">
          <img src="../assets/seat-ocupada.png" alt="" width="35px">
        </v-badge>
        Ocupadas
      </div>
      <div>
        <v-badge :content="countDeshabilitadas(getSillasByName(grupo.name))" overlap bordered class="mr-3">
          <img src="../assets/seat-desahabilitada.png" alt="" width="35px">
        </v-badge>
        Deshabilitadas
      </div>
    </div>
    <OptionChair v-if="dialog" />
    <OptionGroup v-if="dialogGroup" />

    <div class="footer-groups text-center">
      <h2>Totales</h2>
      <div class="resultAll">
        <v-badge :content="disponibles" overlap bordered class="mr-3">
          <img src="../assets/seat-libre.png" alt="" width="35px">
        </v-badge>
        Libres
      </div>
      <div class="resultAll">
        <v-badge :content="ocupadas" overlap bordered class="mr-3">
          <img src="../assets/seat-ocupada.png" alt="" width="35px">
        </v-badge>
        Ocupadas
      </div>
      <div class="resultAll">
        <v-badge :content="deshabilitadas" overlap bordered class="mr-3">
          <img src="../assets/seat-desahabilitada.png" alt="" width="35px">
        </v-badge>
        Deshabilitadas
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import GrupoSillas from '../components/GrupoSillas'
import OptionChair from '../components/OptionChair'
import OptionGroup from '../components/OptionGroup'

export default {
  name: 'IndexPage',
  components: {
    GrupoSillas,
    OptionChair,
    OptionGroup,
  },
  data() {
    return {
      grupos: [
        { name: 'sillas1', rows: 15, cols: 3 },
        { name: 'sillas2', rows: 15, cols: 5 },
        { name: 'sillas3', rows: 15, cols: 5 },
        { name: 'sillas4', rows: 15, cols: 3 },
      ],
      sillas1: [
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: 3 },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: 3 },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: false },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: false },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: false },
        { id: 'key', disponible: true },
        { id: 'key', disponible: false },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: false },
        { id: 'key', disponible: true },
        { id: 'key', disponible: false },
        { id: 'key', disponible: true },
        { id: 'key', disponible: false },
        { id: 'key', disponible: true },
      ],
      sillas2: [
        { id: 'key', disponible: false },
        { id: 'key', disponible: false },
        { id: 'key', disponible: false },
        { id: 'key', disponible: false },
        { id: 'key', disponible: false },
        { id: 'key', disponible: false },
        { id: 'key', disponible: false },
        { id: 'key', disponible: false },
        { id: 'key', disponible: false },
        { id: 'key', disponible: false },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: false },
        { id: 'key', disponible: false },
        { id: 'key', disponible: false },
        { id: 'key', disponible: false },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
      ],
      sillas3: [
        { id: 'key', disponible: false },
        { id: 'key', disponible: false },
        { id: 'key', disponible: false },
        { id: 'key', disponible: false },
        { id: 'key', disponible: false },
        { id: 'key', disponible: false },
        { id: 'key', disponible: false },
        { id: 'key', disponible: false },
        { id: 'key', disponible: false },
        { id: 'key', disponible: false },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: false },
        { id: 'key', disponible: false },
        { id: 'key', disponible: false },
        { id: 'key', disponible: false },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
      ],
      sillas4: [
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: false },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: false },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: false },
        { id: 'key', disponible: true },
        { id: 'key', disponible: false },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: true },
        { id: 'key', disponible: false },
        { id: 'key', disponible: true },
        { id: 'key', disponible: false },
        { id: 'key', disponible: true },
        { id: 'key', disponible: false },
        { id: 'key', disponible: true },
      ],
    }
  },
  computed: {
    dialog() {
      return this.$store.state.optionchair.dialog
    },
    dialogGroup() {
      return this.$store.state.optiongroup.dialog
    },
    disponibles() {
      const all = this.grupos.reduce((acumGruop, group) => {
        const listSeats = [ ...this.getSillasByName(group.name) ]
        const count = listSeats.filter((silla) => silla.disponible === true).length
        acumGruop += count
        return acumGruop
      }, 0)
      return all.toString()
    },
    ocupadas() {
      const all = this.grupos.reduce((acumGruop, group) => {
        const listSeats = [ ...this.getSillasByName(group.name) ]
        const count = listSeats.filter((silla) => silla.disponible === false).length
        acumGruop += count
        return acumGruop
      }, 0)
      return all.toString()
    },
    deshabilitadas() {
      const all = this.grupos.reduce((acumGruop, group) => {
        const listSeats = [ ...this.getSillasByName(group.name) ]
        const count = listSeats.filter((silla) => silla.disponible === 3).length
        acumGruop += count
        return acumGruop
      }, 0)
      return all.toString()
    },
  },
  methods: {
    ...mapMutations({
      setStatusDialog: 'optiongroup/setStatusDialog',
    }),
    getSillasByName(name) {
      return this[`${name}`]
    },
    countLibres(sillas) {
      const count = sillas.filter((silla) => silla.disponible === true).length
      return count.toString()
    },
    countOcupadas(sillas) {
      const count = sillas.filter((silla) => silla.disponible === false).length
      return count.toString()
    },
    countDeshabilitadas(sillas) {
      const count = sillas.filter((silla) => silla.disponible === 3).length
      return count.toString()
    },
  },
}
</script>

<style scoped>
/* .ctainer {
  background: #e70c0c;
} */

.sillas1, .sillas4 {
  position: relative;
  padding-top: 15px;
  /* border-radius: 10px; */
  border-right: 1px solid rgb(93, 93, 93);
  display: inline-block;
  /* background: #b6f800; */
  width: 16%;
  margin-right: 6%;
}
.sillas4 {
  margin-right: 0px;
  border-right: 0px solid rgb(93, 93, 93);
  border-left: 1px solid rgb(93, 93, 93);
}

.sillas2, .sillas3 {
  position: relative;
  padding-top: 15px;
  /* border-radius: 10px; */
  border-left: 1px solid rgb(93, 93, 93);
  border-right: 1px solid rgb(93, 93, 93);
  display: inline-block;
  /* background: #0d9b54; */
  width: 25%;
  margin-right: 6%;
}

.header-groups {
  border-left: 0px solid rgb(93, 93, 93);
  border-right: 0px solid rgb(93, 93, 93);
  padding-top: 0px;
  text-align: center;
}

.btnEdit {
  position: absolute;
  top: -20px;
  left: center;
}

.footer-groups {
  border-radius: 10px;
  border: 1px solid rgb(93, 93, 93);
  margin-top: 20px;
  padding: 10px;
  padding-top: 15px;
}

.resultAll {
  display: inline-block;
  margin: 10px 20px;
}
</style>
