<!--<template>-->
<!--    <div ref="dom">-->
<!--      <Dashboard :monthList=monthList></Dashboard>-->
<!--    </div>-->
<!--</template>-->

<!--<script>-->
<!--// import echarts from 'echarts'-->
<!--import Dashboard from '../../components/dashboard'-->
<!--import { getInputList } from '../../../api/kpi/kpiinput'-->
<!--// import { on, off } from '@/libs/tools'-->
<!--export default {-->
<!--  name: 'example',-->
<!--  components: { Dashboard },-->
<!--  data () {-->
<!--    return {-->
<!--      dom: null,-->
<!--      month: ['2019-06', '周二', '周三', '周四', '周五', '周六', '周日'],-->
<!--      monthList: []-->
<!--    }-->
<!--  },-->
<!--  methods: {-->
<!--    // resize () {-->
<!--    //   this.dom.resize()-->
<!--    // },-->
<!--    handlegetInputList () {-->
<!--      getInputList().then(-->
<!--        res => {-->
<!--          let arr = res.data.results-->
<!--          for (let i = 0; i < arr.length; i++) {-->
<!--            this.monthList.push(arr[i].month.substr(0, 7))-->
<!--          }-->
<!--        }-->
<!--      )-->
<!--    }-->
<!--  },-->
<!--  created () {-->
<!--    this.handlegetInputList()-->
<!--  }-->
<!--  // beforeDestroy () {-->
<!--  //   off(window, 'resize', this.resize)-->
<!--  // }-->
<!--}-->
<!--</script>-->
