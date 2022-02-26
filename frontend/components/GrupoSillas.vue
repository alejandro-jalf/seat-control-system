<template>
  <div :id="idChair" class="con-main">
    <div v-for="(row, indexrow) in refactorData" :key="indexrow" class="row-chair">
      <v-col
        v-for="(chair, indexchair) in row"
        :key="indexchair"
        class="col-chair"
        :style="widthCol"
        @click="showOptions(chair)"
      >
        <div class="numberChair">{{ chair.position }}</div>
        <img v-if="chair.disponible_asiento === 2" src="../assets/seat-desahabilitada.png" width="30px" />
        <img v-else-if="chair.disponible_asiento === 1" src="../assets/seat-libre.png" width="30px" />
        <img v-else src="../assets/seat-ocupada.png" width="30px" />
      </v-col>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'GrupoSillas',
  props: {
    sillas: {
      required: true,
      type: Array
    },
    rows: {
      required: true,
      type: Number
    },
    cols: {
      required: true,
      type: Number
    },
    idChair: {
      required: true,
      type: String
    },
  },
  data() {
    return {
      data: [],
    }
  },
  computed: {
    isInvitedUser() {
      return this.$store.state.general.dataUser.data.data[0].tipo_user === 'invited'
    },
    refactorData() {
      return this.data
    },
    widthCol() {
      const width = 'width:' + parseInt(100 / this.cols) + '%;'
      return width
    },
    widthImage() {
      const ct = document.getElementById(this.idChair)
      const porcentaje = parseInt(100 / this.cols) / 100
      const width = porcentaje * ct.clientWidth
      return (width - 2) + 'px'
    },
  },
  mounted() {
    this.createDataMatriz()
  },
  methods: {
    ...mapMutations({
      stateDialog: 'optionchair/stateDialog',
      changeChair: 'optionchair/changeChair',
    }),
    showOptions(chair) {
      if (this.isInvitedUser) return false
      this.changeChair(chair)
      this.stateDialog(true)
    },
    createDataMatriz() {
      let row = []
      const data = []
      let countChairs = 0
      let rowMax = 1;
      let rowMin = 1;
      let colMax = 10;
      let colMin = 10;

      this.sillas.forEach((seat, index) => {
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
      for (let rows = 1; rows <= rowsTotal; rows++) {
        for (let cols = 1; cols <= colsTotal; cols++) {
          const rowChair = { ...this.sillas[countChairs] }
          rowChair.position = countChairs + 1
          row.push(rowChair)
          countChairs++
        }
        data.push(row)
        row = []
      }
      this.data = data
    },
  },
}
</script>

<style scoped>
.con-main {
  margin-top: 15px;
  /* background: rgb(8, 123, 177); */
}

.asiento {
  width: 30px;
}

.row-chair {
  text-align: center;
  /* background: rebeccapurple; */
}

.col-chair {
  position: relative;
  display: inline-block;
  padding: 0px;
  text-align: center;
  /* background: rgba(255, 255, 255, 0.267); */
  /* border: 1px solid rgb(165, 202, 1); */
}

.numberChair {
  position: absolute;
  top: 25%;
  left: 0px;
  width: 100%;
  height: 75%;
  text-align: center;
  color: aliceblue;
  font-size: 12px;
}
</style>
