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
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
export default {
  name: 'User',
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
    message () {
      this.$router.push({
        name: 'message_page'
      })
    },
    handleClick (name) {
      switch (name) {
        case 'logout': this.logout()
          break
        case 'message': this.message()
          break
      }
    }
  }
}
</script>
