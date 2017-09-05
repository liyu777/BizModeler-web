<template>
  <div>
    <el-dialog title="方法选择" v-model="treeVisible">
        <methodClass @upup="changeType"></methodClass>
      </el-dialog>
    <el-form :inline="true" >
      <el-form-item style="margin:0 ">
        <el-button type="info" @click="OpenTree" v-if="ifoperate">&nbsp;&nbsp;新增&nbsp;&nbsp;</el-button>
      </el-form-item>

    </el-form>
    <el-table :data="tableData"  style="width: 100%;display:block">
      <el-table-column type="index" align='center' label="序号" width="70"></el-table-column>
      <el-table-column prop="edmmTypeName" label="方法分类" align='center'></el-table-column>
      <el-table-column prop="edmmName" label="方法名称" align='center'>
        <template scope="scope">
          {{scope.row.edmmName}}
        </template></el-table-column>
      <el-table-column prop="isAuto" label="是否自动方法" align='center'>
        <template scope="scope">
          <div v-if="scope.row.isAuto === 1 ">
            {{ '是' }}
          </div>
          <div v-else-if="scope.row.isAuto === 0 ">
            {{ '否' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="isPlatformProgram" label="是否平台程序" align='center'>
        <template scope="scope">
          <div v-if="scope.row.isPlatformProgram === 1">
            {{ '是' }}
          </div>
          <div v-else-if="scope.row.isPlatformProgram === 0">
            {{ '否' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="edmmProgramType" label="程序类型" align='center'>
        <template scope="scope">
          <div v-if="scope.row.edmmProgramType === '1'">
            {{ 'java程序' }}
          </div>
          <div v-else-if="scope.row.edmmProgramType === '3'">
            {{ 'C++程序' }}
          </div>
          <div v-else-if="scope.row.edmmProgramType === '2'">
            {{ 'SQL脚本'}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="edmmVer" label="版本号" align='center'></el-table-column>
      <el-table-column prop="edmmDevelopDept" label="研发部门" align='center'></el-table-column>
      <el-table-column prop="edmmProgrammer" label="程序员" align='center'></el-table-column>
      <el-table-column prop="moduser" label="维护人" align='center'></el-table-column>
      <el-table-column prop="modtimeStr" label="维护时间"  align='center' width="130"></el-table-column>
      <el-table-column prop="md_operation" label="操作" width="200" align='center' v-if="ifoperate">
        <template scope="scope" >
          <el-button size="small" @click="methodDelete(scope.$index, scope.row)" type="rx-icon" icon="rx-shanchu2" title="删除"></el-button>
          <el-button size="small" @click="shiftUp(scope.$index, scope.row)" type="rx-icon" icon="rx-shangyi2" title="上移"></el-button>
          <el-button size="small" @click="shiftDown(scope.$index, scope.row)" type="rx-icon" icon="rx-xiayi2" title="下移"></el-button>
        </template>
      </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import methodClass from '@/components/m-cmpns/method-choice'
  export default {
    name: 'methods',
    props: [
      'ifoperate'
    ],
    data () {
      return {
        tableData: [],
        treeVisible: false
      }
    },
    mounted: function () {
      this.dataChange(this.modelMainLeftTreeCurrSelectId)
    },
    components: {
      methodClass
    },
    watch: {
      'modelMainLeftTreeCurrSelectId': function () {
        console.info('modelMainLeftTreeCurrSelectId changed' + this.modelMainLeftTreeCurrSelectId)
        this.dataChange(this.modelMainLeftTreeCurrSelectId)
      },
      methodType: function () {
        return this.$store.state.methodType
      }
    },
    computed: {
      modelMainLeftTreeCurrSelectId: function () {
        return this.$store.state.modelMainLeftTreeCurrSelectId
      }
    },
    methods: {
      changeType: function () {
        this.treeVisible = false
        var id = this.$store.state.modelMainLeftTreeCurrSelectId
        this.queryMethods(id)
      },
      OpenTree: function () {
        this.$store.dispatch('addMethod', 1)
        this.treeVisible = true
      },
      dataChange (id) {
        console.log('dataChange' + id)
        var vm = this
        console.log(vm)
        this.queryMethods(id)
      },
      shiftUp: function (index, row) {
        console.log(index)
        console.info(row.id)
        var vm = this
        var did = ''
        var id = this.$store.state.modelMainLeftTreeCurrSelectId
        if (index > '0') {
          for (var i = 0; i < vm.tableData.length; i++) {
            if (row.edcmId === vm.tableData[i].edcmId) {
              did = vm.tableData[i - 1].edcmId
            }
          }
          window.axios.put('/v1/methods/' + row.edcmId + '/' + did)
            .then(function (response) {
              var data = response.data
              if (data.retCode === 1) {
                vm.$message({
                  showClose: true,
                  message: '上移成功'
                })
              } else {
                console.log(data.errMsg)
              }
              vm.queryMethods(id)
            }).catch(function (error) {
              console.info(error)
            })
        } else {
          vm.$message({
            showClose: true,
            message: '第一行无法上移!'
          })
        }
      },
      shiftDown: function (index, row) {
        console.log(index)
        console.info(row)
        var vm = this
        var uid = ''
        var id = this.$store.state.modelMainLeftTreeCurrSelectId
        if (index === (vm.tableData.length - '1')) {
          vm.$message({
            showClose: true,
            message: '最后一行无法下移!'
          })
        } else {
          for (var i = 0; i < vm.tableData.length; i++) {
            if (row.edcmId === vm.tableData[i].edcmId) {
              uid = vm.tableData[i + 1].edcmId
            }
          }
          window.axios.put('/v1/methods/' + uid + '/' + row.edcmId)
            .then(function (response) {
              var data = response.data
              if (data.retCode === 1) {
                vm.$message({
                  showClose: true,
                  message: '下移成功'
                })
              } else {
                console.log(data.errMsg)
              }
              vm.queryMethods(id)
            }).catch(function (error) {
              console.info(error)
            })
        }
      },
      queryMethods (id) {
        var vm = this
        console.log(id)
        window.axios.get('/v1/classes/' + id + '/methods')
          .then(function (response) {
            console.info(response)
            if (response.data.data === null) {
              vm.tableData = []
            } else {
              vm.tableData = response.data.data
            }
          }).catch(function (error) {
            console.info(error)
          })
      },
      methodDelete (index, list) {
        console.info(index)
        console.info(list.id)
        var vm = this
        var id = this.$store.state.modelMainLeftTreeCurrSelectId
        this.$confirm('是否确认继续?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          window.axios.delete('/v1/classes/' + id + '/' + list.id)
            .then(function (res) {
              if (res.data.retCode === 1) {
                vm.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                vm.queryMethods(id)
              } else {
                this.$message({
                  type: 'info',
                  message: '删除失败!'
                })
              }
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    }
  }

</script>
<style>
.el-pagination {
  width: 50px;
}
</style>
