<template>
    <div class="class-tree-selector" id="tree">
      <el-input placeholder="输入关键字(类名)进行过滤"
        v-model="filterText">
      </el-input>
      <el-tree class="filter-tree"
        :data="treeData"
        :props="defaultProps"
        default-expand-all
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        :empty-text="emptyText"
        @node-click="nodeClick"
        ref="tree2">
      </el-tree>
    </div> <!-- /.class-tree-selector -->
</template>
<script>
export default {
  name: 'classTreeSelector',
  props: ['modelID'],
  data () {
    return {
      filterText: '',
      selectedValue: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'edmcName'
      }
    }
  },
  mounted () {
    this.queryData()
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.edmcName.indexOf(value) !== -1
    },
    queryData () {
      let id = this.modelID
      let url = `/v1/modelers/${id}/classes`
      console.log('=============')
      console.log(id)
      var _this = this
      let params = { }
      if (this.filterText.length > 0) {
        params.name = this.filterText
      }
      window.axios.get(url, {params: params})
      .then(function (res) {
        console.log(res.data.data)
        if (res.data.data) {
          _this.treeData = res.data.data
        } else {
          _this.treeData = []
        }
        _this.selectedValue = []
      })
    },
    nodeClick (nodeData, nodeObj, nodeEle) {
      this.$emit('nodeSelect', nodeData)
    }
  },
  computed: {
    emptyText: function () {
      return '根据模型ID和类名[' + this.filterText + ']没有找到匹配的类信息'
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree2.filter(val)
    },
    modelID (newval, oldval) {
      if (newval !== oldval) {
        this.queryData()
      }
    }
  }
}
</script>
<style>
  /*树节点样式*/
  #tree .el-tree-node__content{
    font-size: 16px;
    color: #6B6B74;
  }
  #tree .el-tree-node__content:hover  .el-tree-node__label{
    color: #ffffff;
  }
  /*输入框高度*/
  #tree .el-input__inner{
    height: 50px;
    line-height: 50px;
    margin-bottom: 1px;
  }
  /*类树每个节点高度（不安全）*/
/*  #tree .el-tree-node__content{
    height: 45px;
    line-height: 45px;
  }*/
</style>
