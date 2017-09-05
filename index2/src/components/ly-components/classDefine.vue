<template>
  <div id="class-define">
    <el-form :model="edmClass">
      <el-row>
        <el-form-item id="defbtn">
          <el-button type="info" v-if="ifOld2" :disabled="checkName===false || checkCode===false || checkShowShortName === false"
                     @click="insertClass('ruleForm')" icon="rx-baocun1-b" >保存</el-button>
          <el-button type="info" v-if="ifOld"  :disabled="checkName===false || checkCode===false || checkShowShortName === false"
                     @click="savaClass('ruleForm')" icon="rx-baocun1-b">保存</el-button>
          <el-button type="info" v-if="ifOld3" :disabled="checkName===false || checkCode===false || checkShowShortName === false"
                     @click="copyClass('ruleForm')" icon="rx-baocun1-b">保存</el-button>
          <el-button v-if="ifOld1" type="info" @click="deleteClass" >删除</el-button>
          <el-button  @click="goBack" type="info" icon="rx-chexiao-b">返回</el-button>
        </el-form-item>
      </el-row>
      <el-row>
      <el-form  :inline="true" :model="edmClass" :rules="rules" ref="ruleForm" class="demo-form-inline">
        <el-form-item label="类编码" prop="edmcCode">
          <el-input v-model="edmClass.edmcCode"  @blur="_checkCode" class="short-width"></el-input>
          <checkTip :checkShow="checkShowCode" :check="checkCode" class="checkTip"></checkTip>
        </el-form-item>
        <el-form-item label="类简称" prop="edmcShortName">
          <el-input v-model="edmClass.edmcShortName"  @blur="_checkShortName" :maxlength="4"></el-input>
          <checkTip :checkShow="checkShowShortName" :check="checkShortName"></checkTip>
        </el-form-item>
        <el-form-item label="类名称" prop="edmcName">
          <el-input v-model="edmClass.edmcName"  @blur="_checkName" class="short-width"></el-input>
          <checkTip :checkShow="checkShowName" :check="checkName" class="checkTip"></checkTip>
        </el-form-item>
        <el-form-item label="类英文名称" prop="edmcNameEn">
          <el-input v-model="edmClass.edmcNameEn" class="short-width" ></el-input>
        </el-form-item>
        <el-form-item label="父类" prop="parentName" >
        <!--这里v-model绑定的是选择树节点后输入框显示的值-->
        <el-input v-model="edmClass.parentName"
                  placeholder="" icon="plus" @focus="OpenTree" class="short-width"  ></el-input>
      </el-form-item>
        <!--这是一棵树-->
      <div id="dialog-title">
        <el-dialog title="类选择" v-model="treeVisible" size="tiny">
          <tree :modelID="edmClass.edmcEdmdId" @nodeSelect="funcTree1Selected"></tree>
        </el-dialog>
      </div>
      </el-form>
      <el-form :inline="true" :model="edmClass">
        <el-form-item label="类版本">
        <el-input v-model="edmClass.edmcVer " class="short-width"></el-input>
      </el-form-item>
      <el-form-item label="是否实体类">
        <el-select v-model="edmClass.isEntity" class="short-width">
          <el-option v-for="option in isOptions" :key="option.value" :label="option.label"
                     :value="option.value" >{{option.label}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据库类型">
        <el-select v-model="edmClass.databaseType" class="short-width">
          <el-option v-for="option in options" :key="option.codeValue" :label="option.codeName"
                     :value="option.codeValue" >{{option.codeName}}</el-option>
        </el-select>
      </el-form-item>
        <el-form-item label="负责人">
        <el-input v-model="edmClass.edmcPrincipal" class="short-width"></el-input>
      </el-form-item>
      </el-form>
      </el-row>
      <el-row>
        <el-form-item label="适用行业" prop="industryValues">
          <el-cascader placeholder="通用模型" expand-trigger="hover" :options="industries" :props="props"
                       v-model="edmClass.industryValues" class="long-width"
                       @change="" >
          </el-cascader>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="使用说明"  prop="edmcUseDesc">
          <el-input type="textarea" :rows="3" placeholder="请输入内容(字数限制：800字符)" v-model="edmClass.edmcUseDesc"
                     class="long-width"></el-input>
        </el-form-item>
      </el-row>
      <el-row style="padding: 0px 0 24px 40px">
        <label class="modspan">维护人： {{edmClass.moduser}}</label>
      </el-row>
      <el-row style="padding: 0px 0 24px 27px">
        <label class="modspan">维护时间： {{edmClass.modtimeStr}}</label>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import Tree from '@/components/common/ClassTreeSelector'
  import checkTip from '../m-cmpns/checkTip.vue'
  // import Tree1 from '@/components/method-manage/modelManageIndex'
  import axios from 'axios'
  export default {
    name: 'classDefine',
    data () {
      return {
        treeVisible: false,
        ifOld: false,
        ifOld1: false,
        ifOld2: false,
        ifOld3: false,
        checkName: true,
        checkShowName: false,
        checkCode: true,
        checkShowCode: false,
        checkShortName: true,
        checkShowShortName: false,
        options: [],
        isOptions: [{
          value: '1',
          label: '是'
        }, {
          value: '0',
          label: '否'
        }],
        idd: '2', // 假数据，用来查个树展示出来
        // edmcParentName: '', // 这个用来在输入框显示选择结果的
        edmClass: {
          id: '',
          edmcEdmdId: '', // 根据这个去查树，用这个替换idd
          edmcCode: '',
          edmcName: '',
          edmcShortName: '',
          isEntity: '0',
          databaseType: 'hbase',
          edmcNameEn: '',
          edmcParentId: '',
          edmcVer: '',
          edmcPrincipal: '',
          industryValues: [''],
          edmcIndustryCode: '',
          edmcUseDesc: '',
          parentName: '',
          adduser: '',
          addtime: ''
        },
        oldName: '',
        oldCode: '',
        props: {
          value: 'codeValue',
          label: 'codeName'
        },
        formInline1: {},
        rules: {
          edmcCode: [
            {required: true, message: '请输入类编码', trigger: 'blur'}
          ],
          edmcShortName: [
            {required: true, message: '请输入类简称', trigger: 'blur'}
          ],
          edmcName: [
            {required: true, message: '请输入类名称', trigger: 'blur'}
          ],
          edmcNameEn: [
            {required: true, message: '请输入类英文名称', trigger: 'blur'}
          ],
          parentName: [
            {required: true, message: '请选择父类', trigger: 'change'}
          ],
          edmcIndustryCode: [
            {required: true, message: '请选择适用行业', trigger: 'blur'}
          ],
          edmcUseDesc: [
            { max: 800, message: '长度请不要超过800个字符', trigger: 'blur' }
          ]
        },
        industries: []
      }
    },
    created: function () {
      var _this = this
      axios.get('/v1/codes/industries').then((res) => {
        _this.industries = res.data.data
      }).catch((error) => {
        this.$message({
          type: 'error',
          showClose: true,
          message: '使用行业列表信息获取失败：' + error
        })
      })
      // 新增类
      if (this.$route.params.rout === '0') {
        this.ifOld2 = true
        _this.edmClass.id = _this.$route.params.id
        axios.get('/v1/classes/' + _this.$route.params.id).then((res) => {
          // console.log(JSON.stringify(res.data.data))
          if (res.data.data.industryValues) {
            res.data.data.industryValues = res.data.data.industryValues.split(',')
          } else {
            res.data.data.industryValues = []
          }
          // console.log(JSON.stringify(res.data.data))
          console.log(res)
          _this.edmClass.parentName = res.data.data.edmcName
          _this.edmClass.edmcParentId = res.data.data.id
          _this.edmClass.edmcEdmdId = res.data.data.edmcEdmdId
          _this.edmClass.moduser = res.data.data.moduser
          _this.edmClass.modtimeStr = res.data.data.modtimeStr
        }).catch((error) => {
          this.$message({
            type: 'error',
            showClose: true,
            message: '获取数据失败：' + error
          })
        })
      }
      // 编辑类
      if (this.$route.params.rout === '1') {
        this.ifOld = true
        this.ifOld1 = true
        // console.log(this.$route.params.id + '.....')
        axios.get('/v1/classes/' + _this.$route.params.id).then((res) => {
          // console.log(JSON.stringify(res.data.data))
          if (res.data.data.industryValues) {
            res.data.data.industryValues = res.data.data.industryValues.split(',')
          } else {
            res.data.data.industryValues = []
          }
          console.log(res.data.data)
          _this.edmClass = res.data.data
          if (res.data.data.isEntity) {
            _this.edmClass.isEntity = (res.data.data.isEntity).toString()
          }
          this.oldName = _this.edmClass.edmcName
          this.oldCode = _this.edmClass.edmcCode
        }).catch((error) => {
          this.$message({
            type: 'error',
            showClose: true,
            message: '获取数据失败：' + error
          })
        })
      }
      // 复制类
      if (this.$route.params.rout === '2') {
        this.ifOld3 = true
        console.log(this.$route.params.id + '.....')
        axios.get('/v1/classes/' + _this.$route.params.id).then((res) => {
          if (res.data.data.industryValues) {
            res.data.data.industryValues = res.data.data.industryValues.split(',')
          } else {
            res.data.data.industryValues = []
          }
          console.log(JSON.stringify(res.data.data))
          _this.edmClass = res.data.data
          _this.edmClass.edmcCode = ''
          _this.edmClass.edmcShortName = ''
          _this.edmClass.edmcName = ''
          _this.edmClass.edmcNameEn = ''
          _this.edmClass.parentName = ''
          _this.edmClass.edmcParentId = ''
          _this.edmClass.edmcVer = ''
          _this.edmClass.isEntity = '0'
          _this.edmClass.databaseType = 'hbase'
          _this.edmClass.edmcPrincipal = ''
          _this.edmClass.industryValues = []
          _this.edmClass.edmcUseDesc = ''
        }).catch((error) => {
          this.$message({
            type: 'error',
            showClose: true,
            message: '获取数据失败：' + error
          })
        })
      }
    },
    mounted: function () {
      this.queryType()
    },
    methods: {
      queryType () {
        var vm = this
        window.axios.get('/v1/codes/edm_db_type')
          .then(function (response) {
            vm.options = response.data.data
          }).catch(function (error) {
            console.info(error)
          })
      },
      OpenTree: function () {
        // console.log('edcmClass:' + JSON.stringify(this.edmClass))
        this.treeVisible = true
      },
      savaClass: function (formName) {
        var _this = this
        var length = this.edmClass.industryValues.length - 1
        this.edmClass.edmcIndustryCode = this.edmClass.industryValues[length]
        console.log(this.edmClass.id)
        console.log('Values:' + this.edmClass.edmcIndustryCode)
        console.log(JSON.stringify(_this.edmClass))
        this.$refs[formName].validate((valid) => {
          if (valid) {
            axios.put('/v1/classes', _this.edmClass).then((res) => {
              if (res.data.retCode === 1) {
                this.$message({
                  type: 'success',
                  showClose: true,
                  message: '保存成功'
                })
                this.$router.push('/modelMain/1/' + _this.edmClass.edmcEdmdId)
                // window.location.href = '/#modelMain/1'
              } else {
                this.$message({
                  type: 'error',
                  showClose: true,
                  message: '保存失败：' + res.data.errMsg
                })
              }
            }).catch((error) => {
              this.$message({
                type: 'error',
                showClose: true,
                message: '接口调用失败：' + error
              })
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      funcTree1Selected: function (edmc) { // 这个树返回的是一个对象
        this.treeVisible = false
        if (this.edmClass.edmcName === edmc.edmcName) {
          this.$message({
            type: 'error',
            showClose: true,
            message: '不能选择自身为父类'
          })
        } else {
          axios.get('/v1/classes/child/' + this.edmClass.id + '/' + edmc.id).then(
            (res) => {
              if (res.data.data === false) {
                this.edmClass.parentName = edmc.edmcName
                this.edmClass.edmcParentId = edmc.id
              } else {
                this.$message({
                  type: 'error',
                  showClose: true,
                  message: '不能选择子类为父类'
                })
              }
            }
          ).catch((error) => {
            this.$message({
              type: 'error',
              showClose: true,
              message: '接口调用失败：' + error
            })
          }
        )
        }
      },
      copyClass: function (formName) {
        var _this = this
        console.log(this.edmClass.id)
        console.log(JSON.stringify(_this.edmClass))
        this.$refs[formName].validate((valid) => {
          if (valid) {
            axios.post('/v1/classes/copy', _this.edmClass).then((res) => {
              if (res.data.retCode === 1) {
                this.$message({
                  type: 'success',
                  showClose: true,
                  message: '保存成功'
                })
                this.$router.push('/modelMain/1/' + _this.edmClass.edmcEdmdId)
                // window.location.href = '/#modelMain/1'
              } else {
                this.$message({
                  type: 'error',
                  showClose: true,
                  message: '保存失败：' + res.data.errMsg
                })
              }
            }).catch((error) => {
              this.$message({
                type: 'error',
                showClose: true,
                message: '接口调用失败：' + error
              })
            })
          } else {
            // console.log('error submit!!')
            return false
          }
        })
      },
      deleteClass: function () {
        var _this = this
        console.log(_this.edmClass.id + '===')
        this.$confirm('此操作将删除该类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.delete('/v1/classes/' + _this.edmClass.id).then((res) => {
            this.$message({
              type: 'success',
              showClose: true,
              message: '删除成功'
            })
            this.$router.push('/modelMain/1/' + _this.edmClass.edmcEdmdId)
            // window.location.href = '/#list'
          }).catch((error) => {
            this.$message({
              type: 'error',
              showClose: true,
              message: '删除失败' + error
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      insertClass: function (formName) {
        var _this = this
        var length = this.edmClass.industryValues.length - 1
        this.edmClass.edmcIndustryCode = this.edmClass.industryValues[length]
        this.$refs[formName].validate((valid) => {
          if (valid) {
            axios.post('/v1/classes', _this.edmClass).then((res) => {
              if (res.data.retCode === 1) {
                this.$message({
                  type: 'success',
                  showClose: true,
                  message: '保存成功'
                })
                this.$router.push('/modelMain/1/' + _this.edmClass.edmcEdmdId)
                // window.location.href = '/#modelMain/1'
              } else {
                this.$message({
                  type: 'error',
                  showClose: true,
                  message: '保存失败：' + res.data.errMsg
                })
              }
            }).catch((error) => {
              this.$message({
                type: 'error',
                showClose: true,
                message: '接口调用失败：' + error
              })
            })
          } else {
            // console.log('error submit!!')
            return false
          }
        })
      },
      _checkName () {
        this.checkShowName = true
        if (this.edmClass.edmcName && this.edmClass.edmcName !== this.oldName) {
          axios.get('/v1/classes/checkData', {
            params: {
              edmcName: this.edmClass.edmcName,
              edmcEdmdId: this.edmClass.edmcEdmdId
            }
          }).then((res) => {
            if (res.data.retCode === 1) {
              this.checkName = true
            } else {
              this.checkName = false
              this.$message({
                type: 'warning',
                showClose: true,
                message: res.data.errMsg
              })
            }
          }).catch((error) => {
            this.$message({
              type: 'error',
              showClose: true,
              message: '校验接口调用失败：' + error
            })
          })
        } else {
          this.checkShowName = false
          this.checkName = true
        }
      },
      _checkCode () {
        this.checkShowCode = true
        // console.log('checkCode:' + this.checkCode)
        if (this.edmClass.edmcCode && this.edmClass.edmcCode !== this.oldCode) {
          console.log('code:' + JSON.stringify(this.edmClass.edmcCode))
          console.log('EDMDID:' + JSON.stringify(this.edmClass.edmcEdmdId))
          axios.get('/v1/classes/checkData', {
            params: {
              edmcCode: this.edmClass.edmcCode,
              edmcEdmdId: this.edmClass.edmcEdmdId
            }
          }).then((res) => {
            if (res.data.retCode === 1) {
              this.checkCode = true
            } else {
              this.checkCode = false
              this.$message({
                type: 'warning',
                showClose: true,
                message: res.data.errMsg
              })
            }
          }).catch((error) => {
            this.$message({
              type: 'error',
              showClose: true,
              message: '校验接口调用失败：' + error
            })
          })
        } else {
          this.checkShowCode = false
          this.checkCode = true
        }
      },
      _checkShortName () {
        this.checkShowShortName = true
        if (this.edmClass.edmcShortName && this.edmClass.edmcShortName !== this.oldCode) {
          axios.get('/v1/classes/checkData', {
            params: {
              edmcShortName: this.edmClass.edmcShortName,
              edmcEdmdId: this.edmClass.edmcEdmdId
            }
          }).then((res) => {
            if (res.data.retCode === 1) {
              this.checkShowShortName = true
            } else {
              this.checkShowShortName = false
              this.$message({
                type: 'warning',
                showClose: true,
                message: res.data.errMsg
              })
            }
          }).catch((error) => {
            this.$message({
              type: 'error',
              showClose: true,
              message: '校验接口调用失败：' + error
            })
          })
        } else {
          this.checkShowShortName = false
          this.checkShortName = true
        }
      },
      goBack () {
        this.$router.push('/modelMain/1/' + this.edmClass.edmcEdmdId)
      }
    },
    components: {
      Tree,
      checkTip
    }
  }
</script>

<style>
  /*输入框样式*/
.short-width{
 width: 200px;
}
.long-width{
  width: 670px;
}
#class-define .el-input__inner{
  border-radius: 4px;
}
/*重复性验证图标样式*/
.checkTip{
  position: absolute;
  left: 400px;
  top: 0;
}
/*label样式*/
#class-define .el-form-item__label{
width: 100px;
}
#class-define span{
  margin-right: 5px;
}
/*维护信息样式*/
  #class-define .modspan{
    color: #48576a;
    font-size: 14px;
    vertical-align: middle;
    line-height: 1;
    padding: 11px 12px 11px 0;
    box-sizing: border-box;
    text-align: right;
  }
  /*按钮样式*/
  #defbtn .el-form-item__content{
    padding-left: 35px;
    padding-top: 10px;
  }
  #defbtn .el-button--info{
    margin-right: 20px;
  }
  #defbtn  .el-icon-rx-baocun1-b:before{
    color: #ffffff;
  }
  #defbtn .is-disabled>.el-icon-rx-baocun1-b:before{
    color: #9496a0;
  }
</style>
