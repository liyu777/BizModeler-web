<template>
    <div>
    <div id="dialog-title">
      <el-dialog title="方法分类" v-model="treeVisible">
                    <methodClass @upup="changeType"></methodClass>
                </el-dialog>
    </div>
        <el-form :inline="true"
                 :model="queryCon"
                 class="demo-form-inline">
            <el-form-item label="方法分类">
                <el-input v-model="queryCon.edmm_type_name" size="small"
                          placeholder=""
                          icon="plus"
                          @click="OpenTree" @focus="OpenTree"></el-input>
                          <input type="hidden" v-model="queryCon.edmm_type">
                <input type="hidden"
                       v-model="queryCon.edmm_type">
            </el-form-item>
            <el-form-item label="方法名称">
                <el-input v-model="queryCon.edmm_name" size="small"
                          placeholder=""></el-input>
            </el-form-item>
             <el-form-item label="模型版本">
              <el-select v-model="queryCon.edmdVer" size="small">
                <el-option :key="''" :label="'全部'"
					           :value="''"></el-option>
					<el-option v-for="options in queryCon.edmm_ver_option" :key="options" :label="options"
					           :value="options"></el-option>
                     </el-select>
            </el-form-item>
            <el-form-item label="类名称">
                <el-input v-model="queryCon.edmc_name" size="small"
                          placeholder=""></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="info" size="small"  icon="search"
                           @click="Query()">查询</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="tableData"
                  :height="getHight"
                  style="width: 100%;display:block" highlight-current-row>
                  <el-table-column type="index" align="center" width="70px" label="序号"></el-table-column>
                  <el-table-column align="center" prop="edmtName" label="方法分类" width="100px" show-overflow-tooltip></el-table-column>
                  <el-table-column align="center" label="方法名称(版本号)" show-overflow-tooltip width="180px">
                      <template scope="scope">
                          <el-button @click="ToMethod(1,scope.row.id)" type="text">{{scope.row.edmmName}}({{scope.row.edmmVer}})</el-button>
                      </template>
                      </el-table-column>
                  <el-table-column header-align="center" align="left"  prop="edmmDesc" label="方法描述" show-overflow-tooltip></el-table-column>
                  <el-table-column align="center" label="模型版本" width="100px">
                      <template scope="scope">
                          <el-button @click="ToModel(scope.row.edmdId)" type="text">{{scope.row.edmdVersion}}</el-button>
                          </template>
                      </el-table-column>
                <el-table-column align="center" prop="edmdStatus" label="模型状态" width="100px"></el-table-column>
                  <el-table-column align="center" label="类名称" width="120px">
                      <template scope="scope">
                          <el-button @click="ToClass(scope.row.edmcId)" type="text">{{scope.row.edmcName}}</el-button>
                          </template>
                      </el-table-column>
                  <el-table-column align="center" prop="moduser" label="维护人" width="100px"></el-table-column>
                  <el-table-column align="center" prop="modtimeStr" label="维护时间" width="180px"></el-table-column>
        </el-table>
        <!--<div class="paging">
          <el-pagination @size-change="Query"
          @current-change="Query"
          :current-page="paging.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="paging.pageSize"
          layout="total,sizes, prev, pager, next,jumper"
          :total="paging.total">
          </el-pagination>
        </div>-->
    </div>
</template>
<script>
import axios from 'axios'
import methodClass from '@/components/m-cmpns/method-classify'
export default {
  name: 'methodModel',
  data () {
    return {
      queryCon: {
        edmm_type_name: '',
        edmm_type: '',
        edmdVer: '',
        edmm_name: '',
        edmc_name: '',
        edmm_ver_option: []
      },
      // paging: {
      //   pageSize: 20,
      //   pageNum: 1,
      //   total: 0
      // },
      tableData: [],
      treeVisible: false
    }
  },
  created: function () {
    var _this = this
    axios.get('/v1/modelers/versions').then(function (res) {
      _this.queryCon.edmm_ver_option = res.data.data
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
    ToModel: function (modelId) {
      this.$router.push({path: '/modelMain/1/' + modelId})
    },
    ToClass: function (classId) {
      this.$router.push({path: '/modelM/' + classId})
    },
    ToMethod: function (type, methodId) {
      this.$router.push({
        path: '/method-define',
        query: {
          type: type,
          mid: methodId,
          page: 'model'
        }})
    },
    OpenTree: function () {
      this.treeVisible = true
    },
    Query: function () {
      var _this = this
      axios.get('/v1/methods/classes', {
        params: {
          type: _this.queryCon.edmm_type_name,
          name: _this.queryCon.edmm_name,
          version: _this.queryCon.edmdVer,
          className: _this.queryCon.edmc_name
        }
      }).then(function (res) {
        _this.tableData = res.data.data
      }).catch(function (error) {
        _this.$message({
          type: 'error',
          showClose: true,
          message: '接口调用失败：' + error
        })
      })
    },
    changeType: function (data) {
      this.queryCon.edmm_type_name = data.name
      this.queryCon.edmm_type = data.id
      this.treeVisible = false
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
</style>
