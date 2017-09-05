<template>
    <div id="mdefine">
    <div id="dialog-title">
      <el-dialog title="方法分类" v-model="treeVisible">
				  <methodClass @upup="changeType"></methodClass>
			</el-dialog>
      </div>
        <el-form :model="methodObject" :rules="rules" ref="form" class="demo-form-inline">
          <el-row style="padding-left: 20px">
            <div v-if="isEdit">
              <el-form-item >
                <el-button type="info" @click="isEdit=!isEdit" disabled><i class="el-icon-rx-bianji2">&nbsp;编辑</i></el-button>
                <el-button type="info" @click="Save('form')"><i class="el-icon-rx-baocun2-b">&nbsp;保存</i></el-button>
                <el-button type="info" @click="ChangeStatus"><i class="el-icon-rx-jinyong-b">&nbsp;{{btnStatus}}</i></el-button>
                <el-button type="info" @click="Delete" :disabled="!getIsDel"><i class="el-icon-delete2">&nbsp;删除</i></el-button>
                <el-button type="info" @click="Exit"><i class="el-icon-rx-chexiao-b">&nbsp;取消</i></el-button>
              </el-form-item>
            </div>
            <div v-else>
              <el-form-item >
                <el-button type="info" @click="isEdit=!isEdit"><i class="el-icon-rx-bianji2-b">&nbsp;编辑</i></el-button>
                <el-button type="info" @click="Save('form')" disabled><i class="el-icon-rx-baocun2">&nbsp;保存</i></el-button>
                <el-button type="info" @click="ChangeStatus" disabled><i class="el-icon-rx-jinyong">&nbsp;{{btnStatus}}</i></el-button>
                <el-button type="info" @click="Delete" :disabled="!getIsDel"><i class="el-icon-delete2">&nbsp;删除</i></el-button>
                <el-button type="info" @click="Exit"><i class="el-icon-rx-chexiao-b">&nbsp;取消</i></el-button>
              </el-form-item>
            </div>
          </el-row>
          <el-form-item :inline="true" label="方法分类" prop="edmmType">
              <el-input v-model="methodObject.edmmTypeName" :disabled="!isEdit" @focus="OpenTree" size="small"
			          placeholder=""  icon="plus" @click="OpenTree" readonly style="width:200px"></el-input>
              <el-input type="text" style="display:none" v-model="methodObject.edmmType"></el-input>
          </el-form-item>
          <el-form-item :inline="true" label="方法名称"  prop="edmmName">
            <el-input v-model="methodObject.edmmName" :disabled="!isEdit" size="small" @blur="CheckData" placeholder="" style="width:200px"></el-input>
          </el-form-item>
          <el-form-item label="状态">
              <div v-if="methodObject.edmmStatus == '1'">启用</div>
              <div v-else>禁用</div>
          </el-form-item>
          <input type="hidden" v-model="methodObject.edmmStatus">
          <el-form-item label="程序类型" prop="edmmProgramType" >
            <el-select v-model="methodObject.edmmProgramType" :disabled="!isEdit" style="width:200px" size="small">
              <el-option v-for="options in program_type" :key="options.id" :label="options.codeName" :value="options.codeValue"></el-option>
          </el-select>
          </el-form-item>
            <el-form-item label="是否自动方法">
                <div class="checkClass"><el-checkbox v-model="methodObject.isAuto" :disabled="!isEdit"></el-checkbox></div>
            </el-form-item>
              <el-form-item label="是否平台方法">
                <div class="checkClass"><el-checkbox v-model="methodObject.isPlatformProgram" :disabled="!isEdit"></el-checkbox></div>
            </el-form-item>
            <el-form-item label="方法描述" prop="edmmDesc" size="small">
              <el-input :disabled="!isEdit"
                  type="textarea"
                  :rows="2"
                  :file-list="fileList"
                  placeholder="请输入内容"
                  v-model="methodObject.edmmDesc"
                  style="width:450px"
                  >
              </el-input>
            </el-form-item>
            <el-row style="width:610px">
              <div v-if="isEdit">
                <el-col :span="23">
                  <el-form-item label="存储位置" size="small">
                    <el-input
                        placeholder="存储位置"
                        v-model="methodObject.edmmProgramStorage"
                        style="width:450px"
                        :disabled="true" size="small"
                        >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1">
                  <el-form-item>
                    <el-upload
                           action="http://192.168.13.34:2002/attachments/upload"
                           :file-list="fileList"
                           :on-change="UpLoadFile"
                           :show-file-list="false"
                           size="small"
                           ref="upload">
                      <el-button size="small" type="rx-icon2" icon="rx-tianjia-b" style="padding-top: 1px"></el-button>
                    </el-upload>
                  </el-form-item>
                </el-col>
              </div>
              <div v-else>
                <el-form-item label="存储位置" size="small">
                  <el-input
                      placeholder="存储位置"
                      v-model="methodObject.edmmProgramStorage"
                      style="width:450px"
                      :disabled="true" size="small"
                      >
                  </el-input>
                </el-form-item>
              </div>
            </el-row>
            <el-form-item label="触发条件" prop="edmmTriggerCond">
              <el-input
                  type="textarea"
                  :rows="2"
                  :disabled="!isEdit"
                  placeholder="请输入内容"
                  v-model="methodObject.edmmTriggerCond"
                  style="width:450px"
                  size="small"
                  >
              </el-input>
            </el-form-item>
            <el-form-item label="版本更新说明" prop="edmmUpdateDesc">
                <el-input
                    type="textarea"
                    :rows="2"
                    :disabled="!isEdit"
                    placeholder="请输入内容"
                    v-model="methodObject.edmmUpdateDesc"
                    style="width:450px" size="small"
                    >
                    </el-input>
            </el-form-item>
            <el-form-item label="版本号" prop="edmmVer">
              <el-input v-model="methodObject.edmmVer" :disabled="!isEdit" style="width:200px" size="small"></el-input>
            </el-form-item>
            <el-form-item label="研发部门" prop="edmmDevelopDept">
              <el-input :disabled="!isEdit" v-model="methodObject.edmmDevelopDept" style="width:200px" size="small"></el-input>
              <input type="hidden" v-model="methodObject.edmmDevelopDept">
            </el-form-item>
            <el-form-item label="程序员" prop="edmmProgrammer">
              <el-input  :disabled="!isEdit" v-model="methodObject.edmmProgrammer" style="width:200px" size="small"></el-input>
              <input type="hidden" v-model="methodObject.edmmProgrammer">
            </el-form-item>
            <el-form-item label="排序" prop="edmmSeq">
                <el-input v-model.number="methodObject.edmmSeq" :disabled="!isEdit" style="width:200px" size="small"></el-input>
            </el-form-item>
            <el-form-item label="维护人">
                {{methodObject.moduser}}
            </el-form-item>
            <el-form-item label="维护时间">
                {{methodObject.modtimeStr}}
            </el-form-item>
        </el-form>
        <el-tabs type="border-card">
          <div class="tabClass">
            <el-tab-pane label="方法输入参数">
              <el-table :data="tableInput" height="250" style="width: 100%">
                <el-table-column type="index" label="序号" align="center" width="70px"></el-table-column>
                <el-table-column align='center' label="参数类型" width="170px">
                  <template scope="scope">
                      <el-select v-model="scope.row.edmaDataType" style="width:150px" :disabled="!(scope.row.isEdit === 1)">
                          <el-option v-for="options in data_type" :key="options.id" :label="options.codeName" :value="options.codeValue"></el-option>
                      </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="参数名称" align='center' header-align="center" width="170px">
                    <template scope="scope">
                        <el-input v-model="scope.row.edmaName" placeholder="请输入参数名称" @blur="CheckArg(scope.row)" style="width:150px" :disabled="!(scope.row.isEdit === 1)"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="参数描述" align='left'>
                    <template scope="scope">
                        <el-input v-model="scope.row.edmaDesc" placeholder="请输入参数描述" :disabled="!(scope.row.isEdit === 1)"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="维护人" align='center' prop="moduser" width="170px"></el-table-column>
                <el-table-column label="维护时间" align='center' prop="modtimeStr" width="180px"></el-table-column>
                <el-table-column label="操作" align='center' width="190px">
                    <template scope="scope" >
                        <div v-if="scope.row.isEdit === 1">
                            <el-button size="small" @click="SaveTable('form','input',scope.row)" type="text" :disabled="!isEdit">保存</el-button>
                            <el-button size="small" @click="Cancel(scope.row)" type="text" >取消</el-button>
                        </div>
                        <div v-else>
                          <el-button size="small" @click="EditRow(scope.row)" type="text" >编辑</el-button>
                          <el-button size="small" @click="DeleteRow('input',scope.row)" type="text" >删除</el-button>
                          <el-button size="small" @click="UpArg('input',scope.row)" type="text" >上移</el-button>
                          <el-button size="small" @click="DownArg('input',scope.row)" type="text" >下移</el-button>
                        </div>
                    </template>
                </el-table-column>
              </el-table>
              </el-tab-pane>
              <el-tab-pane label="方法返回值">
                <el-table   :data="tableReturn"
                                height="250"
                                style="width: 100%">
                  <el-table-column type="index" label="序号" width="70px" align="center"></el-table-column>
                  <el-table-column align='center' label="参数类型" width="170px">
                    <template scope="scope">
                      <el-select v-model="scope.row.edmaDataType" style="width:150px" :disabled="!(scope.row.isEdit === 1)">
                        <el-option v-for="options in data_type" :key="options.id" :label="options.codeName" :value="options.codeValue"></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                <el-table-column label="返回值名称" align='center' header-align="center" width="170px">
                    <template scope="scope">
                        <el-input v-model="scope.row.edmaName" placeholder="请输入返回值名称" style="width:150px" :disabled="!(scope.row.isEdit === 1)"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="返回值描述" align='left'>
                    <template scope="scope">
                        <el-input v-model="scope.row.edmaDesc" placeholder="请输入返回值描述" :disabled="!(scope.row.isEdit === 1)"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="维护人" align='center' prop="moduser" width="170px"></el-table-column>
                <el-table-column label="维护时间" align='center' prop="modtimeStr" width="180px"></el-table-column>
                <el-table-column label="操作" align='center' width="190px">
                    <template scope="scope">
                        <div v-if="scope.row.isEdit === 1">
                            <el-button size="small" @click="SaveTable('form','return',scope.row)" type="text" :disabled="!isEdit">保存</el-button>
                            <el-button size="small" @click="Cancel(scope.row)" type="text" >取消</el-button>
                        </div>
                        <div v-else>
                            <el-button size="small" @click="EditRow(scope.row)" type="text" >编辑</el-button>
                            <el-button size="small" @click="DeleteRow('return',scope.row)" type="text" >删除</el-button>
                        </div>
                    </template>
                </el-table-column>
               </el-table>
              </el-tab-pane>
            </div>
        </el-tabs>
    </div>
</template>
<script>
import axios from 'axios'
import methodClass from '@/components/m-cmpns/method-classify'
export default {
  name: 'methodDefine',
  data () {
    return {
      isEdit: '', // 是否编辑状态
      isDel: '', // 能否删除
      mid: 0, // 对象id
      originPage: '',
      user: 'Tao', // 默认操作人  现状写死  以后改为登录人
      btnStatus: '禁用', // 用于禁用、启用按钮名称改变 默认启用状态  所以为禁用
      check_name: '', // 用于校验名字是否改变
      methodObject: { // 表单对象
        acctid: '1',
        addtime: this.getDate,
        adduser: this.user,
        edmmDesc: '',
        edmmDevelopDept: '',
        edmmName: '',
        edmmProgramStorage: '',
        edmmProgramType: '',
        edmmProgrammer: '',
        edmmSeq: null,
        edmmStatus: '1',
        edmmTriggerCond: '',
        edmmType: '',
        edmmTypeName: '',
        edmmUpdateDesc: '',
        edmmVer: '',
        isAuto: 0,
        isDefined: '',
        isDel: '0',
        isPlatformProgram: 0,
        modtimeStr: this.getDate,
        moduser: this.user
      },
      data_type: [], // 数据类型下拉框数据
      program_type: [], // 程序类型下拉框数据
      tableInput: [], // 输入参数数据
      tableReturn: [{
        id: 0,
        edmaDataType: '',
        edmaName: '',
        edmaDesc: '',
        adduser: '',
        addtime: '',
        moduser: '',
        modtime: '',
        modtimeStr: '',
        isEdit: 1
      }], // 返回值参数数据
      treeVisible: false, // 是否显示方法分类树
      copyTable: [], // 用于保存已有输入参数、返回参数   取消编辑后恢复原来数据
      fileList: [], // 上传文件
      rules: {
        edmmType: [
          { required: true, message: '请选择方法分类', trigger: 'onchange' }
        ],
        edmmName: [
          { required: true, message: '请输入方法名称', trigger: 'blur' },
          { max: 50, message: '长度不能超过50', trigger: 'blur' }
        ],
        edmmProgramType: [
          { required: true, message: '请选择程序类型', trigger: 'change' }
        ],
        edmmVer: [
          { required: true, message: '请输入版本号', trigger: 'blur' },
          { max: 50, message: '长度不能超过50', trigger: 'blur' }
        ],
        edmmDesc: [
          { max: 400, message: '长度不能超过400', trigger: 'blur' }
        ],
        edmmTriggerCond: [
          { max: 4000, message: '长度不能超过4000', trigger: 'blur' }
        ],
        edmmUpdateDesc: [
          { max: 2000, message: '长度不能超过2000', trigger: 'blur' }
        ],
        edmmDevelopDept: [
          { required: true, message: '请输入研发部门', trigger: 'blur' },
          { max: 50, message: '长度不能超过50', trigger: 'blur' }
        ],
        edmmProgrammer: [
          { required: true, message: '请输入程序员', trigger: 'blur' },
          { max: 50, message: '长度不能超过50', trigger: 'blur' }
        ],
        edmmSeq: [
          { required: true, message: '请输入排序' },
          { type: 'number', message: '排序必须为数字值' }
        ]
      }
    }
  },
  computed: {
    // 编辑状态下且可以删除的
    getIsDel: function () {
      return this.isDel && this.isEdit
    },
    // 获取返回值排序
    getReturnSeq: function () {
      var len = this.tableReturn.length
      if (len === 0) {
        return 1
      } else {
        return this.tableReturn[len - 1].edmaSeq + 1
      }
    },
    // 获取当前日期
    getDate: function () {
      var date = new Date()
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      return date.getFullYear() + '-' + month + '-' + strDate + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    }
  },
  created: function () {
    if (this.$route.query.type === '1' || this.$route.query.type === 1) {
      this.mid = this.$route.query.mid
    }
    this.methodObject.modtimeStr = this.getDate
    this.methodObject.moduser = this.user
    this.tableReturn[0].moduser = this.user
    this.tableReturn[0].modtimeStr = this.getDate
    this.originPage = this.$route.query.page
    this.initDDL()
    this.QueryMain()
  },
  methods: {
    // 初始化页面下拉框
    initDDL: function () {
      var _this = this
      axios.get('/v1/codes/edm_program_type').then(function (res) {
        _this.program_type = res.data.data
      }).catch(function (error) {
        this.$message({
          type: 'error',
          message: '初始化程序类型下拉框失败！' + error
        })
        console.log(error)
      })
      axios.get('/v1/codes/edm_para_type').then(function (res) {
        _this.data_type = res.data.data
      }).catch(function (error) {
        this.$message({
          type: 'error',
          message: '初始化数据类型下拉框失败！' + error
        })
        console.log(error)
      })
    },
    // 在方法类型树种选择方法分类
    changeType: function (data) {
      this.methodObject.edmmTypeName = data.name
      this.methodObject.edmmType = data.id
      this.treeVisible = false
    },
    // 主表查询
    QueryMain: function () {
      var _this = this
      if (_this.$route.query.type === '1' || _this.$route.query.type === 1) {
        _this.isEdit = false
        _this.isDel = true
        axios.get('/v1/methods/' + _this.$route.query.mid).then(function (res) {
          if (res.data.retCode === 1) {
            _this.methodObject = res.data.data[0]
            _this.methodObject.isAuto = !!_this.methodObject.isAuto
            _this.methodObject.edmmSeq = parseInt(_this.methodObject.edmmSeq)
            _this.methodObject.isPlatformProgram = !!_this.methodObject.isPlatformProgram
            _this.check_name = _this.methodObject.edmmName
            if (res.data.data[0].edmmStatus === '0' || res.data.data[0].edmmStatus === 0) {
              _this.btnStatus = '启用'
            } else {
              _this.btnStatus = '禁用'
            }
            // console.log(JSON.stringify(res.data.data))
            _this.QueryInput()
            _this.QueryReturn()
          }
        }).catch(function (error) {
          this.$message({
            type: 'error',
            message: '查询失败！' + error
          })
          console.log(error)
        })
      } else {
        _this.isEdit = true
        _this.isDel = false
        _this.AddRow()
      }
    },
    // 删除方法
    Delete: function () {
      var _this = this
      _this.$confirm('确认删除？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.delete('/v1/methods/' + _this.mid).then(function (res) {
          if (res.data.retCode === 1) {
            _this.$alert('删除成功！', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                _this.$router.push({path: '/method-manage'})
              }
            })
          }
        }).catch(function (error) {
          _this.$message({
            type: 'error',
            message: '删除失败！' + error
          })
          console.log(error)
        })
      })
    },
    // 保存方法
    Save: function (formName) {
      var _this = this
      var fileList = _this.$refs.upload.fileList
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          if (_this.mid === 0) {
            axios.post('/v1/methods/', {
              acctid: '1',
              edmmDesc: _this.methodObject.edmmDesc,
              edmmDevelopDept: _this.methodObject.edmmDevelopDept,
              edmmName: _this.methodObject.edmmName,
              edmmProgramStorage: fileList[fileList.length - 1].response.data.edmaPath,
              edmmProgramType: _this.methodObject.edmmProgramType,
              edmmProgrammer: _this.methodObject.edmmProgrammer,
              edmmSeq: parseInt(_this.methodObject.edmmSeq),
              edmmStatus: _this.methodObject.edmmStatus,
              edmmTriggerCond: _this.methodObject.edmmTriggerCond,
              edmmType: _this.methodObject.edmmType,
              edmmUpdateDesc: _this.methodObject.edmmUpdateDesc,
              edmmVer: _this.methodObject.edmmVer,
              isAuto: _this.methodObject.isAuto ? 1 : 0,
              isDefined: '1',
              isDel: '0',
              isPlatformProgram: _this.methodObject.isPlatformProgram ? 1 : 0,
              adduser: _this.user,
              moduser: _this.user
            }).then(function (res) {
              if (res.data.retCode === 1 || res.data.retCode === '1') {
                _this.mid = res.data.data
                _this.$alert('保存成功！', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    _this.$router.push({path: '/method-manage'})
                  }
                })
              } else {
                _this.$message({
                  type: 'error',
                  message: '保存失败！' + res.errMsg
                })
              }
            }).catch(function (error) {
              _this.$message({
                type: 'error',
                message: '保存失败！' + error
              })
              console.log(error)
            })
          } else {
            axios.put('/v1/methods/', {
              acctid: '1',
              edmmDesc: _this.methodObject.edmmDesc,
              edmmDevelopDept: _this.methodObject.edmmDevelopDept,
              edmmName: _this.methodObject.edmmName,
              edmmProgramStorage: _this.methodObject.edmmProgramStorage,
              edmmProgramType: _this.methodObject.edmmProgramType,
              edmmProgrammer: _this.methodObject.edmmProgrammer,
              edmmSeq: parseInt(_this.methodObject.edmmSeq),
              edmmStatus: _this.methodObject.edmmStatus,
              edmmTriggerCond: _this.methodObject.edmmTriggerCond,
              edmmType: _this.methodObject.edmmType,
              edmmUpdateDesc: _this.methodObject.edmmUpdateDesc,
              edmmVer: _this.methodObject.edmmVer,
              isAuto: _this.methodObject.isAuto ? 1 : 0,
              isDefined: '1',
              isDel: '0',
              id: _this.mid,
              isPlatformProgram: _this.methodObject.isPlatformProgram ? 1 : 0,
              moduser: _this.user
            }).then(function (res) {
              if (res.data.retCode === 1 || res.data.retCode === '1') {
                _this.$alert('保存成功！', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    _this.$router.push({path: '/method-manage'})
                  }
                })
              } else {
                _this.$message({
                  type: 'error',
                  message: '保存失败！' + res.errMsg
                })
              }
            }).catch(function (error) {
              _this.$message({
                type: 'error',
                message: '保存失败！' + error
              })
              console.log(error)
            })
          }
        } else {
          return false
        }
      })
    },
    // 修改启用、禁用状态
    ChangeStatus: function () {
      if (this.methodObject.edmmStatus === '1' || this.methodObject.edmmStatus === 1) {
        this.methodObject.edmmStatus = 0
        this.btnStatus = '启用'
      } else {
        this.methodObject.edmmStatus = 1
        this.btnStatus = '禁用'
      }
    },
    // 查询输入参数
    QueryInput: function () {
      var _this = this
      axios.get('/v1/methodArgs/inputArg/' + _this.mid).then(function (res) {
        if (res.data.retCode === 1) {
          _this.tableInput = res.data.data
          var len = _this.tableInput.length
          for (var i = 0; i < len; i++) {
            _this.tableInput[i].isEdit = 0
            _this.tableInput[i].checkName = _this.tableInput[i].edmaName
          }
        }
        _this.AddRow()
      }).catch(function (error) {
        _this.$message({
          type: 'error',
          message: '查询失败！' + error
        })
        console.log(error)
      })
    },
    // 查询返回参数
    QueryReturn: function () {
      var _this = this
      axios.get('/v1/methodArgs/returnArg/' + _this.mid).then(function (res) {
        if (res.data.retCode === 1 && res.data.data.length > 0) {
          _this.tableReturn = res.data.data
        }
      }).catch(function (error) {
        _this.$message({
          type: 'error',
          message: '查询失败！' + error
        })
        console.log(error)
      })
    },
    // 保存输入、输入参数   formName用于新增页面时先保存方法  tabletype用于区分输入、输出参数 obj为当前对象
    SaveTable: function (formName, tableType, obj) {
      var _this = this
      // 校验单据
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          if (_this.mid === 0) {
            axios.post('/v1/methods/', {
              acctid: '1',
              edmmDesc: _this.methodObject.edmmDesc,
              edmmDevelopDept: _this.methodObject.edmmDevelopDept,
              edmmName: _this.methodObject.edmmName,
              edmmProgramStorage: _this.methodObject.edmmProgramStorage,
              edmmProgramType: _this.methodObject.edmmProgramType,
              edmmProgrammer: _this.methodObject.edmmProgrammer,
              edmmSeq: parseInt(_this.methodObject.edmmSeq),
              edmmStatus: _this.methodObject.edmmStatus,
              edmmTriggerCond: _this.methodObject.edmmTriggerCond,
              edmmType: _this.methodObject.edmmType,
              edmmUpdateDesc: _this.methodObject.edmmUpdateDesc,
              edmmVer: _this.methodObject.edmmVer,
              isAuto: _this.methodObject.isAuto ? 1 : 0,
              isDefined: '1',
              isDel: '0',
              isPlatformProgram: _this.methodObject.isPlatformProgram ? 1 : 0,
              adduser: _this.user,
              moduser: _this.user
            }).then(function (res) {
              if (res.data.retCode === 1) {
                _this.mid = res.data.data
                _this.$message({
                  showClose: true,
                  message: '主表保存成功！'
                })
                // 校验当前对象数据
                if (obj.edmaDataType === '') {
                  this.$message({
                    showClose: true,
                    message: '请选择数据类型！',
                    type: 'error'
                  })
                  return
                }
                if (obj.edmaName === '') {
                  this.$message({
                    showClose: true,
                    message: '请输入名称！',
                    type: 'error'
                  })
                  return
                }
                if (obj.edmaName.length > 50) {
                  this.$message({
                    showClose: true,
                    message: '名称长度不能超过50！',
                    type: 'error'
                  })
                  return
                }
                if (obj.edmaDesc.length > 400) {
                  this.$message({
                    showClose: true,
                    message: '描述长度不能超过400！',
                    type: 'error'
                  })
                  return
                }
                if (obj.id === 0) {
                  axios.post('/v1/methodArgs/' + tableType + 'Arg', {
                    acctid: '1',
                    adduser: _this.user,
                    edmaDataType: obj.edmaDataType,
                    edmaDesc: obj.edmaDesc,
                    edmaEdmmId: _this.mid,
                    edmaName: obj.edmaName,
                    edmaSeq: obj.edmaSeq,
                    edmaType: obj.edmaType,
                    moduser: _this.user
                  }).then(function (res) {
                    if (res.data.retCode === 1) {
                      obj.id = res.data.data
                      obj.isEdit = 0
                      if (tableType === 'input') {
                        _this.AddRow()
                      }
                      _this.$message({
                        showClose: true,
                        message: '保存成功！'
                      })
                    }
                  }).catch(function (error) {
                    _this.$message({
                      type: 'error',
                      message: '保存失败！' + error
                    })
                    console.log(error)
                  })
                } else {
                  axios.put('/v1/methodArgs', {
                    acctid: '1',
                    adduser: _this.user,
                    moduser: _this.user,
                    edmaDataType: obj.edmaDataType,
                    edmaDesc: obj.edmaDesc,
                    edmaEdmmId: _this.mid,
                    edmaName: obj.edmaName,
                    edmaSeq: obj.edmaSeq,
                    edmaType: obj.edmaType,
                    id: obj.id
                  }).then(function (res) {
                    if (res.data.retCode === 1) {
                      _this.$message({
                        showClose: true,
                        message: '保存成功！'
                      })
                      obj.isEdit = 0
                    }
                  }).catch(function (error) {
                    _this.$message({
                      type: 'error',
                      message: '保存失败！' + error
                    })
                    console.log(error)
                  })
                }
              } else {
                _this.$message({
                  type: 'error',
                  message: '保存失败！' + res.errMsg
                })
              }
            }).catch(function (error) {
              _this.$message({
                type: 'error',
                message: '保存主表失败！' + error
              })
              return 0
            })
          } else {
            // 校验当前对象数据
            if (obj.edmaDataType === '') {
              this.$message({
                showClose: true,
                message: '请选择数据类型！',
                type: 'error'
              })
              return
            }
            if (obj.edmaName === '') {
              this.$message({
                showClose: true,
                message: '请输入名称！',
                type: 'error'
              })
              return
            }
            if (obj.edmaName.length > 50) {
              this.$message({
                showClose: true,
                message: '名称长度不能超过50！',
                type: 'error'
              })
              return
            }
            if (obj.edmaDesc.length > 400) {
              this.$message({
                showClose: true,
                message: '描述长度不能超过400！',
                type: 'error'
              })
              return
            }
            if (obj.id === 0) {
              axios.post('/v1/methodArgs/' + tableType + 'Arg', {
                acctid: '1',
                adduser: _this.user,
                edmaDataType: obj.edmaDataType,
                edmaDesc: obj.edmaDesc,
                edmaEdmmId: _this.mid,
                edmaName: obj.edmaName,
                edmaSeq: obj.edmaSeq,
                edmaType: obj.edmaType,
                moduser: _this.user
              }).then(function (res) {
                if (res.data.retCode === 1) {
                  obj.id = res.data.data
                  obj.isEdit = 0
                  if (tableType === 'input') {
                    _this.AddRow()
                  }
                  _this.$message({
                    showClose: true,
                    message: '保存成功！'
                  })
                }
              }).catch(function (error) {
                _this.$message({
                  type: 'error',
                  message: '保存失败！' + error
                })
                console.log(error)
              })
            } else {
              axios.put('/v1/methodArgs', {
                acctid: '1',
                adduser: _this.user,
                moduser: _this.user,
                edmaDataType: obj.edmaDataType,
                edmaDesc: obj.edmaDesc,
                edmaEdmmId: _this.mid,
                edmaName: obj.edmaName,
                edmaSeq: obj.edmaSeq,
                edmaType: obj.edmaType,
                id: obj.id
              }).then(function (res) {
                if (res.data.retCode === 1) {
                  _this.$message({
                    showClose: true,
                    message: '保存成功！'
                  })
                  obj.isEdit = 0
                }
              }).catch(function (error) {
                _this.$message({
                  type: 'error',
                  message: '保存失败！' + error
                })
                console.log(error)
              })
            }
          }
        } else {
          return false
        }
      })
    },
    // 新增一行数据 type用于区别输入、输出参数
    AddRow: function () {
      var _this = this
      var tempSeq = 1
      var len = 0
      len = _this.tableInput.length
      // 获取当前行排序
      if (_this.tableInput.length > 0) {
        tempSeq = parseInt(_this.tableInput[len - 1].edmaSeq) + 1
      }
      _this.tableInput.push({
        id: 0,
        edmaDataType: '',
        edmaName: '',
        edmaDesc: '',
        adduser: _this.user,
        addtime: _this.getDate,
        edmaSeq: tempSeq,
        moduser: _this.user,
        modtime: _this.getDate,
        modtimeStr: _this.getDate,
        isEdit: 1
      })
    },
    // 删除输入、输出参数
    DeleteRow: function (type, obj) {
      var _this = this
      _this.$confirm('确认删除？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.delete('/v1/methodArgs/' + obj.id).then(function (res) {
          var len
          var i = 0
          if (res.data.retCode === 1) {
            if (type === 'input') {
              len = _this.tableInput.length
              for (; i < len; i++) {
                if (_this.tableInput[i].id === obj.id) {
                  break
                }
              }
              _this.tableInput.splice(i, 1)
            } else {
              _this.$set(_this.tableReturn, 0, {
                id: 0,
                edmaDataType: '',
                edmaName: '',
                edmaDesc: '',
                adduser: '',
                addtime: '',
                moduser: '',
                modtime: '',
                modtimeStr: '',
                isEdit: 1
              })
            }
            _this.$alert('删除成功！', '提示', {
              confirmButtonText: '确定'
            })
          }
        }).catch(function (error) {
          _this.$message({
            type: 'error',
            message: '删除失败！' + error
          })
        })
      })
    },
    // 点击输出、输出参数后面的编辑按钮触发事件
    EditRow: function (obj) {
      if (!this.isEdit) {
        this.$message('请在编辑状态下进行操作！')
        return false
      }
      var item
      var flag = 0
      // 判断copy数据是否存在  存在则覆盖  不存在则增加   用于取消编辑时恢复原数据
      for (item in this.copyTable) {
        if (item.id === obj.id) {
          item.edmaDateType = obj.id
          item.edmaName = obj.edmaName
          item.edmaDesc = obj.edmaDesc
          flag = 1
          break
        }
      }
      if (flag === 0) {
        this.copyTable.push({
          id: obj.id,
          edmaDateType: obj.edmaDateType,
          edmaName: obj.edmaName,
          edmaDesc: obj.edmaDesc
        })
      }
      obj.isEdit = 1
    },
    // 取消编辑状态
    Cancel: function (obj) {
      var i = 0
      var len = this.copyTable.length
      if (obj.id === 0) { // 如果为新增行 则不能取消
        return 0
      } else {
        for (; i < len; i++) {
          if (this.copyTable[i].id === obj.id) {
            break
          }
        }
        obj.edmaDateType = this.copyTable[i].edmaDateType
        obj.edmaName = this.copyTable[i].edmaName
        obj.edmaDesc = this.copyTable[i].edmaDesc
        obj.isEdit = '0'
      }
    },
    // 上移参数
    UpArg: function (type, obj) {
      var _this
      var win = this
      if (type === 'input') {
        _this = this.tableInput
      } else {
        _this = this.tableReturn
      }
      var len = _this.length
      var index = 0
      for (;index < len; index++) {
        if (_this[index].id === obj.id) {
          break
        }
      }
      if (index > 0) {
        axios.put('/v1/methodArgs/' + _this[index - 1].id + '/' + obj.id).then(function (res) {
          win.$message({
            type: 'success',
            message: '操作成功！'
          })
          if (res.data.retCode === 1) {
            var tempObj = _this[index]
            win.$set(_this, index, _this[index - 1])
            win.$set(_this, index - 1, tempObj)
          }
        }).catch(function (error) {
          win.$message({
            type: 'error',
            message: '操作失败！' + error
          })
        })
      } else {
        win.$message({
          type: 'error',
          message: '操作失败：该数据已位于第一个！'
        })
      }
    },
    // 下移参数
    DownArg: function (type, obj) {
      var _this
      var win = this
      if (type === 'input') {
        _this = this.tableInput
      } else {
        _this = this.tableReturn
      }
      var len = _this.length
      var index = 0
      for (;index < len; index++) {
        if (_this[index].id === obj.id) {
          break
        }
      }
      if (index < _this.length - 2) {
        axios.put('/v1/methodArgs/' + _this[index + 1].id + '/' + obj.id).then(function (res) {
          win.$message({
            type: 'success',
            message: '操作成功！'
          })
          if (res.data.retCode === 1) {
            var tempObj = _this[index + 1]
            win.$set(_this, index + 1, _this[index])
            win.$set(_this, index, tempObj)
          }
        }).catch(function (error) {
          win.$message({
            type: 'error',
            message: '操作失败！' + error
          })
        })
      } else {
        win.$message({
          type: 'error',
          message: '操作失败：该数据已位于最后一个！'
        })
      }
    },
    // 打开方法分类树
    OpenTree: function () {
      this.treeVisible = true && this.isEdit
    },
    // 上传文件  返回存储位置
    UpLoadFile: function (file, fileList) {
      var vm = this
      if (file.status === 'fail') {
        vm.$message({
          type: 'info',
          message: '文件过大!'
        })
      }
      vm.fileList = fileList
      vm.methodObject.edmmProgramStorage = file.name
    },
    // 清空方法分类数据
    ClearType: function () {
      this.methodObject.edmmTypeName = ''
      this.methodObject.edmmType = ''
    },
    // 返回方法查询页面
    Exit: function () {
      if (this.originPage === 'manage') {
        this.$router.push({path: '/method-manage'})
      } else if (this.originPage === 'model') {
        this.$router.push({path: '/method-model'})
      }
    },
    // 校验方法名称不为空
    CheckData: function () {
      var _this = this
      if (_this.check_name === _this.methodObject.edmmName) {
        return false
      }
      axios.get('/v1/methods/checkData?edmmName=' + _this.methodObject.edmmName).then(function (res) {
        if (res.data.retCode === 1) {
          return true
        } else {
          _this.$message({
            showClose: true,
            message: '该名称已存在！'
          })
          _this.methodObject.edmmName = '' // 改名称不可用  清空当前输入 并给出提示
          return false
        }
      })
    },
    CheckArg: function (obj) {
      if (obj.checkName !== obj.edmaName) {
        var _this = this
        axios.get('/v1/methodArgs/checkData?edmaName=' + obj.edmaName + '&edmaEdmmId=' + _this.mid).then(function (res) {
          if (res.data.retCode === 1) {
            return true
          } else {
            _this.$message({
              showClose: true,
              message: '该参数名称已存在！'
            })
            obj.edmaName = obj.checkName // 改名称不可用  清空当前输入 并给出提示
            return false
          }
        })
      }
    }
  },
  components: {
    methodClass
  }
}
</script>
<style>
/*label宽度*/
#mdefine .el-form-item__label {
  width: 120px;
}
/*勾选框样式*/
.checkClass .el-checkbox__inner:hover{
  border-color: #9da8ff;
}
.checkClass .el-checkbox__input.is-checked .el-checkbox__inner {
  border-color: #9da8ff;
  background-color: #9da8ff;
}
.checkClass .el-checkbox__input.is-focus .el-checkbox__inner {
  border-color: #9da8ff;
}
#mdefine .el-tabs__item.is-active {
  color: #9da8ff;
}
/*按钮样式*/
#mdefine .el-button+.el-button {
  margin-left: 20px;
}
#mdefine .el-button--info {
  border-color: #9da8ff;
}
/*table数据颜色*/
#mdefine .el-table {
  color: #6B6B74;
  margin-left: 10px;
}
/*table数据行高度*/
#mdefine .el-table .el-table__body-wrapper td {
  height: 50px;
}
/*表头高度*/
#mdefine .tabClass .el-table th>.cell {
  height: 42px;
  padding-top: 7px;
}
/*表头字体颜色*/
#mdefine .tabClass .el-table__header-wrapper thead div {
  color: #9496A0;
  font-size: 14px;
  background-color: #e9edf6;
}
  /*按钮颜色样式*/
#mdefine  .el-icon-rx-bianji2:before{
  color: #ffffff;
}
#mdefine .is-disabled>span>.el-icon-rx-bianji2:before{
  color: #9496a0;
}
#mdefine  .el-icon-rx-baocun2-b:before{
  color: #ffffff;
}
#mdefine .is-disabled>span>.el-icon-rx-baocun2-b:before{
  color: #9496a0;
}
#mdefine  .el-icon-rx-jinyong-b:before{
  color: #ffffff;
}
#mdefine .is-disabled>span>.el-icon-rx-jinyong-b:before{
  color: #9496a0;
}
#mdefine  .el-icon-delete2:before{
  color: #ffffff;
}
#mdefine .is-disabled>span>.el-icon-delete2:before{
  color: #9496a0;
}
#mdefine .el-button--rx-icon2{
  font-size: 12px;
}
</style>
