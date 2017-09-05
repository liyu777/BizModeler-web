<template>
  <div id="m_choice">
    <div id="bod2"></div>
    <el-row :gutter="20">
      <el-col id="col-1"  :xs="24" :sm="24" :md="8" :lg="8" class="grid-content" style="padding: 0">
        <div class="top-conent">
          <p style="margin-top:0;padding:13px">方法选择</p>
        </div>
        <div style="overflow-y:auto;height:400px;" class="m_tree">
          <el-input placeholder="输入关键字进行过滤" v-model="filterText" icon="search"></el-input>
          <el-tree  show-checkbox class="filter-tree" node-key="id"  :data="methodClass"
                   @check-change="getNodes" style="border:0"
                   highlight-current :props="defaultProps"  :filter-node-method="filterNode" ref="tree" >
          </el-tree>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="16" :lg="16" class="grid-content2" >
        <div class="medetail">
          <el-form  label-width="160px" :model="methodData">
            <el-form-item label="方法分类">
              <div class="metext" v-text="methodData.edmmTypeName"></div>
            </el-form-item>
            <el-form-item label="方法名称">
              <div class="metext" v-text="methodData.edmmName"></div>
            </el-form-item>
            <el-form-item label="方法描述">
              <div class="metext" v-text="methodData.edmmDesc"></div>
            </el-form-item>
            <el-form-item label="程序类型">
              <div class="metext" v-text="methodData.edmProgramTypeName"></div>
            </el-form-item>
            <el-form-item label="方法输入参数">
              <template scope="scope">
                <el-tooltip  effect="light"  :content="edmInsertArgDesc" placement="top-start">
                  <el-input class="metext" type="text" v-text="edmEdmdInsertArgName"></el-input>
                </el-tooltip>
              </template>
            </el-form-item>
            <el-form-item label="方法返回值">
              <template scope="scope">
                <el-tooltip  effect="light" :content="edmReturnDesc" placement="top-start">
                  <el-input class="metext" type="text" v-text="edmEdmdReturnName"></el-input>
                </el-tooltip>
              </template>
            </el-form-item>
            <el-form-item label="是否自动方法">
                <div class="metext" v-if="methodData.isAuto === 1 ">
                    {{ '是' }}
                </div>
                <div class="metext" v-else-if="methodData.isAuto === 0 ">
                    {{ '否' }}
                </div>
            </el-form-item>
            <el-form-item label="是否平台方法">
                <div class="metext" v-if="methodData.isPlatformProgram === 1 ">
                    {{ '是' }}
                </div>
                <div class="metext" v-else-if="methodData.isPlatformProgram === 0 ">
                    {{ '否' }}
                </div>
            </el-form-item>
            <el-form-item label="触发条件">
              <div class="metext" v-text="methodData.edmmTriggerCond"></div>
            </el-form-item>
            <el-form-item label="存储位置">
              <div class="metext" v-text="methodData.edmmProgramStorage"></div>
            </el-form-item>
            <el-form-item label="版本号">
              <template scope="scope">
                <el-tooltip  effect="light" :content="methodData.edmmVer" placement="top-start">
                  <el-input type="text" v-text="methodData.edmmVer"></el-input>
                </el-tooltip>
              </template>
            </el-form-item>
            <el-form-item label="研发部门">
              <div class="metext" v-text="methodData.edmmDevelopDept"></div>
            </el-form-item>
            <el-form-item label="程序员">
              <div class="metext" v-text="methodData.edmmProgrammer"></div>
            </el-form-item>
          </el-form>
        </div>
        <div class="aBtn"><el-button :disabled="confirmStatu"  @click="confirm" type="info"><i class="el-icon-circle-check">&nbsp;确认</i></el-button></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'methodChoice',
    props: [
      'childMag',
      'ifShow'
    ],
    watch: {
      filterText (val) {
        this.$refs.tree.filter(val)
      }
    },
    data () {
      return {
        edmInsertArgDesc: '',
        edmEdmdInsertArgName: '',
        edmReturnDesc: '',
        edmEdmdReturnName: '',
        type: '0',
        id: '1',
        cName: '',
        mName: '',
        ids: [],
        confirmStatu: false,
        methodData: {
          edmmTypeName: '',
          edmmVer: ''
        },
        filterText: '',
        methodClass: [],
        defaultProps: {
          children: 'children',
          label: 'label',
          id: 'id'
        }
      }
    },
    mounted: function () {
      this.queryTree()
    },
    methods: {
      queryTree: function () {
        var _this = this
        // 0/属性编辑和修改  1/方法新增和查询
        // 0/1
        _this.type = this.$route.params.type
        _this.id = this.$route.params.id
        var code = this.$store.state.methodType
        if (code === 0 || code === 1) {
          // 加载全部方法树
          window.axios.get('/v1/methods/methodTypeTree')
              .then(function (res) {
                if (res.data.data) {
                  _this.methodClass = res.data.data
                } else {
                  _this.methodClass = []
                }
              })
              .catch(function (error) { _this.$message.error(error) })
        } else {
          window.axios.get('/v1/methods/' + code)
              .then(function (response) {
                // var code = this.$store.state.methodType
                // console.log('123***************code:' + code)
                if (response.data.data.length !== 0) {
                  // console.log(response.data.data)
                  _this.methodData = response.data.data[0]
                  _this.getmethodTypeName()
                } else {
                  _this.methodData = {}
                  // _this.methodData.edmmTypeName = ''
                }
              })
              .catch(function (error) { _this.$message.error(error) })
        }
      },
      filterNode (value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      // 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点
      getNodes (object, node, a) {
        var _this = this
        _this.edmInsertArgDesc = ''
        _this.edmEdmdInsertArgName = ''
        _this.edmReturnDesc = ''
        _this.edmEdmdReturnName = ''
        var qID = []
        var length = 0
        // 仅返回被选中的叶子节点的 keys
        qID = this.$refs.tree.getCheckedKeys(true)
        length = qID.length
        // alert(length)
        console.log(qID[length - 1])
        // console.log(qID)
        // console.log(JSON.stringify(object))
        // console.log(object.id)
        // console.log(node)
        // console.log(a)
        // 存在选中的叶子节点
        if (qID[length - 1]) {
          // 直接点击选中一个叶子节点，显示他的信息
          if (node && !a) {
            window.axios.get('/v1/methods/' + object.id)
            .then(function (response) {
              if (response.data.retCode === 1) {
                _this.methodData = response.data.data[0]
                _this.getmethodTypeName()
              }
            })
            .catch(function (error) { _this.$message.error(error) })
          } else {
            // 点击父节点时，会选中多个叶子节点，显示最后一个叶子节点的信息
            window.axios.get('/v1/methods/' + qID[length - 1])
            .then(function (response) {
              if (response.data.retCode === 1) {
                _this.methodData = response.data.data[0]
                _this.getmethodTypeName()
              }
            })
            .catch(function (error) { _this.$message.error(error) })
          }
        } else {
          _this.methodData = {}
        }
      },
      // 获取分类名字和是否自动方法0、1转换否、是
      getmethodTypeName () {
        var _this = this
        // console.log(_this.methodData.edmmType)
        // console.log(_this.methodData.isAuto)
        // console.log(_this.methodData.isPlatformProgram)
        if (_this.methodData.isAuto === 1) {
          _this.methodData.isAutoName = '是'
        } else {
          _this.methodData.isAutoName = '否'
        }
        if (_this.methodData.isPlatformProgram === 1) {
          _this.methodData.isPlatformProgramName = '是'
        } else {
          _this.methodData.isPlatformProgramName = '否'
        }
        if (_this.methodData.edmmType) {
          window.axios.get('/v1/methodtypes/' + _this.methodData.edmmType)
          .then(function (r1) {
            // console.log('ww:' + r1.data.data[0].edmtName)
            _this.methodData.edmmTypeName = r1.data.data[0].edmtName
          })
          .catch(function (error) {
            _this.$message({message: '接口调用失败' + error + _this.methodData.edmmTypeName, showClose: true, type: 'error'})
          })
        } else {
          _this.methodData.edmmTypeName = ''
        }
        // 输入参数处理
        // console.log(_this.methodData.id)
        window.axios.get('/v1/methodArgs/inputArg/' + _this.methodData.id)
          .then(function (r1) {
            // console.log(r1.data.data.length)
            var l = r1.data.data.length
            var i = 0
            _this.edmEdmdInsertArgName = ''
            _this.edmInsertArgDesc = ''
            for (i = 0; i < l; i++) {
              if (i === 0) {
                _this.edmEdmdInsertArgName = r1.data.data[i].edmaDataTypeName + ' ' + r1.data.data[i].edmaName
                _this.edmInsertArgDesc = r1.data.data[i].edmaName + '表示' + r1.data.data[i].edmaDesc
              } else {
                _this.edmEdmdInsertArgName = _this.edmEdmdInsertArgName + ', ' + r1.data.data[i].edmaDataTypeName + ' ' + r1.data.data[i].edmaName
                _this.edmInsertArgDesc = _this.edmInsertArgDesc + ', ' + r1.data.data[i].edmaName + '表示' + r1.data.data[i].edmaDesc
              }
            }
          })
          .catch(function (error) {
            _this.$message({message: '接口调用失败' + error, showClose: true, type: 'error'})
          })
        // 返回参数处理
        window.axios.get('/v1/methodArgs/returnArg/' + _this.methodData.id)
          .then(function (r1) {
            // console.log(r1.data.data.length)
            var l = r1.data.data.length
            var i = 0
            _this.edmEdmdReturnName = ''
            _this.edmReturnDesc = ''
            for (i = 0; i < l; i++) {
              if (i === 0) {
                _this.edmEdmdReturnName = r1.data.data[i].edmaDataTypeName + ' ' + r1.data.data[i].edmaName
                _this.edmReturnDesc = r1.data.data[i].edmaName + '表示' + r1.data.data[i].edmaDesc
              } else {
                _this.edmEdmdReturnName = _this.edmEdmdReturnName + ', ' + r1.data.data[i].edmaDataTypeName + ' ' + r1.data.data[i].edmaName
                _this.edmReturnDesc = _this.edmReturnDesc + ', ' + r1.data.data[i].edmaName + '表示' + r1.data.data[i].edmaDesc
              }
            }
          })
          .catch(function (error) {
            _this.$message({message: '接口调用失败' + error, showClose: true, type: 'error'})
          })
      },
      confirm () {
        var vm = this
        var type = this.$store.state.methodType
        // alert('******确认时type:' + type)
        // 1为方法的批量增加
        if (type === 1) {
          var idArr = []
          idArr = vm.$refs.tree.getCheckedKeys(true)
          if (idArr.length !== 0) {
            var id = this.$store.state.modelMainLeftTreeCurrSelectId
            window.axios.post('/v1/classes/methods?classId=' + id + '&methodIds=' + idArr)
              .then(function (response) {
                if (response.data.retCode === 1) {
                  vm.$message({
                    type: 'success',
                    message: '增加成功!'
                  })
                  vm.$emit('upup', '')
                }
              })
              .catch(function (error) {
                vm.$message.error(error)
              })
          } else {
            vm.$message({
              type: 'info',
              message: '请选择需要增加的方法!'
            })
          }
          // 0为查看响应方法或者编辑相应方法
        } if (type === 0) {
          // 被选中的叶子节点有多个时
          if (this.$refs.tree.getCheckedKeys(true).length > 1) {
            this.$alert('修改响应方法时只能选择一个！', '提示', {
              confirmButtonText: '确定'
            })
            return false
          } else {
            // console.log(vm.methodData.id)
          // console.log(vm.methodData.edmmName)
            this.$store.dispatch('methodsChoice', vm.methodData.id)
            this.$store.dispatch('methodsChoiceN', vm.methodData.edmmName)
            this.$emit('upup', '')
          }
        } else {
          this.$emit('upup', '')
        }
      }
    }
  }
</script>

<style>
#m_choice .top-conent {
  background: #f5f6ff;
  height: 48px;
  text-align: center;
}
/*#m_choice .el-form-item .el-form-item__label {
  color: #9496a0;
  padding: 11px 30px 11px 0;
}
#m_choice .el-form-item .el-tree-node__label {
  color: #6b6b74;
}*/
/*.metext {
  color: #6b6b74;
}*/
.grid-content {
  border-radius: 4px;
 /* border: 1px solid #D3DCE6;*/
}
.grid-content2 {
  border-radius: 4px;
}
.medetail {
  overflow-y:auto;
  height:400px;
/*  border: 1px solid #D3DCE6;*/
}
.aBtn {
  position: absolute;
  bottom: 10px;
  right: 60px;
}
.medetail .el-form-item__label {
  font-size: 14px;
  color: #9496a0;
  padding: 11px 30px 11px 0;
}
.medetail .el-form-item__content {
  font-size: 14px;
  color: #6b6b74;
}
/*输入框高度*/
  #m_choice .el-input__inner{
    height: 48px;
  }
/*#m_choice .el-tree-node__content{
  height: 48px;
  line-height: 48px;
}*/
/*中间阴影条样式*/
  #bod2{
    display: inline-block;
    margin: 2px 0 2px 10px;
    height: 99%;
    width: 10px;
    position: absolute;
    top: 0px;
    left: 33.33%;
    box-shadow: 10px 0 5px rgba(205, 207, 236, 0.16);
  }
</style>
