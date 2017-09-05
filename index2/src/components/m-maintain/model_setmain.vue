<template>
<div>
  <el-dialog title="方法选择" v-model="treeVisible" >
                    <methodClass @upup="changeType"></methodClass>
                  </el-dialog>
  <el-dialog title="属性扩展" v-model="attrVisible" size="full" @close="querySetMain">
    <attr :id="attrid" :classid="treeEdmcEdmdId" v-if="attrVisible" ></attr>
  </el-dialog>
  <el-form class="class-setMain" :inline="true"  :data="data" >
    <el-form-item label="类名称:">
      {{ data.edmpEdmcName}}
    </el-form-item>
    <el-form-item label="属性集名称:">
      {{ data.edmpName }}
    </el-form-item>
  </el-form>
   <el-form >
 <el-table :data="tableData"  style="width: 100%;display:block" >
                <el-table-column type="index"  align='center' label="序号" width="70"></el-table-column>
                <el-table-column prop="edmpEdmcName" label="继承类" align='center' width="80">
                <template scope="scope">
                    {{scope.row.edmpEdmcName}}
                </template></el-table-column>
                <el-table-column prop="edmpCode" label="属性代码" align='center'  width="100">
                <template scope="scope">
                  <div v-if="scope.row.m_operation">
                    {{scope.row.edmpCode}}
                   </div>
                   <div v-else>
                     <el-input v-model="scope.row.edmpCode" value="scope.row.edmpCode" @blur="checkDataCode" :disabled="true"></el-input>
                   </div>
                 </template></el-table-column>
                <el-table-column prop="edmpName" label="属性名称" align='center' >
                <template scope="scope">
                  <div v-if="scope.row.m_operation">
                    {{scope.row.edmpName}}
                   </div>
                   <div v-else>
                    <el-input v-model="scope.row.edmpName" value="scope.row.edmpName" width="150" @blur="checkDataName"></el-input>
                  </div>
                </template></el-table-column>
                <el-table-column prop="edmpValueType" label="属性值类型" align='center' width="120">
                <template scope="scope">
                  <div v-if="scope.row.m_operation && (scope.row.edmpValueType ==='varchar'||scope.row.edmpValueType === 'float')">
                    {{scope.row.edmpValueName}}({{scope.row.edmpValueSize }})
                  </div>
                  <div v-if="scope.row.m_operation && scope.row.edmpValueType !=='varchar'&& scope.row.edmpValueType !== 'float'">
                    {{scope.row.edmpValueName}}
                  </div>
                  <div v-if="!scope.row.m_operation">
                    <el-popover
                      ref="popover3"
                      placement="right-end"
                      :title="scope.row.edmpValueType === 'varchar'?'长度':'精度'"
                      width="200"
                      :disabled="(scope.row.edmpValueType === 'varchar'||scope.row.edmpValueType === 'float')?false:true"
                      trigger="hover">
                      <el-input v-model="scope.row.edmpValueSize" value="scope.row.length" ref="length" >{{scope.row.edmpValueSize }}</el-input>
                    </el-popover>
                    <el-select v-model="scope.row.edmpValueType" v-popover:popover3>
                      <el-option v-for="options in option" :key="options.id" :label="options.codeName" :value="options.codeValue" >
                        {{options.codeName}}</el-option>
                    </el-select>
                  </div>
                </template></el-table-column>
                <el-table-column prop="edmpValueLimit" label="属性限值" align='center'>
                <template scope="scope">
                  <div v-if="!scope.row.m_operation && scope.row.edmpValueType !== 'object' && scope.row.edmpValueType !== 'assemble' && scope.row.edmpValueType !== 'instantiate'">
                    <el-input v-model="scope.row.edmpValueLimit" value="scope.row.edmpValueLimit"></el-input>
                  </div>
                  <div v-else-if="scope.row.m_operation && scope.row.edmpValueType !== 'object' && scope.row.edmpValueType !== 'assemble' && scope.row.edmpValueType !== 'instantiate'">
                    {{ scope.row.edmpValueLimit }}
                  </div>
                </template></el-table-column>
                <el-table-column prop="edmpFormula" label="属性公式" align='center'>
                <template scope="scope">
                  <div v-if="!scope.row.m_operation && scope.row.edmpValueType !== 'object' && scope.row.edmpValueType !== 'assemble' && scope.row.edmpValueType !== 'instantiate'">
                    <el-input v-model="scope.row.edmpFormula" value="scope.row.edmpFormula"></el-input>
                  </div>
                  <div v-else-if="scope.row.m_operation && scope.row.edmpValueType !== 'object' && scope.row.edmpValueType !== 'assemble' && scope.row.edmpValueType !== 'instantiate'">
                    {{scope.row.edmpFormula}}
                  </div>
                </template></el-table-column>
                <el-table-column prop="edmpValue" label="属性值" align='center' width="100">
                <template scope="scope">
                  <div v-if="scope.row.m_operation  && scope.row.edmpValueType === 'assemble'">
                    <a  size="small" @click="goSetMain(scope.$index, scope.row)" >属性集</a>
                  </div>
                  <div v-else-if="!scope.row.m_operation  && scope.row.edmpValueType === 'assemble'">
                    属性集
                  </div>
                  <div v-else-if="scope.row.m_operation && scope.row.edmpValueType !== 'assemble'">
                    {{scope.row.edmpValue}}
                  </div>
                  <div v-else-if=" !scope.row.m_operation  && (scope.row.edmpValueType === 'object'|| scope.row.edmpValueType === 'instantiate') ">
                    <el-input v-model="scope.row.edmpValue"
                              placeholder=""  icon="view" @click="OpenTree1(scope.$index)"></el-input>
                       <el-dialog title="类选择" v-model="treeVisible1" size="tiny">
                         <tree :modelID="treeEdmcEdmdId" @nodeSelect="funcTree1Selected"></tree>
                       </el-dialog>
                </div>
                <div v-else>
                  <el-input v-model="scope.row.edmpValue" value="scope.row.edmpValue"></el-input>
                </div>
                </template></el-table-column>
                <el-table-column prop="edmpEdmmName" label="修改响应方法" align='center' width="100">
                <template scope="scope">
                  <div v-if="!scope.row.m_operation && scope.row.edmpValueType !== 'object' && scope.row.edmpValueType !== 'assemble' && scope.row.edmpValueType !== 'instantiate'">
                    <el-input v-model="scope.row.edmpEdmmName"
                              placeholder=""  icon="view" @click="OpenTree(scope.$index)" readonly></el-input>
                </div>
                <div v-else-if="scope.row.m_operation && scope.row.edmpValueType !== 'object' && scope.row.edmpValueType !== 'assemble' && scope.row.edmpValueType !== 'instantiate'">
                  <a  size="small"  @click="ShowTree(scope.row)" >{{scope.row.edmpEdmmName}}</a>
                </div>
                </template>
                </el-table-column></el-table-column>
                <el-table-column prop="edmpExtendProperty" label="属性扩展" align='center' width="150">
                <template scope="scope">
                    <div v-if="scope.row.m_operation && scope.row.edmpValueType !== 'object' && scope.row.edmpValueType !== 'assemble' && scope.row.edmpValueType !== 'instantiate'">
                        <a size="small" @click="goAttributeVindicate(scope.$index, scope.row)" >{{scope.row.edmpExtendProperty}}</a>
                    </div>
                    <div v-else-if="!scope.row.m_operation && scope.row.edmpValueType !== 'object' && scope.row.edmpValueType !== 'assemble' && scope.row.edmpValueType !== 'instantiate'">
                        <el-input v-model="scope.row.edmpExtendProperty" value="scope.row.edmpExtendProperty"></el-input>
                    </div>
                </template></el-table-column>
                <el-table-column prop="m_description" label="属性描述" align='center' width="130">
                <template scope="scope">
                  <div v-if="!scope.row.m_operation && scope.row.edmpValueType !== 'object' && scope.row.edmpValueType !== 'assemble'&& scope.row.edmpValueType !== 'instantiate'">
                    <el-input v-model="scope.row.edmpDesc" value="scope.row.edmpDesc"></el-input>
                  </div>
                  <div v-else-if=" scope.row.m_operation && scope.row.edmpValueType !== 'object' && scope.row.edmpValueType !== 'assemble'&& scope.row.edmpValueType !== 'instantiate' ">
                    {{scope.row.edmpDesc}}
                  </div>
                </template></el-table-column>
                <el-table-column prop="moduser" label="维护人" align='center'>
                  <template scope="scope">
                      <div v-if="scope.row.edmpValueType !== 'object' && scope.row.edmpValueType !== 'assemble'&& scope.row.edmpValueType !== 'instantiate'">
                        {{ scope.row.moduser }}
                      </div>
                  </template>
                </el-table-column>
                <el-table-column prop="modtimeStr" label="维护时间" width="130"  align='center'>
                  <template scope="scope">
                      <div v-if="scope.row.edmpValueType !== 'object' && scope.row.edmpValueType !== 'assemble'&& scope.row.edmpValueType !== 'instantiate'">
                        {{ scope.row.modtimeStr }}
                      </div>
                  </template>
                </el-table-column>
                <el-table-column prop="m_operation" label="操作" width="200" align='center' v-if="ifshow">
                  <template scope="scope">
                    <el-button size="small" @click="edit(scope.row)" type="rx-icon" icon="rx-bianji2" title="编辑" v-if="scope.row.m_operation" ></el-button>
                    <el-button size="small" @click="saveEdit(scope.$index, scope.row)" type="rx-icon" icon="rx-baocun2" title="保存" v-else ></el-button>
                    <el-button size="small" @click="mainDelete(scope.$index, scope.row)" type="rx-icon" icon="rx-shanchu2" title="删除" v-if="scope.row.m_operation"></el-button>
                    <el-button size="small" @click="cancel(scope.row)" type="rx-icon" icon="rx-chexiao" title="取消" v-if="!scope.row.m_operation"></el-button>
                    <el-button size="small" @click="shiftUp(scope.$index, scope.row)" type="rx-icon" icon="rx-shangyi2" title="上移" v-if="scope.row.m_operation"></el-button>
                    <el-button size="small" @click="shiftDown(scope.$index, scope.row)" type="rx-icon" icon="rx-xiayi2" title="下移" v-if="scope.row.m_operation"></el-button>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
         </el-form>
  </div>
</template>
<script>
import Tree from '@/components/common/ClassTreeSelector'
import methodClass from '@/components/m-cmpns/method-choice'
import attr from '../ly-components/attributeVindicate.vue'

export default {
  name: 'setMain',
  data () {
    return {
      tableData: [],
      rowNum: 0,
      option: [],
      data: {},
      ifshow: true,
      treeVisible: false,
      treeVisible1: false,
      attrVisible: false,
      attrid: ''
    }
  },
  methods: {
    goSetMain (index, list) {
      console.log(index)
      if (this.$store.state.showType === 0) {
        window.location.href = '/#setMain/0/' + list.id
      } else {
        window.location.href = '/#setMain/1/' + list.id
      }
      var id = this.$store.state.modelMainLeftTreeCurrSelectId
      this.querySetMain(id)
    },
    edit: function (row) {
      row.m_operation = !row.m_operation
      this.$store.dispatch('editProperty', row.edmpEdmcId)
    },
    cancel: function (row) {
      row.m_operation = !row.m_operation
      var id = this.$store.state.modelMainLeftTreeCurrSelectId
      this.querySetMain(id)
    },
    created: function () {
      console.log(this.$route.params.type)
      if (this.$route.params.type === '0') {
        this.ifshow = false
      }
      if (this.$route.params.if === '0') {
        this.$store.dispatch('showType', 0)
      }
    },
    treeEdmcEdmdId: function () {
      return this.$store.state.treeEdmcEdmdId
    },
    ShowTree: function (row) {
      this.$store.dispatch('addMethod', row.edmpEdmmId)
      this.treeVisible = true
          /* this.$router.push('/method-choice/0/' + row.edmpEdmmId) */
    },
    goAttributeVindicate (index, list) {
      console.log(index)
      console.log(list)
      /* window.location.href = '/#attributeVindicate/' + list.id + '/' + this.$store.state.treeEdmcEdmdId */
      this.attrVisible = true
      this.attrid = list.id
    },
    changeType: function () {
      this.tableData[this.rowNum].edmpEdmmName = this.$store.state.methodsChoiceName
      this.treeVisible = false
    },
    OpenTree: function (index) {
      this.rowNum = index
      this.$store.dispatch('addMethod', 0)
      this.treeVisible = true
    },
    OpenTree1: function (index) {
      this.rowNum = index
      this.treeVisible1 = true
    },
    funcTree1Selected: function (edmc) { // 这个树返回的是一个对象
      this.treeVisible1 = false
      this.$store.dispatch('classSelectId', edmc.id)
      this.$store.dispatch('classSelectName', edmc.edmcName)
      this.tableData[this.rowNum].edmpValue = edmc.edmcName
    },
    queryType () {
      var vm = this
      window.axios.get('/v1/codes/edm_field_type')
        .then(function (response) {
          vm.option = response.data.data
        }).catch(function (error) {
          console.info(error)
        })
    },
    mainDelete (index, list) {
      console.info(index)
      console.info(list.id)
      var vm = this
      this.$confirm('是否确认继续?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.axios.delete('/v1/properties/' + list.id)
          .then(function (res) {
            if (res.data.retCode === 1) {
              vm.$message({
                type: 'success',
                message: '删除成功!'
              })
              vm.querySetMain()
            } else {
              vm.$message({
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
    },
    shiftUp: function (index, row) {
      console.log(index)
      console.info(row)
      var vm = this
      var did = ''
      if (index > '0') {
        for (var i = 0; i < vm.tableData.length; i++) {
          if (row.id === vm.tableData[i].id) {
            did = vm.tableData[i - 1].id
          }
        }
        window.axios.put('/v1/properties/' + row.id + '/' + did)
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
            vm.querySetMain()
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
      console.log(vm.tableData.length)
      if (index === (vm.tableData.length - '1')) {
        vm.$message({
          showClose: true,
          message: '最后一行无法下移!'
        })
      } else {
        for (var i = 0; i < vm.tableData.length; i++) {
          if (row.id === vm.tableData[i].id) {
            uid = vm.tableData[i + 1].id
          }
        }
        window.axios.put('/v1/properties/' + uid + '/' + row.id)
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
            vm.querySetMain()
          }).catch(function (error) {
            console.info(error)
          })
      }
    },
    checkDataCode (list) {
      var vm = this
      var id = this.$store.state.modelMainLeftTreeCurrSelectId
      var newEdmpCode = list.srcElement.value
      if (newEdmpCode) {
        window.axios.get('/v1/properties/checkData', {
          params: {edmpCode: newEdmpCode, edmpName: '', edmpEdmcId: id}
        }).then((res) => {
          if (res.data.retCode === 1) {
            console.log(res.data.retCode)
          } else {
            vm.$message({
              type: 'warning',
              showClose: true,
              message: '属性代码已存在，请重新填写！'
            })
          }
        }).catch((error) => {
          vm.$message({
            type: 'error',
            showClose: true,
            message: '属性代码校验失败：' + error
          })
        })
      }
    },
    checkDataName (list) {
      var newEdmpName = list.srcElement.value
      var id = this.$store.state.modelMainLeftTreeCurrSelectId
      var vm = this
      if (newEdmpName) {
        window.axios.get('/v1/properties/checkData', {
          params: {edmpCode: '', edmpName: newEdmpName, edmpEdmcId: id}
        }).then((res) => {
          if (res.data.retCode === 1) {
            console.log(res.data.retCode)
          } else {
            vm.$message({
              type: 'warning',
              showClose: true,
              message: '属性名称已存在，请重新填写！'
            })
          }
        }).catch((error) => {
          vm.$message({
            type: 'error',
            showClose: true,
            message: '属性名称校验失败：' + error
          })
        })
      }
    },
    saveEdit (index, list) {
      console.log('...')
      console.info(index)
      console.info(list)
      var vm = this
      if (list.edmpCode === null || list.edmpCode === '') {
        vm.$message({
          showClose: true,
          message: '请输入属性代码！',
          type: 'error'
        })
        return
      }
      if (list.edmpName === null || list.edmpName === '') {
        vm.$message({
          showClose: true,
          message: '请输入属性名称！',
          type: 'error'
        })
        return
      }
      if (list.edmpValueType === null || list.edmpValueType === '') {
        vm.$message({
          showClose: true,
          message: '请选择属性值类型！',
          type: 'error'
        })
        return
      }
      if (list.id != null) {
        var length = this.$refs.length._data.currentValue
        list.edmpValueSize = length
        list.edmpEdmmName = this.$store.state.methodsChoiceName
        list.edmpEdmmId = this.$store.state.methodsChoiceId
        list.edmpObjEdmcId = this.$store.state.classSelectId
        if (list.edmpValueType === 'object' || list.edmpValueType === 'instantiate') {
          list.edmpValue = this.$store.state.classSelectName
        }
        window.axios.put('/v1/properties', list)
          .then(function (res) {
            var data = res.data
            console.log(data.retCode)
            if (data.retCode === 1) {
              vm.$message({
                showClose: true,
                message: '保存成功'
              })
              list.m_operation = !list.m_operation
            } else {
              console.log(data.errMsg)
            }
          })
          .then(function () {
            vm.querySetMain()
          })
          .catch(function (err) {
            console.log(err)
          })
      } else {
        var parentId = this.$route.params.id
        list.edmpParentId = parentId
        list.edmpEdmcId = this.$store.state.modelMainLeftTreeCurrSelectId
        list.isDel = '0'
        list.edmpEdmmName = this.$store.state.methodsChoiceName
        list.edmpEdmmId = this.$store.state.methodsChoiceId
        list.edmpObjEdmcId = this.$store.state.classSelectId
        if (list.edmpValueType === 'object' || list.edmpValueType === 'instantiate') {
          list.edmpValue = this.$store.state.classSelectName
        }
        window.axios.post('/v1/properties', list)
          .then(function (res) {
            var data = res.data
            console.log(data)
            if (data.retCode === 1) {
              vm.$message({
                showClose: true,
                message: '新增成功'
              })
              list.m_operation = !list.m_operation
            } else {
              console.log(data.errMsg)
            }
          })
          .then(function () {
            vm.querySetMain()
          })
          .catch(function (err) {
            console.log(err)
          })
      }
    },
    querySetMain () {
      var vm = this
      var arr = []
      var id = this.$route.params.id
      var classId = this.$store.state.modelMainLeftTreeCurrSelectId
      window.axios.get('/v1/properties/' + id + '/properties')
        .then(function (response) {
          console.log(response)
          if (response.data.data != null) {
            for (var i = 0; i < response.data.data.length; i++) {
              var everyData = response.data.data[i]
              everyData.m_operation = 'true'
              arr.push(everyData)
              console.log(arr)
            }
            vm.tableData = response.data.data
          } else {
            vm.tableData = []
          }
          window.axios.get('/v1/properties/getEdmpCode', {params: {classId: classId}})
            .then(function (response) {
              vm.tableData.push({
                edmpValueType: '',
                edmpValue: '',
                edmpEdmmName: '',
                edmpCode: response.data.data,
                edmpName: ''
              })
            })
        }).catch(function (error) {
          console.info(error)
        })
    },
    queryClass () {
      var vm = this
      var id = this.$route.params.id
      console.log(id)
      window.axios.get('/v1/properties/' + id)
        .then(function (response) {
          console.info(response)
          if (response.data.data === null) {
            vm.data = {}
          } else {
            vm.data = response.data.data
          }
        }).catch(function (error) {
          console.info(error)
        })
    }
  },
  computed: {
    treeEdmcEdmdId: function () {
      return this.$store.state.treeEdmcEdmdId
    }
  },
  watch: {
    'modelMainLeftTreeCurrSelectId': function () {
      console.info('modelMainLeftTreeCurrSelectId changed' + this.modelMainLeftTreeCurrSelectId)
      this.dataChange(this.modelMainLeftTreeCurrSelectId)
    },
    methodsChoiceId: function () {
      return this.$store.state.methodsChoiceId
    },
    methodsChoiceName: function () {
      return this.$store.state.methodsChoiceName
    },
    classId: function () {
      return this.$store.state.classId
    },
    classSelectId: function () {
      return this.$store.state.classSelectId
    },
    classSelectName: function () {
      return this.$store.state.classSelectName
    },
    showType: function () {
      return this.$store.state.showType
    },
    treeEdmcEdmdId: function () {
      return this.$store.state.treeEdmcEdmdId
    }
  },
  mounted: function () {
    this.querySetMain()
    this.queryType()
    this.queryClass()
    if (this.$route.params.type === '0') {
      this.ifshow = false
    }
  },
  components: {
    Tree,
    methodClass,
    attr
  }
}

</script>
<style>
  a{
    color: #91A0FB;
  }
</style>
