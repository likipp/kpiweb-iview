<template>
  <div>
    <Card>
      <div style="padding-bottom: 10px">
        <Button style="margin-right:8px">
          <Icon type="ios-trash-outline" size="15" style="margin-bottom: 3px"></Icon>删除</Button>
        <Input v-model="getParams.search" placeholder="搜索" style="width:auto; margin-left: 5px"
               @on-click="handleGetKpiList" @on-enter="handleGetKpiList" clearable @on-clear="handleGetKpiList"></Input>
        <Button @click="kpiModal = true" type="primary" style="float:right">
                <Icon type="ios-add" size="15" style="margin-bottom: 3px"></Icon>新增KPI</Button>
      </div>
      <div style="text-align: center">
        <Row>
          <Col span="24">
            <Table strip border :columns="columns" :data="kpiList" :loading="loading"></Table>
          </Col>
        </Row>
      </div>
      <div style="text-align: center; margin: 16px 0">
        <Page :total="total" show-sizer :current.sync="getParams.page" @on-change="handleChange"
              @on-page-size-change="sizeChange" show-total></Page>
      </div>
    </Card>
    <Modal v-model="kpiModal" width="800" :title="type === 'create' ? '增加KPI' : '修改KPI'" draggable scrollable @on-cancel="cancel">
      <Form ref="kpiForm" :model="kpiForm" :rules="ruleForm" :label-width="100">
        <Row>
          <Col span="12">
            <FormItem label="名称: " prop="name">
              <Input v-model="kpiForm.name"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="单位: " prop="unit">
              <Input v-model="kpiForm.unit"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="使用状态: " prop="status" >
              <Select v-model="kpiForm.status">
                <Option value="using">使用中</Option>
                <Option value="unused">未使用</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="开始时间: " prop="in_time">
              <Input v-model="kpiForm.in_time"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="结束时间: " prop="mo_time">
              <Input v-model="kpiForm.mo_time"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large" v-if="type === 'create'"
                @click="handleCreateKpi" :disabled="submitDisabled">确定</Button>
        <Button type="primary" size="large" v-else @click="handleUpdatekpi" :disabled="submitDisabled">修改</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getKpiList, createKpi, updateKpi, deleteKpi } from '../../api/kpi/base'
import { Button } from 'iview'

export default {
  name: 'base',
  data () {
    return {
      total: 1,
      type: 'create',
      loading: false,
      kpiModal: false,
      kpiList: [],
      getParams: {
        page: 1,
        page_size: 10,
        search: ''
      },
      kpiForm: {
        name: '',
        in_time: '',
        mo_time: '',
        unit: '',
        status: ''
      },
      ruleForm: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        in_time: [{ required: true, message: '开始日期不能为空', trigger: 'blur' }],
        mo_time: [{ required: true, message: '结束日期不能为空', trigger: 'blur' }],
        unit: [{ required: true, message: '单位不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '状态必须选择', trigger: 'blur' }]
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
          title: '名称',
          align: 'center',
          render: (h, params) => {
            return h('span', {}, params.row.name)
          }
        },
        {
          title: '单位',
          align: 'center',
          width: '100px',
          render: (h, params) => {
            return h('span', {}, params.row.unit)
          }
        },
        {
          title: '录入/修改日期',
          align: 'center',
          render: (h, params) => {
            let time = params.row.in_time + '~' + params.row.mo_time + '号'
            return h('span', {}, time)
          }
        },
        {
          title: '状态',
          align: 'center',
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
              h(Button, {
                props: {
                  type: 'primary',
                  size: 'small',
                  icon: 'ios-create-outline'
                },
                style: {
                  marginRight: '12px'
                },
                on: {
                  click: () => {
                    this.type = 'edit'
                    this.kpiModal = true
                    this.kpiForm.name = params.row.name
                    this.kpiForm.unit = params.row.unit
                    this.kpiForm.in_time = params.row.in_time
                    this.kpiForm.mo_time = params.row.mo_time
                    this.kpiForm.status = params.row.status.id
                    this.kpiForm.id = params.row.id
                  }
                }
              }, '修改'),
              h(Button, {
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
                    title: `确定要删除${params.row.name}吗？`,
                    type: 'error',
                    size: 'small',
                    width: '300',
                    vModel: true
                  },
                  on: {
                    'on-ok': () => {
                      this.handleDeleteKpi(params.row)
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
    handleGetKpiList () {
      if (this.curPage >= this.getParams.page) {
        if (this.loading) return
        this.loading = true
        getKpiList(this.getParams).then(
          res => {
            this.kpiList = res.data.results
            this.total = res.data.count
            this.loading = false
          })
      } else {
        if (this.loading) return
        this.loading = true
        this.getParams.page = 1
        getKpiList(this.getParams).then(
          res => {
            this.kpiList = res.data.results
            this.total = res.data.count
            this.loading = false
          })
      }
    },
    handleCreateKpi () {
      createKpi(this.kpiForm).then(
        res => {
          this.$Message.success(`新增用户${this.kpiForm.name}成功`)
          this.kpiModal = false
          this.$refs['kpiForm'].resetFields()
          this.handleGetKpiList()
        }
      )
    },
    handleUpdatekpi () {
      const { id, ...params } = this.kpiForm
      updateKpi(id, params).then(
        res => {
          this.$Message.success(`修改${params.name}成功`)
          this.kpiModal = false
          this.$refs['kpiForm'].resetFields()
          this.handleGetKpiList()
        }
      )
    },
    handleDeleteKpi (value) {
      const { id, ...params } = value
      deleteKpi(id).then(
        res => {
          this.$Message.success(`删除${params.name}成功`)
          this.loading = false
          this.total = this.total - 1
          this.handleGetKpiList()
        }
      )
    },
    cancel () {
      this.$Message.success('取消操作')
      this.kpiModal = false
      this.$refs['kpiForm'].resetFields()
      this.handleGetKpiList()
    },
    handleChange (val) {
      this.getParams.page = val
      this.handleGetKpiList()
    },
    sizeChange (size) {
      this.getParams.page_size = size
      this.$nextTick(() => {
        this.handleGetKpiList()
      })
    }
  },
  created () {
    this.handleGetKpiList()
  },
  computed: {
    submitDisabled () {
      let disabled = false
      if (this.kpiForm.name === '') disabled = true
      return disabled
    },
    curPage: function () {
      return Math.ceil(this.total / this.getParams.page_size)
    }
  }
}
</script>

<style scoped>

</style>
