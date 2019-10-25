<template>
  <div class="user-avatar-dropdown">
    <Dropdown @on-click="handleClick">
<!--      <Badge :dot="!!messageUnreadCount">-->
      <Badge>
<!--        <Avatar :src="userAvatar"/>-->
        <Avatar src="https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png"></Avatar>
<!--        <Avatar src="http://127.0.0.1:8000/media/avatar/default.jpg"></Avatar>-->
      </Badge>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
<!--        <DropdownItem name="message">-->
<!--          消息中心<Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>-->
<!--        </DropdownItem>-->
        <DropdownItem name="change_password">修改密码</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Modal v-model="modal" :title="'修改密码'">
      <Form ref="passwordForm" :model="passwordForm" label-colon label-position="right" :rules="passwordValidate">
          <FormItem label="旧密码" prop="oldPassword">
            <Input type="password" v-model="passwordForm.oldPassword" password></Input>
          </FormItem>
          <FormItem label="新密码" prop="newPassword">
            <Input type="password" v-model="passwordForm.newPassword" password></Input>
          </FormItem>
          <FormItem label="确认密码" prop="newPasswordC">
            <Input type="password" v-model="passwordForm.newPasswordC" password></Input>
          </FormItem>
      </Form>
      <div slot="footer">
        <Button  size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large" @click="handelUpdateUser">修改</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
import Cookies from 'js-cookie'
import { updateUser } from '../../../../api/account/users'

export default {
  name: 'User',
  data () {
    const validRePassword = (rule, value, callback) => {
      if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      modal: false,
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        newPasswordC: ''
      },
      passwordValidate: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '请至少输入6个字符', trigger: 'blur' },
          { max: 32, message: '最多输入32个字符', trigger: 'blur' }
        ],
        newPasswordC: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: validRePassword, trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    userAvatar: {
      type: String,
      default: ''
    }
    // messageUnreadCount: {
    //   type: Number,
    //   default: 0
    // }
  },
  methods: {
    ...mapActions([
      'Logout'
    ]),
    logout () {
      this.Logout().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    handelUpdateUser () {
      const user = Cookies.get('name')
      updateUser(user, this.passwordForm).then(
        res => {

        }
      )
    },
    change_password () {
      // this.$router.push({
      //   name: '修改密码'
      // })
      this.modal = true
    },
    cancel () {},
    // message () {
    //   this.$router.push({
    //     name: 'message_page'
    //   })
    // },
    handleClick (name) {
      switch (name) {
        case 'logout': this.logout()
          break
        // case 'message': this.message()
        //   break
        case 'change_password': this.change_password()
          break
      }
    }
  }
}
</script>
