<template>
  <div id="model-define">
    <el-button-group class="el-form-item">
      <el-button type="info" v-if="model.statu" @click="goEdit" icon="rx-bianji2" :disabled="model.statu4">编辑&nbsp;
      </el-button>
      <el-button type="info" v-if="model.statu2" @click="cancelEdit" icon="rx-chexiao">取消&nbsp;</el-button>
      <el-button type="info" v-if="!model.statu3" :disabled="model.statu==check" @click="saveMod('ruleForm')" icon="rx-baocun2">&nbsp;保&nbsp;&nbsp;存&nbsp;
      </el-button>
      <el-button type="info" v-if="model.statu3" :disabled="model.statu==check" @click="UpdateMod('ruleForm')" icon="rx-baocun2">&nbsp;保&nbsp;&nbsp;存&nbsp;
      </el-button>
      <el-button type="info" v-if="model.statu3" :disabled="model.statu" @click="deleteMod" icon="rx-shanchu2">&nbsp;删&nbsp;&nbsp;除&nbsp;
      </el-button>
    </el-button-group>
    <el-form :model="edmModeler" label-width="86px" :rules="rules" ref="ruleForm">
      <!--<el-form-item label="源模型" v-if="model.statu2">
                {{$route.params.code}}
          </el-form-item>-->
      <!--<el-form-item label="模型编码:">
                  <el-input type="text" :disabled="model.statu" size="small"></el-input>
              </el-form-item>
              <el-form-item label="模型名称:">
                  <el-input type="text" :disabled="model.statu" size="small"></el-input>
              </el-form-item>-->
      <el-form-item label="模型版本:" class="inputs-width" prop="edmdVer">
        <el-input type="text" :disabled="model.statu" v-model="edmModeler.edmdVer" @blur="checkData"
                  size="small"></el-input>
      <!--  <div v-if="checkShow">
        <div class="el-icon-check"  v-show="check"></div>
        <div class="el-icon-close close" v-show="!check"></div>
        </div>-->
        <checkTip :checkShow="checkShow" :check="check" class="checkTip1"></checkTip>
      </el-form-item>
      <el-form-item label="模型状态:" prop="edmdStatus">
        <el-select :disabled="model.statu1" size="small" class="select-width" v-model="edmModeler.edmdStatus">
          <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <!--<el-form-item label="适用行业:">
                <el-select  :disabled="model.statu" size="small" class="item-width" v-model="value" multiple>
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" ></el-option>
              </el-select>
            </el-form-item>-->
      <!--<el-form-item label="模型描述:">
                    <el-input type="textarea" :disabled="model.statu" :rows="4" size="small" class="item-width" ></el-input>
            </el-form-item>-->
      <el-form-item label="更新说明:" prop="edmdUpdateDesc" >
        <el-input type="textarea" :disabled="model.statu" placeholder="字数请限制在800字符内"  v-model="edmModeler.edmdUpdateDesc" :rows="4" size="small"
        ></el-input>
      </el-form-item>
      <el-form-item label="维护人:">
        {{edmModeler.moduser}}
      </el-form-item>
      <el-form-item label="维护时间:">
        {{edmModeler.modtimeStr}}
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import axios from 'axios'
  import _ from 'lodash'
  import checkTip from './checkTip.vue'
  export default{
    name: 'modelDefine',
    props: ['code', 'edmId'],
    data () {
      return {
        edmModeler: {
          id: '',
          edmdVer: '',
          edmdStatus: '1',
          edmdUpdateDesc: ''
        },
        edmModeler_1: {},
        oldVer: '',
        options: [{
          value: '0',
          label: '通用'
        }, {
          value: '1',
          label: '航嘉'
        }],
        options1: [{
          label: '待开发',
          value: '1'
        }, {
          label: '开发中',
          value: '2'
        }, {
          label: '待测试',
          value: '3'
        }, {
          label: '测试中',
          value: '4'
        }, {
          label: '待发布',
          value: '5'
        }, {
          label: '已发布',
          value: '6'
        }, {
          label: '作废',
          value: '7'
        }],
        value: [],
        modelThree: {},
        addUser: '赤木刚宪',
        addTime: '2017-4-21 11:37',
        rules: {
          edmdVer: [
            {required: true, message: '请输入模型版本', trigger: 'blur'}
          ],
          edmdStatus: [
            {required: true, message: '请选择模型状态', trigger: 'change'}
          ],
          edmdUpdateDesc: [
            { max: 800, message: '长度请不要超过800个字符', trigger: 'blur' }
          ]
        },
        check: true,
        checkShow: false,
        model: {
          statu: '',
          statu1: '',
          statu2: '',
          statu3: '',
          statu4: false
        }
      }
    },
    created: function () {
      var _this = this
      console.log(this.code + '.....')
      console.log(this.edmId + '===')
      if (this.code === 0) {
        // if (this.$route.params.id === '0') {
        this.model.statu = false
        this.model.statu1 = true
        this.model.statu2 = false
        this.model.statu3 = false
        axios.get('/v1/modelers/status').then(function (res) {
          _this.edmModeler.edmdVer = res.data.data.edmdVer
          _this.edmModeler.id = res.data.data.id
        })
      }
      if (this.code === 1) {
        // if (this.$route.params.id === '1') {
        this.model.statu = true
        this.model.statu1 = true
        this.model.statu2 = false
        this.model.statu3 = true
        // console.log(_this.$route.params.code)
        axios.get('/v1/modelers/' + _this.edmId).then(function (res) {
          // console.log(JSON.stringify(res.data.data))
          console.log(JSON.stringify(res.data.data))
          _this.edmModeler = res.data.data[0]
          _this.edmModeler_1 = _.cloneDeep(res.data.data[0])
          // 重复性判断第一步：得到原始值
          _this.oldVer = _this.edmModeler.edmdVer
          if (_this.edmModeler.edmdStatus) {
            _this.edmModeler.edmdStatus = _this.edmModeler.edmdStatus.toString()
          } else {
            _this.edmModeler.edmdStatus = '1'
          }
          if (_this.edmModeler.edmdStatus === '6' || _this.edmModeler.edmdStatus === '7') {
            _this.model.statu4 = true
          }
        })
      }
      /* if (this.$route.params.id === '2') {
       this.model.statu = false
       this.model.statu1 = false
       this.model.statu2 = true
       } */
    },
    methods: {
      goEdit: function () {
        this.model.statu = false
        this.model.statu1 = false
        this.model.statu2 = true
      },
      cancelEdit: function () {
        this.model.statu = true
        this.model.statu1 = true
        this.model.statu2 = false
        this.edmModeler = this.edmModeler_1
        if (this.edmModeler.edmdStatus) {
          this.edmModeler.edmdStatus = this.edmModeler.edmdStatus.toString()
        } else {
          this.edmModeler.edmdStatus = '1'
        }
      },
      saveMod: function (formName) {
        var _this = this
        console.log(this.edmModeler.id)
        console.log(JSON.stringify(_this.edmModeler))
        this.$refs[formName].validate((valid) => {
          if (valid) {
            axios.post('/v1/modelers', _this.edmModeler).then((res) => {
              if (res.data.retCode === 1) {
                this.$message({
                  type: 'success',
                  showClose: true,
                  message: '保存成功'
                })
                this.$emit('closeDia')
                // this.$router.push('/list')
                // console.log(res.data.retCode + '===' + res.data.errMsg)
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
      UpdateMod: function (formName) {
        var _this = this
        console.log(JSON.stringify(this.edmModeler))
        this.$refs[formName].validate((valid) => {
          if (valid) {
            axios.put('/v1/modelers', _this.edmModeler).then((res) => {
              this.$message({
                type: 'success',
                showClose: true,
                message: '更新成功'
              })
              this.$emit('closeDia')
              // this.$router.push('/list')
              // window.location.href = '/#list'
            }).catch((error) => {
              this.$message({
                type: 'error',
                showClose: true,
                message: '更新失败：' + error
              })
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      deleteMod: function () {
        var _this = this
        console.log(_this.edmModeler.id + '===')
        axios.delete('/v1/modelers/' + _this.edmModeler.id).then((res) => {
          this.$message({
            type: 'success',
            showClose: true,
            message: '删除成功'
          })
          this.$emit('closeDia')
          // this.$router.push('/list')
          // window.location.href = '/#list'
        }).catch((error) => {
          this.$message({
            type: 'error',
            showClose: true,
            message: '删除失败：' + error
          })
        })
      },
      checkData () {
        var _this = this
        console.log(_this.edmModeler.edmdVer + '*****')
       // this.check = true
        this.checkShow = true
        // 重复性判断第二步： 当输入框有值且值与初始值不同时再调用判断接口
        if (_this.edmModeler.edmdVer && _this.edmModeler.edmdVer !== _this.oldVer) {
          console.log('it is here!')
          axios.get('/v1/modelers/checkData', {
            params: {edmdVer: _this.edmModeler.edmdVer}
          }).then((res) => {
            if (res.data.retCode === 1) {
              this.check = true
              /* this.$message({
               type: 'success',
               showClose: true,
               message: '版本号唯一，可以使用'
               }) */
            } else {
              this.check = false
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
              message: '版本号校验失败：' + error
            })
          })
        } else {
          this.checkShow = false
        }
      }
    },
    components: {
      checkTip
    }
  }
</script>

<style>
  /*.item-left {
    margin-left: 50px
  }*/

  /*.item-width textarea{
    width: 80%
  }*/

  .select-width {
    width: 55%
  }
  .inputs-width {
    width: 62.67%
  }
  .checkTip1{
    position: absolute;
    left: 130px;
    top: 0;
  }
  #model-define .el-form-item__content{
    display: block;
  }
  #class-define .el-button+.el-button{
    margin-left: 0;
  }
  /*图标按钮样式*/
  #model-define .el-icon-rx-bianji2:before{
    color: #ffffff;
  }
  #model-define .el-button [class*=el-icon-]+span{
    margin-left: 1px;
  }
  #model-define .el-icon-rx-baocun2:before{
    color: #ffffff;
  }
  #model-define .is-disabled>.el-icon-rx-baocun2:before{
    color: #9496a0;
  }
  #model-define .el-icon-rx-shanchu2:before{
    color: #ffffff;
  }
  #model-define .is-disabled>.el-icon-rx-shanchu2:before{
    color: #9496a0;
  }
  #model-define .el-icon-rx-chexiao:before{
    color: #ffffff;
  }
  #model-define .is-disabled>.el-icon-rx-chexiao:before{
    color: #9496a0;
  }
</style>
