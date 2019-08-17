<template>
  <div>
    <Row style="padding: 15px 0">
      <Form inline :label-width="80">
        <FormItem label="请选择部门: ">
          <Select v-model="form.name" style="width: 200px" @on-change="change">
            <Option v-for="dep in formdep" :key="dep.id" :value="dep.name">{{ dep.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="请选择指标: ">
          <Select v-model="form.kpi" style="width: 200px" :disabled="!form.name">
            <Option v-for="kpi in formkpi" :key="kpi.id" :value="kpi.name">{{ kpi.name }}</Option>
          </Select>
        </FormItem>
      </Form>
      <Card>
        <div style="text-align: center; padding: 15px">
          <Row style="padding-bottom: 10px; float: left">
            <Tag color="success">达到目标</Tag>
            <Tag color="warning">需要改善</Tag>
            <Tag color="error">低于下限</Tag>
          </Row>
          <Row>
            <Col span="24">
            <Table stripe border :columns="columns" :data="this.inputList"></Table>
            </Col>
          </Row>
        </div>
      </Card>
    </Row>
    <Row>
      <Card>
        <Dashboard :value=monthList style="height: 600px;" :search="this.form.name"></Dashboard>
      </Card>
    </Row>
  </div>
</template>

<script>
// import { ChartPie, ChartBar } from '_c/charts'
// import Example from './example.vue'
import Dashboard from '../../components/dashboard'
// import { getInputList } from '../../../api/kpi/kpiinput'
import { getDepList } from '../../../api/account/departments'
import { getGroupKpiList } from '../../../api/kpi/groupkpi'
// import { compare } from '../../utils/compare'
import { selectData } from '../../../api/kpi/kpidash'

export default {
  name: 'home',
  components: {
    Dashboard
  },
  data () {
    return {
      groupKpiList: [],
      formdep: [],
      kpi: [],
      formkpi: [],
      inputList: [
        {
          kpi: '',
          t_value: '',
          l_limit: ''
        },
        {
          kpi: '',
          t_value: '90',
          l_limit: '80'
        }
      ],
      monthList: [],
      kpiList: {},
      t_value: [],
      l_limit: [],
      form: {
        name: '',
        kpi: ''
      },
      myTe: {},
      columns: [
        {
          title: '序号',
          type: 'index',
          align: 'center',
          width: '80px'
        },
        {
          title: '指标名称',
          align: 'center',
          render: (h, params) => {
            console.log(params, 6666)
            return h('span', {}, params.row.kpi)
          }
        },
        {
          title: '下限值',
          key: '下限值',
          align: 'center',
          render: (h, params) => {
            return h('span', {}, params.row.l_limit)
          }
        },
        {
          title: '目标值',
          align: 'center',
          render: (h, params) => {
            return h('span', {}, params.row.t_value)
          }
        }
      ]
    }
  },
  mounted () {

  },
  methods: {
    handelGetDepList () {
      getDepList().then(
        res => {
          this.formdep = res.data.results
        }
      )
    },
    handelGetGroupKpiList () {
      getGroupKpiList().then(
        res => {
          this.groupKpiList = res.data.results
        }
      )
    },
    handelPostGroupKpi () {
      let data = this.form
      selectData(data).then(
        res => {
          // for (let i =0; i < res.data.length; i++) {
          //   console.log(res.data[i], 888888)
          // }]
          // let arr = Object.keys(obj).map(key => obj[key])
          let tem = Object.entries(res.data[this.form.name])
          for (let i = 0; i < tem.length; i++) {
            this.kpiList['kpi'] = tem[i][0]
            this.kpiList['l_limit'] = tem[i][1].l_limit
            this.kpiList['t_value'] = tem[i][1].t_value
          }
          this.inputList[3] = this.kpiList
          console.log(this.inputList, 90909090)
        }
      )
    },
    // handelPostGroupKpi () {
    //   let data = this.form
    //   selectData(data).then(
    //     res => {
    //       // for (let i =0; i < res.data.length; i++) {
    //       //   console.log(res.data[i], 888888)
    //       // }]
    //       // let arr = Object.keys(obj).map(key => obj[key])
    //       let tem = Object.entries(res.data[this.form.name])
    //       for (let i = 0; i < tem.length; i++) {
    //         let kpi_month = Object.entries(tem[i][1].r_value)[i]
    //         this.monthList.push(kpi_month[0])
    //         this.kpiList.push(kpi_month[1])
    //         this.t_value.push(tem[i][1].t_value)
    //         this.l_limit.push(tem[i][1].l_limit)
    //         this.kpi.push(tem[i][0])
    //         // let te = new Map()
    //         // te.set(i, { t_value: this.t_value, monthList: this.monthList, kpiList: this.kpiList })
    //         // this.myTe = te
    //       }
    //       // this.columsInit()
    //       let myArray = []
    //       let myObject = {}
    //       for (let i = 0; i < this.monthList.length; i++) {
    //         let key = this.monthList[i]
    //         let val = this.kpiList[i]
    //         myObject[key] = val
    //       }
    //       myArray = {
    //         't_value': this.t_value[0],
    //         'l_limit': this.l_limit[0],
    //         'kpi': this.kpi
    //       }
    //       this.inputList = [Object.assign(myArray, myObject)]
    //       console.log(this.inputList)
    //       console.log(typeof (this.inputList))
    //     }
    //   )
    // },
    // handelgetInputList () {
    //   getInputList(this.form).then(
    //     res => {
    //       // 重置列表为空,否则切换部门时,会保留上一个部门的数据
    //       this.monthList = []
    //       this.kpiList = []
    //       this.t_value = []
    //       this.l_limit = []
    //       this.kpi = []
    //       // 把自定义的数据删除掉,删除目标值后面的所有数据
    //       this.columns.splice(4)
    //       let arr = res.data.results
    //       arr = arr.sort(compare)
    //       for (let i = 0; i < arr.length; i++) {
    //         this.monthList.push(arr[i].month.substr(0, 7))
    //         this.kpiList.push(arr[i].r_value)
    //         this.t_value.push(arr[i].t_value)
    //         this.l_limit.push(arr[i].l_limit)
    //         this.kpi = arr[i].kpi
    //         let te = new Map()
    //         let ab = arr[i].kpi.name
    //         te.set(i, { t_value: this.t_value, monthList: this.monthList, kpiList: this.kpiList })
    //         this.myTe = te
    //       }
    //       console.log(this.myTe, 3254565)
    //       this.columsInit()
    //       // 重新定义一个数组,传递给inputList充当Table的data
    //       let myArray = []
    //       let myObject = {}
    //       for (let i = 0; i < this.monthList.length; i++) {
    //         let key = this.monthList[i]
    //         let val = this.kpiList[i]
    //         myObject[key] = val
    //       }
    //       myArray = {
    //         't_value': this.t_value[0],
    //         'l_limit': this.l_limit[0],
    //         'kpi': this.kpi.name
    //       }
    //       this.inputList = [Object.assign(myArray, myObject)]
    //     }
    //   )
    // },
    columsInit () {
      for (let i = this.monthList.length - 1; i >= 0; i--) {
        this.columns.splice(4, 0, {
          title: this.monthList[i],
          key: this.monthList[i],
          align: 'center',
          render: (h, params) => {
            let t_value = this.t_value[0]
            let l_limit = this.l_limit[0]
            const month = this.kpiList[i]
            // 做数据大小的判断,显示不同的颜色,并且return回来的是一个变量month
            if (month >= t_value) {
              return h('Tag', {
                props: { color: '#19be6b' }
              }, month)
            } else if (month <= l_limit) {
              return h('Tag', {
                props: { color: '#ed4014' }
              }, month)
            } else {
              return h('Tag', {
                props: { color: '#ff9900' }
              }, month)
            }
          }
        })
      }
    },
    change (val) {
      this.formkpi = []
      let arr = this.groupKpiList
      for (let i = 0; i < arr.length; i++) {
        if (val === arr[i].dep.name) {
          this.formkpi.push(arr[i].kpi)
          // this.kpi = Object.keys(this.formkpi)
          // this.kpi = Object.keys(this.formkpi)
        }
      }
      this.handelPostGroupKpi()
      // this.handelgetInputList()
    }
    // 动态更改单元格样式, 没测试成功, 查看资料需要在data中先设置cellClassName, 但是render回来的数据不知道怎么操作。。
    // test (params) {
    //   let column = params.column.key
    //   let row = params.index
    //   this.$set(this.inputList[row].cellClassName, column, 'err')
    // }
  },
  created () {
    // this.handelgetInputList()
    this.handelGetDepList()
    this.handelGetGroupKpiList()
  }
}
</script>

<style lang="less">
.err {
  background-color: #ff9900;
  color: #fff
}
</style>
