<template>
  <div class="login" @keydown.enter="handleSubmit">
    <div class="login-con">
      <Card :bordered="false">
        <p slot="title">
          <Icon type="log-in"></Icon>
          欢迎登录
        </p>
        <div class="form-con">
          <Form ref="loginForm" :model="form" :rules="rules">
            <FormItem prop="userName">
              <Input v-model="form.userName" placeholder="请输入用户名">
              <span slot="prepend">
                <Icon :size="16" type="ios-person"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="form.password" placeholder="请输入密码">
              <span slot="prepend">
                <Icon size="14" type="md-lock"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem>
              <Button @click="handleSubmit" type="primary" long>登录</Button>
            </FormItem>
          </Form>
          <p class="login-tip"></p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { Login } from '../../api/account/users'

export default {
  data () {
    return {
      form: {
        userName: '',
        password: ''
      },
      rules: {
        userName: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    let user = localStorage.getItem('user')
    this.form.userName = user
  },
  methods: {
    handleSubmit () {
      // this.$refs.loginForm.validate((valid) => {
      //   if (valid) {
      //
      //   }
      // })
      this.login(this.form.userName, this.form.password)
    },
    login (user, password) {
      const data = { username: user, password: password }
      Login(data).then(response => {
        let token = response.data.token
        Cookies.set('token', token)
        Cookies.set('user', user)
        Cookies.set('password', password)
        localStorage.setItem('user', user)
        this.$router.push({ name: 'home' })
        this.$Message.success(
          '登录成功'
        )
      }).catch(() => {
        this.$Message.error('用户名或者密码错误')
      })
    }
  }
}
</script>

<style lang="less">
  @import './login.less';
</style>
