 <template>
    <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline" >
            <el-form-item label="模型名称">
                <el-input v-model="formInline.user" size="small" placeholder="模型名称"></el-input>
            </el-form-item>
            <el-form-item label="适用行业">
                <el-input v-model="formInline.region" size="small" placeholder="适用行业"></el-input>
            </el-form-item>
            <el-form-item >
                <el-button type="info" >&nbsp;&nbsp;查询&nbsp;&nbsp;</el-button>
                <el-button type="info" v-on:click="OpenWin(1)">模型比较
                </el-button>
                <a align="right" href="#/list">模型历史列表</a>
            </el-form-item>
        </el-form>

        <el-table :data="tableData" border  >
                <el-table-column type="selection" align='center' width="55"></el-table-column>
                <el-table-column type="index" align='center' label="序号" width="70"></el-table-column>
                <el-table-column prop="m_code" label="模型编码" align='center'>
                    <template scope="scope">
                        <a href="/#modelDefine/0/0">{{scope.row.m_code}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="m_name" label="模型名称" align='center'></el-table-column>
                <el-table-column prop="m_version" label="模型版本" align='center'>
                    <template scope="scope">
                        <a href="/#modelUpdateHis">{{scope.row.m_version}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="m_apply" label="适用行业" align='center'></el-table-column>
                <el-table-column prop="m_describtion" label="模型描述" align='center'></el-table-column>
                <el-table-column prop="m_human" label="维护人" align='center'></el-table-column>
                <el-table-column prop="m_time" label="维护时间" align='center'></el-table-column>
                <el-table-column prop="operation" label="操作" width="300" align='center'>
                    <template scope="scope">
                        <el-button size="small" @click="OpenWin(2)" type="text">浏览</el-button>
                        <el-button size="small" @click="" type="text">导出</el-button>
                        <el-button size="small" @click="OpenWin(3)" type="text">复制</el-button>
                    </template>
                </el-table-column>
            </el-table-column>
        </el-table>

    </div>
</template>

<script>
    export default {
      name: 'modelList',
      data () {
        return {
          tableData: [{
            m_code: 'M0001',
            m_name: '通用',
            m_version: 'v0.1',
            m_status: '已发布',
            m_apply: '通用',
            m_describtion: '描述',
            m_update: '说明说明说明说明说明说明说明说明说明说明说明说明说明说明说明说明',
            m_human: '流川枫',
            m_time: '01-22 10:00',
            m_operation: true
          }, {
            m_code: 'M0002',
            m_name: '航嘉',
            m_version: 'v0.2',
            m_status: '待开发',
            m_apply: '航嘉',
            m_describtion: '描述',
            m_update: '说明...',
            m_human: '流川枫',
            m_time: '01-22 10:00',
            m_operation: false
          }],
          value: '',
          showme: true,
          formInline: {
            user: '',
            region: ''
          }
        }
      },
      methods: {
        OpenWin: function (value) {
          if (value === 1) {
            window.location.href = '#/modelCompare'
          } else if (value === 2) {
            window.location.href = '#/modelMain'
          } else if (value === 3) {
            window.location.href = '#/modelDefine/0/0'
          }
        }
      }
}
</script>

<style>
/*.tableDiv{
    display: block;
    padding-left: 200px;
    padding-right: 200px
}
.margin-200{
    margin-left: 200px
}
.demo-form-inline{
    text-align: left
}*/
</style>
