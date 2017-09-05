<template>
  <div id="m_main">
    <div id="dialog-title">
          <el-dialog title="方法选择" v-model="treeVisible">
              <methodClass @upup="changeType"></methodClass>
           </el-dialog>
          <el-dialog title="响应方法" v-model="treeVisible2" >
              <methodClass @upup="queryChoice"></methodClass>
          </el-dialog>
          <el-dialog title="类选择" v-model="treeVisible1" size="tiny">
              <tree :modelID="treeEdmcEdmdId" @nodeSelect="funcTree1Selected"></tree>
          </el-dialog>
        <el-dialog title="属性扩展" v-model="attrVisible" size="full" @close="dataChange(modelMainLeftTreeCurrSelectId)">
          <attr :id="attrid" :classid="treeEdmcEdmdId" v-if="attrVisible"  ></attr>
        </el-dialog>
    </div>
         <el-table :data="ifShowFather?tableData2:tableData"  style="width: 100%;display:block" height="400" >
                <el-table-column type="index"  align='center' label="序号" width="70" ></el-table-column>
                <el-table-column v-if="ifShowFather" prop="edmpEdmcName" label="继承类" align='center' width="80">
                <template scope="scope">
                  <div style="color:#AAAAAA">
                    {{scope.row.edmpEdmcName}}
                  </div>
                </template></el-table-column>
                <el-table-column prop="edmpCode" label="属性代码" align='center' width="120" >
                <template scope="scope">
                  <div v-if="scope.row.m_isFather" style="color:#AAAAAA">
                    <div v-if="scope.row.m_operation">
                      {{scope.row.edmpCode}}
                     </div>
                     <div v-else>
                       <el-input v-model="scope.row.edmpCode" value="scope.row.edmpCode" @blur="checkDataCode" :disabled="true"></el-input>
                     </div>
                  </div>
                  <div v-else>
                    <div v-if="scope.row.m_operation">
                    {{scope.row.edmpCode}}
                   </div>
                   <div v-else>
                     <el-input v-model="scope.row.edmpCode" value="scope.row.edmpCode" @blur="checkDataCode" :disabled="true"></el-input>
                   </div>
                  </div>
                 </template></el-table-column>
                <el-table-column prop="edmpName" label="属性名称" align='center' width="95">
                <template scope="scope">
                  <div v-if="scope.row.m_isFather" style="color:#AAAAAA">
                    <div v-if="scope.row.m_operation">
                    {{scope.row.edmpName}}
                   </div>
                   <div v-else>
                    <el-input v-model="scope.row.edmpName" value="scope.row.edmpName"  @blur="checkDataName"></el-input>
                  </div>
                  </div>
                  <div v-else>
                    <div v-if="scope.row.m_operation">
                    {{scope.row.edmpName}}
                   </div>
                   <div v-else>
                    <el-input v-model="scope.row.edmpName" value="scope.row.edmpName"  @blur="checkDataName"></el-input>
                  </div>
                  </div>
                </template></el-table-column>
                <el-table-column prop="edmpValueType" label="属性值类型" align='center' width="120">
                <template scope="scope">
                <div v-if="scope.row.m_isFather" style="color:#AAAAAA">
                  <div v-if="scope.row.m_operation && (scope.row.edmpValueType ==='varchar'||scope.row.edmpValueType === 'float')">
                  {{scope.row.edmpValueName}}({{scope.row.edmpValueSize }})
                 </div>
                 <div v-if="scope.row.m_operation && scope.row.edmpValueType !=='varchar'&& scope.row.edmpValueType !== 'float'">
                   {{scope.row.edmpValueName}}
                 </div>
                  <div v-if="!scope.row.m_operation && scope.row.edmpValueType === 'varchar'">
                     <el-popover
                       ref="popover1"
                       placement="top-start"
                       title="长度"
                       width="200"
                       trigger="hover">
                       <el-input v-model="scope.row.edmpValueSize"  value="scope.row.length" ref="length" >{{scope.row.edmpValueSize }}</el-input>
                         <el-select v-model="scope.row.edmpValueType" v-popover:popover1>
                           <el-option v-for="options in option" :key="options.id" :label="options.codeName"
                                      :value="options.codeValue" >{{options.codeName}}</el-option>
                         </el-select>
                     </el-popover>
                     </div>
                  <div v-if="!scope.row.m_operation && scope.row.edmpValueType === 'float'">
                   <el-popover
                       ref="popover2"
                       placement="top-start"
                       title="精度"
                       width="200"
                       trigger="hover">
                       <el-input v-model="scope.row.edmpValueSize" value="scope.row.length" ref="length" >{{scope.row.edmpValueSize }}</el-input>
                     </el-popover>
                    <el-select v-model="scope.row.edmpValueType" v-popover:popover1>
                      <el-option v-for="options in option" :key="options.id" :label="options.codeName"
                                 :value="options.codeValue" >{{options.codeName}}</el-option>
                    </el-select>
                 </div>
                </div>
                <div v-if="!scope.row.m_isFather">
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
                  </div><!-- end of v-if="!scope.row.m_operation" -->
                </div><!-- end of scope.row.m_isFather-->
              </template><!-- end of 属性值类型 -->
              </el-table-column>
                <el-table-column prop="edmpValueLimit" label="属性限值" align='center' width="95">
                <template scope="scope">
                  <div v-if="scope.row.m_isFather" style="color:#AAAAAA">
                    <div v-if="!scope.row.m_operation && scope.row.edmpValueType !== 'object' && scope.row.edmpValueType !== 'assemble' && scope.row.edmpValueType !== 'instantiate'">
                    <el-input v-model="scope.row.edmpValueLimit" value="scope.row.edmpValueLimit"></el-input>
                   </div>
                   <div v-else-if="scope.row.m_operation && scope.row.edmpValueType !== 'object' && scope.row.edmpValueType !== 'assemble' && scope.row.edmpValueType !== 'instantiate'">
                     {{ scope.row.edmpValueLimit }}
                   </div>
                  </div>
                  <div v-else>
                    <div v-if="!scope.row.m_operation && scope.row.edmpValueType !== 'object' && scope.row.edmpValueType !== 'assemble' && scope.row.edmpValueType !== 'instantiate' ">
                    <el-input v-model="scope.row.edmpValueLimit" value="scope.row.edmpValueLimit"></el-input>
                   </div>
                   <div v-else-if="scope.row.m_operation && scope.row.edmpValueType !== 'object' && scope.row.edmpValueType !== 'assemble' && scope.row.edmpValueType !== 'instantiate' ">
                     {{ scope.row.edmpValueLimit }}
                   </div>
                  </div>
                </template></el-table-column>
                <el-table-column prop="edmpFormula" label="属性公式" align='center' width="100">
                <template scope="scope">
                <div v-if="scope.row.m_isFather" style="color:#AAAAAA">
                  <div v-if="!scope.row.m_operation && scope.row.edmpValueType !== 'object' && scope.row.edmpValueType !== 'assemble' && scope.row.edmpValueType !== 'instantiate'">
                  <el-input v-model="scope.row.edmpFormula" value="scope.row.edmpFormula"></el-input>
                 </div>
                 <div v-else-if="scope.row.m_operation && scope.row.edmpValueType !== 'object' && scope.row.edmpValueType !== 'assemble' && scope.row.edmpValueType !== 'instantiate'">
                   {{scope.row.edmpFormula}}
                 </div>
                  </div>
                  <div v-else>
                    <div v-if="!scope.row.m_operation && scope.row.edmpValueType !== 'object' && scope.row.edmpValueType !== 'assemble' && scope.row.edmpValueType !== 'instantiate'">
                  <el-input v-model="scope.row.edmpFormula" value="scope.row.edmpFormula"></el-input>
                 </div>
                 <div v-else-if="scope.row.m_operation && scope.row.edmpValueType !== 'object' && scope.row.edmpValueType !== 'assemble' && scope.row.edmpValueType !== 'instantiate'">
                   {{scope.row.edmpFormula}}
                 </div>
                  </div>
                </template></el-table-column>
                <el-table-column prop="edmpValue" label="属性值" align='center' width="100" >
                <template scope="scope">
                <div v-if="scope.row.m_isFather" style="color:#AAAAAA">
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
                            placeholder=""  icon="view" @click="OpenTree1(scope.$index)" readonly></el-input>
                  </el-form-item>
                   </div>
                   <div v-else>
                   <el-input v-model="scope.row.edmpValue" value="scope.row.edmpValue"></el-input>
                  </div>
                  </div>
                  <div v-else>
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
                             placeholder=""  icon="view" @click="OpenTree1(scope.$index)" readonly></el-input>
                   </el-form-item>
                   </div>
                   <div v-else>
                   <el-input v-model="scope.row.edmpValue" value="scope.row.edmpValue"></el-input>
                  </div>
                  </div>
                </template></el-table-column>
                <el-table-column prop="edmpEdmmName" label="修改响应方法" align='center' width="125">
                <template scope="scope">
                <div v-if="scope.row.m_isFather" style="color:#AAAAAA">
                  <div v-if="!scope.row.m_operation && scope.row.edmpValueType !== 'object' && scope.row.edmpValueType !== 'assemble' && scope.row.edmpValueType !== 'instantiate'">
                      <el-input v-model="scope.row.edmpEdmmName"  size="small"
                                placeholder=""  icon="plus" @click="OpenTree(scope.$index)" readonly  ></el-input>

                   </div>
                   <div v-else-if="scope.row.m_operation && scope.row.edmpValueType !== 'object' && scope.row.edmpValueType !== 'assemble' && scope.row.edmpValueType !== 'instantiate'">
                     <a  size="small" @click="ShowTree(scope.$index, scope.row)" >{{scope.row.edmpEdmmName}}</a>
                   </div>
                  </div>
                  <div v-else>
                    <div v-if="!scope.row.m_operation && scope.row.edmpValueType !== 'object' && scope.row.edmpValueType !== 'assemble' && scope.row.edmpValueType !== 'instantiate'">
                      <el-input v-model="scope.row.edmpEdmmName"  size="small"
                                placeholder=""  icon="plus" @click="OpenTree(scope.$index)" readonly ></el-input>

                   </div>
                   <div v-else-if="scope.row.m_operation && scope.row.edmpValueType !== 'object' && scope.row.edmpValueType !== 'assemble' && scope.row.edmpValueType !== 'instantiate' ">
                     <a  size="small" @click="ShowTree(scope.row)" >{{scope.row.edmpEdmmName}}</a>
                   </div>
                  </div>
                </template>
                </el-table-column></el-table-column>
                <el-table-column prop="edmpExtendProperty" label="属性扩展" align='center' width="150">
                <template scope="scope">
                <div v-if="scope.row.m_isFather" style="color:#AAAAAA">
                  <div v-if="scope.row.m_operation && scope.row.edmpValueType !== 'assemble'">
                    <a size="small" @click="goAttributeVindicate(scope.$index, scope.row)" >{{scope.row.edmpExtendProperty}}</a>
                  </div>
                  <div v-else-if="!scope.row.m_operation && scope.row.edmpValueType !== 'object' && scope.row.edmpValueType !== 'assemble' && scope.row.edmpValueType !== 'instantiate'">
                    <el-input v-model="scope.row.edmpExtendProperty" value="scope.row.edmpExtendProperty"></el-input>
                  </div>
                  </div>
                  <div v-else>
                  <div v-if="scope.row.m_operation && scope.row.edmpValueType !== 'assemble' ">
                    <a size="small" @click="goAttributeVindicate(scope.$index, scope.row)" >{{scope.row.edmpExtendProperty}}</a>
                  </div>
                  <div v-else-if="!scope.row.m_operation && scope.row.edmpValueType !== 'object' && scope.row.edmpValueType !== 'assemble'&& scope.row.edmpValueType !== 'instantiate'">
                    {{scope.row.edmpExtendProperty}}
                    </div>
                  </div>
                </template></el-table-column>
                <el-table-column prop="edmpDesc" label="属性描述" align='center' width="100">
                <template scope="scope">
                <div v-if="scope.row.m_isFather" style="color:#AAAAAA">
                  <div v-if="!scope.row.m_operation && scope.row.edmpValueType !== 'object' && scope.row.edmpValueType !== 'assemble'&& scope.row.edmpValueType !== 'instantiate'">
                    <el-input v-model="scope.row.edmpDesc" value="scope.row.edmpDesc"></el-input>
                   </div>
                   <div v-else-if=" scope.row.m_operation && scope.row.edmpValueType !== 'object' && scope.row.edmpValueType !== 'assemble'&& scope.row.edmpValueType !== 'instantiate' ">
                     {{scope.row.edmpDesc}}
                   </div>
                  </div>
                  <div v-else>
                    <div v-if="!scope.row.m_operation && scope.row.edmpValueType !== 'object' && scope.row.edmpValueType !== 'assemble'&& scope.row.edmpValueType !== 'instantiate'">
                    <el-input v-model="scope.row.edmpDesc" value="scope.row.edmpDesc"></el-input>
                   </div>
                   <div v-else-if=" scope.row.m_operation && scope.row.edmpValueType !== 'object' && scope.row.edmpValueType !== 'assemble' && scope.row.edmpValueType !== 'instantiate'">
                     {{scope.row.edmpDesc}}
                   </div>
                  </div>
                </template></el-table-column>
                <el-table-column prop="moduser" label="维护人" align='center'>
                 <template scope="scope">
                 <div v-if="scope.row.m_isFather" style="color:#AAAAAA">
                  <div v-if="scope.row.edmpValueType !== 'object' && scope.row.edmpValueType !== 'assemble'&& scope.row.edmpValueType !== 'instantiate'">
                    {{ scope.row.moduser }}
                    </div>
                  </div>
                  <div v-else>
                    <div v-if="scope.row.edmpValueType !== 'object' && scope.row.edmpValueType !== 'assemble'&& scope.row.edmpValueType !== 'instantiate'">
                    {{ scope.row.moduser }}
                    </div>
                  </div>
                 </template>
                </el-table-column>
                <el-table-column prop="modtimeStr" label="维护时间"  width="150"  align='center'>
                <template scope="scope">
                <div v-if="scope.row.m_isFather" style="color:#AAAAAA">
                  <div v-if="scope.row.edmpValueType !== 'object' && scope.row.edmpValueType !== 'assemble'&& scope.row.edmpValueType !== 'instantiate'">
                    {{ scope.row.modtimeStr }}
                    </div>
                  </div>
                  <div v-else>
                    <div v-if="scope.row.edmpValueType !== 'object' && scope.row.edmpValueType !== 'assemble'&& scope.row.edmpValueType !== 'instantiate'">
                    {{ scope.row.modtimeStr }}
                    </div>
                  </div>
                 </template></el-table-column>
                <el-table-column prop="m_operation" label="操作" width="200" align='center' v-if="ifoperate">
                  <template scope="scope">
                  <div v-if="scope.row.m_isFather" style="color:#AAAAAA">
                    <div v-if="scope.row.edmpParentName !=='资产类'">
                   <!-- <el-button size="small" @click="edit(scope.row)" type="text" v-if="scope.row.m_operation" >编辑</el-button>
                    <el-button size="small" @click="saveEdit(scope.$index, scope.row)" type="text" v-else >保存</el-button>
                    <el-button size="small" @click="mainDelete(scope.$index, scope.row)" type="text" v-if="scope.row.m_operation">删除</el-button>
                    <el-button size="small" @click="cancel(scope.row)" type="text" v-if="!scope.row.m_operation">取消</el-button>
                    <el-button size="small" @click="shiftUp(scope.$index, scope.row)" type="text" v-if="scope.row.m_operation">上移</el-button>
                    <el-button size="small" @click="shiftDown(scope.$index, scope.row)" type="text" v-if="scope.row.m_operation">下移</el-button>-->
                      <el-button size="small" @click="edit(scope.row)"  v-if="scope.row.m_operation" type="rx-icon" icon="rx-bianji2" title="编辑"></el-button>
                      <el-button size="small" @click="saveEdit(scope.$index, scope.row)" type="rx-icon" icon="rx-baocun2" title="保存" v-else ></el-button>
                      <el-button size="small" @click="mainDelete(scope.$index, scope.row)" type="rx-icon" icon="rx-shanchu2" title="删除" v-if="scope.row.m_operation"></el-button>
                      <el-button size="small" @click="cancel(scope.row)"  v-if="!scope.row.m_operation" type="rx-icon" title="取消" icon="rx-chexiao"></el-button>
                      <el-button size="small" @click="shiftUp(scope.$index, scope.row)" v-if="scope.row.m_operation" type="rx-icon" title="上移" icon="rx-shangyi2"></el-button>
                      <el-button size="small" @click="shiftDown(scope.$index, scope.row)" type="rx-icon" icon="rx-xiayi2" title="下移" v-if="scope.row.m_operation"></el-button>
                  </div>
                  <div v-else>
                  </div>
                  </div>
                  <div v-else>
                    <div v-if="scope.row.edmpParentName !=='资产类'">
                    <!--<el-button size="small" @click="edit(scope.row)" type="text" v-if="scope.row.m_operation" >编辑</el-button>
                    <el-button size="small" @click="saveEdit(scope.$index, scope.row)" type="text" v-else >保存</el-button>
                    <el-button size="small" @click="mainDelete(scope.$index, scope.row)" type="text" v-if="scope.row.m_operation">删除</el-button>
                    <el-button size="small" @click="cancel(scope.row)" type="text" v-if="!scope.row.m_operation">取消</el-button>
                    <el-button size="small" @click="shiftUp(scope.$index, scope.row)" type="text" v-if="scope.row.m_operation">上移</el-button>
                    <el-button size="small" @click="shiftDown(scope.$index, scope.row)" type="text" v-if="scope.row.m_operation">下移</el-button>-->
                      <el-button size="small" @click="edit(scope.row)" type="rx-icon" icon="rx-bianji2" title="编辑" v-if="scope.row.m_operation" ></el-button>
                      <el-button size="small" @click="saveEdit(scope.$index, scope.row)" type="rx-icon" icon="rx-baocun2" title="保存" v-else ></el-button>
                      <el-button size="small" @click="mainDelete(scope.$index, scope.row)" type="rx-icon" icon="rx-shanchu2" title="删除" v-if="scope.row.m_operation"></el-button>
                      <el-button size="small" @click="cancel(scope.row)" type="rx-icon" icon="rx-chexiao" title="取消" v-if="!scope.row.m_operation"></el-button>
                      <el-button size="small" @click="shiftUp(scope.$index, scope.row)" type="rx-icon" icon="rx-shangyi2" title="上移" v-if="scope.row.m_operation"></el-button>
                      <el-button size="small" @click="shiftDown(scope.$index, scope.row)" type="rx-icon" icon="rx-xiayi2" title="下移" v-if="scope.row.m_operation"></el-button>
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
import methodClass from '@/components/m-cmpns/method-choice'
import attr from '../ly-components/attributeVindicate.vue'

export default {
  name: 'model',
  props: [
    'ifShowFather',
    'ifoperate'
  ],
  data () {
    return {
      tableData: [],
      rowNum: 0,
      tableData2: [],
      option: [],
      treeVisible: false,
      treeVisible1: false,
      treeVisible2: false,
      input: '',
      data: [],
      attrVisible: false,
      attrid: ''
    }
  },
  methods: {
    edit: function (row) {
      row.m_operation = !row.m_operation
      this.$store.dispatch('editProperty', row.edmpEdmcId)
    },
    cancel: function (row) {
      row.m_operation = !row.m_operation
      var id = this.$store.state.modelMainLeftTreeCurrSelectId
      this.queryMain(id)
    },
    ShowTree: function (row) {
      this.$store.dispatch('addMethod', row.edmpEdmmId)
      this.treeVisible2 = true
      /* this.$router.push('/method-choice/0/' + row.edmpEdmmId) */
    },
    checkDataCode (list) {
      var vm = this
      var id = ''
      if (this.$store.state.classId !== null && this.$store.state.classId !== '') {
        id = this.$store.state.classId
      } else {
        id = this.$store.state.modelMainLeftTreeCurrSelectId
      }
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
      var vm = this
      var newEdmpName = list.srcElement.value
      if (this.$store.state.classId !== null && this.$store.state.classId !== '') {
        var id = this.$store.state.classId
      } else {
        id = this.$store.state.modelMainLeftTreeCurrSelectId
      }
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
      console.info(list)
      var vm = this
      var id = this.$store.state.modelMainLeftTreeCurrSelectId
      console.log(list)
      if (list.edmpCode === null || list.edmpCode === '') {
        vm.$message({
          showClose: true,
          message: '请输入属性代码！',
          type: 'error'
        })
        return
      }
      if (list.edmpValueType === 'varchar' && list.edmpValueSize === null) {
        vm.$message({
          showClose: true,
          message: '请填写字符串长度！',
          type: 'error'
        })
        return
      }
      if (list.edmpValueType === 'float' && list.edmpValueSize === null) {
        vm.$message({
          showClose: true,
          message: '请填写浮点精度！',
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
            } else {
              console.log(data.errMsg)
            }
            list.m_operation = !list.m_operation
            vm.queryMain(id)
          })
          .catch(function (err) {
            console.log(err)
          })
      } else {
        if (list.edmpValueType === 'float' && this.$refs.length._data.currentValue === undefined) {
          vm.$message({
            showClose: true,
            message: '请填写浮点精度！',
            type: 'error'
          })
          return
        } if (list.edmpValueType === 'varchar' && this.$refs.length._data.currentValue === undefined) {
          vm.$message({
            showClose: true,
            message: '请填写字符串长度！',
            type: 'error'
          })
          return
        }
        list.edmpEdmcId = id
        list.isDel = '0'
        list.edmpEdmmName = this.$store.state.methodsChoiceName
        list.edmpEdmmId = this.$store.state.methodsChoiceId
        list.edmpObjEdmcId = this.$store.state.classSelectId
        if (list.edmpValueType === 'object' || list.edmpValueType === 'instantiate') {
          list.edmpValue = this.$store.state.classSelectName
        }
        console.log(list)
        window.axios.post('/v1/properties', list)
          .then(function (res) {
            var data = res.data
            console.log('===')
            console.log(data)
            if (data.retCode === 1) {
              vm.$message({
                showClose: true,
                message: '新增成功'
              })
            } else {
              console.log(data.errMsg)
            }
            list.m_operation = !list.m_operation
            vm.queryMain(id)
          })
          .catch(function (err) {
            console.log(err)
          })
      }
    },
   /*  editEdmmName (index, list) {
      window.location.href = '/#methodChoice/0/' + list.id
    }, */
    changeType: function () {
      this.tableData2[this.rowNum].edmpEdmmName = this.$store.state.methodsChoiceName
      this.tableData[this.rowNum].edmpEdmmName = this.$store.state.methodsChoiceName
      this.treeVisible = false
    },
    queryChoice: function () {
      this.treeVisible2 = false
    },
    goAttributeVindicate (index, list) {
      console.log(index)
      console.log(list)
      /* window.location.href = '/#attributeVindicate/' + list.id + '/' + this.$store.state.treeEdmcEdmdId */
      this.attrVisible = true
      this.attrid = list.id
    },
    funcTree1Selected: function (edmc) { // 这个树返回的是一个对象
      this.treeVisible1 = false
      this.$store.dispatch('classSelectId', edmc.id)
      this.$store.dispatch('classSelectName', edmc.edmcName)
      this.tableData2[this.rowNum].edmpValue = edmc.edmcName
      this.tableData[this.rowNum].edmpValue = edmc.edmcName
    },
    goSetMain (index, list) {
      console.log(index)
      if (this.$store.state.showType === 0) {
        window.location.href = '/#setMain/0/' + list.id
      } else {
        window.location.href = '/#setMain/1/' + list.id
      }
    },
    selectType: function (value) {
      console.log('selectType' + value)
      console.log(value)
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
        window.axios.delete('/v1/properties/' + list.id)
          .then(function (res) {
            if (res.data.retCode === 1) {
              vm.$message({
                type: 'success',
                message: '删除成功!'
              })
              vm.queryMain(id)
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
    OpenTree1: function (index) {
      this.rowNum = index
      this.treeVisible1 = true
    },
    OpenTree: function (index) {
      this.rowNum = index
      this.$store.dispatch('addMethod', 0)
      this.treeVisible = true
    },
    handleChange: function (value) {
      console.log(value)
    },
    shiftUp: function (index, row) {
      console.log(index)
      console.info(row)
      var vm = this
      var did = ''
      var id = this.$store.state.modelMainLeftTreeCurrSelectId
      if (index > '0') {
        for (var i = 0; i < vm.tableData2.length; i++) {
          if (row.id === vm.tableData2[i].id) {
            did = vm.tableData2[i - 1].id
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
            vm.queryMain(id)
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
      console.log('1')
      console.log(vm.tableData2.length)
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
            vm.queryMain(id)
          }).catch(function (error) {
            console.info(error)
          })
      }
    },
    /* dateFormat: function (row, column) {
      var date = row[column.property]
      if (date === null) {
        return ''
      }
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    }, */
    queryMain (id) {
      var vm = this
      var arr2 = [ ]
      var arr = [ ]
      window.axios.get('/v1/classes/' + id + '/properties')
        .then(function (response) {
          console.info(response)
          if (response.data.data != null) {
            for (var i = 0; i < response.data.data.length; i++) {
              var everyData = response.data.data[i]
              everyData.m_operation = 'true'
              if (everyData.edmpEdmcId === id) {
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
          window.axios.get('/v1/properties/getEdmpCode', {params: {classId: id}})
            .then(function (response) {
              vm.tableData.push({
                edmpCode: response.data.data,
                edmpName: '',
                edmpValueType: '',
                edmpValue: '',
                edmpEdmmName: ''
              })
              vm.tableData2.push({
                edmpCode: response.data.data,
                edmpName: '',
                edmpValueType: '',
                edmpValue: '',
                edmpEdmmName: ''
              })
            })
        }).catch(function (error) {
          console.info(error)
        })
    },
    dataChange (id) {
      console.log('dataChange' + id)
      var vm = this
      console.log(vm)
      this.queryMain(id)
    },
    queryType () {
      var vm = this
      window.axios.get('/v1/codes/edm_field_type')
        .then(function (response) {
          vm.option = response.data.data
        }).catch(function (error) {
          console.info(error)
        })
    }
  },
  created: function () {
    if (this.$route.params.if === '0') {
      this.$store.dispatch('showType', 0)
    }
  },
  mounted: function () {
    this.dataChange(this.modelMainLeftTreeCurrSelectId)
    this.queryType()
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
    showType: function () {
      return this.$store.state.showType
    },
    treeEdmcEdmdId: function () {
      return this.$store.state.treeEdmcEdmdId
    },
    classSelectId: function () {
      return this.$store.state.classSelectId
    },
    classSelectName: function () {
      return this.$store.state.classSelectName
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
  components: {
    Tree,
    methodClass,
    attr
  }
}
</script>
<style>
  /*表头样式*/
 #main  .el-table__header-wrapper thead div{
    background-color: #C4CEF8;
  }
 #main .el-table th{
   background-color: #C4CEF8;
 }
  #main .el-table__header-wrapper thead div{
    color: #ffffff;
  }
 /* .el-input__inner:focus{
    border-color: #AEB9FF;
  }*/
  /*表格内连接样式*/
  #main a{
    color: #91A0FB;
  }
  /*表格内字体图标样式*/
  #m_main  .el-icon-plus{
    font-size: 10px;
  }
  /*表格行高度*/
  #m_main .el-table th{
    height: 50px;
  }
  #m_main .el-table td{
    height: 60px;
  }
</style>
