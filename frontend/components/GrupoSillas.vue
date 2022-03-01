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
        <img v-if="chair.disponible_asiento === 2" src="../assets/seat-desahabilitada.png" :width="widthSeat" />
        <img v-else-if="chair.disponible_asiento === 1" src="../assets/seat-libre.png" :width="widthSeat" />
        <img v-else src="../assets/seat-ocupada.png" :width="widthSeat" />
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
      colsDiff: 0,
      rowsDiff: 0,
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
    widthSeat() {
      const divisor = this.$store.state.general.width <= 699 ? 1 : 4
      const colsMax = this.$store.state.general.numberMaxCols
      const widthContainer = this.$store.state.general.widthContainerMain
      const widthSeat = (widthContainer / divisor) / colsMax
      if (divisor === 1 && widthSeat > 35)
        return 35 + 'px'
      return parseInt(widthSeat - 4) + 'px'
    },
  },
  mounted() {
    this.createDataMatriz()
  },
  methods: {
    ...mapMutations({
      stateDialog: 'optionchair/stateDialog',
      changeChair: 'optionchair/changeChair',
      setNumberMaxCols: 'general/setNumberMaxCols',
    }),
    showOptions(chair) {
      if (this.isInvitedUser) return false
      this.changeChair(chair)
      this.stateDialog(true)
    },
    createDataMatriz() {
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
      this.rowsDiff = rowsTotal
      this.colsDiff = colsTotal
      this.setNumberMaxCols(colsTotal)
      let seatsSort = [ ...this.sillas ]
      seatsSort.sort((a,b) => a.row_asiento < b.row_asiento ? -1 : 1)
      let groupSeat = []
      seatsSort = seatsSort.reduce((acumSeat, seat, indexSeat) => {
        groupSeat.push(seat)
        seat.position = indexSeat + 1
        countChairs = (indexSeat + 2) - colsTotal
        if (indexSeat > 0 && (indexSeat + 1)%colsTotal === 0) {
          groupSeat.sort((a, b) => a.col_asiento < b.col_asiento ? -1 : 1)
          groupSeat.forEach((seat, indexS) => {
            seat.position = countChairs + indexS
          })
          acumSeat.push(groupSeat)
          groupSeat = []
        }
        return acumSeat
      }, [])
      this.data = seatsSort
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
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor: pointer;
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
