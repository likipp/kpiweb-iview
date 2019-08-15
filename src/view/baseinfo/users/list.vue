<template>
  <div class="users-list">
    <Table border :columns="columns" :data="value">
      <template slot-scope="{ row, index }" slot="id">
        <strong>{{ row.id }}</strong>
      </template>
      <template slot-scope="{ row, index }" slot="username">
        <Input type="text" v-model="values.editUserName" v-if="editIndex === index"></Input>
        <span v-else>{{ row.username }}</span>
<!--        <strong>{{ row.username }}</strong>-->
      </template>
      <template slot-scope="{ row, index }" slot="nickname">
        <Input type="text" v-model="values.editNickName" v-if="editIndex === index"></Input>
        <span v-else>{{ row.nickname }}</span>
<!--        <strong>{{ row.nickname }}</strong>-->
      </template>
      <template slot-scope="{ row, index }" slot="dep">
        <strong>{{ row.dep.name }}</strong>
      </template>
      <template slot-scope="{ row, index }" slot="is_active">
        <div v-if="row.is_active === true">
          <span>已激活</span>
        </div>
        <div v-else>
          <span>未激活</span>
        </div>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <div v-if="editIndex === index">
          <Button size="small" style="margin-right: 5px" type="primary" ghost @click="handleSave(row, index)">保存</Button>
          <Button size="small" type="error" ghost @click="editIndex = -1">取消</Button>
        </div>
        <div v-else>
          <Button type="primary" size="small" style="margin-right: 5px" @click="handelOpenEdit(row, index)">编辑</Button>
          <Poptip
            confirm
            title="你确定要删除这条数据吗?"
            @on-ok="handelDeleteUser(row)"
            @on-cancel="cancel">
            <Button type="error" size="small">删除</Button>
          </Poptip>
        </div>
      </template>
    </Table>
  </div>
</template>

<script>
export default {
  name: 'users-list',
  props: ['value'],
  data () {
    return {
      columns: [
        {
          title: '序号',
          slot: 'id',
          align: 'center'
        },
        {
          title: '用户名',
          slot: 'username',
          align: 'center'
        },
        {
          title: '姓名',
          slot: 'nickname',
          align: 'center'
        },
        {
          title: '所属部门',
          slot: 'dep',
          align: 'center'
        },
        {
          title: '状态',
          slot: 'is_active',
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action'
        }
      ],
      editIndex: -1,
      values: [
        {
          editUserName: ''
        },
        {
          editNickName: ''
        }
      ]
    }
  },
  methods: {
    handelOpenEdit (value, index) {
      this.values.editUserName = value.username
      this.values.editNickName = value.nickname
      this.values.editDep = value.dep
      this.editIndex = index
    },
    handelDeleteUser (value) {
      this.$emit('delete', value)
    },
    cancel () {
      this.$Message.info('取消删除成功')
    },
    handleSave (value) {
      console.log(value)
      value.nickname = this.values.editNickName
      this.$emit('save', value)
      this.editIndex = -1
    }
  }
}
</script>

<style scoped>

</style>
