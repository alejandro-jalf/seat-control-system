<template>
  <div>
    <div class="mb-5">
      <v-checkbox
        label="Actualizar cada 30s"
        color="amber"
        hide-details
        class="mb-3 mr-3 display-ib"
      >
      </v-checkbox>
      <v-btn
        color="amber"
        outlined
        :block="width < 400"
        class="display-ib"
      >
        <v-icon>mdi-refresh</v-icon>
        Refrescar informacion
      </v-btn>
    </div>

    <br><br>

    <div v-if="editingGroup && width <= 699" class="sillas-movil">
      <div class="text-h5 text-center">{{ group.name.toUpperCase() }}</div>
      <v-btn
        color="green"
        outlined
        :block="width < 400"
        @click="setEditingGroup(false)"
      >
        <v-icon>mdi-close-circle</v-icon>
        Cerrar
      </v-btn>
      <GrupoSillas
          :sillas="getSillasByName(group.name_grupo)"
          :rows="group.rows_grupo"
          :cols="group.cols_grupo"
          :id-chair="group.name_grupo"
        />
    </div>
    <div v-else>
      <div
        v-for="(grupo, indexGrupo) in grupos"
        :key="indexGrupo + 'btn'"
        class="header-groups"
        :class="grupo.name_grupo"
      >
        <v-btn
          :small="width < 350"
          color="amber"
          outlined
          @click="editGroup(grupo)"
        >
          <v-icon>mdi-pencil</v-icon>
          <span v-if="width > 699"> Editar </span>
        </v-btn>
      </div>

      <div v-if="width > 699">
        <GrupoSillas
          v-for="(grupo, indexGrupo) in grupos"
          :key="indexGrupo"
          :sillas="getSillasByName(grupo.name_grupo)"
          :rows="grupo.rows_grupo"
          :cols="grupo.cols_grupo"
          :id-chair="grupo.name_grupo"
          :class="grupo.name_grupo"
        />
      </div>
      <div v-else>
        <div
          v-for="(grupo, indexGrupo) in grupos"
          :key="indexGrupo"
          :class="grupo.name_grupo"
          class="group-icon"
          @click="showGroup(grupo)"
        >
          <span v-if="width > 416"> SILLAS{{ indexGrupo + 1 }} </span>
          <span v-else> S{{ indexGrupo + 1 }} </span>
          <br>
          <span v-if="width > 561">
            Cols = {{ grupo.cols_grupo }} <br>
            Rows = {{ grupo.rows_grupo }}
          </span>
          <span v-else class="card"> {{ grupo.cols_grupo }} X {{ grupo.rows_grupo }} </span>

          <br>
          <v-icon color="light-green accent-2" large>
            mdi-gesture-double-tap
          </v-icon>
        </div>
      </div>

      <div
        v-for="(grupo, indexGrupo) in grupos"
        :key="indexGrupo + 'footer'"
        class="footer-groups"
        :class="grupo.name_grupo"
      >
        <div class="mt-2">
          <v-badge
            :content="countLibres(getSillasByName(grupo.name_grupo))"
            overlap
            bordered
            class="mr-3"
          >
            <img src="../assets/seat-libre.png" alt="" width="35px">
          </v-badge>
          <span v-if="width > 699"> Libres </span>
        </div>
        <div class="mt-2">
          <v-badge
            :content="countOcupadas(getSillasByName(grupo.name_grupo))"
            overlap
            bordered
            class="mr-3"
          >
            <img src="../assets/seat-ocupada.png" alt="" width="35px">
          </v-badge>
          <span v-if="width > 699"> Ocupadas </span>
        </div>
        <div class="mt-2">
          <v-badge
            :content="countDeshabilitadas(getSillasByName(grupo.name_grupo))"
            overlap
            bordered
            class="mr-3"
          >
            <img src="../assets/seat-desahabilitada.png" alt="" width="35px">
          </v-badge>
          <span v-if="width > 699"> Deshabilitadas </span>
        </div>
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
import { mapMutations, mapActions } from 'vuex'
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
      grupos1: [
        { name: 'sillas1', rows: 15, cols: 3 },
        { name: 'sillas2', rows: 15, cols: 5 },
        { name: 'sillas3', rows: 15, cols: 5 },
        { name: 'sillas4', rows: 15, cols: 3 },
      ],
      sillas11: [
        { id: 'key', disponible: true },
      ],
    }
  },
  computed: {
    sillas1() {
      return Object.values(this.$store.state.general.dataSeats.data).filter((seat) => seat.grupo_asiento === 1)
    },
    sillas2() {
      return Object.values(this.$store.state.general.dataSeats.data).filter((seat) => seat.grupo_asiento === 2)
    },
    sillas3() {
      return Object.values(this.$store.state.general.dataSeats.data).filter((seat) => seat.grupo_asiento === 3)
    },
    sillas4() {
      return Object.values(this.$store.state.general.dataSeats.data).filter((seat) => seat.grupo_asiento === 4)
    },
    grupos() {
      return this.$store.state.general.dataGrupos.data
    },
    group() {
      return this.$store.state.optiongroup.group
    },
    dialog() {
      return this.$store.state.optionchair.dialog
    },
    dialogGroup() {
      return this.$store.state.optiongroup.dialog
    },
    editingGroup() {
      return this.$store.state.optiongroup.editingGroup
    },
    disponibles() {
      const grupos = this.$store.state.general.dataGrupos.data
      console.log('disponibles', grupos, this.$store.state.general.dataGrupos);
      const all = grupos.reduce((acumGruop, group) => {
        const listSeats = [ ...this.getSillasByName(group.name_grupo) ]
        const count = listSeats.filter((silla) => silla.disponible === true).length
        acumGruop += count
        return acumGruop
      }, 0)
      return all.toString()
    },
    ocupadas() {
      const grupos = this.$store.state.general.dataGrupos.data
      console.log('ocupadas', grupos);
      const all = grupos.reduce((acumGruop, group) => {
        const listSeats = [ ...this.getSillasByName(group.name_grupo) ]
        const count = listSeats.filter((silla) => silla.disponible === false).length
        acumGruop += count
        return acumGruop
      }, 0)
      return all.toString()
    },
    deshabilitadas() {
      const grupos = this.$store.state.general.dataGrupos.data
      console.log('deshabilitadas', grupos);
      const all = grupos.reduce((acumGruop, group) => {
        const listSeats = [ ...this.getSillasByName(group.name_grupo) ]
        const count = listSeats.filter((silla) => silla.disponible === 3).length
        acumGruop += count
        return acumGruop
      }, 0)
      return all.toString()
    },
    width() {
      return this.$store.state.general.width
    },
  },
  mounted() {
    console.log(this.$store.state.general.dataGrupos);
    this.getGroups()
    this.getSeats()
  },
  methods: {
    ...mapMutations({
      setStatusDialog: 'optiongroup/setStatusDialog',
      setGroup: 'optiongroup/setGroup',
      setEditingGroup: 'optiongroup/setEditingGroup',
      setLoading: 'general/setLoading',
    }),
    ...mapActions({
      getGroups: 'general/getGroups',
      getSeats: 'general/getSeats',
    }),
    showGroup(group) {
      this.setEditingGroup(true)
      this.setGroup(group)
    },
    editGroup(group) {
      this.setGroup(group)
      this.setStatusDialog(true)
    },
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
.display-ib {
  display: inline-block;
}

.sillas-movil {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid rgb(93, 93, 93);
}

.sillas1, .sillas4 {
  position: relative;
  padding-top: 15px;
  border-right: 1px solid rgb(93, 93, 93);
  display: inline-block;
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
  border-left: 1px solid rgb(93, 93, 93);
  border-right: 1px solid rgb(93, 93, 93);
  display: inline-block;
  width: 25%;
  margin-right: 6%;
}

.group-icon {
  background: #0288D1;
  margin-top: 15px;
  border: 1px solid rgb(93, 93, 93);
  border-radius: 10px;
  padding: 5px;
  padding-top: 50px;
  text-align: center;
  height: 250px;
  transition-duration: 0.3s;
  transition-property: background-color;
}

.group-icon:hover {
  background: #02527e;
}

.card {
  border-radius: 3px;
  border: 1px solid rgb(255, 255, 255);
  padding: 3px;
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

@media screen and (max-width: 561px) {
  .group-icon {
    height: 200px;
  }
}

@media screen and (max-width: 430px) {
  .card {
    font-size: 14px;
  }
}

@media screen and (max-width: 396px) {
  .card {
    font-size: 12px;
  }
}

@media screen and (max-width: 360px) {
  .card {
    font-size: 10px;
  }
}

</style>
