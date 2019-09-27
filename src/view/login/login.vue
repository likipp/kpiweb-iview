<template>
  <div class="login" @keydown.enter="handleSubmit">
    <div class="login-con">
<!--      <Card :bordered="false">-->

<!--      </Card>-->
      <p slot="title" style="color: white">
        <Icon type="md-log-in"></Icon>
        欢迎登录
      </p>
      <div class="form-con">
        <Form ref="loginForm" :model="form" :rules="rules">
          <FormItem prop="userName">
            <!--              <Input v-model="form.userName" placeholder="请输入用户名">-->
            <!--              <span slot="prepend">-->
            <!--                <Icon :size="16" type="ios-contact-outline"></Icon>-->
            <!--              </span>-->
            <!--              </Input>-->
            <Input v-model="form.userName" placeholder="请输入用户名">
              <Icon :size="16" type="ios-contact-outline" slot="prefix"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="password">
            <!--              <Input type="password" v-model="form.password" placeholder="请输入密码">-->
            <!--              <span slot="prepend">-->
            <!--                <Icon size="14" type="ios-lock-outline"></Icon>-->
            <!--              </span>-->
            <!--              </Input>-->
            <Input type="password" v-model="form.password" placeholder="请输入密码">
              <Icon :size="16" type="ios-lock-outline" slot="prefix"></Icon>
            </Input>
          </FormItem>
          <FormItem>
            <Checkbox>记住密码</Checkbox>
          </FormItem>
          <FormItem>
            <Button @click="handleSubmit" type="primary" long>登录</Button>
          </FormItem>
        </Form>
        <p class="login-tip"></p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

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
    // let user = localStorage.getItem('user')
    // this.form.userName = user
  },
  methods: {
    ...mapActions([
      'handleLogin'
    ]),
    handleSubmit () {
      // this.$refs.loginForm.validate((valid) => {
      //   if (valid) {
      //
      //   }
      // })
      // this.login(this.form.userName, this.form.password)
      const userName = this.form.userName
      const password = this.form.password
      this.handleLogin({
        username: userName,
        password: password
      }).then(() => {
        this.$Message.success('登录成功')
        this.$router.push({
          name: 'home'
        })
      }).catch(() => {
        this.$Message.error('用户名或者密码错误')
      })
    }
    // login (user, password) {
    //   const data = { username: user, password: password }
    //   Login(data).then(response => {
    //     let token = response.data.token
    //     Cookies.set('token', token)
    //     Cookies.set('user', user)
    //     // Cookies.set('password', password)
    //     localStorage.setItem('user', user)
    //     this.$router.push({ name: 'home' })
    //     console.log(this)
    //     this.$Message.success(
    //       '登录成功'
    //     )
    //   }).catch(() => {
    //     console.log(22222)
    //     this.$Message.error('用户名或者密码错误')
    //   })
    // }
    // login (user, password) {
    //   const data = { username: user, password: password }
    //   console.log(data.username, data.password, 88888)
    //   this.handleLogin(data.username, data.password).then(() => {
    //     console.log(11111)
    //   }).catch(() => {
    //     console.log(2222)
    //     this.$Message.error('登录失败')
    //   })
    // }
  }
}
</script>

<style lang="less">
  @import './login.less';
</style>
