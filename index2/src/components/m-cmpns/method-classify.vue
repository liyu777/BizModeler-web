<template>
	<div id="classify">
    <el-row :gutter="20" type="flex">
      <el-col  :xs="24" :sm="24" :md="8"  :lg="8">
        <div>
            <el-form>
              <el-form-item>
                  <el-button  @click="confirm" type="info">确认</el-button>
              </el-form-item>
            </el-form>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="16" :lg="16" >
          <div>
              <el-form>
                <el-form-item >
                  <el-button type="info" :disabled="addStatu" @click="addEdit">新增分类</el-button>
                  <el-button type="info" :disabled="editStatu" @click="goEdit">编辑分类</el-button>
                  <el-button type="info" :disabled="saveStatu" @click="saveMod('methodData')">保存</el-button>
                  <el-button type="info" :disabled="delStatu" @click="deleteMod">删除</el-button>
                </el-form-item>
              </el-form>
          </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" type="flex">
      <el-col   :xs="24" :sm="24" :md="8" :lg="8" class="grid-content" style="padding: 0" >
        <div class="top-conent" >
          <p style="margin-top:0;padding:13px">方法分类</p>
        </div>
        <div style="overflow-y:auto;height:400px;">
              <el-input placeholder="输入关键字进行过滤" v-model="filterText" icon="search"></el-input>
              <el-tree style="border:0" class="filter-tree" node-key="id"  :data="treeData"
               @node-click="handleNodeClick"
              highlight-current :props="defaultProps"  ref="tree2" :filter-node-method="filterNode">
              </el-tree>
        </div>
      </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" class="grid-content2" >
          <div>
            <el-form  label-width="140px" :model="methodData" :rules="rules" ref="methodData"   style="border: 1px solid #D3DCE6;" >
              <el-form-item label="父分类："  >
                 <el-form v-if="pType1" :inline="true" >
                    <el-form-item style="width: 160px" >
                      <div>{{edmtParentName}}</div>
                    </el-form-item>
                </el-form>
                <el-form v-else :inline="true" >
                    <el-form-item v-if="pType2" style="width: 160px" >
                      <el-cascader clearable v-model="parentOp"  @change="parentSelect"    :options="parentOptions" change-on-select :props="aProps" >
                    </el-cascader>
                    </el-form-item>
                    <el-form-item v-if="pType3"  style="width: 160px" >
                      <div>{{edmtParentName}}</div>
                    </el-form-item>
                    <el-form-item >
                      <el-button v-if="pType4"  @click="changeP"  size="small"  type="info">修改</el-button>
                    </el-form-item>
                </el-form>
              </el-form-item>
              <el-form-item label="分类编码：" prop="edmtCode" class="marginR" >
                <el-input @change="unDel" :disabled="detailStatu"  placeholder="" v-model="methodData.edmtCode"></el-input>
              </el-form-item>
              <el-form-item label="分类名称：" prop="edmtName" class="marginR">
                <el-input @change="unDel" :disabled="detailStatu" placeholder="" v-model="methodData.edmtName"></el-input>
              </el-form-item>
              <el-form-item label="分类描述：" prop="edmtDesc" class="marginR">
                <el-input @change="unDel" :disabled="detailStatu" placeholder="" v-model="methodData.edmtDesc"></el-input>
              </el-form-item>
               <el-form-item label="排序：" prop="edmtSeq"  class="marginR">
                <el-input type="edmtSeq" auto-complete="off" @change="unDel" :disabled="detailStatu" placeholder="" v-model.number="methodData.edmtSeq"></el-input>
              </el-form-item>
               <el-form-item label="维护人：" style="margin: 0;" >
                <div v-text="methodData.moduser" style="width: 120px"></div>
              </el-form-item>
               <el-form-item label="维护时间：" style="margin: 0;">
                <div v-text="methodData.modtimeStr"></div>
              </el-form-item>
            </el-form>
          </div>
          <div style="margin-top: 20px">
            <el-form :inline="true" >
                <el-form-item style="margin:0 ">
                    将当前分类下的方法移动到：<el-cascader v-model="moveOp" clearable @change="moveSelect" :disabled="moveStatu" :props="aProps" :options="moveOptions"change-on-select
                style="width: 190px"></el-cascader>
                </el-form-item>
                <el-form-item style="margin:0 ">
                  <el-button :disabled="moveStatu" size="small"  @click="moveClick" type="info" style="margin-right: 0;margin-left: 10px">移动</el-button>
                </el-form-item>
            </el-form>
          </div>
        </el-col>
    </el-row>
	</div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'methodClassify',
    data () {
      return {
        filterText: '',
        edmtParentName: '',
        edmtParentId: '',
        // 保存分类编码和分类名称，和修改后的比较
        edmtCode: '',
        edmtName: '',
        methodData: {
          id: '',
          edmtParentId: '',
          edmtCode: '',
          edmtName: '',
          edmtDesc: '',
          edmtSeq: '',
          moduser: '',
          modtimeStr: '',
          adduser: '',
          addtimeStr: ''
        },
        // 移动目标ID
        moveId: 0,
        // 新增 flag
        addFlag: 0,
        // 编辑 flag
        editFlag: 0,
        // 分类树
        treeData: [],
        saveStatu: true,
        delStatu: true,
        detailStatu: true,
        editStatu: true,
        addStatu: false,
        moveStatu: true,
        pType1: true,
        pType2: true,
        pType3: false,
        pType4: false,
        input2: '',
        pid: ['1'],
        moveOptions: [],
        moveOp: [],
        parentOp: [],
        // 父类
        parentOptions: [],
        defaultProps: {
          children: 'children',
          label: 'edmtName'
        },
        aProps: {
          children: 'children',
          label: 'label',
          value: 'id'
        },
        rules: {
          edmtCode: [ { required: true, message: '请输入分类编码', trigger: 'blur' },
                { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }],
          edmtName: [ { required: true, message: '请输入分类名称', trigger: 'blur' },
                { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }],
          edmtDesc: [ { required: true, message: '请输入分类描述', trigger: 'blur' },
                { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }],
          edmtSeq: [{required: true, message: '请输入排序'}, {type: 'number', message: '排序必须为数字值'}]
        }
      }
    },
    watch: {
      filterText (val) {
        this.$refs.tree2.filter(val)
      }
    },
    // 加载时运行
    created: function () {
      var _this = this
      axios.get('/v1/methodtypes').then(function (res) {
      // 类树
        _this.treeData = res.data.data
        // 移动树
        _this.moveOptions = res.data.data
        // 父类树
        _this.parentOptions = res.data.data
      })
      .catch(function (error) {
        _this.$message({message: '方法分类树接口调用失败' + error, showClose: true, type: 'error'})
      })
    },
    methods: {
      // 对树节点进行筛选时执行的方法
      filterNode (value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      // 新增方法分类
      addEdit: function () {
        var _this = this
        _this.editFlag = 0
        _this.addFlag = 1
        _this.saveStatu = false
        _this.addStatu = true
        _this.detailStatu = false
        _this.editStatu = true
        _this.moveStatu = true
        _this.pType1 = false
        _this.pType2 = true
        _this.pType3 = false
        _this.pType4 = false
        _this.methodData = {}
        _this.edmtParentName = ''
        _this.methodData.moduser = '罗华'
        _this.methodData.modtimeStr = new Date()
        _this.methodData.adduser = '罗华'
        _this.methodData.addtimeStr = new Date()
      },
      // 修改方法分类
      goEdit: function () {
        var _this = this
        _this.saveStatu = false
        _this.delStatu = false
        _this.detailStatu = false
        _this.addStatu = true
        _this.moveStatu = false
        _this.pType1 = false
        _this.pType2 = false
        _this.pType3 = true
        _this.pType4 = true
        _this.editFlag = 1
        _this.addFlag = 0
        _this.edmtCode = _this.methodData.edmtCode
        _this.edmtName = _this.methodData.edmtName
        _this.methodData.moduser = '罗华'
        _this.methodData.modtimeStr = new Date()
      },
      // 保存
      saveMod: function (md) {
        var _this = this
        _this.$refs[md].validate((valid) => {
          if (valid) {
            // 新增保存
            if (_this.addFlag === 1) {
              // 分类编码唯一性
              axios.get('/v1/methodtypes/code/unique/' + _this.methodData.edmtCode)
              .then(function (response) {
                // 分类编码唯一性通过
                if (response.data.retCode === 1) {
                  // 分类名称唯一性
                  axios.get('/v1/methodtypes/name/unique/' + _this.methodData.edmtName)
                  .then(function (response) {
                    // 分类名称唯一性通过
                    // console.log(_this.edmtParentId)
                    // console.log(_this.methodData.edmtParentId)
                    if (response.data.retCode === 1) {
                      axios.post('/v1/methodtypes', {
                        edmtParentId: _this.methodData.edmtParentId,
                        edmtCode: _this.methodData.edmtCode,
                        edmtName: _this.methodData.edmtName,
                        edmtDesc: _this.methodData.edmtDesc,
                        edmtSeq: _this.methodData.edmtSeq,
                        adduser: _this.methodData.adduser,
                        moduser: _this.methodData.moduser,
                        addtime: _this.methodData.addtimeStr,
                        modtime: _this.methodData.modtimeStr,
                        isDel: '0',
                        acctid: '1'
                      })
                      .then(function (response) {
                        if (response.data.retCode === 1) {
                          _this.$message({message: '新增成功', showClose: true, type: 'success'})
                          _this.methodData.id = response.data.data
                          _this.addcheck = 0
                          _this.fresh()
                        } else {
                          _this.$message({message: '新增失败：' + response.data.errMsg, showClose: true, type: 'error'})
                        }
                      }).catch(function (error) {
                        _this.$message({message: '接口调用失败' + error, showClose: true, type: 'error'})
                      })
                    }
                    // 分类名称唯一性未通过
                    if (response.data.retCode !== 1) {
                      _this.$alert(response.data.errMsg, '提示', {
                        confirmButtonText: '确定'
                      })
                      return false
                    }
                  })
                  .catch(function (error) {
                    _this.$message({message: '接口调用失败' + error, showClose: true, type: 'error'})
                  })
                }
                // 分类编码唯一性未通过
                if (response.data.retCode !== 1) {
                  _this.$alert(response.data.errMsg, '提示', {
                    confirmButtonText: '确定'
                  })
                  return false
                }
              })
              .catch(function (error) {
                _this.$message({message: '接口调用失败' + error, showClose: true, type: 'error'})
              })
            }
            // 修改保存
            if (_this.editFlag === 1) {
              // if (_this.edmtParentId === _this.methodData.id) {
              //   this.$alert('不能把自己当父分类，请重新选择', '提示', {
              //     confirmButtonText: '确定'
              //   })
              //   return false
              // }
              // 名称校验
              if (_this.edmtName === _this.methodData.edmtName) {
                // 编码校验
                if (_this.edmtCode === _this.methodData.edmtCode) {
                  _this.editSavefunction()
                } else {
                  // 编码和其他对比
                  axios.get('/v1/methodtypes/code/unique/' + _this.methodData.edmtCode)
                  .then(function (response) {
                    // 分类编码唯一性通过
                    if (response.data.retCode === 1) {
                      _this.editSavefunction()
                    }
                    // 分类编码唯一性未通过
                    if (response.data.retCode !== 1) {
                      _this.$alert(response.data.errMsg, '提示', {
                        confirmButtonText: '确定'
                      })
                      return false
                    }
                  })
                  .catch(function (error) {
                    _this.$message({message: '接口调用失败' + error, showClose: true, type: 'error'})
                  })
                }
              } else {
                axios.get('/v1/methodtypes/name/unique/' + _this.methodData.edmtName)
                  .then(function (response) {
                    // 分类名称唯一性通过
                    if (response.data.retCode === 1) {
                      _this.editSavefunction()
                    }
                    // 分类名称唯一性未通过
                    if (response.data.retCode !== 1) {
                      _this.$alert(response.data.errMsg, '提示', {
                        confirmButtonText: '确定'
                      })
                      return false
                    }
                  })
                  .catch(function (error) {
                    _this.$message({message: '接口调用失败' + error, showClose: true, type: 'error'})
                  })
              }
            }
          } else {
            return false
          }
        })
      },
      // 修改分类
      editSavefunction () {
        var _this = this
        axios.put('/v1/methodtypes', {
          id: _this.methodData.id,
          edmtParentId: _this.methodData.edmtParentId,
          edmtCode: _this.methodData.edmtCode,
          edmtName: _this.methodData.edmtName,
          edmtDesc: _this.methodData.edmtDesc,
          edmtSeq: _this.methodData.edmtSeq,
          moduser: _this.methodData.moduser,
          modtime: _this.methodData.modtimeStr
        })
        .then(function (response) {
          if (response.data.retCode === 1) {
            _this.$message({message: '修改成功', showClose: true, type: 'success'})
            _this.fresh()
          } else {
            _this.$message({message: response.data.errMsg, showClose: true, type: 'error'})
          }
        })
        .catch(function (error) {
          _this.$message({message: '接口调用失败' + error, showClose: true, type: 'error'})
        })
      },
      // 删除分类
      deleteMod: function () {
        var _this = this
        this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.delete('/v1/methodtypes/' + _this.methodData.id)
          .then(function (response) {
            if (response.data.retCode === 1) {
              _this.$message({message: '删除成功', showClose: true, type: 'success'})
              _this.methodData.id = ''
              // console.log(_this.methodData.id)
              _this.fresh()
            } else {
              _this.$message({message: response.data.errMsg, showClose: true, type: 'error'})
            }
          })
         .catch(function (error) {
           _this.$message({message: '接口调用失败' + error, showClose: true, type: 'error'})
         })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 分类树点击触发
      handleNodeClick (data) {
        var _this = this
        _this.saveStatu = true
        _this.delStatu = true
        _this.detailStatu = true
        _this.moveStatu = true
        _this.editStatu = false
        _this.addStatu = false
        _this.pType1 = true
        _this.moveOp = []
        _this.parentOp = []
        // console.log(data.id)
        // console.log(_this.methodData.edmtName)
        _this.$refs['methodData'].resetFields()
        axios.get('/v1/methodtypes/' + data.id)
        .then(function (response) {
          _this.methodData = response.data.data[0]
          // 找父类名字
          if (_this.methodData.edmtParentId) {
            axios.get('/v1/methodtypes/' + _this.methodData.edmtParentId)
            .then(function (r1) {
              // console.log('ww')
              _this.edmtParentName = r1.data.data[0].edmtName
            })
            .catch(function (error) {
              _this.$message({message: '接口调用失败' + error, showClose: true, type: 'error'})
            })
          } else {
            _this.edmtParentName = ''
          }
        })
       .catch(function (error) {
         _this.$message({message: '接口调用失败' + error, showClose: true, type: 'error'})
       })
      },
      // 编辑后不能删除
      unDel: function () {
        // this.delStatu = true
        this.moveStatu = true
      },
      changeP: function () {
        this.pType3 = false
        this.pType2 = true
        this.pType4 = false
        this.methodData.edmtParentId = ''
        this.edmtParentId = ''
      },
      moveClick: function () {
        // this.$message('从分类id=' + this.methodData.id + '移动到分类id=' + this.moveId)
        var _this = this
        if (_this.methodData.id === _this.moveId) {
          _this.$alert('把自己的方法移给自己，多此一举！', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
        axios.put('/methodtypes/moveMethod/' + _this.methodData.id + '/' + _this.moveId)
          .then(function (response) {
            if (response.data.retCode === 1) {
              _this.$message({message: '移动成功', showClose: true, type: 'success'})
              _this.methodData.id = ''
              _this.fresh()
            }
            if (response.data.retCode === 0) {
              _this.$message({message: '移动失败：' + response.data.errMsg, showClose: true, type: 'error'})
            }
          })
         .catch(function (error) {
           _this.$message({message: '接口调用失败' + error, showClose: true, type: 'error'})
         })
        this.fresh()
      },
      parentSelect (data) {
        this.edmtParentId = data[data.length - 1]
        this.methodData.edmtParentId = this.edmtParentId
        this.edmtParentId = ''
        this.moveStatu = true
      },
      // 移动方法
      moveSelect (data) {
        // console.log(data)
        this.moveId = data[data.length - 1]
        this.saveStatu = true
        this.delStatu = true
        this.detailStatu = true
        this.editStatu = true
        this.addStatu = true
        this.pType1 = true
        // console.log('移动到' + this.moveId)
      },
      // 确认按钮，返回分类id/name给父页面
      confirm: function () {
        var idName = {}
        idName.id = this.methodData.id
        idName.name = this.methodData.edmtName
        // console.log(idName)
        this.$emit('upup', idName)// 主动触发upup方法，'idName'为向父组件传递的数据
      },
      // 重新加载页面
      fresh: function () {
        var _this = this
        _this.moveOp = []
        _this.parentOp = []
        _this.saveStatu = true
        _this.delStatu = true
        _this.detailStatu = true
        _this.moveStatu = true
        _this.editStatu = true
        _this.addStatu = false
        _this.pType1 = true
        // console.log(_this.methodData.id)
        // if (_this.methodData.id) {
        axios.get('/v1/methodtypes').then(function (rf) {
          _this.treeData = rf.data.data
            // console.log(JSON.stringify(rf.data.data))
            // console.log(_this.methodData.id)
            // 移动树
          _this.moveOptions = rf.data.data
            // 父类树
          _this.parentOptions = rf.data.data
        })
          // 分类信息
        // console.log('tt' + _this.methodData.id)
        if (_this.methodData.id) {
          axios.get('/v1/methodtypes/' + _this.methodData.id)
          .then(function (response) {
            _this.methodData = {}
            _this.methodData = response.data.data[0]
              // 找父类名字
            if (_this.methodData.edmtParentId) {
              axios.get('/v1/methodtypes/' + _this.methodData.edmtParentId)
              .then(function (rr) {
                _this.edmtParentName = rr.data.data[0].edmtName
              })
            }
          })
          .catch(function (error) {
            _this.$message({message: '接口调用失败' + error, showClose: true, type: 'error'})
          })
        }
      }
    }
  }
</script>

<style>
#classify .grid-content {
    border: 1px solid #D3DCE6;
    margin-top: 0px;
    border-radius: 4px;
}
#classify .grid-content2 {
    margin-top: 0px;
    border-radius: 4px;
}
#classify .top-conent {
    background: #f5f6ff;
    height: 45px;
    text-align: center;
}
#classify .marginR {
  margin-right: 30px
}
  #classify .el-button{
    margin-right: 10px;
  }
</style>
