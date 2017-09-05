<template>
  <div class="attClass">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="卷积" name="first">
            <el-form :model="convoData" class="demo-form-inline" :rules="rules" ref="ruleForm1" label-width="120px">
              <div class="convcss">
                <div style="margin-bottom: 22px">
                      <el-button type="info" @click="tab1_save('ruleForm1')">确定</el-button>
                </div>
                <el-form-item label="卷积更新时效" prop="edcoUpdateType">
                  <el-col :xs="11" :sm="7" :md="7" :lg="4">
                    <el-radio-group v-model="convoData.edcoUpdateType">
                      <el-radio label="1">同步</el-radio>
                      <el-radio label="2">异步</el-radio>
                      <el-radio label="3">定时</el-radio>
                    </el-radio-group>
                  </el-col>
                  <el-col :xs="11" :sm="7" :md="7" :lg="4">
                    <div v-if="convoData.edcoUpdateType==2">
                      <el-input-number v-model="convoData.edcoUpdateTimeliness" :step="10" placeholder="请选择时效"></el-input-number>
                    </div>
                    <div v-if="convoData.edcoUpdateType==3">
                      <el-date-picker type="datetime" v-model="convoData.edcoUpdateTime"  placeholder="请选择时间点" @change="convoData.edcoUpdateTime=$event">
                      </el-date-picker>
                    </div>
                  </el-col>
                </el-form-item>
                <el-form-item label="卷积公式" prop="edcoConvoluteFormula">
                  <el-select v-model="convoData.edcoConvoluteFormula">
                    <el-option v-for="item in formulaOptions" :key="formulaOptions.id" :label="item.codeName" :value="item.codeValue"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="公式描述" prop="edcoFormulaDesc">
                  <el-input v-model="convoData.edcoFormulaDesc" type="textarea" style="width:80%"></el-input>
                </el-form-item>
              </div>
            </el-form>
        </el-tab-pane>
        <el-tab-pane label="关联" name="second">
            <template>
              <el-table :data="tableData1" style="width: 100%" highlight-current-row>
                <el-table-column type="index" label="序号" align='center' width="80"></el-table-column>
                <el-table-column align='center' label="类" width="180">
                  <template scope="scope">
                    <div v-if="scope.row.operation">
                      <a @click="OpenModel(scope.row)">{{scope.row.edmlEdmcNameLink}}</a>
                    </div>
                    <div v-else>
                      <el-input readonly v-model="scope.row.edmlEdmcNameLink" icon="plus" @click="OpenTree(scope.$index)"></el-input>
                      <el-input v-model="scope.row.edmlEdmcIdLink" style="display:none"></el-input>
                    </div>
                    <el-dialog title="类选择" v-model="treeVisible" size="tiny" :modal="false">
                       <tree align='left' :modelID="classid" @nodeSelect="funcTree1Selected"></tree>
                     </el-dialog>
                  </template>
                </el-table-column>
                <el-table-column align='center' label="关联属性">
                  <template scope="scope">
                    <div v-if="scope.row.operation">
                      {{scope.row.edmlEdmpNameLink}}
                    </div>
                    <div v-else>
                      <el-select v-model="scope.row.edmlEdmpLinkId" @visible-change="checkClass(scope.$index,scope.row,$event)" placeholder="请选择">
                        <el-option
                          v-for="item in scope.row.edmlEdmpLink"
                          :label="item.edmpName"
                          :value="item.id" :key="scope.row.edmlEdmpLink.id">
                        </el-option>
                      </el-select>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="edmlCond" align='center' label="关联条件">
                  <template scope="scope">
                    <div v-if="scope.row.operation">
                      {{scope.row.edmlCond}}
                    </div>
                    <div v-else>
                      <el-input v-model="scope.row.edmlCond" value="scope.row.edmlCond"></el-input>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="edmlFormula" align='center' label="关联公式">
                  <template scope="scope">
                    <div v-if="scope.row.operation">
                      {{scope.row.edmlFormula}}
                    </div>
                    <div v-else>
                      <el-input v-model="scope.row.edmlFormula" value="scope.row.edmlFormula"></el-input>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align='center' label="是否保存联动记录">
                  <template scope="scope">
                    <div v-if="scope.row.operation">
                      <div v-if="scope.row.edcnLinkPreservable==1">是</div>
                      <div v-else>否</div>
                    </div>
                    <div v-else>
                      <el-select v-model="scope.row.edcnLinkPreservable" placeholder="请选择">
                        <el-option
                          v-for="item in ifSaveChange"
                          :label="item.label"
                          :value="item.value" :key="ifSaveChange.id">
                        </el-option>
                      </el-select>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="m_changeTime" align='center' label="联动时效" width="200">
                  <template scope="scope">
                    <div v-if="scope.row.operation">
                      <div v-if="scope.row.edclUpdateType==1">同步</div>
                      <div v-if="scope.row.edclUpdateType==2">异步</div>
                      <div v-if="scope.row.edclUpdateType==3">定时</div>
                      <div v-if="scope.row.edclUpdateType==2">
                        {{scope.row.edclUpdateTimeliness}}
                      </div>
                      <div v-if="scope.row.edclUpdateType==3">
                        {{scope.row.edclUpdateTime}}
                      </div>
                    </div>
                    <div v-else>
                      <el-select v-model="scope.row.edclUpdateType" placeholder="请选择">
                        <el-option
                          v-for="item in changes"
                          :label="item.label"
                          :value="item.value" :key="changes.id">
                        </el-option>
                      </el-select>
                      <div v-if="scope.row.edclUpdateType==2">
                        <el-input-number style="width:160px" v-model="scope.row.edclUpdateTimeliness" :step="10" placeholder="请选择时效"></el-input-number>
                      </div>
                      <div v-if="scope.row.edclUpdateType==3">
                        <el-date-picker type="datetime" style="width:160px" v-model="scope.row.edclUpdateTime"  placeholder="请选择时间点" @change="scope.row.edclUpdateTime=$event">
                        </el-date-picker>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="moduser" align='center' label="维护人"></el-table-column>
                <el-table-column prop="modtimeStr" align='center' label="维护时间"></el-table-column>
                <el-table-column prop="operation" align='center' label="操作" width="120">
                  <template scope="scope">
                    <el-button v-if="scope.row.operation" title="编辑" size="small" @click="ChangeStatus(scope.$index,scope.row)" type="rx-icon" icon="rx-bianji2"></el-button>
                    <el-button v-if="scope.row.operation" title="删除" size="small"  type="rx-icon" icon="rx-shanchu2" @click="tab2_delete(scope.$index,scope.row)"></el-button>
                    <el-button v-if="!scope.row.operation" title="保存" size="small" @click="tab2_save(scope.$index,scope.row)"  type="rx-icon" icon="rx-baocun2"></el-button>
                    <el-button v-if="!scope.row.operation" title="取消" size="small"  type="rx-icon" icon="rx-chexiao" @click="tab2_cancel(scope.$index,scope.row)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
        </el-tab-pane>
        <el-tab-pane label="联动" name="third">
          <el-form :model="conneData" class="demo-form-inline" :rules="rules" ref="ruleForm2">
            <div class="conncss">
              <el-form-item>
                  <el-button type="info" @click="tab3_save('ruleForm2')">确定</el-button>
              </el-form-item>
              <el-form-item label="是否保存联动记录" prop="edcnLinkPreservable3">
                <el-radio-group v-model="conneData.edcnLinkPreservable3">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="联动更新时效" prop="edcnUpdateType3">
                <el-col :xs="12" :sm="7" :md="6" :lg="4">
                  <el-radio-group v-model="conneData.edcnUpdateType3">
                    <el-radio label="1">同步</el-radio>
                    <el-radio label="2">异步</el-radio>
                    <el-radio label="3">定时</el-radio>
                  </el-radio-group>
                </el-col>
                <el-col :xs="12" :sm="7" :md="6" :lg="4">
                  <div v-if="conneData.edcnUpdateType3==2">
                    <el-input-number v-model="conneData.edcnUpdateTimeliness3" :step="10" placeholder="请选择时效"></el-input-number>
                  </div>
                  <div v-if="conneData.edcnUpdateType3==3">
                    <el-date-picker type="datetime" v-model="conneData.edcnUpdateTime3" placeholder="请选择时间点" @change="conneData.edcnUpdateTime3=$event">
                    </el-date-picker>
                  </div>
                </el-col>
              </el-form-item>
            </div>
          </el-form>
          <el-table :data="tableData2" style="width: 100%" highlight-current-row>
            <el-table-column type="index" label="序号" align='center' width="80"></el-table-column>
            <el-table-column prop="className" align='center' label="类" width="180">
              <template scope="scope">
                <a @click="OpenModel2(scope.row)">{{scope.row.edmcName}}</a>
              </template>
            </el-table-column>
            <el-table-column prop="edmpName" align='center' label="联动属性"></el-table-column>
            <el-table-column prop="edmlCond" align='center' label="联动条件"></el-table-column>
            <el-table-column prop="edmlFormula" align='center' label="联动公式"></el-table-column>
            <el-table-column prop="moduser" align='center' label="维护人"></el-table-column>
            <el-table-column prop="modtimeStr" align='center' label="维护时间"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="单位" name="fourth">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="请选择单位类别："  prop="unitType">
              <el-select v-model="unitType" placeholder="请选择单位类别">
                <el-option v-for="unit in unitTypes" :key="unitTypes.id" :label="unit.codeName" :value="unit.codeValue"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="info" @click="tab4_save1"><i class="el-icon-rx-baocun2-b">&nbsp;保存</i></el-button>
            </el-form-item>
          </el-form>
          <el-table :data="tableData3" style="width: 100%" highlight-current-row>
          <el-table-column type="index" label="序号" align='center' width="80"></el-table-column>
          <el-table-column prop="m_attribute" align='center' label="数值属性" width="180">
            <template scope="scope">
              <div v-if="scope.row.operation">
                <el-select v-model="scope.row.edunQtyEdmpId" filterable placeholder="请选择" disabled>
                  <el-option
                    v-for="item in edmpQtyNames"
                    :label="item.edmpName"
                    :value="item.id" :key="edmpQtyNames.id">
                  </el-option>
                </el-select>
              </div>
              <div v-else>
                <el-select v-model="scope.row.edunQtyEdmpId" filterable placeholder="请选择">
                  <el-option
                    v-for="item in edmpQtyNames"
                    :label="item.edmpName"
                    :value="item.id" :key="edmpQtyNames.id">
                  </el-option>
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="moduser" align='center' label="维护人"></el-table-column>
          <el-table-column prop="modtimeStr" align='center' label="维护时间"></el-table-column>
          <el-table-column align='center' label="操作" width="150px">
            <template scope="scope">
              <el-button v-if="scope.row.operation" title="编辑" size="small" @click="ChangeStatus2(scope.$index,scope.row)"  type="rx-icon" icon="rx-bianji2"></el-button>
              <el-button v-else size="small" title="保存" @click="tab4_save2(scope.$index,scope.row)" type="rx-icon" icon="rx-baocun2"></el-button>
              <el-button v-if="scope.row.operation" title="删除" @click="tab4_delete(scope.$index,scope.row)" size="small" type="rx-icon" icon="rx-shanchu2"></el-button>
              <el-button v-else size="small" title="取消" @click="tab4_cancel(scope.$index,scope.row)" type="rx-icon" icon="rx-chexiao"></el-button>
            </template>
          </el-table-column>
        </el-table>
        </el-tab-pane>
      </el-tabs>
  </div>
</template>

<script>
    import axios from 'axios'
    import _ from 'lodash'
    import Tree from '@/components/common/ClassTreeSelector'
    export default {
      name: 'attributeVindicate',
      props: ['id', 'classid'],
      data () {
        return {
          /* id: '',
          classid: '', */
          rowNum: 0,
          ifShow: true,
          activeName: 'first',
          // 卷积数据
          convoData: {
            tab1_id: '',
            edcoUpdateType: '',
            edcoUpdateTimeliness: '',
            edcoUpdateTime: '',
            edcoConvoluteFormula: '',
            edcoFormulaDesc: ''
          },
          formulaOptions: [],
          // 关联数据
          tableData1: [],
          visibilityState: 1,
          tableData1_1: [],
          tableData1_2: {
            id: '',
            edmlEdmpId: '',
            edmlEdmpLinkId: '',
            edmlCond: '',
            edmlFormula: '',
            edclUpdateType: null,
            edclUpdateTime: null,
            isDel: 0,
            addtime: null,
            adduser: 'LY',
            modtime: null,
            moduser: 'LY',
            acctid: null,
            addtimeStr: null,
            modtimeStr: null,
            edmConnectId: '',
            edcnLinkPreservable: '0',
            edclUpdateTimeliness: '',
            edmcId: '',
            edmcName: null,
            edmpName: null,
            edmlEdmcIdLink: '',
            edmlEdmcNameLink: null,
            edmlEdmpNameLink: null,
            operation: false,
            edmlEdmpLink: []
          },
          operations: [],
          treeVisible: false,
          // 联动数据
          conneData: {
            tab3_id: '',
            edcnLinkPreservable3: '',
            edcnUpdateType3: '',
            edcnUpdateTimeliness3: '',
            edcnUpdateTime3: ''
          },
          tableData2: [],
          // 单位数据
          unitType: '',
          unitTypes: [],
          edmpQtyNames: [],
          tableData3: [],
          tableData3_1: [],
          tableData3_2: {
            id: '',
            edunEdmpId: '',
            edunQtyEdmpId: '',
            edunUnitType: '',
            isDel: 0,
            addtime: null,
            adduser: null,
            modtime: null,
            moduser: null,
            acctid: null,
            edmcName: null,
            edmpName: null,
            edmcQtyName: null,
            edmpQtyName: null,
            className: '',
            propertyName: '',
            classId: '',
            operation: false
          },
          ifSaveChange: [
            {
              label: '是',
              value: '1'
            }, {
              label: '否',
              value: '0'
            }
          ],
          changes: [
            {
              label: '同步',
              value: '1'
            }, {
              label: '异步',
              value: '2'
            }, {
              label: '定时',
              value: '3'
            }
          ],
          rules: {
            edcoUpdateType: [
              {required: true, message: '卷积更新时效不能为空', trigger: 'change'}
            ],
            edcoConvoluteFormula: [
              {required: true, message: '卷积公式不能为空', trigger: 'change'}
            ],
            edcnUpdateType3: [
              {required: true, message: '联动更新时效不能为空', trigger: 'change'}
            ],
            edcnLinkPreservable3: [
              {required: true, message: '是否保存联动记录不能为空', trigger: 'change'}
            ]
          }
        }
      },
      computed: {
        getDate: function () {
          var date = new Date()
          return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        }
      },
      created: function () {
        /* this.id = this.$route.params.id
        this.classid = this.$route.params.classid */
        var _this = this
        // 卷积公式下拉框
        axios.get('/v1/codes/edm_convolute_formula').then((res) => {
          _this.formulaOptions = res.data.data
          console.log(`=====id:${JSON.stringify(this.id)}  classid:${this.classid}=======`)
        }).catch((error) => {
          _this.$message({
            type: 'error',
            showClose: true,
            message: '卷积公式下拉框加载失败:' + error
          })
        })
        // 卷积form
        axios.get('/v1/properties/' + _this.id + '/convolute').then((res) => {
          if (res.data.data) {
            _this.convoData.tab1_id = res.data.data.id
            _this.convoData.edcoUpdateType = res.data.data.edcoUpdateType.toString()
            _this.convoData.edcoUpdateTime = res.data.data.edcoUpdateTime
            _this.convoData.edcoUpdateTimeliness = res.data.data.edcoUpdateTimeliness
            _this.convoData.edcoConvoluteFormula = res.data.data.edcoConvoluteFormula
            _this.convoData.edcoFormulaDesc = res.data.data.edcoFormulaDesc
          }
        }).catch((error) => {
          _this.$message({
            type: 'error',
            showClose: true,
            message: '卷积表单加载失败:' + error
          })
        })
        // 关联table
        axios.get('/v1/properties/' + _this.id + '/links').then((res) => {
          _this.tableData1 = res.data.data
          for (var i = 0; i < _this.tableData1.length; i++) {
            _this.tableData1[i].operation = true
            _this.tableData1[i].edmlEdmpLink = []
            _this.tableData1[i].edclUpdateType = _this.tableData1[i].edclUpdateType.toString()
            _this.tableData1[i].edcnLinkPreservable = _this.tableData1[i].edcnLinkPreservable.toString()
          }
          _this.tableData1_1 = _.cloneDeep(_this.tableData1)
          var obj = _.cloneDeep(_this.tableData1_2)
          obj.edmlEdmpId = _this.id
          obj.modtimeStr = _this.getDate
          _this.tableData1.push(obj)
        }).catch((error) => {
          _this.$message({
            type: 'error',
            showClose: true,
            message: '关联表格加载失败:' + error
          })
        })
        // 联动表头
        axios.get('/v1/properties/' + _this.id + '/connect/properties').then((res) => {
          if (res.data.data) {
            _this.conneData.tab3_id = res.data.data.id
            _this.conneData.edcnLinkPreservable3 = res.data.data.edcnLinkPreservable.toString()
            _this.conneData.edcnUpdateType3 = res.data.data.edcnUpdateType.toString()
            _this.conneData.edcnUpdateTimeliness3 = res.data.data.edcnUpdateTimeliness
            _this.conneData.edcnUpdateTime3 = res.data.data.edcnUpdateTime
          }
        }).catch((error) => {
          _this.$message({
            type: 'error',
            showClose: true,
            message: '联动表头加载失败:' + error
          })
        })
        // 联动table
        axios.get('/v1/properties/' + _this.id + '/connects').then((res) => {
          _this.tableData2 = res.data.data
        }).catch((error) => {
          _this.$message({
            type: 'error',
            showClose: true,
            message: '联动表格加载失败:' + error
          })
        })
        // 单位类别下拉框
        axios.get('/v1/codes/edm_unit').then((res) => {
          _this.unitTypes = res.data.data
        }).catch((error) => {
          _this.$message({
            type: 'error',
            showClose: true,
            message: '单位类别下拉框加载失败:' + error
          })
        })
        // 单位table
        axios.get('/v1/properties/' + _this.id + '/units').then((res) => {
          _this.tableData3 = res.data.data
          _this.unitType = res.data.data[0].edunUnitType
          _this.tableData3_1 = _.cloneDeep(res.data.data)
          for (var i = 0; i < _this.tableData3.length; i++) {
            _this.tableData3[i].operation = true
          }
          var obj = _.cloneDeep(_this.tableData3_2)
          _this.tableData3.push(obj)
        }).catch((error) => {
          _this.$message({
            type: 'error',
            showClose: true,
            message: '单位表格加载失败:' + error
          })
        })
        // 数值属性
        axios.get('/v1/properties/' + _this.id + '/units/sameclassunitlist').then((res) => {
          _this.edmpQtyNames = res.data.data
        }).catch((error) => {
          _this.$message({
            type: 'error',
            showClose: true,
            message: '数值属性下拉框加载失败:' + error
          })
        })
      },
      methods: {
        // 卷积保存方法
        tab1_save: function (ruleForm) {
          this.$refs[ruleForm].validate((valid) => {
            if (valid) {
              var _this = this
              if (this.convoData.tab1_id === '' || !this.convoData.tab1_id) {
                axios.post('/v1/convolutes', {
                  edcoEdmpId: _this.id,
                  edcoConvoluteFormula: _this.convoData.edcoConvoluteFormula,
                  edcoUpdateType: _this.convoData.edcoUpdateType,
                  edcoFormulaDesc: _this.convoData.edcoFormulaDesc,
                  edcoUpdateTime: _this.convoData.edcoUpdateTime,
                  edcoUpdateTimeliness: _this.convoData.edcoUpdateTimeliness
                }).then((res) => {
                  _this.$message({
                    type: 'success',
                    showClose: true,
                    message: '保存成功！'
                  })
                  _this.convoData.tab1_id = res.data.data
                }).catch((error) => {
                  _this.$message({
                    type: 'error',
                    showClose: true,
                    message: '卷积保存失败:' + error
                  })
                })
              } else {
                axios.put('/v1/convolutes', {
                  id: _this.convoData.tab1_id,
                  edcoEdmpId: _this.id,
                  edcoConvoluteFormula: _this.convoData.edcoConvoluteFormula,
                  edcoUpdateType: _this.convoData.edcoUpdateType,
                  edcoFormulaDesc: _this.convoData.edcoFormulaDesc,
                  edcoUpdateTime: _this.convoData.edcoUpdateTime,
                  edcoUpdateTimeliness: _this.convoData.edcoUpdateTimeliness
                }).then((res) => {
                  _this.$message({
                    type: 'success',
                    showClose: true,
                    message: '保存成功！'
                  })
                }).catch((error) => {
                  _this.$message({
                    type: 'error',
                    showClose: true,
                    message: '卷积保存失败:' + error
                  })
                })
              }
            } else {
              return false
            }
          })
        },
        // 关联
        tab2_save: function (index, row) {
          var _this = this
          if (row.edmlEdmcIdLink === '') {
            this.$message.error('类不能为空！')
          } else if (row.edmlEdmpLinkId === '') {
            this.$message.error('关联属性不能为空！')
          } else if (row.edmlCond === '') {
            this.$message.error('关联条件不能为空！')
          } else if (row.edmlFormula === '') {
            this.$message.error('关联公式不能为空！')
          } else if (!row.edclUpdateType) {
            this.$message.error('联动时效不能为空！')
          } else if ((row.edclUpdateType === '2' && row.edclUpdateTimeliness === '') || (row.edclUpdateType === '3' && !row.edclUpdateTime)) {
            this.$message.error('时间不能为空！')
          } else {
            if (row.id === '') {
              axios.post('/v1/links', {
                edmlEdmpId: row.edmlEdmpId,
                edmlEdmpLinkId: row.edmlEdmpLinkId,
                edcnLinkPreservable: row.edcnLinkPreservable,
                edclUpdateType: row.edclUpdateType,
                edclUpdateTime: row.edclUpdateTime,
                edclUpdateTimeliness: row.edclUpdateTimeliness,
                edmlCond: row.edmlCond,
                edmlFormula: row.edmlFormula,
                adduser: 'LY',
                moduser: 'LY'
              }).then((res) => {
                _this.$message({
                  type: 'success',
                  showClose: true,
                  message: '保存成功！'
                })
                row.id = res.data.data
                var i = 0
                for (; i < _this.tableData1[index].edmlEdmpLink.length; i++) {
                  if (row.edmlEdmpLinkId === _this.tableData1[index].edmlEdmpLink[i].id) {
                    break
                  }
                }
                row.edmlEdmpNameLink = _this.tableData1[index].edmlEdmpLink[i].edmpName
                row.operation = !row.operation
                _this.$set(_this.tableData1, index, row)
                if (_this.tableData1[_this.tableData1.length - 1].id !== '') {
                  var obj = _.cloneDeep(_this.tableData1_2)
                  obj.edmlEdmpId = _this.id
                  obj.modtimeStr = _this.getDate
                  _this.tableData1.push(obj)
                }
              }).catch((error) => {
                _this.$message({
                  type: 'error',
                  showClose: true,
                  message: '关联保存失败:' + error
                })
              })
            } else {
              axios.put('/v1/links', {
                id: row.id,
                edmlEdmpId: row.edmlEdmpId,
                edmlEdmpLinkId: row.edmlEdmpLinkId,
                edcnLinkPreservable: row.edcnLinkPreservable,
                edclUpdateType: row.edclUpdateType,
                edclUpdateTime: row.edclUpdateTime,
                edclUpdateTimeliness: row.edclUpdateTimeliness,
                edmlCond: row.edmlCond,
                edmlFormula: row.edmlFormula,
                edmConnectId: row.edmConnectId
              }).then((res) => {
                _this.$message({
                  type: 'success',
                  showClose: true,
                  message: '保存成功！'
                })
                row.id = res.data.data
                row.operation = !row.operation
                _this.$set(_this.tableData1, index, row)
              }).catch((error) => {
                _this.$message({
                  type: 'error',
                  showClose: true,
                  message: '关联保存失败:' + error
                })
              })
            }
          }
        },
        tab2_delete: function (index, row) {
          var _this = this
          axios.delete('/v1/links/' + row.id).then((res) => {
            _this.$message({
              type: 'success',
              showClose: true,
              message: '删除成功！'
            })
            _this.tableData1.splice(index, 1)
            _this.tableData1_1.splice(index, 1)
          }).catch((error) => {
            _this.$message({
              type: 'error',
              showClose: true,
              message: '关联删除失败:' + error
            })
          })
        },
        tab2_cancel: function (index, row) {
          if (row.id === '') {
            this.$message.error('空数据行不能取消！')
          } else {
            var obj = _.cloneDeep(this.tableData1_1[index])
            this.tableData1_1[index].operation = !row.operation
            this.$set(this.tableData1, index, obj)
          }
        },
        // 联动
        tab3_save: function (ruleForm) {
          this.$refs[ruleForm].validate((valid) => {
            if (valid) {
              var _this = this
              if (this.conneData.tab3_id === '') {
                axios.post('/v1/connects', {
                  edcnEdmpId: _this.id,
                  edcnLinkPreservable: _this.conneData.edcnLinkPreservable3,
                  edcnUpdateType: _this.conneData.edcnUpdateType3,
                  edcnUpdateTime: _this.conneData.edcnUpdateTime3,
                  edcnUpdateTimeliness: _this.conneData.edcnUpdateTimeliness3
                }).then((res) => {
                  _this.$message({
                    type: 'success',
                    showClose: true,
                    message: '保存成功！'
                  })
                  _this.convoData.tab3_id = res.data.data
                }).catch((error) => {
                  _this.$message({
                    type: 'error',
                    showClose: true,
                    message: '联动保存失败:' + error
                  })
                })
              } else {
                axios.put('/v1/connects', {
                  id: _this.conneData.tab3_id,
                  edcnEdmpId: _this.id,
                  edcnLinkPreservable: _this.conneData.edcnLinkPreservable3,
                  edcnUpdateType: _this.conneData.edcnUpdateType3,
                  edcnUpdateTime: _this.conneData.edcnUpdateTime3,
                  edcnUpdateTimeliness: _this.conneData.edcnUpdateTimeliness3
                }).then((res) => {
                  _this.$message({
                    type: 'success',
                    showClose: true,
                    message: '保存成功！'
                  })
                }).catch((error) => {
                  _this.$message({
                    type: 'error',
                    showClose: true,
                    message: '联动保存失败:' + error
                  })
                })
              }
            } else {
              return false
            }
          })
        },
        // 单位
        tab4_save1: function () {
          var _this = this
          if (this.unitType === '') {
            this.$message.error('单位类别不能为空！')
          } else {
            axios.put('/v1/properties/' + _this.id + '/units/edmunittype?edmUnitType=' + _this.unitType).then((res) => {
              _this.$message({
                type: 'success',
                showClose: true,
                message: '保存成功！'
              })
            }).catch((error) => {
              _this.$message({
                type: 'error',
                showClose: true,
                message: '单位保存失败:' + error
              })
            })
          }
        },
        tab4_save2: function (index, row) {
          var _this = this
          if (this.unitType === '') {
            this.$message.error('单位类别不能为空！')
          } else {
            if (row.edunQtyEdmpId === '') {
              this.$message.error('数值属性不能为空！')
            } else {
              if (row.id === '') {
                axios.post('/v1/units', {
                  edunEdmpId: _this.id,
                  edunQtyEdmpId: row.edunQtyEdmpId,
                  edunUnitType: _this.unitType
                }).then((res) => {
                  _this.$message({
                    type: 'success',
                    showClose: true,
                    message: '保存成功！'
                  })
                  row.id = res.data.data
                  row.operation = !row.operation
                  _this.$set(this.tableData3, index, row)
                  if (this.tableData3[_this.tableData3.length - 1].id !== '') {
                    var obj = _.cloneDeep(_this.tableData3_2)
                    _this.tableData3.push(obj)
                  }
                }).catch((error) => {
                  _this.$message({
                    type: 'error',
                    showClose: true,
                    message: '单位保存失败' + error
                  })
                })
              } else {
                axios.put('/v1/units', {
                  id: row.id,
                  edunEdmpId: _this.id,
                  edunQtyEdmpId: row.edunQtyEdmpId,
                  edunUnitType: _this.unitType
                }).then((res) => {
                  _this.$message({
                    type: 'success',
                    showClose: true,
                    message: '保存成功！'
                  })
                  row.id = res.data.data
                  row.operation = !row.operation
                  _this.$set(this.tableData3, index, row)
                }).catch((error) => {
                  _this.$message({
                    type: 'error',
                    showClose: true,
                    message: '单位保存失败:' + error
                  })
                })
              }
            }
          }
        },
        tab4_delete: function (index, row) {
          var _this = this
          axios.delete('/v1/units/' + row.id).then((res) => {
            _this.$message({
              type: 'success',
              showClose: true,
              message: '删除成功！'
            })
            _this.tableData3.splice(index, 1)
            _this.tableData3_1.splice(index, 1)
          }).catch((error) => {
            _this.$message({
              type: 'error',
              showClose: true,
              message: '单位删除失败:' + error
            })
          })
        },
        tab4_cancel: function (index, row) {
          if (row.id === '') {
            this.$message.error('空数据行不能取消！')
          } else {
            var obj = _.cloneDeep(this.tableData3_1[index])
            this.tableData3_1[index].operation = !row.operation
            this.$set(this.tableData3, index, obj)
          }
        },
        queryData: function (row) {
          var _this = this
          axios.get('/v1/properties/' + _this.id + '/units/sameclassunitlist').then((res) => {
            _this.edmpQtyNames = res.data.data
          }).catch((error) => {
            _this.$message({
              type: 'error',
              showClose: true,
              message: '数据加载失败:' + error
            })
          })
        },
        // 编辑状态变更
        ChangeStatus: function (index, row) {
          // 关联属性下拉框
          axios.get('/v1/classes/' + row.edmlEdmcIdLink + '/properties/name').then((res) => {
            row.edmlEdmpLink = res.data.data
            row.operation = !row.operation
            this.$set(this.tableData1, index, row)
          })
        },
        ChangeStatus2: function (index, row) {
          row.operation = !row.operation
          this.$set(this.tableData3, index, row)
        },
        funcTree1Selected: function (edmc) {
          this.treeVisible = false
          this.tableData1[this.rowNum].edmlEdmcNameLink = edmc.edmcName
          this.tableData1[this.rowNum].edmlEdmcIdLink = edmc.id
          // 关联属性下拉框
          this.tableData1[this.rowNum].edmlEdmpLinkId = ''
          var _this = this
          axios.get('/v1/classes/' + edmc.id + '/properties/name').then((res) => {
            _this.tableData1[this.rowNum].edmlEdmpLink = res.data.data
          }).catch((error) => {
            _this.$message({
              type: 'error',
              showClose: true,
              message: '关联属性下拉框加载失败:' + error
            })
          })
        },
        OpenTree: function (index) {
          this.rowNum = index
          this.treeVisible = true
        },
        OpenModel: function (row) {
          window.location.href = '#/modelM/' + row.edmlEdmcIdLink
        },
        OpenModel2: function (row) {
          window.location.href = '#/modelM/' + row.edmcId
        },
        checkClass: function (index, row, event) {
          if (row.edmlEdmcIdLink === '' && event === true) {
            this.$message({
              type: 'error',
              showClose: true,
              message: '请先选择类再选择关联属性'
            })
          }
        },
        dateChange: function (row, val) {
          console.log(val + '|||||||')
          console.log(row + '======')
        }
      },
      components: {
        Tree
      },
      watch: {
        propertyName (val) {
          this.queryData()
        }
      }
    }
</script>

<style>
/*卷积label宽度*/
.convcss .el-form-item__label {
  width: 110px;
}
/*联动label宽度*/
.conncss .el-form-item__label {
  width: 140px;
}
.attClass .el-tabs__header {
  margin: 0 0 15px 20px;
}
.attClass .el-input__inner {
  border: 1px solid #bfcbd9;
}
.attClass .el-input-number__decrease, .el-input-number__increase {
  line-height: 30px;
  top: 3px;
}
.attClass .el-tabs__content {
  margin-left: 20px;
}
.attClass .el-form-item__content{
  display: block;
}
</style>
