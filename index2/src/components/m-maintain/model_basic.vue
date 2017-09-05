<template>
<div>
  <el-form >
    <el-form :inline="true" :model="data" >
      				<el-form-item style="text-indent:1.8em" label="类版本:">
                <el-input v-model="data.edmcVer" value="data.edmcVer" :disabled="true"></el-input>
      				</el-form-item>
      				<el-form-item label="负责人:">
                <el-input v-model="data.edmcPrincipal" value="data.edmcPrincipal" :disabled="true"></el-input>
      				</el-form-item>
      				<el-form-item label="维护人:">
                <el-input v-model="data.moduser" value="data.moduser" :disabled="true"></el-input>
      				</el-form-item>
      				<el-form-item label="维护时间:">
                <el-input v-model="data.modtimeStr" value="data.modtimeStr" :disabled="true" ></el-input>
      				</el-form-item>
      			</el-form>
     <el-form-item label="类使用说明:">
            <el-input  type="textarea" :disabled="true" :row="3" size="small" value="data.edmcUseDesc" v-model="data.edmcUseDesc" class="item-width"></el-input>
            </el-form-item>

  <el-form-item label="附件列表">
  <el-table :data="tableData"  style="width: 100%;display:block" >
               				<el-table-column type="index" align='center' label="序号" width="70"></el-table-column>
               				<el-table-column prop="edmaType" label="附件类型" align='center'>
               				<template scope="scope">
                         <div v-if="scope.row.md_operation">
                           {{ scope.row.typeValue }}
                         </div>
                         <div v-else>
                           <el-select v-model="scope.row.edmaType" value="scope.row.typeValue">
                             <el-option v-for="options in option" :key="options.id" :label="options.codeName"
                                        :value="options.codeValue" >{{options.codeName}}</el-option>
                           </el-select>
                         </div>
               				  </template>
                      </el-table-column>
               				<el-table-column prop="edmaName" label="附件名称" align='center'>
               				<template scope="scope">
                        <div v-if="scope.row.md_operation">
                          {{scope.row.edmaName}}
                         </div>
                         <div v-else>
                           <el-input v-model="scope.row.edmaName" value="scope.row.edmaName"  @blur="checkDataName"></el-input>
                         </div>
                       </template></el-table-column>
               				<el-table-column prop="edmaPath" label="附件路径" align='center' width="400">
               				<template scope="scope">
               				   <div v-if="(scope.row.edmaType === 1 || scope.row.edmaType === '1') && scope.row.md_operation ">
               				     <a :href="scope.row.edmaPath" target="_blank">{{ scope.row.edmaPath }}</a>
               				   </div>
               				   <div v-else-if="!scope.row.md_operation && (scope.row.edmaType === 1 || scope.row.edmaType === '1')">
               				     <el-input v-model="scope.row.edmaPath" value="scope.row.edmaPath"></el-input>
               				   </div>
               				   <div v-else-if="scope.row.md_operation && (scope.row.edmaType === 2 || scope.row.edmaType === '2')">
                           <a  :href="'http://192.168.13.34:2002/attachments/download?id='+scope.row.id">{{ scope.row.edmaPath }}</a>
                         </div>
                        <div v-else-if="!scope.row.md_operation && (scope.row.edmaType === 2 || scope.row.edmaType === '2')">
               				   <el-upload
                           action="http://192.168.13.34:2002/attachments/upload"
                           :on-remove="handleRemove"
                           class="upload-demo"
                           :on-preview="handlePreview"
                           :file-list="fileList"
                           :on-change="onChange"
                           ref="upload">
                           <el-button size="small" type="primary">浏览</el-button>
                         </el-upload>
               				   </div>
               				  </template></el-table-column>
               				<el-table-column prop="moduser" label="维护人" align='center'></el-table-column>
               				<el-table-column prop="modtimeStr" label="维护时间"  align='center'></el-table-column>
               				<el-table-column prop="md_operation" label="操作" width="200" align='center' v-if="ifoperate">
               					<template scope="scope">
                          <el-button size="small" @click="edit(scope.row)"  type="rx-icon" icon="rx-bianji2" title="编辑" v-if="scope.row.md_operation" ></el-button>
                          <el-button size="small" @click="save(scope.$index, scope.row)" type="rx-icon"  icon="rx-baocun2" title="保存" v-else ></el-button>
                          <el-button size="small" @click="basicDelete(scope.$index, scope.row)" type="rx-icon" icon="rx-shanchu2" title="删除" v-if="scope.row.md_operation"></el-button>
                          <el-button size="small" @click="cancel(scope.row)" type="rx-icon" icon="rx-chexiao" title="取消" v-if="!scope.row.md_operation"></el-button>
                          <el-button size="small" @click="shiftUp(scope.$index, scope.row)" type="rx-icon" icon="rx-shangyi2" title="上移" v-if="scope.row.md_operation"></el-button>
                          <el-button size="small" @click="shiftDown(scope.$index, scope.row)" type="rx-icon" icon="rx-xiayi2" title="下移" v-if="scope.row.md_operation"></el-button>
                          </template>
               				</el-table-column>
               			</el-table-column>
               		</el-table>
               	</el-form-item>
               	</el-form>
</div>
</template>
<script>

export default{
  name: 'basic',
  props: [
    'ifoperate'
  ],
  data () {
    return {
      formInline: {},
      data: {},
      option: [],
      tableData: [],
      fileList: []
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
    }
  },
  computed: {
    modelMainLeftTreeCurrSelectId: function () {
      return this.$store.state.modelMainLeftTreeCurrSelectId
    }
  },
  methods: {
    edit: function (row) {
      row.md_operation = !row.md_operation
    },
    checkDataName (list) {
      var vm = this
      var newEdmpName = list.srcElement.value
      var id = this.$store.state.modelMainLeftTreeCurrSelectId
      if (newEdmpName) {
        window.axios.get('/v1/attachments/checkData', {
          params: {edmaName: newEdmpName, edmaEdmcId: id}
        }).then((res) => {
          if (res.data.retCode === 1) {
            console.log(res.data.retCode)
          } else {
            vm.$message({
              type: 'warning',
              showClose: true,
              message: '附件名称已存在，请重新填写！'
            })
          }
        }).catch((error) => {
          vm.$message({
            type: 'error',
            showClose: true,
            message: '附件名称校验失败：' + error
          })
        })
      }
    },
    cancel: function (row) {
      row.md_operation = !row.md_operation
      var id = this.$store.state.modelMainLeftTreeCurrSelectId
      this.queryAttachment(id)
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    onChange (file, fileList) {
      var vm = this
      if (file.status === 'fail') {
        vm.$message({
          type: 'info',
          message: '文件过大!'
        })
      }
      vm.fileList = fileList.slice(-1)
    },
    handlePreview (file) {
      console.log(file)
    },
    basicDelete (index, list) {
      console.info(index)
      console.info(list.id)
      var vm = this
      var id = this.$store.state.modelMainLeftTreeCurrSelectId
      this.$confirm('是否确认继续?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.axios.delete('/v1/attachments/' + list.id)
          .then(function (res) {
            if (res.data.retCode === 1) {
              vm.$message({
                type: 'success',
                message: '删除成功!'
              })
              vm.queryAttachment(id)
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
    beforeUpload (file) {
      console.log(file)
    },
    shiftUp: function (index, row) {
      console.log(index)
      console.info(row.id)
      var vm = this
      var did = ''
      var id = this.$store.state.modelMainLeftTreeCurrSelectId
      if (index > '0') {
        for (var i = 0; i < vm.tableData.length; i++) {
          if (row.id === vm.tableData[i].id) {
            did = vm.tableData[i - 1].id
          }
        }
        window.axios.put('/v1/attachments/' + row.id + '/' + did)
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
            vm.queryAttachment(id)
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
      if (index === (vm.tableData.length - '2')) {
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
        window.axios.put('/v1/attachments/' + uid + '/' + row.id)
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
            vm.queryAttachment(id)
          }).catch(function (error) {
            console.info(error)
          })
      }
    },
    save (index, list) {
      console.log(index)
      var vm = this
      var id = this.$store.state.modelMainLeftTreeCurrSelectId
      if (list.edmaType === 2 || list.edmaType === '2') {
        var fileList = vm.$refs.upload.fileList
        console.log(fileList)
        list.edmaPath = fileList[fileList.length - 1].response.data.edmaPath
      } else {
        list.edmaPath = ''
      }
      if (list.id != null) {
        window.axios.put('/v1/attachments/', list)
          .then(function (res) {
            var data = res.data
            if (data.retCode === 1) {
              vm.$message({
                showClose: true,
                message: '保存成功'
              })
            } else {
              console.log(data.errMsg)
            }
            list.md_operation = !list.md_operation
            vm.queryAttachment(id)
          }).catch(function (error) {
            console.info(error)
          })
      } else {
        list.edmaEdmcId = id
        list.isDel = '0'
        window.axios.post('/v1/attachments/', list)
          .then(function (res) {
            var data = res.data
            if (data.retCode === 1) {
              vm.$message({
                showClose: true,
                message: '新增成功'
              })
            } else {
              console.log(data.errMsg)
            }
            vm.queryAttachment(id)
            list.md_operation = !list.md_operation
          })
          .catch(function (err) {
            console.log(err)
          })
      }
    },
    queryType () {
      var vm = this
      window.axios.get('/v1/codes/edm_attachment_type')
        .then(function (response) {
          console.log(response)
          vm.option = response.data.data
        }).catch(function (error) {
          console.info(error)
        })
    },
    dataChange (id) {
      console.log('dataChange' + id)
      var vm = this
      console.log(vm)
      this.queryBasic(id)
      this.queryAttachment(id)
    },
    queryBasic (id) {
      var vm = this
      console.log(id)
      window.axios.get('v1/classes/' + id)
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
    },
    queryAttachment (id) {
      var vm = this
      var arr = []
      window.axios.get('v1/classes/' + id + '/attachments')
        .then(function (res) {
          console.log(res)
          if (res.data.data != null) {
            for (var i = 0; i < res.data.data.length; i++) {
              var everyData = res.data.data[i]
              everyData.md_operation = 'true'
              everyData.edmaType = (everyData.edmaType).toString()
              arr.push(everyData)
              console.log(arr)
            }
            vm.tableData = res.data.data
          } else {
            vm.tableData = []
          }
          vm.tableData.push({
            edmaType: ''
          })
        }).catch(function (error) {
          console.info(error)
        })
    }
  }

}
</script>

<style>

a:hover{
  cursor:pointer
}
</style>
