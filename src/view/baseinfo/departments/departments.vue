<template>
  <div>
    <Card>
      <Row>
        <div style="padding-bottom: 10px">
          <Button style="margin-right:8px;" @click="handelDeleteDep(this.selectData)">
            <Icon type="ios-trash-outline" size="15" style="margin-bottom: 3px" ></Icon>删除</Button>
          <Button @click="depModal = true" type="primary" style="float:right">
            <Icon type="ios-add" size="20" style="margin-bottom: 3px"></Icon>新增部门</Button>
        </div>
        <Col span="24">
          <Table :columns="columns" :data="depList" :loading="loading"
                  @on-selection-change="selectChange"></Table>
        </Col>
      </Row>
    </Card>
    <Modal v-model="depModal" width="500" title="新增部门" draggable scrollable>
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
                <Option value="group">集团公司</Option>
                <Option value="sale">销售片区</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large" @click="handelCreateDep">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getDepList, deleteDep, createDep } from '../../../api/account/departments'
import expandRow from './table-expand'

export default {
  name: 'departments',
  components: { expandRow },
  data () {
    return {
      showCheckbox: true,
      depModal: false,
      loading: false,
      depForm: {
        name: '',
        type: ''
      },
      ruledepForm: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '部门类型不能为空', trigger: 'blur' }]
      },
      selectData: [],
      editIndex: -1,
      editName: '',
      editType: '',
      columns: [
        // {
        //   type: 'expand',
        //   width: 20,
        //   render: (h, params) => {
        //     let members = []
        //     for (let i = 0; i < params.row.member.length; i++) {
        //       members.push(params.row.member[i].nickname)
        //     }
        //     return h(expandRow,
        //       { props: { row: members } }
        //       // h('Span', {
        //       //   style: {
        //       //     marginLeft: '10px'
        //       //   }
        //       // }, members.map(function (item, index) {
        //       //   return h('Tag', item)
        //       // }))
        //     )
        //   }
        // },
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '序号',
          type: 'index',
          align: 'center',
          key: 'id',
          width: '100px',
          sortable: true
        },
        {
          title: '名称',
          key: 'name',
          align: 'center',
          render: (h, { row, index }) => {
            let edit
            // return中不能使用for循环,所以在render中事先定义好循环遍历出tbody数据格式
            let members = []
            row.member.forEach((a, index) => {
              members.push(h('tbody', [
                h('tr', [
                  h('td', index + 1),
                  h('td', a.nickname),
                  h('td', a.username)
                ])
              ]))
            })
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
            return [h('span', {
              style: {
                marginRight: '3px'
              }
            }, [edit]),
            h('Poptip', {
              props: {
                transfer: true,
                placement: 'right',
                width: '300'
              }
            }, [
              h('div', {
                slot: 'content',
                class: 'show'
              }, [
                h('table', {}, [
                  h('thead', [
                    h('tr', {}, [
                      h('th', 'ID'),
                      h('th', '姓名'),
                      h('th', '用户名')
                    ])
                  ]),
                  members
                ])
              ]),
              h('Badge', {
                props: {
                  count: row.member.length,
                  type: 'primary'
                }
              }
              )]
            )
            // if (that.member.length) {
            //   h('Badge', {
            //     props: {
            //       count: that.member.length,
            //       type: 'primary'
            //     }
            //   })
            // } else {
            //   h('Badge', {
            //     props: {
            //       count: 0,
            //       type: 'warning'
            //     }
            //   })
            // }
            ]
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
            let members = []
            for (let i = 0; i < row.member.length; i++) {
              members.push(row.member[i].nickname)
            }
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
                // 应该将Button包裹在Poptip中,不然会出现必须点击Poptip中的文件才可以弹出删除提示。 先h('Poptip')再h('Button')
                h('Poptip', {
                  props: {
                    confirm: true,
                    transfer: true,
                    placement: 'left',
                    title: `确定要删除${row.name}吗`,
                    type: 'error',
                    size: 'small',
                    width: '300',
                    vModel: true
                  },
                  style: {
                    marginRight: '6px'
                  },
                  on: {
                    'on-ok': () => {
                      this.handelDeleteDep(row)
                    },
                    'on-cancel': () => {
                      console.log(typeof (row), row)
                      this.$Message.info('点击了取消')
                    }
                  }
                }, [
                  h('Button', {
                    props: {
                      type: 'error',
                      icon: 'ios-trash-outline'
                    }
                  }, '删除')]),
                h('Poptip', {
                  props: {
                    title: '部门成员',
                    placement: 'left',
                    // slot: 'content',
                    width: '300'
                    // vModel: true,
                    // type: 'error'
                  }
                }, [
                  h('Button', {
                    props: {
                      type: 'success',
                      icon: 'ios-keypad'
                    },
                    style: {
                      marginLeft: '6px'
                    }
                  }, `成员(${row.member.length})`),
                  h('div', {
                    slot: 'content',
                    props: {

                    }
                  }, [
                    h('Span', {
                      style: {
                        marginLeft: '10px'
                      }
                    }, members.map(function (item, index) {
                      return h('Tag', item)
                    }))
                  ])
                ])
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
    handelCreateDep () {
      createDep(this.depForm).then(
        res => {
          this.$Message.success(`部门:${this.depForm.name}添加成功`)
          this.depModal = false
          this.handelGetDepList()
        }
      )
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
    },
    // selectAll (arr) {
    // },
    // 当多选发生变化时,带出选择状态下的值
    selectChange (arr) {
      this.selectData = arr
    }
  },
  created () {
    this.handelGetDepList()
  },
  computed: {
    // columns () {
    //   let temp_columns = []
    //   temp_columns.push({
    //     type: 'selection',
    //     width: 60,
    //     align: 'center'
    //   })
    //   // temp_columns.push({
    //   //   title: '名称',
    //   //   key: 'name',
    //   //   align: 'center',
    //   //   render: (h, { row, index }) => {
    //   //     let edit
    //   //     if (this.editIndex === index) {
    //   //       edit = [h('Input', {
    //   //         props: {
    //   //           value: row.name
    //   //         },
    //   //         on: {
    //   //           input: (val) => {
    //   //             this.editName = val
    //   //           }
    //   //         }
    //   //       })]
    //   //     } else {
    //   //       edit = row.name
    //   //     }
    //   //     return h('div', [edit])
    //   //   }
    //   // })
    //   return temp_columns
    // }
  }
}
</script>

<style>
  .show table {
    table-layout: fixed;
    font-family:"Trebuchet MS", Arial, Helvetica, sans-serif;
    width:100%;
    border-collapse:collapse;
    border:1px solid #e9e9e9;
  }
  .show td, .show th {
    font-size:1em;
    border:1px solid #e9e9e9;
    padding:3px 7px 2px 7px;
    text-align: center;
  }
  .show th {
    font-size:1.1em;
    padding-top:5px;
    padding-bottom:4px;
    background-color:#f7f7f7;
  }
</style>
