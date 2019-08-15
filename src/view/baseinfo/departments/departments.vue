<template>
  <div>
    <Card>
      <Row>
        <div style="padding-bottom: 10px">
          <Button style="margin-right:8px;">
            <Icon type="ios-trash-outline" size="15" style="margin-bottom: 3px"></Icon>删除</Button>
          <Button @click="depModal = true" type="primary" style="float:right">
            <Icon type="ios-add" size="20" style="margin-bottom: 3px"></Icon>新增部门</Button>
        </div>
        <Col span="24">
          <Table stripe border :columns="columns" :data="depList" :loading="loading"></Table>
        </Col>
      </Row>
    </Card>
    <Modal v-model="depModal" width="800" title="新增部门" draggable scrollable>
      <Form ref="depForm" :model="depForm" :rule="ruledepForm" :label-width="100">
        <Row>
          <Col>
            <FormItem label="部门名称: " prop="name">
              <Input v-model="depForm.name"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="部门类型: ">
              <Select v-model="depForm.type">
                <Option value="1">集团公司</Option>
                <Option value="2">销售片区</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getDepList, deleteDep } from '../../../api/account/departments'

export default {
  name: 'departments',
  data () {
    return {
      depModal: false,
      loading: false,
      depForm: {
        name: '',
        type: 0
      },
      ruledepForm: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '部门类型不能为空', trigger: 'blur' }]
      },
      editIndex: -1,
      editName: '',
      editType: '',
      columns: [
        {
          title: '名称',
          key: 'name',
          align: 'center',
          render: (h, { row, index }) => {
            let edit
            if (this.editIndex === index) {
              edit = [h('Input', {
                props: {
                  value: row.name
                },
                on: {
                  input: (val) => {
                    this.editName = val
                  }
                }
              })]
            } else {
              edit = row.name
            }
            return h('div', [edit])
          }
        },
        {
          title: '类型',
          key: 'type',
          align: 'center',
          render: (h, params) => {
            return h('Span', {}, params.row.type.name)
          }
        },
        {
          title: '操作',
          align: 'center',
          render: (h, { row, index }) => {
            if (this.editIndex === index) {
              return [
                h('Button', {
                  props: {
                    type: 'success'
                  },
                  on: {
                    click: () => {
                      this.depList.name = this.editName
                      this.editIndex = -1
                    }
                  }
                }, '保存'),
                h('Button', {
                  props: {
                    type: 'error'
                  },
                  style: {
                    marginLeft: '6px'
                  },
                  on: {
                    click: () => {
                      this.editIndex = -1
                    }
                  }
                }, '取消')
              ]
            } else {
              return [
                h('Button', {
                  props: {
                    type: 'primary',
                    icon: 'ios-create-outline'
                  },
                  style: {
                    marginRight: '6px'
                  },
                  on: {
                    click: () => {
                      this.editName = row.name
                      this.editIndex = index
                    }
                  }
                }, '修改'),
                h('Button', {
                  props: {
                    type: 'error',
                    icon: 'ios-trash-outline'
                  }
                }, [
                  h('Poptip', {
                    props: {
                      confirm: true,
                      transfer: true,
                      placement: 'left-start',
                      title: `确定要删除${row.type.name}吗`,
                      type: 'error',
                      size: 'small',
                      width: '300',
                      vModel: true
                    },
                    on: {
                      'on-on': () => {
                        this.handelDeleteDep(row)
                      },
                      'on-cancel': () => {
                        this.$Message.info('点击了取消')
                      }
                    }
                  }, '删除')
                ])
                //   style: {
                //     marginLeft: '6px'
                //   },
                //   on: {
                //     'on-cancel': () => {
                //       this.$Message.info('点击了取消')
                //     }
                //   }
                // }, '删除')
              ]
            }
          }
        }
      ],
      depList: []
    }
  },
  methods: {
    handelGetDepList () {
      getDepList(this.params).then(
        res => {
          this.depList = res.data.results
        })
    },
    handelDeleteDep (value) {
      deleteDep(value.id, value.name).then(
        res => {
          this.$Message.success(`删除${value.name}成功`)
          this.handelGetDepList()
        }
      )
    },
    cancel () {
      this.depModal = false
      this.$Message.success('取消操作')
    }
  },
  created () {
    this.handelGetDepList()
  }
}
</script>
