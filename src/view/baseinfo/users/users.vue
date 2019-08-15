<template>
  <div>
    <Card>
      <div style="padding-bottom: 10px">
        <Button style="margin-right:8px;">
          <Icon type="ios-trash-outline" size="15" style="margin-bottom: 3px"></Icon>删除</Button>
        <Input v-model="getParams.search" placeholder="搜索" style="width: auto; margin-left: 5px;"
               @on-click="handleGetUserList"   @on-enter="handleGetUserList" clearable @on-clear="handleGetUserList" />
        <Button @click="userModal = true" type="primary" style="float:right">
        <Icon type="ios-add" size="15" style="margin-bottom: 3px"></Icon>新增用户</Button>
      </div>
      <div style="text-align: center">
        <Row>
          <Col span="24">
            <Table stripe border :columns="columns" :data="List" :loading="loading"></Table>
          </Col>
        </Row>
      </div>
      <div style="text-align:center; margin:16px 0">
        <Page :total=total show-sizer :current.sync="getParams.page" @on-change="handelChange"
              @on-page-size-change="sizeChange" show-total></Page>
      </div>
    </Card>
<!--    在data中设置type默认等于create，当新增按钮点击时标题跟按钮为新增，修改成其它值时，标题跟按钮为修改-->
    <Modal v-model="userModal" width ="800" :title="type === 'create' ? '增加用户' : '修改用户'" draggable scrollable @on-cancel="cancel">
      <Row>
          <Alert type="warning" show-icon>
            <Icon type="ios-bulb-outline" slot="icon"></Icon>
            <template slot="desc">带*填写完后，并且密码必须大于6位数，提交才可以点击 </template>
          </Alert>
      </Row>
      <Form ref="userForm" :model="userForm" :rules="ruleuserForm" :label-width="100" >
        <Row>
          <Col span="12">
            <FormItem label="用户名: " prop="username">
              <Input v-model="userForm.username"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="姓名: " prop="nickname">
              <Input v-model="userForm.nickname"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="部门：" prop="dep">
              <Select v-model="userForm.dep">
                <Option v-for="dep in depList" :value="dep.id" :key="dep.id">{{ dep.name }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="密码: " prop="password">
              <Input type="password" v-model="userForm.password" placeholder="密码必须大于6位数"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="系统身份: " prop="">
              <Checkbox label="is_active" v-model="userForm.is_active" prop="is_active">已激活</Checkbox>
              <Checkbox label="is_staff" v-model="userForm.is_staff" prop="is_staff">登录后台</Checkbox>
              <Checkbox label="is_superuser" v-model="userForm.is_superuser" prop="is_superuser">管理员</Checkbox>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button  size="large" @click="cancel">取消</Button>
        <!--使用v-if对type类型做判断使用哪个Button-->
        <Button type="primary" size="large" v-if="type === 'create'"
                @click="handelCreateUser" :disabled="submitDisabled">确定</Button>
        <Button type="primary" size="large" v-else @click="handelUpdateUser" :disabled="submitDisabled">修改</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getUsersList, deleteUser, updateUser, createUser } from '../../../api/account/users'
import { getDepList } from '../../../api/account/departments'
import { Button } from 'iview'

export default {
  name: 'users',
  data () {
    return {
      buttonSize: 'large',
      userModal: false,
      type: 'create',
      total: 1,
      errorMes: '',
      getParams: {
        page: 1,
        page_size: 10,
        search: ''
      },
      columns: [
        {
          title: '序号',
          type: 'index',
          align: 'center',
          key: 'id',
          width: '100px',
          sortable: true,
          // render: (h, params) => {
          //   return h('Span', {}, params.row.id)
          // }
          indexMethod: (row) => {
            return (row._index + 1) + (this.getParams.page * this.getParams.page_size) - this.getParams.page_size
          }
        },
        {
          title: '用户名',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'person'
                }
              }),
              h('strong', params.row.username)
            ])
          }
        },
        {
          title: '姓名',
          align: 'center',
          render: (h, params) => {
            if (params.row.nickname) {
              return h('Tag', {
                props: { color: '#5cadff' }
              }, params.row.nickname)
            } else if (params.row.nickname === '') {
              return h('span', {}, '空')
            }
          }
        },
        {
          title: '所属部门',
          align: 'center',
          render: (h, params) => {
            return h('Span', {}, params.row.dep.name)
          }
        },
        {
          title: '状态',
          align: 'center',
          filters: [
            {
              label: '已激活',
              value: 1
            },
            {
              label: '未激活',
              value: 2
            }
          ],
          filterMultiple: false,
          filterMethod (value, row) {
            if (value === 1) {
              return row.is_staff === true
            } else if (value === 2) {
              return row.is_staff === false
            }
          },
          render: (h, params) => {
            // 普通写法时。
            if (params.row.is_staff === true) {
              return h('div', [
                h('span', { style: { marginRight: '3px' } }, '已激活'),
                h('Icon', {
                  props: {
                    type: 'ios-checkmark-circle-outline'
                  },
                  style: {
                    fontSize: '18px',
                    color: '#19be6b'
                  }
                })
              ])
            } else if (params.row.is_staff === false) {
              // 设置一个div，然后再div下重新生成两个h()，分别做为span,icon标签
              return h('div', [
                h('span', { style: { marginRight: '3px' } }, '未激活'),
                h('Icon', {
                  props: {
                    type: 'ios-close-circle-outline'
                  },
                  style: {
                    fontSize: '18px',
                    color: 'red'
                  }
                })
              ])
            }
            // 三目运算，简写
            // const row = params.row
            // const color = row.is_staff === true ? 'success' : 'error'
            // const text = row.is_staff === true ? '已激活' : '未激活'
            // return h('Tag', {
            //   props: {
            //     type: 'dot',
            //     color: color
            //   }
            // }, text)
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
                on: {
                  // Button监听事件使用click
                  click: () => {
                    // 此处将用户原有的数据填充到Modal框中
                    this.type = 'edit'
                    this.userModal = true
                    this.userForm.username = params.row.username
                    this.userForm.nickname = params.row.nickname
                    this.userForm.password = params.row.password
                    this.userForm.dep = params.row.dep.id
                    this.userForm.is_staff = params.row.is_staff
                    this.userForm.is_active = params.row.is_active
                    this.userForm.is_superuser = params.row.is_superuser
                    this.userForm.id = params.row.id
                  }
                },
                style: {
                  marginRight: '12px'
                }
              }, '修改'),
              h(Button, {
                // 渲染Button按钮样式
                props: {
                  type: 'error',
                  size: 'small',
                  icon: 'ios-trash-outline'
                }
              }, [
                // Button下面再次h()一个Poptip
                h('Poptip', {
                  props: {
                    confirm: true,
                    transfer: true,
                    placement: 'left-start',
                    title: `确定要删除${params.row.nickname}吗`,
                    type: 'error',
                    size: 'small',
                    width: '300',
                    vModel: true
                  },
                  on: {
                    // Poptip监听事件使用on-ok
                    'on-ok': () => {
                      this.handelDeleteUser(params.row)
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
      depList: [],
      List: [],
      editIndex: -1,
      loading: false,
      userForm: {
        username: '',
        nickname: '',
        password: '',
        role: 'user',
        dep: 0,
        is_active: true,
        is_staff: false,
        is_superuser: false
      },
      ruleuserForm: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        nickname: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        dep: [{ required: true, message: '部门不能为空', trigger: 'blur' }]
      },
      checked: false
    }
  },
  methods: {
    // 获取部门信息列表
    handelGetDepList () {
      getDepList().then(
        res => {
          this.depList = res.data.results
          console.log(res.data)
        }
      )
    },
    // 获取用户信息列表
    handleGetUserList () {
      if (this.curPage >= this.getParams.page) {
        if (this.loading) return
        this.loading = true
        getUsersList(this.getParams).then(
          res => {
            this.List = res.data.results
            this.total = res.data.count
            this.loading = false
          })
      } else {
        if (this.loading) return
        this.loading = true
        this.getParams.page = 1
        getUsersList(this.getParams).then(
          res => {
            this.List = res.data.results
            this.total = res.data.count
            this.loading = false
          })
      }
    },
    // 删除用户，通过传递过来的value获取到用户id
    handelDeleteUser (value) {
      const { id, ...params } = value
      deleteUser(id).then(
        res => {
          this.$Message.success(`删除${params.nickname}成功`)
          this.loading = false
          // 删除用户时，total数量减1，使计算属性cutPage计算出删除用户后的页码数，当删除用户后的页码书小于之前的页码数，则跳转到第一页
          this.total = this.total - 1
          this.handleGetUserList()
          // 删除用户后，判断页面还存在，如果存在，则返回当前页，如果不存在，页码重新刷新到第一页
          // if (this.getParams.page in this.getParams.page) this.getParams.page = 1
        }
      )
    },
    // 添加用户
    handelCreateUser () {
      createUser(this.userForm).then(
        res => {
          this.$Message.success(`新增${this.userForm.nickname}成功`)
          this.userModal = false
          this.userForm.is_staff = false
          this.userForm.is_superuser = false
          this.$refs['userForm'].resetFields()
          this.handleGetUserList()
        }
      ).catch(error => {
        // this.$Message.error(JSON.stringify(error.response.data['username']))
        if (error.response.data['username']) {
          this.$Message.error('用户名已存在!')
        }
      })
    },
    // patch更新用户，通过userForm获取到用户的输入信息
    handelUpdateUser () {
      const { id, ...params } = this.userForm
      updateUser(id, params).then(
        res => {
          this.$Message.success(`修改${params.nickname}成功`)
          this.userModal = false
          this.userForm.is_superuser = false
          this.userForm.is_staff = false
          this.$refs['userForm'].resetFields()
          this.handleGetUserList()
        }
      )
    },
    // 模态框中的取消按钮。
    cancel () {
      this.$Message.success('取消操作')
      this.userModal = false
      this.userForm.is_superuser = false
      this.userForm.is_staff = false
      this.$refs['userForm'].resetFields()
      this.handleGetUserList()
    },
    // 分页组件中的上下一页的按钮，用于点击事件的监听
    handelChange (val) {
      this.getParams.page = val
      this.handleGetUserList()
    },
    // 分页组件中的更换页面显示数量， 此处的page_size必须与Django中pagination组件中定义的同名，不然会出错。
    sizeChange (size) {
      this.getParams.page_size = size
      this.$nextTick(() => {
        this.handleGetUserList()
      })
    }
  },
  created () {
    this.handleGetUserList()
    this.handelGetDepList()
  },
  computed: {
    submitDisabled () {
      let disabled = false
      if (this.userForm.username === '') disabled = true
      if (this.userForm.password.length < 6) disabled = true
      return disabled
    },
    curPage: function () {
      return Math.ceil(this.total / this.getParams.page_size)
    }
  }
}
</script>
