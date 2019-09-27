<template>
    <div>
      <Row class="expand-row">
        <Col span="8">
<!--          <span class="expand-value" v-for="{item} in row">{{ item }}</span>-->
          <span class="expand-value">{{ row }}</span>
        </Col>
      </Row>
    </div>
</template>

<script>
export default {
  name: 'table-expand.vue',
  props: {
    row: Array
  },
  data () {
    return {}
  }
}
</script>

<style scoped>

</style>
