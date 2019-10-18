<template>
  <chart-line :List=this.List></chart-line>
</template>

<script>
// import G2 from '@antv/g2'
import Charts from '_c/charts/chart-line'
// import DataSet from '@antv/data-set'
import { getInputList } from '../../api/kpi/kpiinput'

export default {
  name: 'dashboard',
  components: { 'chart-line': Charts },
  data () {
    return {
      List: []
    }
  },
  methods: {
    handlegetInputList () {
      getInputList(1).then(
        res => {
          this.List = res.data.results
        }
      )
    }
  },
  mounted () {

  },
  created () {
    this.handlegetInputList()
  }
}
</script>

<style scoped>

</style>
