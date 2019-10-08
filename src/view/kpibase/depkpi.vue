<template>
  <div>
    <Card>
      <div style="padding-bottom: 10px">
        <Button style="margin-right:8px">
          <Icon type="ios-trash-outline" size="15" style="margin-bottom:3px"></Icon>删除
        </Button>
        <Input v-model="getParams.search" placeholder="搜索" style="width:auto; margin-left:5px"
               @click="handleGetGroupKpiList" @on-enter="handleGetGroupKpiList" clearable @on-clear="handleGetGroupKpiList"></Input>
        <Button @click="groupKpiModal = true, type='create'" type="primary" style="float:right">
          <Icon type="ios-add" size="15" style="margin-bottom:3px"></Icon>新增部门指标
        </Button>
      </div>
      <div style="text-align: center">
        <Row>
          <Col span="24">
            <Table stripe border :columns="columns" :data="groupKpiList" :loading="loading"></Table>
          </Col>
        </Row>
      </div>
      <div style="text-align: center; margin: 16px 0">
        <Page :total="total" show-sizer :current.sync="getParams.page" @on-change="handleChange"
              @on-page-size-change="sizeChange" show-total></Page>
      </div>
    </Card>
    <Modal v-model="groupKpiModal" width="800" :title="type === 'create' ? '增加部门指标' : '修改部门指标'" draggable scrollable @on-cancel="cancel">
      <Form ref="groupKpiForm" :model="groupKpiForm" :label-width="100" :rules="ruleForm">
        <Row>
          <Col span="11">
            <FormItem label="部门: " prop="dep">
              <Select v-model="groupKpiForm.dep" clearable @on-change="handleChangeDep">
                <Option v-for="dep in depList" :value="dep.id" :key="dep.id">{{ dep.name }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="10">
            <FormItem label="状态: " prop="status">
              <Select v-model="groupKpiForm.status">
                <Option value="using">使用中</Option>
                <Option value="unused">未使用</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="上限值: " prop="u_limit">
              <Input v-model="groupKpiForm.u_limit"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="下限值: " prop="l_limit">
              <Input v-model="groupKpiForm.l_limit"></Input>
            </FormItem>
          </Col>
          <Col span="7">
            <FormItem label="目标值: " prop="t_value">
              <Input v-model="groupKpiForm.t_value"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="部门指标: ">
              <Transfer :data="kpiList" :target-keys="targetKeys" :list-style="listStyle"
                        @on-change="handleCreateChange" :operations="['删除', '添加']" :titles="title" filterable :filter-method="filterMethod">
<!--                <div :style="{float: 'right', margin: '5px'}">-->
<!--                  <Button size="small">刷新</Button>-->
<!--                </div>-->
              </Transfer>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large" v-if="type === 'create'" @click="handleCreateDepKpi">确定</Button>
        <Button type="primary" size="large" v-else @click="handleUpdateDepKpi">修改</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
// import { createGroupList, getGroupKpiList, updateGroupKpi, deleteGroupKpi } from '../../api/kpi/groupkpi'
import { getGroupKpiList, createGroupList, deleteGroupKpi, updateGroupKpi } from '../../api/kpi/groupkpi'
import { getDepList } from '../../api/account/departments'
import { getKpiList } from '../../api/kpi/base'
import { contains } from '../utils/transfer'

export default {
  name: 'dep-kpi',
  data () {
    return {
      title: ['可选', '已选'],
      type: 'create',
      depList: [],
      groupKpiList: [],
      kpiList: [],
      total: 1,
      loading: false,
      groupKpiModal: false,
      targetKeys: [],
      listStyle: {
        width: '250px',
        height: '300px'
      },
      getParams: {
        page: 1,
        page_size: 10,
        search: ''
      },
      groupKpiForm: {
        kpi: '',
        dep: '',
        u_limit: 0,
        l_limit: 0,
        t_value: 0,
        status: ''
      },
      ruleForm: {
        dep: [{ required: true, message: '部门必须选择', trigger: 'blur' }],
        status: [{ required: true, message: '状态必须选择', trigger: 'blur' }],
        u_limit: [{ required: true, message: '上限值必须输入', trigger: 'blur' }],
        l_limit: [{ required: true, message: '下限值必须输入', trigger: 'blur' }],
        t_value: [{ required: true, message: '目标值必须输入', trigger: 'blur' }]
      },
      columns: [
        {
          title: '序号',
          type: 'index',
          align: 'center',
          key: 'id',
          width: '80px',
          sortable: true,
          indexMethod: (row) => {
            return (row._index + 1) + (this.getParams.page * this.getParams.page_size) - this.getParams.page_size
          }
        },
        {
          title: '部门',
          align: 'center',
          render: (h, params) => {
            return h('span', {}, params.row.dep.name)
          }
        },
        {
          title: 'KPI',
          align: 'center',
          render: (h, params) => {
            return h('span', {}, params.row.kpi.name)
          }
        },
        {
          title: '上限值',
          align: 'center',
          width: '80',
          render: (h, params) => {
            return h('span', {}, params.row.u_limit)
          }
        },
        {
          title: '下限值',
          align: 'center',
          width: '80',
          render: (h, params) => {
            return h('span', {}, params.row.l_limit)
          }
        },
        {
          title: '目标值',
          align: 'center',
          width: '80',
          render: (h, params) => {
            return h('span', {}, params.row.t_value)
          }
        },
        {
          title: '状态',
          align: 'center',
          width: '140',
          render: (h, params) => {
            const row = params.row
            const color = row.status.id === 'using' ? 'success' : 'error'
            const text = row.status.id === 'using' ? '使用中' : '未使用'
            return h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
          }
        },
        {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  icon: 'ios-create-outline'
                },
                on: {
                  click: () => {
                    this.type = 'edit'
                    this.groupKpiModal = true
                    this.groupKpiForm.dep = params.row.dep.id
                    this.groupKpiForm.status = params.row.status.id
                    this.groupKpiForm.l_limit = params.row.l_limit
                    this.groupKpiForm.u_limit = params.row.u_limit
                    this.groupKpiForm.t_value = params.row.t_value
                    this.groupKpiForm.id = params.row.id
                    let kpis = params.row.kpi
                    let kpis_copy = []
                    // const arr = this.kpiList
                    // const te = arr.splice(arr.findIndex(item => item.id === kpis.id), 1)
                    kpis_copy[0] = kpis.id
                    this.targetKeys = kpis_copy
                    let kpiList_copy = []
                    let kpiList = this.kpiList
                    for (let i in kpiList) {
                      if (contains(kpis_copy, kpiList[i].id) === false) {
                        kpiList_copy.push(kpiList[i])
                      }
                    }
                    this.kpiList = kpiList_copy
                  }
                },
                style: {
                  marginRight: '12px'
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  icon: 'ios-trash-outline'
                }
              }, [
                h('Poptip', {
                  props: {
                    confirm: true,
                    transfer: true,
                    placement: 'left-start',
                    title: `确定要删除${params.row.kpi.name}吗?`,
                    type: 'error',
                    size: 'small',
                    width: '300',
                    vModel: true
                  },
                  on: {
                    'on-ok': () => {
                      this.handleDeleteDepKpi(params.row)
                    },
                    'on-cancel': () => {
                      this.$Message.info('点击了取消')
                    }
                  }
                }, '删除')
              ])
            ])
          }
        }
      ]
    }
  },
  methods: {
    kpiFormat (kpiList) {
      // Transfer需要传递一个列表
      let kpis = []
      kpiList.map((item) => {
        kpis.push({
          id: item.id - 1,
          key: item.id,
          label: item.name
        })
      })
      this.kpiList = kpis
    },
    handleGetKpiList () {
      getKpiList().then(
        res => {
          let kpiList = res.data.results
          this.kpiFormat(kpiList)
        }
      )
    },
    handleGetDepList () {
      getDepList().then(
        res => {
          this.depList = res.data.results
        }
      )
    },
    handleChangeDep (val) {
      // console.log(this.depList)
      // console.log(val, this.depList[1].id)
      for (let i = 0; i < this.depList.length; i++) {
        let prep = []
        if (val === this.depList[i].id) {
          prep = this.depList[i].prep_kpi
          this.kpiFormat(prep)
        }
      }
    },
    handleGetGroupKpiList () {
      getGroupKpiList().then(
        res => {
          if (this.curPage >= this.getParams.page) {
            if (this.loading) return
            this.loading = true
            getGroupKpiList(this.getParams).then(
              res => {
                this.groupKpiList = res.data.results
                this.total = res.data.count
                this.loading = false
              }
            )
          } else {
            if (this.loading) return
            this.loading = true
            this.getParams.page = 1
            getGroupKpiList(this.getParams).then(
              res => {
                this.groupKpiList = res.data.results
                this.total = res.data.count
                this.loading = false
              }
            )
          }
        }
      )
    },
    handleDeleteDepKpi (value) {
      const { id, ...params } = value
      deleteGroupKpi(id).then(
        res => {
          this.$Message.success(`删除${params.dep.name}下的${params.kpi.name}成功`)
          this.loading = false
          this.total = this.total - 1
          this.handleGetGroupKpiList()
        }
      )
    },
    handleCreateDepKpi () {
      let data = this.groupKpiForm
      // 默认this.targetKeys是数组(Array),而新建需要的是数值,所以要转换成数值
      for (let value of this.targetKeys.values()) {
        data.kpi = value
      }
      this.$refs[data].validate((valid) => {
        if (valid) {
          this.$Message.success('Success!')
        } else {
          this.$Message.error('Fail!')
        }
      })
      createGroupList(data).then(
        res => {
          this.$Message.success('指标新建成功')
          this.groupKpiModal = false
          this.$refs['groupKpiForm'].resetFields()
          this.targetKeys = []
          this.handleGetGroupKpiList()
        }
      )
    },
    handleUpdateDepKpi () {
      const { id, ...params } = this.groupKpiForm
      for (let value of this.targetKeys.values()) {
        params.kpi = value
      }
      updateGroupKpi(id, params).then(
        res => {
          this.$Message.success('修改成功')
          this.groupKpiModal = false
          this.$refs['groupKpiForm'].resetFields()
          this.targetKeys = []
          this.handleGetGroupKpiList()
        }
      )
    },
    handleChange (val) {
      this.getParams.page = val
      this.handleGetGroupKpiList()
    },
    sizeChange (size) {
      this.getParams.page_size = size
      this.$nextTick(() => {
        this.handleGetGroupKpiList()
      })
    },
    cancel () {
      this.$Message.info('取消操作')
      this.groupKpiModal = false
      this.$refs['groupKpiForm'].resetFields()
    },
    handleCreateChange (newTargetKeys) {
      // newTargetKeys是一个数组对象(Array),所以在更新数据时,传递的也要是数组格式 [0:1]
      // console.log(newTargetKeys)
      this.targetKeys = newTargetKeys
    },
    filterMethod (data, query) {
      return data.label.indexOf(query) > -1
    }
  },
  created () {
    this.handleGetGroupKpiList()
    this.handleGetDepList()
    this.handleGetKpiList()
  },
  computed: {
    curPage: function () {
      return Math.ceil(this.total / this.getParams.page_size)
    }
  }
}
</script>

<style>

</style>
