<template>
    <div>
      <Card>
        <Row>
          <div style="padding-bottom: 10px">
            <Button style="margin-right:8px;">
              <Icon type="ios-trash-outline" size="15" style="margin-bottom: 3px" ></Icon>删除</Button>
            <Button @click="groupModal = true" type="primary" style="float:right">
              <Icon type="ios-add" size="20" style="margin-bottom: 3px"></Icon>新增组</Button>
          </div>
        </Row>
        <div style="text-align: center">
          <Table stripe border :columns="columns" :data="List" :loading="loading"></Table>
        </div>
      </Card>
      <Modal class-name="vertical-center-modal" v-model="groupModal" title="新增组" width="700" draggable scrollable>
        <Form :model="groupForm">
          <FormItem label="组名：" :label-width="100">
            <Input v-model="groupForm.name" palceholer="请输入组名"></Input>
          </FormItem>
<!--          <Col span="24">-->
<!--            -->
<!--          </Col>-->
          <FormItem label="权限:">
            <Transfer filterable :operations="['删除', '添加']">

            </Transfer>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button size="large" @click="cancel">取消</Button>
          <Button type="primary" size="large" @click="handleCreateGroup">确定</Button>
        </div>
      </Modal>
    </div>
</template>

<script>
import { getGroupsList, deleteGroup } from '../../../api/account/groups'
import { Button } from 'iview'

export default {
  name: 'groups.vue',
  data () {
    return {
      groupModal: false,
      groupForm: {
        name: ''
      },
      loading: false,
      memberList: [],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '序号',
          width: 80,
          type: 'index',
          align: 'center',
          key: 'id',
          sortable: true
        },
        {
          title: '组名',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'person'
                }
              }),
              h('strong', params.row.name)
            ])
          }
        },
        {
          title: '成员',
          align: 'center',
          render: (h, params) => {
            let memberList = []
            for (let i = 0; i < params.row.members.length; i++) {
              memberList.push(params.row.members[i].nickname)
            }
            return h('span', memberList.map(function (item, index) {
              return h('Tag', {
                props: {
                  color: 'purple'
                }
              }, item)
            }))
          }
        },
        {
          title: '权限',
          align: 'center',
          render: (h, params) => {
            let permissionList = []
            for (let i = 0; i < params.row.group_permissions.length; i++) {
              permissionList.push(params.row.group_permissions[i].name)
            }
            return h('span', permissionList.map(function (item, index) {
              return h('Tag', {
                props: {
                  color: 'purple'
                }
              }, item)
            }))
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
                    title: '确定要删除吗?',
                    type: 'error',
                    size: 'small',
                    width: '300',
                    vModel: true
                  },
                  on: {
                    'on-ok': () => {
                      this.handleDeleteGroup(params.row)
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
      ],
      List: []
    }
  },
  methods: {
    handleGetGroupsList () {
      getGroupsList().then(
        res => {
          this.List = res.data.results
        }
      )
    },
    handleCreateGroup () {},
    handleDeleteGroup (value) {
      const { id, ...params } = value
      deleteGroup(id).then(
        res => {
          this.$Message.success(`删除${params.nickname}成功`)
          this.loading = false
          this.handleGetGroupsList()
        }
      )
    },
    cancel () {
      this.groupModal = false
      this.$Message.info('取消操作')
    }
  },
  created () {
    this.handleGetGroupsList()
  }
}
</script>

<style lang="less">
  /*.vertical-center-modal{*/
  /*  display: flex;*/
  /*  align-items: center;*/
  /*  justify-content: center;*/

  /*.ivu-modal{*/
  /*  top: 0;*/
  /*}*/
  /*}*/
</style>
