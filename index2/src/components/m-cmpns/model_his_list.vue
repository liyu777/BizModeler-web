<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="模型版本" style="padding-left: 20px">
        <el-input v-model="edmdVer" size="small" placeholder="模型版本"></el-input>
      </el-form-item>
      <el-form-item label="更新说明">
          <el-input v-model="edmdUpdateDesc" size="small" placeholder="更新说明"></el-input>
        <!--<el-select v-model="edmdStatus" size="small" placeholder="更新说明">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>-->
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="queryMod">查询<i class="el-icon-search"></i></el-button>
        <el-button type="info" @click="addMod" :disabled="newVer">新增版本</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="新增EDM" v-model="dialogVisible" size="tiny">
      <edmDef :code="0" v-if="dialogVisible" @closeDia="closeDia"></edmDef>
    </el-dialog>
    <el-dialog title="EDM维护" v-model="dialogVisible1" size="tiny">
      <edmDef :code="1" :edmId="edmId" v-if="dialogVisible1" @closeDia="closeDia1"></edmDef>
    </el-dialog>
    <div class="tableClass">
      <el-table :data="tableData" style="" highlight-current-row>
        <el-table-column type="index" align='center' width="70" label="序号"></el-table-column>
        <el-table-column prop="edmdCode" label="模型版本" align='center' width="200">
          <template scope="scope">
            <!--<a href="/#modelDefine/1/1">{{scope.row.edmdVer}}</a>-->
            <el-button size="small" @click="seeMod(scope.row.id)" type="text">{{scope.row.edmdVer}}</el-button>
            <!--<a href="javascript:void(0)" @click="seeMod(scope.row.id)">{{scope.row.edmdVer}}</a>-->
          </template>
        </el-table-column>
        <!--<el-table-column prop="edmdName" label="模型名称" align='center'></el-table-column>
                <el-table-column prop="edmdVer" label="模型版本" align='center'>
                    <template scope="scope">
                           <a href="/#modelUpdateHis">{{scope.row.edmdVer}}</a>
                      </template>
                </el-table-column>-->
        <el-table-column prop="edmdStatusName" label="模型状态" align='center' width="200"></el-table-column>
        <!--<el-table-column prop="edmiIndustryName" label="适用行业" align='center'></el-table-column>
                <el-table-column prop="edmdDesc" label="模型描述" align='center'></el-table-column>-->
        <el-table-column prop="edmdUpdateDesc" label="更新说明" header-align="center" align='left'
                         :show-overflow-tooltip='showme'></el-table-column>
        <el-table-column prop="moduser" label="维护人" width="150" align='center'></el-table-column>
        <el-table-column prop="modtimeStr" label="维护时间" width="200" align='center'></el-table-column>
        <el-table-column label="模型操作" width="200" align='center'>
          <template scope="scope">
            <el-button title="编辑" size="small" @click="editmod(scope.row.id, scope.row.edmdVer)"
                       v-if="modelStatu(scope.row.edmdStatus)" type="rx-icon" icon="rx-bianji2">
            </el-button>
            <el-button title="浏览" size="small" @click="browsemod(scope.row.id)"
                       v-if="!modelStatu(scope.row.edmdStatus)" type="rx-icon" icon="rx-yulan">
            </el-button>
            <!--<el-button size="small" @click="" type="text">生成</el-button>
                        <el-button size="small" @click="" type="text">测试</el-button>-->
            <!--<el-button size="small" @click="" type="text" v-if="modelStatu(scope.row.edmdStatusName)">导入</el-button>-->
            <el-button title="导出" size="small" @click="open3(scope.row.id)" type="rx-icon" icon="rx-daochu2"></el-button>
            <!--<a href="http://bizmodeler:2002/modelers/export?id=25">导出</a>-->
            <!--<el-button size="small" @click="copymod(scope.row.m_code)" type="text">复制</el-button>-->
            <!--<el-button size="small" @click="" type="text" v-if="scope.row.m_operation">发布</el-button>-->
          </template>
        </el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <div class="mright">
      <el-pagination layout="total, sizes,prev, pager, next, jumper" :page-sizes="[10, 20, 30, 40]" :total="tableTotal"
                     :page-size="size" @size-change="changeSize" @current-change="changePage"></el-pagination>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import edmDef from './modelDefine.vue'
  export default {
    name: 'list',
    data () {
      return {
        tableData1: [{
          edmdCode: 'M0001',
          id: '4',
          edmdName: '通用',
          edmdVer: 'v0.1',
          edmdStatusName: '已发布',
          edmiIndustryName: '通用',
          edmdDesc: '描述',
          edmdUpdateDesc: '说明说明说明说明说明说明说明说明说明说明说明说明说明说明说明说明',
          adduser: '流川枫',
          addtime: '01-22 10:00',
          edmd_operation: true
        }, {
          edmdCode: 'M0002',
          edmdName: '航嘉',
          edmdVer: 'v0.2',
          edmdStatusName: '待开发',
          edmiIndustryName: '航嘉',
          edmdDesc: '描述',
          edmdUpdateDesc: '说明...',
          adduser: '流川枫',
          addtime: '01-22 10:00',
          edmd_operation: false
        }],
        tableData: [],
        size: 10,
        value: '',
        tableTotal: 0,
        showme: true,
        idshow: false,
        edmdVer: '',
        edmdUpdateDesc: '',
        mStatu: true,
        newVer: false,
        dialogVisible: false,
        dialogVisible1: false,
        ifUpdate: true,
        edmId: '',
        mStatus: ''
      }
    },
    watch: {
      edmCodeName: function () {
        return this.$store.state.edmCodeName
      }
    },
    created () {
      this.getData()
    },
    methods: {
      /* addMod: function () {
       this.$router.push('/modelDefine/0/0')
       }, */
      getData () {
        var _this = this
        axios.get('/v1/modelers').then((res) => {
          _this.tableData = res.data.data.list
          _this.tableTotal = res.data.data.total
          // console.log(_this.tableData.length)
          // console.log(JSON.stringify(_this.tableData[0]))
        }).catch((error) => {
          this.$message({
            type: 'error',
            showClose: true,
            message: '查询失败：' + error
          })
        })
        axios.get('/v1/modelers/status').then((res) => {
          console.log('addStatus:' + res.data.data.addStatus)
          if (res.data.data.addStatus === 0) {
            _this.newVer = true
          } else {
            _this.newVer = false
          }
        }).catch((error) => {
          this.$message({
            type: 'error',
            showClose: true,
            message: '查询失败：' + error
          })
        })
      },
      addMod: function () {
        this.dialogVisible = true
      },
      queryMod: function () {
        var _this = this
        if (!_this.edmdVer) {
          _this.edmdVer = null
        }
        if (!_this.edmdUpdateDesc) {
          _this.edmdUpdateDesc = null
        }
        console.log('Ver:' + _this.edmdVer)
        console.log('desc:' + _this.edmdUpdateDesc)
        axios.get('/v1/modelers', {
          params: {
            edmdVer: _this.edmdVer,
            edmdUpdateDesc: _this.edmdUpdateDesc
          }
        }).then((res) => {
          console.log(res.data.data.total + '...')
          _this.tableData = res.data.data.list
          _this.tableTotal = res.data.data.total
        }).catch((error) => {
          this.$message({
            type: 'error',
            showClose: true,
            message: '查询失败：' + error
          })
        })
      },
      editmod: function (id, code) {
        console.log(code)
        this.$router.push('/modelMain/1/' + id)
        this.$store.dispatch('edmCode', code)
        // window.location.href = '/#modelMain/1/' + id
      },
      browsemod: function (id, code) {
        this.$router.push('/modelMain/0/' + id)
        this.$store.dispatch('edmCode', code)
        // window.location.href = '/#modelMain/0/' + id
      },
      copymod: function (code) {
        window.location.href = '/#modelDefine/2/' + code
      },
      /* seeMod: function (code) {
       this.$router.push('/modelDefine/1/' + code)
       // window.location.href = '/#modelDefine/1/' + code
       }, */
      seeMod: function (id) {
        this.edmId = id
        this.dialogVisible1 = true
        // window.location.href = '/#modelDefine/1/' + code
      },
      changePage: function (currentPage) {
        var _this = this
        // console.log(currentPage)
        axios.get('/v1/modelers', {
          params: {
            pageNum: currentPage
          }
        }).then((res) => {
          console.log(res.data.data.list)
          _this.tableData = res.data.data.list
        }).catch((error) => {
          this.$message({
            type: 'error',
            showClose: true,
            message: '查询失败：' + error
          })
        })
      },
      changeSize: function (size) {
        var _this = this
        // console.log(currentPage)
        axios.get('/v1/modelers', {
          params: {
            pageSize: size
          }
        }).then((res) => {
          console.log(res.data.data.list)
          _this.tableData = res.data.data.list
          _this.size = size
        }).catch((error) => {
          this.$message({
            type: 'error',
            showClose: true,
            message: '查询失败：' + error
          })
        })
      },
      open3: function (id) {
        window.location.href = '/file/modelers/export?id=' + id
      },
      modelStatu: function (statu) {
        if (statu === 6 || statu === 7) {
          return false
        }
        return true
      },
      closeDia () {
        this.dialogVisible = false
        this.getData()
      },
      closeDia1 () {
        this.dialogVisible1 = false
        this.getData()
      }
    },
    components: {
      edmDef
    }
  }
</script>

<style>
  /*表头高度*/
  .tableClass .el-table th>.cell {
    height: 50px;
    padding-top: 10px;
  }
  /*表头字体颜色，高度*/
  .tableClass .el-table__header-wrapper thead div {
    color: #9496A0;
    background-color: #e9edf6;
  }
  /*翻页*/
  .mright {
    display: inline-block;
    width: 440px;
    position: absolute;
    right: 70px;
  }
</style>
