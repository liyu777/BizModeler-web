<template>
     <div>
               <el-dialog title="类选择" v-model="treeVisible1" size="tiny">
                 <tree :modelID="treeEdmcEdmdId" @nodeSelect="funcTree1Selected"></tree>
               </el-dialog>
                 <el-table :data="ifShowFather?tableData2:tableData"  style="width: 100%;display:block">
                 				<el-table-column type="index" align='center' label="序号" width="70"></el-table-column>
                        <el-table-column v-if="ifShowFather" prop="edmcName" label="继承类" align='center'>
                          <template scope="scope">
                            <div style="color:#AAAAAA">
                              {{scope.row.edmcName}}
                            </div>
                          </template></el-table-column>
                        </el-table-column>
                        <el-table-column prop="edctCode" label="属性代码" align='center'>
                          <template scope="scope">
                            <div v-if="scope.row.m_isFather" style="color:#AAAAAA">
                          <div v-if="scope.row.c_operation">
                            {{scope.row.edctCode}}
                           </div>
                           <div v-else>
                             <el-input v-model="scope.row.edctCode" value="scope.row.edctCode" @blur="checkDataCode"></el-input>
                           </div>
                            </div>
                            <div v-else>
                              <div v-if="scope.row.c_operation">
                                {{scope.row.edctCode}}
                              </div>
                              <div v-else>
                                <el-input v-model="scope.row.edctCode" value="scope.row.edctCode" @blur="checkDataCode" ></el-input>
                              </div>
                            </div>
                         </template>
                        </el-table-column>
                        <el-table-column prop="edctName" label="属性名称" align='center'>
                          <template scope="scope">
                            <div v-if="scope.row.m_isFather" style="color:#AAAAAA">
                          <div v-if="scope.row.c_operation">
                            {{scope.row.edctName}}
                           </div>
                           <div v-else>
                             <el-input v-model="scope.row.edctName" value="scope.row.edctName" @blur="checkDataName"></el-input>
                           </div>
                            </div>
                            <div v-else>
                              <div v-if="scope.row.c_operation">
                                {{scope.row.edctName}}
                              </div>
                              <div v-else>
                                <el-input v-model="scope.row.edctName" value="scope.row.edctName" @blur="checkDataName"></el-input>
                              </div>
                            </div>
                         </template>
                        </el-table-column>
                        <el-table-column label="属性值类型" align='center' prop="edctValueTypeName">
                          <template scope="scope">
                            <div v-if="scope.row.m_isFather" style="color:#AAAAAA">
                              <div v-if="scope.row.c_operation && (scope.row.edctValueType ==='varchar'||scope.row.edctValueType === 'float')">
                                {{scope.row.edctValueTypeName}}({{scope.row.edctValueSize }})
                              </div>
                              <div v-if="scope.row.c_operation && scope.row.edctValueType !=='varchar'&& scope.row.edctValueType !== 'float'">
                                {{scope.row.edctValueTypeName}}
                              </div>
                              <div v-if="!scope.row.c_operation && scope.row.edctValueType === 'varchar'">
                                <el-popover
                                  ref="popover1"
                                  placement="top-start"
                                  title="长度"
                                  width="200"
                                  trigger="hover">
                                  <el-input v-model="scope.row.edctValueSize"  value="scope.row.length" ref="length" >{{scope.row.edctValueSize }}</el-input>
                                  <el-select v-model="scope.row.edctValueType" v-popover:popover1>
                                    <el-option v-for="options in option" :key="options.id" :label="options.codeName"
                                               :value="options.codeValue" >{{options.codeName}}</el-option>
                                  </el-select>

                                </el-popover>
                              </div>
                              <div v-if="!scope.row.c_operation && scope.row.edctValueType === 'float'">
                                <el-popover
                                  ref="popover2"
                                  placement="top-start"
                                  title="精度"
                                  width="200"
                                  trigger="hover">
                                  <el-input v-model="scope.row.edctValueSize" value="scope.row.length" ref="length" >{{scope.row.edctValueSize }}</el-input>
                                </el-popover>
                                <el-select v-model="scope.row.edctValueType" v-popover:popover1>
                                  <el-option v-for="options in option" :key="options.id" :label="options.codeName"
                                             :value="options.codeValue" >{{options.codeName}}</el-option>
                                </el-select>
                              </div>
                            </div>
                            <div v-if="!scope.row.m_isFather">
                              <div v-if="scope.row.c_operation && (scope.row.edctValueType ==='varchar'||scope.row.edctValueType === 'float')">
                                {{scope.row.edctValueTypeName}}({{scope.row.edctValueSize }})
                              </div>
                              <div v-if="scope.row.c_operation && scope.row.edctValueType !=='varchar'&& scope.row.edctValueType !== 'float'">
                                {{scope.row.edctValueTypeName}}
                              </div>
                              <div v-if="!scope.row.c_operation">
                                <el-popover
                                  ref="popover3"
                                  placement="right-end"
                                  :title="scope.row.edctValueType === 'varchar'?'长度':'精度'"
                                  width="200"
                                  :disabled="(scope.row.edctValueType === 'varchar'||scope.row.edctValueType === 'float')?false:true"
                                  trigger="hover">
                                  <el-input v-model="scope.row.edctValueSize" value="scope.row.length" ref="length" >{{scope.row.edctValueSize }}</el-input>
                                </el-popover>
                                <el-select v-model="scope.row.edctValueType" v-popover:popover3>
                                  <el-option v-for="options in option" :key="options.id" :label="options.codeName" :value="options.codeValue" >
                                    {{options.codeName}}</el-option>
                                </el-select>
                              </div><!-- end of v-if="!scope.row.c_operation" -->
                            </div><!-- end of scope.row.m_isFather-->
                          </template><!-- end of 属性值类型 -->
                        </el-table-column>
                        <el-table-column prop="edctValueLimit" label="属性限值" align='center'>
                        <template scope="scope">
                          <div v-if="scope.row.m_isFather" style="color:#AAAAAA">
                            <div v-if="!scope.row.c_operation && scope.row.edctValueType !== 'object' && scope.row.edctValueType !== 'assemble' && scope.row.edctValueType !== 'instantiate'">
                              <el-input v-model="scope.row.edctValueLimit" value="scope.row.edctValueLimit"></el-input>
                            </div>
                            <div v-else-if="scope.row.c_operation && scope.row.edctValueType !== 'object' && scope.row.edctValueType !== 'assemble' && scope.row.edctValueType !== 'instantiate'">
                              {{ scope.row.edctValueLimit }}
                            </div>
                          </div>
                          <div v-else>
                            <div v-if="!scope.row.c_operation && scope.row.edctValueType !== 'object' && scope.row.edctValueType !== 'assemble' && scope.row.edctValueType !== 'instantiate' ">
                              <el-input v-model="scope.row.edctValueLimit" value="scope.row.edctValueLimit"></el-input>
                            </div>
                            <div v-else-if="scope.row.c_operation && scope.row.edctValueType !== 'object' && scope.row.edctValueType !== 'assemble' && scope.row.edctValueType !== 'instantiate' ">
                              {{ scope.row.edctValueLimit }}
                            </div>
                          </div>
                         </template></el-table-column>
                        <el-table-column prop="edctValue" label="属性值" align='center'>
                        <template scope="scope">
                          <div v-if="scope.row.m_isFather" style="color:#AAAAAA">
                            <div v-if="scope.row.c_operation  && scope.row.edctValueType === 'assemble'">
                              属性集
                            </div>
                            <div v-else-if="!scope.row.c_operation  && scope.row.edctValueType === 'assemble'">
                              属性集
                            </div>
                            <div v-else-if="scope.row.c_operation && scope.row.edctValueType !== 'object'">
                              {{scope.row.edctValue}}
                            </div>
                            <div v-else-if="scope.row.c_operation && scope.row.edctValueType === 'object'">
                              <a href="/#modelM">{{scope.row.edctValue}}</a>
                            </div>
                            <div v-else-if=" !scope.row.c_operation  && (scope.row.edctValueType === 'object'|| scope.row.edctValueType === 'instantiate') ">
                              <el-input v-model="scope.row.edctValue"
                                        placeholder=""  icon="view" @click="OpenTree1" readonly></el-input>
                            </div>
                            <div v-else>
                              <el-input v-model="scope.row.edctValue" value="scope.row.edctValue"></el-input>
                            </div>
                          </div>
                          <div v-else>
                            <div v-if="scope.row.c_operation  && scope.row.edctValueType === 'assemble'">
                            属性集
                            </div>
                            <div v-else-if="!scope.row.c_operation  && scope.row.edctValueType === 'assemble'">
                              属性集
                            </div>
                            <div v-else-if="scope.row.c_operation && scope.row.edctValueType !== 'object'">
                              {{scope.row.edctValue}}
                            </div>
                            <div v-else-if="scope.row.c_operation && scope.row.edctValueType === 'object'">
                              <a href="/#modelM">{{scope.row.edctValue}}</a>
                            </div>
                            <div v-else-if=" !scope.row.c_operation  && (scope.row.edctValueType === 'object'|| scope.row.edctValueType === 'instantiate') ">
                              <el-input v-model="scope.row.edctValue"
                                        placeholder=""  icon="view" @click="OpenTree1" readonly></el-input>
                            </div>
                            <div v-else>
                              <el-input v-model="scope.row.edctValue" value="scope.row.edctValue"></el-input>
                            </div>
                          </div>
                          <div v-else>
                            <div v-if="!scope.row.c_operation && scope.row.edctValueType !== 'object' && scope.row.edctValueType !== 'assemble' && scope.row.edctValueType !== 'instantiate' ">
                              <el-input v-model="scope.row.edctValueLimit" value="scope.row.edctValueLimit"></el-input>
                            </div>
                            <div v-else-if="scope.row.c_operation && scope.row.edctValueType !== 'object' && scope.row.edctValueType !== 'assemble' && scope.row.edctValueType !== 'instantiate' ">
                              {{ scope.row.edctValueLimit }}
                            </div>
                          </div>
                         </template></el-table-column>
                 				<el-table-column prop="edctDesc" label="属性描述" align='center'>
                        <template scope="scope">
                          <div v-if="scope.row.m_isFather" style="color:#AAAAAA">
                            <div v-if="!scope.row.c_operation && scope.row.edctValueType !== 'object' && scope.row.edctValueType !== 'assemble'&& scope.row.edctValueType !== 'instantiate'">
                              <el-input v-model="scope.row.edctDesc" value="scope.row.edctDesc"></el-input>
                            </div>
                            <div v-else-if=" scope.row.c_operation && scope.row.edctValueType !== 'object' && scope.row.edctValueType !== 'assemble'&& scope.row.edctValueType !== 'instantiate' ">
                              {{scope.row.edctDesc}}
                            </div>
                          </div>
                          <div v-else>
                            <div v-if="!scope.row.c_operation && scope.row.edctValueType !== 'object' && scope.row.edctValueType !== 'assemble'&& scope.row.edctValueType !== 'instantiate'">
                              <el-input v-model="scope.row.edctDesc" value="scope.row.edctDesc"></el-input>
                            </div>
                            <div v-else-if=" scope.row.c_operation && scope.row.edctValueType !== 'object' && scope.row.edctValueType !== 'assemble' && scope.row.edctValueType !== 'instantiate'">
                              {{scope.row.edctDesc}}
                            </div>
                          </div>
                         </template></el-table-column>
                 				<el-table-column prop="adduser" label="维护人" align='center'>
                          <template scope="scope">
                            <div v-if="scope.row.m_isFather" style="color:#AAAAAA">
                              <div v-if="scope.row.edctValueType !== 'object' && scope.row.edctValueType !== 'assemble'&& scope.row.edctValueType !== 'instantiate'">
                                {{ scope.row.adduser }}
                              </div>
                            </div>
                            <div v-else>
                              <div v-if="scope.row.edctValueType !== 'object' && scope.row.edctValueType !== 'assemble'&& scope.row.edctValueType !== 'instantiate'">
                                {{ scope.row.adduser }}
                              </div>
                            </div>
                          </template>
                        </el-table-column>
                 				<el-table-column prop="modtimeStr" label="维护时间" align='center'>
                          <template scope="scope">
                            <div v-if="scope.row.m_isFather" style="color:#AAAAAA">
                              <div v-if="scope.row.edctValueType !== 'object' && scope.row.edctValueType !== 'assemble'&& scope.row.edctValueType !== 'instantiate'">
                                {{ scope.row.modtimeStr }}
                              </div>
                            </div>
                            <div v-else>
                              <div v-if="scope.row.edctValueType !== 'object' && scope.row.edctValueType !== 'assemble'&& scope.row.edctValueType !== 'instantiate'">
                                {{ scope.row.modtimeStr }}
                              </div>
                            </div>
                          </template>
                        </el-table-column>
                 				<el-table-column prop="c_operation" label="操作" width="200" align='center' v-if="ifoperate">
                          <template scope="scope">
                            <div v-if="scope.row.m_isFather" style="color:#AAAAAA">
                              <div v-if="scope.row.edmcName !=='资产类'">
                                <!--<el-button size="small" @click="edit(scope.row)" type="text" v-if="scope.row.c_operation" >编辑</el-button>
                                <el-button size="small" @click="saveEdit(scope.$index, scope.row)" type="text" v-else >保存</el-button>
                                <el-button size="small" @click="mainDelete(scope.$index, scope.row)" type="text" v-if="scope.row.c_operation">删除</el-button>
                                <el-button size="small" @click="cancel(scope.row)" type="text" v-if="!scope.row.c_operation">取消</el-button>
                                <el-button size="small" @click="shiftUp(scope.$index, scope.row)" type="text" v-if="scope.row.c_operation">上移</el-button>
                                <el-button size="small" @click="shiftDown(scope.$index, scope.row)" type="text" v-if="scope.row.c_operation">下移</el-button>-->
                                <el-button size="small" @click="edit(scope.row)" type="rx-icon" icon="rx-bianji2" title="编辑" v-if="scope.row.c_operation" ></el-button>
                                <el-button size="small" @click="saveEdit(scope.$index, scope.row)" type="rx-icon" icon="rx-baocun2" title="保存" v-else ></el-button>
                                <el-button size="small" @click="mainDelete(scope.$index, scope.row)" type="rx-icon" icon="rx-shanchu2" title="删除" v-if="scope.row.c_operation"></el-button>
                                <el-button size="small" @click="cancel(scope.row)" type="rx-icon" icon="rx-chexiao" title="取消" v-if="!scope.row.c_operation"></el-button>
                                <el-button size="small" @click="shiftUp(scope.$index, scope.row)" type="rx-icon" icon="rx-shangyi2" title="上移" v-if="scope.row.c_operation"></el-button>
                                <el-button size="small" @click="shiftDown(scope.$index, scope.row)" type="rx-icon" icon="rx-xiayi2" title="下移" v-if="scope.row.c_operation"></el-button>
                              </div>
                              <div v-else>
                              </div>
                            </div>
                            <div v-else>
                              <div v-if="scope.row.edmcName !=='资产类'">
                                <el-button size="small" @click="edit(scope.row)" type="rx-icon" icon="rx-bianji2" title="编辑" v-if="scope.row.c_operation" ></el-button>
                                <el-button size="small" @click="saveEdit(scope.$index, scope.row)" type="rx-icon" icon="rx-baocun2" title="保存" v-else ></el-button>
                                <el-button size="small" @click="mainDelete(scope.$index, scope.row)" type="rx-icon" icon="rx-shanchu2" title="删除" v-if="scope.row.c_operation"></el-button>
                                <el-button size="small" @click="cancel(scope.row)" type="rx-icon" icon="rx-chexiao" title="取消" v-if="!scope.row.c_operation"></el-button>
                                <el-button size="small" @click="shiftUp(scope.$index, scope.row)" type="rx-icon" icon="rx-shangyi2" title="上移" v-if="scope.row.c_operation"></el-button>
                                <el-button size="small" @click="shiftDown(scope.$index, scope.row)" type="rx-icon" icon="rx-xiayi2" title="下移" v-if="scope.row.c_operation"></el-button>
                              </div>
                              <div v-else>
                              </div>
                            </div>
                          </template>
                 				</el-table-column>
                 			</el-table-column>
                 		</el-table>
     </div>
</template>
<script>
import Tree from '@/components/common/ClassTreeSelector'
export default {
  name: 'constant',
  props: [
    'ifShowFather',
    'ifoperate'
  ],
  data () {
    return {
      option: [],
      tableData: [],
      rowNum: 0,
      tableData2: [],
      treeVisible: false,
      treeVisible1: false,
      input: ''
    }
  },
  methods: {
    edit: function (row) {
      row.c_operation = !row.c_operation
      this.$store.dispatch('editProperty', row.edctEdmcId)
    },
    goSetMain (index, list) {
      console.log(index)
      if (this.$store.state.showType === 0) {
        window.location.href = '/#setMain/0/' + list.id
      } else {
        window.location.href = '/#setMain/1/' + list.id
      }
    },
    funcTree1Selected: function (edmc) { // 这个树返回的是一个对象
      this.treeVisible1 = false
      this.$store.dispatch('classSelectId', edmc.id)
      this.$store.dispatch('classSelectName', edmc.edmcName)
      this.tableData[this.rowNum].edmpEdmmName = edmc.edmcName
    },
    changePage: function (currentPage) {
      console.log(currentPage)
    },
    OpenTree1: function () {
      this.treeVisible1 = true
    },
    cancel: function (row) {
      row.c_operation = !row.c_operation
      var id = this.$store.state.modelMainLeftTreeCurrSelectId
      this.queryConstant(id)
    },
    checkDataCode (list) {
      var newEdctCode = list.srcElement.value
      var id = ''
      if (this.$store.state.classId !== null && this.$store.state.classId !== '') {
        id = this.$store.state.classId
      } else {
        id = this.$store.state.modelMainLeftTreeCurrSelectId
      }
      if (newEdctCode) {
        window.axios.get('/v1/consts/code/unique/' + newEdctCode + '/' + id).then((res) => {
          if (res.data.retCode === 1) {
            console.log(res.data.retCode)
          } else {
            this.$message({
              type: 'warning',
              showClose: true,
              message: '属性代码已存在，请重新填写！'
            })
          }
        }).catch((error) => {
          this.$message({
            type: 'error',
            showClose: true,
            message: '属性代码校验失败：' + error
          })
        })
      }
    },
    checkDataName (list) {
      var newEdctName = list.srcElement.value
      var id = ''
      if (this.$store.state.classId !== null && this.$store.state.classId !== '') {
        id = this.$store.state.classId
      } else {
        id = this.$store.state.modelMainLeftTreeCurrSelectId
      }
      if (newEdctName) {
        window.axios.get('/v1/consts/name/unique/' + newEdctName + '/' + id).then((res) => {
          if (res.data.retCode === 1) {
            console.log(res.data.retCode)
          } else {
            this.$message({
              type: 'warning',
              showClose: true,
              message: '属性名称已存在，请重新填写！'
            })
          }
        }).catch((error) => {
          this.$message({
            type: 'error',
            showClose: true,
            message: '属性名称校验失败：' + error
          })
        })
      }
    },
    shiftUp: function (index, row) {
      var vm = this
      var did = ''
      var id = this.$store.state.modelMainLeftTreeCurrSelectId
      if (index > '0') {
        for (var i = 0; i < vm.tableData2.length; i++) {
          if (row.id === vm.tableData2[i].id) {
            did = vm.tableData2[i - 1].id
          }
        }
        window.axios.put('/v1/consts/' + row.id + '/' + did)
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
            vm.queryConstant(id)
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
      var vm = this
      var uid = ''
      var id = this.$store.state.modelMainLeftTreeCurrSelectId
      if (index === (vm.tableData2.length - '2')) {
        vm.$message({
          showClose: true,
          message: '最后一行无法下移!'
        })
      } else {
        for (var i = 0; i < vm.tableData2.length; i++) {
          if (row.id === vm.tableData2[i].id) {
            uid = vm.tableData2[i + 1].id
          }
        }
        window.axios.put('/v1/consts/' + uid + '/' + row.id)
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
            vm.queryConstant(id)
          }).catch(function (error) {
            console.info(error)
          })
      }
    },
    mainDelete (index, list) {
      console.info(index)
      console.info(list.id)
      var vm = this
      var id = this.$store.state.modelMainLeftTreeCurrSelectId
      vm.$confirm('是否确认继续?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.axios.delete('/v1/consts/' + list.id)
          .then(function (res) {
            if (res.data.retCode === 1) {
              vm.$message({
                type: 'success',
                message: '删除成功!'
              })
              vm.queryConstant(id)
            } else {
              vm.$message({
                type: 'info',
                message: '删除失败!'
              })
            }
          })
      }).catch(() => {
        vm.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    saveEdit (index, list) {
      console.info(index)
      console.info(list)
      var vm = this
      var id = this.$store.state.modelMainLeftTreeCurrSelectId
      if (list.edctValueType === 'varchar' && list.edctValueSize === null) {
        vm.$message({
          showClose: true,
          message: '请填写字符串长度！',
          type: 'error'
        })
        return
      }
      if (list.edctValueType === 'float' && list.edctValueSize === null) {
        vm.$message({
          showClose: true,
          message: '请填写浮点精度！',
          type: 'error'
        })
        return
      }
      if (list.edctCode === null || list.edctCode === '') {
        vm.$message({
          showClose: true,
          message: '请输入属性代码！',
          type: 'error'
        })
        return
      }
      if (list.edctName === null || list.edctName === '') {
        vm.$message({
          showClose: true,
          message: '请输入属性名称！',
          type: 'error'
        })
        return
      }
      if (list.edctValueTypeName === null || list.edctValueTypeName === '') {
        vm.$message({
          showClose: true,
          message: '请选择属性值类型！',
          type: 'error'
        })
        return
      }
      if (list.edctDesc.length > 800) {
        vm.$message({
          showClose: true,
          message: '属性描述不能超过800！',
          type: 'error'
        })
        return
      }
      if (list.id != null) {
        var length = this.$refs.length._data.currentValue
        list.edctObjEdmcId = this.$store.state.classSelectId
        if (list.edmpValueType === 'object' || list.edmpValueType === 'instantiate') {
          list.edctValue = this.$store.state.classSelectName
        }
        list.edctValueSize = length
        console.log(list)
        window.axios.put('/v1/consts/', list)
          .then(function (res) {
            var data = res.data
            console.log(data.retCode)
            if (data.retCode === 1) {
              vm.$message({
                showClose: true,
                message: '保存成功'
              })
              list.c_operation = !list.c_operation
            } else {
              console.log(data.errMsg)
            }
          })
          .then(function () {
            vm.queryConstant(id)
          })
          .catch(function (err) {
            console.log(err)
          })
      } else {
        if (list.edctValueType === 'float' && this.$refs.length._data.currentValue === undefined) {
          vm.$message({
            showClose: true,
            message: '请填写浮点精度！',
            type: 'error'
          })
          return
        } if (list.edctValueType === 'varchar' && this.$refs.length._data.currentValue === undefined) {
          vm.$message({
            showClose: true,
            message: '请填写字符串长度！',
            type: 'error'
          })
          return
        }
        list.edctEdmcId = id
        list.isDel = '0'
        list.edctObjEdmcId = this.$store.state.classSelectId
        if (list.edmpValueType === 'object' || list.edmpValueType === 'instantiate') {
          list.edctValue = this.$store.state.classSelectName
        }
        console.log(list)
        window.axios.post('/v1/consts/', list)
          .then(function (res) {
            var data = res.data
            if (data.retCode === 1) {
              vm.$message({
                showClose: true,
                message: '新增成功'
              })
              list.c_operation = !list.c_operation
            } else {
              console.log(data.errMsg)
            }
          })
          .then(function () {
            vm.queryConstant(id)
          })
          .catch(function (err) {
            console.log(err)
          })
      }
    },
    dataChange (id) {
      this.queryConstant(id)
    },
    queryType () {
      var vm = this
      window.axios.get('/v1/codes/edm_field_type')
        .then(function (response) {
          var arr = []
          for (var i = 0; i < response.data.data.length; i++) {
            console.log(response.data.data[i].codeValue)
            if (response.data.data[i].codeValue !== 'object' && response.data.data[i].codeValue !== 'instantiate' && response.data.data[i].codeValue !== 'assemble') {
              arr.push(response.data.data[i])
            }
          }
          vm.option = arr
        }).catch(function (error) {
          console.info(error)
        })
    },
    queryConstant (id) {
      var vm = this
      var arr2 = [ ]
      var arr = [ ]
      window.axios.get('/v1/classes/' + id + '/consts')
        .then(function (response) {
          console.log(response)
          if (response.data.data != null) {
            for (var i = 0; i < response.data.data.length; i++) {
              var everyData = response.data.data[i]
              everyData.c_operation = 'true'
              if (everyData.edctEdmcId === id) {
                arr.push(everyData)
              } else {
                console.log(everyData)
              }
              arr2.push(everyData)
            }
            vm.tableData = arr
            vm.tableData2 = arr2
          } else {
            vm.tableData = []
            vm.tableData2 = []
          }
          vm.tableData.push({
            edctName: '',
            edctValueType: '',
            edctDesc: ''
          })
          vm.tableData2.push({
            edctName: '',
            edctValueType: '',
            edctDesc: ''
          })
        }).catch(function (error) {
          console.info(error)
        })
    }
  },
  watch: {
    'modelMainLeftTreeCurrSelectId': function () {
      console.info('modelMainLeftTreeCurrSelectId changed' + this.modelMainLeftTreeCurrSelectId)
      this.dataChange(this.modelMainLeftTreeCurrSelectId)
    },
    classId: function () {
      return this.$store.state.classId
    },
    treeEdmcEdmdId: function () {
      return this.$store.state.treeEdmcEdmdId
    }
  },
  computed: {
    modelMainLeftTreeCurrSelectId: function () {
      return this.$store.state.modelMainLeftTreeCurrSelectId
    },
    treeEdmcEdmdId: function () {
      return this.$store.state.treeEdmcEdmdId
    }
  },
  mounted: function () {
    this.dataChange(this.modelMainLeftTreeCurrSelectId)
    this.queryType()
  },
  components: {
    Tree
  }
}

</script>
<style>

</style>
