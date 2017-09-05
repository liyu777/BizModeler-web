<template>
	<div>
		<el-button type="info" node-key="id" v-if="show" @click="toggleShow">显示所有属性</el-button>
		<el-button type="info" node-key="id" v-if="!show" @click="toggleShow">显示差异属性</el-button>
		<el-row :gutter="40">
			<el-col :span="8">
				<el-tree :data="data1" :render-content="renderContent" :default-expand-all="!show" v-if="show" :props="defaultProps"></el-tree>
				<el-tree :data="data1" :render-content="renderContent" :default-expand-all="!show" v-if="!show" :props="defaultProps"></el-tree>
			</el-col>
			<el-col :span="8">
				<el-tree :data="data2" :render-content="renderContent" :default-expand-all="!show" v-if="show" :props="defaultProps2"></el-tree>
				<el-tree :data="data2" :render-content="renderContent" :default-expand-all="!show" v-if="!show" :props="defaultProps2"></el-tree>
			</el-col>
		</el-row>
	</div>
</template>

<script>
export default {
  name: 'modelCompare',
  data () {
    return {
      show: true,
      data1: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      data2: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1+'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      defaultProps2: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    toggleShow: function () {
      this.show = !this.show
    },
    renderContent (h, arg) {
      let isRed = 'black'
      if (arg.data.id === 7) {
        isRed = 'red'
      }
      if (arg.data.id === 3) {
        isRed = 'blue'
      }
      return h('span', {
        style: {
          color: isRed
        },
        domProps: {
          innerHTML: arg.node.label
        }
      })
    }
  }
}
</script>

<style>
</style>
