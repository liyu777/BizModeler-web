<template>
    <div>
        <el-input placeholder="输入关键字进行过滤"
              v-model="filterText">
    </el-input>
    <el-tree class="filter-tree"
             :data="data2"
             :props="defaultProps"
             default-expand-all
             :filter-node-method="filterNode"
             ref="tree2">
    </el-tree>
    </div>
</template>
<script>
export default {
  watch: {
    filterText (val) {
      this.$refs.tree2.filter(val)
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }
  },
  data () {
    return {
      filterText: '',
      data2: [{
        label: '企业模型 EDM',
        children: [{
          label: '流程/活动 Process',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '资源 Resource',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  }
}
</script>
<style>

</style>
