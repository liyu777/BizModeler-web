<template>
    <div>
        <el-form :inline="true"
                 :model="queryCon"
                 class="demo-form-inline">
            <el-form-item label="卷积公式">
                <el-select v-model="queryCon.edco_convolute_formula" size="small">
                  <el-option :key="''" :label="'全部'"
					           :value="''"></el-option>
					<el-option v-for="options in queryCon.edco_convolute_formulas" :key="options.id" :label="options.codeName"
					           :value="options.codeValue"></el-option>
				</el-select>
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
            <el-form-item label="属性名称">
                <el-input v-model="queryCon.edmd_name" size="small"
                          placeholder=""></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="info" size="small"  icon="search"
                           @click="Query">查询</el-button>
            </el-form-item>
        </el-form>

      <el-dialog title="属性扩展" v-model="attrVisible" size="full" @close="">
        <attr :id="attrid" :classid="classid" v-if="attrVisible" ></attr>
      </el-dialog>

        <el-table :data="tableData"
                  :height="getHight"
                  style="width: 100%;display:block" highlight-current-row>
                  <el-table-column type="index" align="center" width="70px" label="序号"></el-table-column>
                  <el-table-column align="center" prop="edcoConvoluteFormulaName" label="卷积公式"></el-table-column>
                  <el-table-column align="center" label="模型版本" width="100px">
                      <template scope="scope">
                          <el-button @click="ToModel(scope.row.edmdId)" type="text">{{scope.row.edmdVer}}</el-button>
                          </template>
                      </el-table-column>
                  <el-table-column align="center" prop="edmdStatusDesc" label="模型状态" width="100px">
                  </el-table-column>
                  <el-table-column align="center" label="类名称">
                      <template scope="scope">
                          <el-button @click="ToClass(scope.row.edmcId)"   type="text">{{scope.row.edmcName}}</el-button>
                          </template>
                      </el-table-column>
                      </el-table-column>
                  <el-table-column align="center" label="属性名称">
                      <template scope="scope">
                          <el-button @click="ToAttr(scope.row.edcoEdmpId,scope.row.edmdId)" type="text">{{scope.row.edmpName}}</el-button>
                          </template>
                      </el-table-column>
                  <el-table-column align="center" prop="edcoUpdateTimeliness" label="卷积更新时效" width="100px"></el-table-column>
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
        </el-pagination>-->
    </div>
	</div>
    </div>
</template>
<script>
import axios from 'axios'
import attr from '../ly-components/attributeVindicate.vue'

export default {
  name: 'methodModel',
  data () {
    return {
      queryCon: {
        edco_convolute_formula: '',
        edco_convolute_formulas: [],
        edmd_name: '',
        edmdVer: '',
        edmm_ver_option: [],
        edmc_name: ''
      },
      tableData: [],
      attrVisible: false,
      attrid: '',
      classid: ''
    }
  },
  created: function () {
    var _this = this
    axios.get('/v1/codes/edm_convolute_formula').then(function (res) {
      _this.queryCon.edco_convolute_formulas = res.data.data
    }).catch(function (error) {
      _this.$message({
        type: 'error',
        showClose: true,
        message: '接口调用失败：' + error
      })
    })
    axios.get('/v1/modelers/versions').then(function (res) {
      _this.queryCon.edmm_ver_option = res.data.data
    }).catch(function (error) {
      _this.$message({
        type: 'error',
        showClose: true,
        message: '接口调用失败：' + error
      })
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
    ToAttr: function (attrId, modelId) {
      // this.$router.push({path: '/attributeVindicate/' + attrId + '/' + modelId})
      this.attrVisible = true
      this.attrid = attrId
      this.classid = modelId
    },
    Query: function () {
      var _this = this
      axios.get('/v1/convolutes/properties', {
        params: {
          edcoConvoluteFormula: _this.queryCon.edco_convolute_formula,
          edmpName: _this.queryCon.edmd_name,
          edmcName: _this.queryCon.edmc_name,
          edmdVer: _this.queryCon.edmdVer
        }
      }).then(function (res) {
        _this.tableData = res.data.data
      }).catch(function (error) {
        _this.$message({
          type: 'error',
          message: '查询失败！' + error
        })
        console.log(error)
      })
    }
  },
  computed: {
    getHight: function () {
      return window.innerHeight * 0.7
    }
  },
  components: {
    attr
  }
}
</script>
<style>
</style>
