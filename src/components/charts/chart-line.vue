<template>
  <div id="mountNode">
  </div>
</template>

<script>
import G2 from '@antv/g2'
import DataSet from '@antv/data-set'
import { getInputList } from '../../api/kpi/kpiinput'

export default {
  name: 'charts-line',
  data () {
    return {
      monthList: [],
      kpiList: [],
      t_value: [],
      l_limit: [],
      form: {
        search: ''
      },
      List: []
    }
  },
  props: ['search'],
  methods: {
    handleGetInputList () {
      getInputList(this.form).then(
        res => {
          this.List = res.data.results
          this.drawChart()
        }
      )
    },
    // drawChartKPI () {
    //   const data = this.List
    //   const ds = new DataSet()
    //   const dv = ds.createView().source(data)
    //   dv.transform({
    //     type: 'fold',
    //     fields: ['r_value'],
    //     key: 'key',
    //     value: 'value',
    //     retains: ['month', 'kpi']
    //   })
    //   dv.transform({
    //     type: 'map',
    //     callback (row) {
    //       if (row.key === 't_value') {
    //         row.key = '目标值'
    //       } else if (row.key === 'l_limit') {
    //         row.key = '下限值'
    //       } else {
    //         row.key = '实际值'
    //       }
    //       return row
    //     }
    //   })
    //   const chart = new G2.Chart({
    //     container: 'mountNode',
    //     // width: 700,
    //     forceFit: true,
    //     padding: [20, 30, 30, 50]
    //   })
    //   chart.source(dv, {
    //     month: {
    //       type: 'timeCat',
    //       range: [0, 1]
    //     },
    //     // 设置图像的vlaue轴的起点最小值跟终点最大值
    //     value: {
    //       min: dv.origin[0].l_limit - dv.origin[0].l_limit * 0.4,
    //       max: dv.origin[0].t_value + dv.origin[0].l_limit * 0.3
    //     }
    //   })
    //   chart.axis('value', {
    //     label: {
    //       formatter: function formatter (val) {
    //         return val + '%'
    //       }
    //     }
    //   })
    //   // chart.legend({
    //   //   attachLast: true
    //   // })
    //   chart.guide().line({
    //     start: ['min', dv.origin[0].l_limit],
    //     end: ['max', dv.origin[0].l_limit],
    //     lineStyle: {
    //       stroke: '#ed4014',
    //       lineWidth: 1,
    //       lineDash: [3, 3]
    //     }
    //     // text: {
    //     //   position: 'start',
    //     //   style: {
    //     //     fill: '#8c8c8c',
    //     //     fontSize: 15,
    //     //     fontWeight: 'normal'
    //     //   },
    //     //   content: '下限值' + dv.origin[0].l_limit,
    //     //   offsetY: -5
    //     // }
    //   })
    //   chart.guide().line({
    //     start: ['min', dv.origin[0].t_value],
    //     end: ['max', dv.origin[0].t_value],
    //     lineStyle: {
    //       stroke: '#19be6b',
    //       lineWidth: 1,
    //       lineDash: [3, 3]
    //     }
    //     // text: {
    //     //   position: 'start',
    //     //   style: {
    //     //     fill: '#8c8c8c',
    //     //     fontSize: 15,
    //     //     fontWeight: 'normal'
    //     //   },
    //     //   content: '上限值' + dv.origin[0].t_value,
    //     //   offsetY: -5
    //     // }
    //   })
    //   chart.line().position('month*value').color('key').shape('smooth')
    //   chart.point().position('month*value').size(4).shape('circle').style({
    //     stroke: '#fff',
    //     lineWidth: 1
    //   })
    //   chart.render()
    // },
    // drawChartDep () {
    //   const data = this.List
    //   const ds = new DataSet()
    //   const dv = ds.createView().source(data)
    //   dv.transform({
    //     type: 'fold',
    //     fields: ['kpi'],
    //     key: 'key',
    //     value: 'value',
    //     retains: ['month', 'r_value']
    //   })
    //   // dv.transform({
    //   //   type: 'map',
    //   //   callback (row) {
    //   //     if (row.key === 't_value') {
    //   //       row.key = '目标值'
    //   //     } else if (row.key === 'l_limit') {
    //   //       row.key = '下限值'
    //   //     } else {
    //   //       row.key = '实际值'
    //   //     }
    //   //     return row
    //   //   }
    //   // })
    //   const chart = new G2.Chart({
    //     container: 'mountNode',
    //     // width: 700,
    //     forceFit: true,
    //     padding: [20, 30, 30, 50]
    //   })
    //   chart.source(dv, {
    //     month: {
    //       type: 'timeCat',
    //       range: [0, 1]
    //     },
    //     // 设置图像的vlaue轴的起点最小值跟终点最大值
    //     r_value: {
    //       min: 0,
    //       max: 100
    //     }
    //   })
    //   // chart.axis('value', {
    //   //   label: {
    //   //     formatter: function formatter (val) {
    //   //       return val + '%'
    //   //     }
    //   //   }
    //   // })
    //   // chart.legend({
    //   //   attachLast: true
    //   // })
    //   // chart.guide().line({
    //   //   start: ['min', dv.origin[0].l_limit],
    //   //   end: ['max', dv.origin[0].l_limit],
    //   //   lineStyle: {
    //   //     stroke: '#ed4014',
    //   //     lineWidth: 1,
    //   //     lineDash: [3, 3]
    //   //   }
    //   // text: {
    //   //   position: 'start',
    //   //   style: {
    //   //     fill: '#8c8c8c',
    //   //     fontSize: 15,
    //   //     fontWeight: 'normal'
    //   //   },
    //   //   content: '下限值' + dv.origin[0].l_limit,
    //   //   offsetY: -5
    //   // }
    //   // })
    //   // chart.guide().line({
    //   //   start: ['min', dv.origin[0].t_value],
    //   //   end: ['max', dv.origin[0].t_value],
    //   //   lineStyle: {
    //   //     stroke: '#19be6b',
    //   //     lineWidth: 1,
    //   //     lineDash: [3, 3]
    //   //   }
    //   //   // text: {
    //   //   //   position: 'start',
    //   //   //   style: {
    //   //   //     fill: '#8c8c8c',
    //   //   //     fontSize: 15,
    //   //   //     fontWeight: 'normal'
    //   //   //   },
    //   //   //   content: '上限值' + dv.origin[0].t_value,
    //   //   //   offsetY: -5
    //   //   // }
    //   // })
    //   chart.line().position('month*r_value').color('value').shape('smooth')
    //   chart.point().position('month*r_value').size(4).shape('circle').style({
    //     stroke: '#fff',
    //     lineWidth: 1
    //   })
    //   chart.render()
    // },
    drawChart () {
      const data = this.List
      const ds = new DataSet()
      const dv = ds.createView().source(data)
      const chart = new G2.Chart({
        container: 'mountNode',
        // width: 700,
        height: window.innerHeight,
        forceFit: true,
        padding: [20, 30, 30, 50]
      })
      if (this.form.search.indexOf(' ') === -1) {
        dv.transform({
          type: 'fold',
          fields: ['kpi'],
          key: 'key',
          value: 'value',
          retains: ['month', 'r_value']
        })
        // dv.transform({
        //   type: 'map',
        //   callback (row) {
        //     if (row.key === 't_value') {
        //       row.key = '目标值'
        //     } else if (row.key === 'l_limit') {
        //       row.key = '下限值'
        //     } else {
        //       row.key = '实际值'
        //     }
        //     return row
        //   }
        // })
        chart.source(dv, {
          month: {
            type: 'timeCat',
            range: [0, 1]
          },
          // 设置图像的vlaue轴的起点最小值跟终点最大值
          r_value: {
            min: 0,
            max: 100
          }
        })
        // chart.axis('value', {
        //   label: {
        //     formatter: function formatter (val) {
        //       return val + '%'
        //     }
        //   }
        // })
        // chart.legend({
        //   attachLast: true
        // })
        // chart.guide().line({
        //   start: ['min', dv.origin[0].l_limit],
        //   end: ['max', dv.origin[0].l_limit],
        //   lineStyle: {
        //     stroke: '#ed4014',
        //     lineWidth: 1,
        //     lineDash: [3, 3]
        //   }
        // text: {
        //   position: 'start',
        //   style: {
        //     fill: '#8c8c8c',
        //     fontSize: 15,
        //     fontWeight: 'normal'
        //   },
        //   content: '下限值' + dv.origin[0].l_limit,
        //   offsetY: -5
        // }
        // })
        // chart.guide().line({
        //   start: ['min', dv.origin[0].t_value],
        //   end: ['max', dv.origin[0].t_value],
        //   lineStyle: {
        //     stroke: '#19be6b',
        //     lineWidth: 1,
        //     lineDash: [3, 3]
        //   }
        //   // text: {
        //   //   position: 'start',
        //   //   style: {
        //   //     fill: '#8c8c8c',
        //   //     fontSize: 15,
        //   //     fontWeight: 'normal'
        //   //   },
        //   //   content: '上限值' + dv.origin[0].t_value,
        //   //   offsetY: -5
        //   // }
        // })
        chart.line().position('month*r_value').color('value').shape('smooth')
        chart.point().position('month*r_value').size(4).shape('circle').style({
          stroke: '#fff',
          lineWidth: 1
        })
        chart.render()
      } else {
        dv.transform({
          type: 'fold',
          fields: ['r_value'],
          key: 'key',
          value: 'value',
          retains: ['month', 'kpi']
        })
        dv.transform({
          type: 'map',
          callback (row) {
            if (row.key === 't_value') {
              row.key = '目标值'
            } else if (row.key === 'l_limit') {
              row.key = '下限值'
            } else {
              row.key = '实际值'
            }
            return row
          }
        })
        chart.source(dv, {
          month: {
            type: 'timeCat',
            range: [0, 1]
          },
          // 设置图像的vlaue轴的起点最小值跟终点最大值
          // value: {
          //   min: dv.origin[0].l_limit - dv.origin[0].l_limit * 0.3,
          //   max: dv.origin[0].t_value + dv.origin[0].t_value * 0.3
          // }
          value: {
            min: 1,
            max: 100
          }
        })
        chart.axis('value', {
          label: {
            formatter: function formatter (val) {
              return val + '%'
            }
          }
        })
        chart.legend({
          attachLast: true
        })
        chart.guide().line({
          start: ['min', dv.origin[0].l_limit],
          end: ['max', dv.origin[0].l_limit],
          lineStyle: {
            stroke: '#ed4014',
            lineWidth: 1,
            lineDash: [3, 3]
          },
          text: {
            position: 'start',
            style: {
              fill: '#8c8c8c',
              fontSize: 15,
              fontWeight: 'normal'
            },
            content: '下限值' + dv.origin[0].l_limit,
            offsetY: -5
          }
        })
        chart.guide().line({
          start: ['min', dv.origin[0].t_value],
          end: ['max', dv.origin[0].t_value],
          lineStyle: {
            stroke: '#19be6b',
            lineWidth: 1,
            lineDash: [3, 3]
          },
          text: {
            position: 'start',
            style: {
              fill: '#8c8c8c',
              fontSize: 15,
              fontWeight: 'normal'
            },
            content: '上限值' + dv.origin[0].t_value,
            offsetY: -5
          }
        })
        chart.guide().regionFilter({
          top: true,
          start: ['min', dv.origin[0].l_limit],
          end: ['max', 0],
          color: '#ff4d4f'
        })
        chart.line().position('month*value').color('key').shape('smooth')
        chart.point().position('month*value').size(4).shape('circle').style({
          stroke: '#fff',
          lineWidth: 1
        })
        chart.render()
      }
    }
  },
  mounted () {
  },
  watch: {
    // search: function (newVal, oldVal) {
    //   console.log(this.search, newVal, oldVal)
    //   this.form = this.search
    //   this.handleGetInputList()
    // }
    search: {
      handler: function (newVal) {
        if (this.search) {
          if (this.search.kpi) {
            this.form.search = this.search.name + ' ' + this.search.kpi
          } else if (this.search.name) {
            this.form.search = this.search.name
          } else {
            this.form.search = ''
          }
        } else {
          this.form.search = ''
        }
        this.handleGetInputList()
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style scoped>

</style>
