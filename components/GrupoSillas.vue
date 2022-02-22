<template>
  <div :id="idChair" class="con-main">
    <div v-for="(row, indexrow) in data" :key="indexrow" class="row-chair">
      <v-col
        v-for="(chair, indexchair) in row"
        :key="indexchair"
        class="col-chair"
        :style="widthCol"
      >
        <div class="numberChair">{{ chair.position }}</div>
        <img v-if="chair.disponible === 3" src="../assets/seat-desahabilitada.png" width="30px" />
        <img v-else-if="chair.disponible" src="../assets/seat-libre.png" width="30px" />
        <img v-else src="../assets/seat-ocupada.png" width="30px" />
      </v-col>
    </div>
  </div>
</template>

<script>
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
    createDataMatriz() {
      let row = []
      let countChairs = 0
      for (let rows = 1; rows <= this.rows; rows++) {
        for (let cols = 1; cols <= this.cols; cols++) {
          const rowChair = { ...this.sillas[countChairs] }
          rowChair.position = countChairs + 1
          row.push(rowChair)
          countChairs++
        }
        this.data.push(row)
        row = []
      }
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
  left: 40%;
  color: aliceblue;
  font-size: 12px;
}
</style>
