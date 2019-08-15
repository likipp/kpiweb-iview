<template>
    <div class="departments-list">
      <Table border :columns="columns" :data="value">
        <template slot-scope="{ row }" slot="id">
          <strong>{{ row.id }}</strong>
        </template>
        <template slot-scope="{ row }" slot="name">
          <strong>{{ row.name }}</strong>
        </template>
        <template slot-scope="{ row }" slot="type">
          <strong>{{ row.type.name }}</strong>
        </template>
        <template slot-scope="{ row }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="handelOpenEdit(row)">编辑</Button>
          <Poptip confirm title="你确定要删除这条数据吗?" @on-ok="handelDeleteDepartments(row)">
            <Button type="error" size="small">删除</Button>
          </Poptip>
        </template>
      </Table>
    </div>
</template>

<script>
export default {
  name: 'departments-list',
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
          title: '部门名称',
          slot: 'name',
          align: 'center'
        },
        {
          title: '部门类型',
          slot: 'type',
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ]
    }
  },
  methods: {
    handelOpenEdit (value) {
      this.$emit('edit', value)
    },
    handelDeleteDepartments (value) {
      this.$emit('delete', value)
    }
  }
}
</script>

<style scoped>

</style>
