<template>
<!--  <div class="folder-wrapper">-->
  <div>
    <Row>
      <Col span="2">
        <Tree :data="depTress" :render="renderFunc"></Tree>
      </Col>
      <Col span="22">
        <Card>
          <Table border :columns="columns1" :data="data1"></Table>
        </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
// import clonedeep from 'clonedeep'
import { getDepList } from '../../../api/account/departments'
import { depTree, transToTree } from '../../../libs/util'

export default {
  data () {
    return {
      columns1: [
        {
          title: 'Name',
          key: 'name'
        },
        {
          title: 'Age',
          key: 'age'
        },
        {
          title: 'Address',
          key: 'address'
        }
      ],
      data1: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03'
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park',
          date: '2016-10-01'
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park',
          date: '2016-10-02'
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park',
          date: '2016-10-04'
        }
      ],
      depList: [],
      depTress: [],
      renderFunc: (h, { root, node, data }) => {
        // return (
        //   // <div class="tree-item">
        //   //   <icon type="ios-folder-outline" size="480px" />
        //   //   { data.title }
        //   // </div>
        // )
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%'
          }
        }, [
          h('span', [
            h('Icon', {
              props: {
                type: 'ios-folder-outline',
                color: '#ed4014',
                size: '15'
              },
              style: {
                marginRight: '8px'
              }
            }),
            h('span', data.title)
          ])
        ])
      }
    }
  },
  methods: {
    handelGetDepList () {
      getDepList(this.params).then(
        res => {
          this.depList = res.data.results
          depTree(this.depList)
          this.depTress = transToTree(depTree(this.depList))
        })
    }
  },
  created () {
    this.handelGetDepList()
  }
}
</script>
<style lang="less">
.folder-wrapper{
  width: 400px;
  .tree-item{
    display: inline-block;
    width: ~"calc(100% -50px)";
  }
}
</style>
