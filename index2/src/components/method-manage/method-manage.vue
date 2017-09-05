<template>
	<div>
  <div id="dialog-title">
    <el-dialog title="方法分类" v-model="treeVisible" >
				<methodClass @upup="changeType"></methodClass>
			</el-dialog>
      </div>
		<el-form :inline="true"
		         :model="queryCon"
		         class="demo-form-inline">
			<el-form-item label="方法分类" style="margin-left: 20px">
				<el-input v-model="queryCon.edmm_type_name" size="small"
				          placeholder=""  icon="plus"  @focus="OpenTree" @click="OpenTree"></el-input>
				<input type="hidden"
				       v-model="queryCon.edmm_type">
			</el-form-item>
			<el-form-item label="程序类型">
        <el-select v-model="queryCon.edmmProgramType" size="small">
                  <el-option :key="''" :label="'全部'"
					           :value="''"></el-option>
					<el-option v-for="options in queryCon.edmm_program_type" :key="options.id" :label="options.codeName"
					           :value="options.codeValue"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="方法名称">
				<el-input v-model="queryCon.edmm_name" size="small"
				          placeholder="" ></el-input>
			</el-form-item>
			<el-form-item label="方法状态">
				<el-select v-model="queryCon.edmmStatus" size="small">
					<el-option v-for="options in queryCon.edmm_status" :key="options.id" :label="options.label"
					           :value="options.val"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="info" size="small"  @click="Query()" icon="search">查询&nbsp</el-button>
				<el-button type="info" size="small" @click="New(0)">新增</el-button>
			</el-form-item>
		</el-form>

		<el-table :data="tableData"
              :height="getHight"
		          style="width: 100%;height: 60%;display:block" highlight-current-row>
			<el-table-column type="index"
			                 align='center'
			                 label="序号"
			                 width="70"></el-table-column>
			<el-table-column prop="edmmTypeName"
			                 label="方法分类"
			                 align='center' show-overflow-tooltip width="100"></el-table-column>
			<el-table-column prop="edmProgramTypeName"
			                 label="程序类型"
			                 align='center' width="100"></el-table-column>
			<el-table-column prop="edmmName"
			                 label="方法名称"
			                 header-align="center" align='left' show-overflow-tooltip width="200"></el-table-column>
			<el-table-column prop="edmmDesc"
			                 label="方法描述"
											 header-align="center" show-overflow-tooltip
			                 align='left'></el-table-column>
			<el-table-column label="是否自动方法"	align='center' width="80">
        <template scope="scope">
        <div v-if="scope.row.isAuto == 1">是</div>
        <div v-else>否</div>
      </template>
      </el-table-column>
			<el-table-column label="是否平台方法" align='center' width="80">
      <template scope="scope">
        <div v-if="scope.row.isPlatformProgram == 1">是</div>
        <div v-else>否</div>
      </template>
                       </el-table-column>
			<el-table-column prop="edmmVer"
			                 label="版本号"
			                 align='center' width="80"></el-table-column>
			<el-table-column label="方法状态" align='center' width="100">
        <template scope="scope">
        <div v-if="scope.row.edmmStatus == 1">启用</div>
        <div v-else-if="scope.row.edmmStatus == 0">禁用</div>
      </template>
      </el-table-column>
			<el-table-column prop="moduser"
			                 label="维护人"
			                 align='center' width="120"></el-table-column>
			<el-table-column prop="modtimeStr"
			                 label="维护时间"
			                 align='center' width="180px"></el-table-column>
			<el-table-column label="操作"
			                 align='center' width="80">
				<template scope="scope">
					<el-button size="small"
					           @click="New(1,scope.row)"
					           type="rx-icon" icon="rx-bianji2" title="编辑"></el-button>
					<!--<el-button v-if="scope.row.edmm_status == 0" size="small"
					           @click="DelMethod(scope.row.id)"
					           type="text">删除</el-button>-->
				</template>
			</el-table-column>
		</el-table>
  <div class="paging">
    <el-pagination
      @size-change="GetSize"
      @current-change="Query"
      :current-page="pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </div>
	</div>
</template>

<script>
  import axios from 'axios'
  import methodClass from '@/components/m-cmpns/method-classify'
  export default {
    name: 'methodManage',
    data () {
      return {
        tableData: [],
        treeVisible: false,
        total: 0,
        pageSize: 10,
        pageNum: 1,
        queryCon: {
          edmm_type_name: '',
          edmm_type: '',
          edmmProgramType: '',
          edmm_name: '',
          edmmStatus: '',
          edmm_program_type: [],
          edmm_status: [{
            id: -1,
            val: '',
            label: '全部'
          }, {
            id: 1,
            val: 1,
            label: '启用'
          }, {
            id: 0,
            val: 0,
            label: '禁用'
          }]
        }
      }
    },
    created: function () {
      var _this = this
      axios.get('/v1/codes/edm_program_type').then(function (res) {
        _this.queryCon.edmm_program_type = res.data.data
      }).catch(function (error) {
        _this.$message({
          type: 'error',
          showClose: true,
          message: '接口调用失败：' + error
        })
        console.log(error)
      })
      _this.Query()
    },
    methods: {
      Query: function (currentPage) {
        var _this = this
        _this.pageNum = currentPage
        axios.get('/v1/methods', {
          params: {
            edmmType: _this.queryCon.edmm_type,
            edmmProgramType: _this.queryCon.edmmProgramType,
            edmmName: _this.queryCon.edmm_name,
            edmmStatus: _this.queryCon.edmmStatus,
            pageNum: _this.pageNum,
            pageSize: _this.pageSize
          }
        }).then(function (res) {
          _this.tableData = res.data.data.list
          _this.total = res.data.data.total
        }).catch(function (error) {
          _this.$message({
            type: 'error',
            showClose: true,
            message: '接口调用失败：' + error
          })
        })
      },
      GetSize: function (pageSize) {
        this.pageSize = pageSize
        this.Query()
      },
      New: function (type, mid) {
        if (type) {
          this.$router.push({
            path: '/method-define',
            query: {
              type: type,
              mid: mid.id,
              page: 'manage'
            }})
        } else {
          this.$router.push({
            path: '/method-define',
            query: {
              type: type,
              page: 'manage'
            }})
        }
      },
      changeType: function (data) {
        this.queryCon.edmm_type_name = data.name
        this.queryCon.edmm_type = data.id
        this.treeVisible = false
      },
      DelMethod: function (mid) {
        this.$confirm('确认删除该方法？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.delete('/v1/methods/' + mid).then(function () {
            this.$message({
              type: 'success',
              message: '删除成功'
            }).catch(function (error) {
              this.$message({
                type: 'error',
                message: '删除失败！' + error
              })
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      OpenTree: function () {
        this.treeVisible = true
      },
      ClearType: function () {
        this.queryCon.edmm_type_name = ''
        this.queryCon.edmm_type = ''
      }
    },
    components: {
      methodClass
    },
    computed: {
      getHight: function () {
        return window.innerHeight * 0.7
      }
    }
}
</script>

<style>
.demo-form-inline {
	text-align: left
}
.paging {
    display: inline-block;
    width: 440px;
    position: absolute;
    right: 0;
  }
</style>
