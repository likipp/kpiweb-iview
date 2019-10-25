<template>
    <div>
      <Modal v-model="userModal" width ="800" :title="'增加用户'" draggable scrollable @on-cancel="cancel">
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
                <Input type="password" v-model="userForm.password" password placeholder="密码必须大于6位数"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="所属组：" prop="groups">
                <Select v-model="userForm.groups" multiple v-if="type === 'create'">
                  <Option v-for="groups in groupList" :value="groups.id" :key="groups.id">{{ groups.name }}</Option>
                </Select>
                <Select v-model="userForm.groups" multiple v-else>
                  <Option v-for="groups in groupList" :value="groups.id" :key="groups.id">{{ groups.name }}</Option>
                </Select>
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
import { createUser } from '../../../api/account/users'
import { getDepList } from '../../../api/account/departments'
import { getGroupsList } from '../../../api/account/groups'

export default {
  name: 'createModal',
  props: ['userModal'],
  data () {
    return {
      userForm: {
        username: '',
        nickname: '',
        password: '',
        role: 'user',
        dep: 0,
        groups: [],
        // { id: 0, name: '' }
        is_active: true,
        is_staff: false,
        is_superuser: false
      },
      ruleuserForm: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        nickname: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        dep: [{ required: true, message: '部门不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handelGetDepList () {
      getDepList().then(
        res => {
          this.depList = res.data.results
        }
      )
    },
    handelGetGroupList () {
      getGroupsList().then(
        res => {
          this.groupList = res.data.results
        }
      )
    },
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
  }
}
</script>

<style scoped>

</style>
