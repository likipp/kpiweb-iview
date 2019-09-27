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
          <Select v-model="form.kpi" style="width: 200px" :disabled="!form.name" @on-change="kpichange">
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
      monthlist: [],
      formkpi: [],
      inputList: [],
      monthList: [],
      form: {
        name: '',
        kpi: ''
      },
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
          width: 160,
          render: (h, params) => {
            return h('span', {}, params.row.kpi)
          }
        },
        {
          title: '下限值',
          key: '下限值',
          align: 'center',
          width: '80px',
          render: (h, params) => {
            return h('span', {}, params.row.value.l_limit)
          }
        },
        {
          title: '目标值',
          align: 'center',
          width: '80px',
          render: (h, params) => {
            return h('span', {}, params.row.value.t_value)
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
      //  当切换部门时,删除表格中现在有的列数据, 只输入4代表从第4列开始删除到结尾的数据
      this.columns.splice(4)
      let data = this.form
      selectData(data).then(
        res => {
          let result = Object.entries(Object.entries(res.data)[0][1]).map(([key, value]) => {
            return { value: value, kpi: key }
          })
          this.monthlist = []
          const date = new Date()
          for (let i = 12; i > 0; i--) {
            if (i < 10) {
              this.monthlist.push((date.getFullYear() + '').substr(2, 3) + '/' + 0 + i)
            } else {
              this.monthlist.push((date.getFullYear() + '').substr(2, 3) + '/' + i)
            }
          }
          for (let i = 0; i < this.monthlist.length; i++) {
            this.columns.splice(4, 0, {
              title: this.monthlist[i],
              key: this.monthlist[i],
              align: 'center',
              render: (h, params) => {
                let r_values = Object.entries(Object.entries(params.row.value.r_value))
                let t_value = Object.entries((Object.entries(params.row.value)))[0][1][1]
                let l_limit = Object.entries((Object.entries(params.row.value)))[1][1][1]
                for (let [index, r_value] of r_values) {
                  if (r_value[0].substr(2, 6) === this.monthlist[i]) {
                    if (r_value[1] >= t_value) {
                      return h('Tag', {
                        props: { color: '#19be6b' }
                      }, r_value[1])
                    } else if (r_value[1] < l_limit) {
                      return h('Tag', {
                        props: { color: '#ed4014' }
                      }, r_value[1])
                    } else {
                      return h('Tag', {
                        props: { color: '#ff9900' }
                      }, r_value[1])
                    }
                  }
                }
                return h('Tag', 'NA')
              }
            })
          }
          this.inputList = result
          this.columns.splice(16)
        }
      )
    },
    // handelPostKpi () {
    //   this.columns.splice(4)
    //   let data = this.form
    //   selectData(data).then(
    //     res => {
    //       let result = Object.entries(Object.entries(res.data)[0][1]).map(([key, value]) => {
    //         return { value: value, kpi: key }
    //       })
    //       for (let i = 0; i < this.monthlist.length; i++) {
    //         this.columns.splice(4, 0, {
    //           title: this.monthlist[i],
    //           key: this.monthlist[i],
    //           align: 'center',
    //           render: (h, params) => {
    //             let r_values = Object.entries(Object.entries(params.row.value.r_value))
    //             let t_value = Object.entries((Object.entries(params.row.value)))[0][1][1]
    //             let l_limit = Object.entries((Object.entries(params.row.value)))[1][1][1]
    //             for (let [index, r_value] of r_values) {
    //               if (r_value[0].substr(2, 6) === this.monthlist[i]) {
    //                 if (r_value[1] >= t_value) {
    //                   return h('Tag', {
    //                     props: { color: '#19be6b' }
    //                   }, r_value[1])
    //                 } else if (r_value[1] < l_limit) {
    //                   return h('Tag', {
    //                     props: { color: '#ed4014' }
    //                   }, r_value[1])
    //                 } else {
    //                   return h('Tag', {
    //                     props: { color: '#ff9900' }
    //                   }, r_value[1])
    //                 }
    //               }
    //             }
    //             return h('Tag', 'NA')
    //           }
    //         })
    //       }
    //       this.inputList = result
    //       this.columns.splice(16)
    //     }
    //   )
    // },
    change (val) {
      this.formkpi = []
      // this.inputList = []
      this.monthlist = []
      let arr = this.groupKpiList
      for (let i = 0; i < arr.length; i++) {
        if (val === arr[i].dep.name) {
          this.formkpi.push(arr[i].kpi)
        }
      }
      this.handelPostGroupKpi()
    },
    kpichange (val) {
      // this.inputList = []
      // this.monthlist = []
      this.form.kpi = val
      this.handelPostGroupKpi()
    }
    // 动态更改单元格样式, 没测试成功, 查看资料需要在data中先设置cellClassName, 但是render回来的数据不知道怎么操作。。
    // test (params) {
    //   let column = params.column.key
    //   let row = params.index
    //   this.$set(this.inputList[row].cellClassName, column, 'err')
    // }
  },
  created () {
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
