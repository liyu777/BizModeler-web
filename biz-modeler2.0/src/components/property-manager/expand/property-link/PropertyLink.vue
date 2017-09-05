<template>
  <div>
    <div class="condition">
      触发条件：
      <trigger-condition-editor class="input" 
      :disabled="mode !== 'edit'" 
      v-model="condition.edcoCond" 
      :text="condition.condFormula ? condition.condFormula : condition.condFormulaDesc"
      :propertyId="propertyId"></trigger-condition-editor>
      <!-- <el-input class="input" icon="plus" :disabled="mode !== 'edit'"></el-input> -->
      <el-button type="primary" icon="rx-baocun1" v-if="mode === 'edit'" @click="saveCondition">保存</el-button>
    </div>
    <div class="button-area">
      <span class="title default-color">
        关联属性集
      </span>
      <span class="button" v-if="mode === 'edit'">
        <el-button type="primary" icon="plus" @click="createLink">新增</el-button>
        <el-button type="danger" icon="delete2" @click="removeLink">删除</el-button>
      </span>
    </div>
    <el-table
      ref="currentTable"
      v-loading="isSearching"
      :data="tableData"
      @selection-change="handleChecked"
      @row-click="checkCurrent"
      :row-class-name="tableCheckedClass"
      height="288">
      <el-table-column type="selection" width="40" align="center" v-if="mode === 'edit'"></el-table-column>
      <el-table-column type="index" label="序号" width="40" align="center"></el-table-column>
      <el-table-column label="类名" width="120" align="center" prop="edmcName"></el-table-column>
      <el-table-column label="关联属性" width="110" align="center">
        <template scope="scope">
          <el-button v-if="mode === 'edit'" type="text" v-on:click.stop="editLink(scope.row)">{{scope.row.edmpName}}</el-button>
          <span v-else>{{scope.row.edmpName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="对象定位公式" align="center">
        <template scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.formulaDesc" placement="top">
            <span v-if="scope.row.formula" style="white-space:nowrap">{{scope.row.formula}}</span>
            <span v-else style="white-space:nowrap">{{scope.row.formulaDesc}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="联动方式" align="center" width="100">
        <template scope="scope">
          {{UTILS.getDictName('edm_connect_type', scope.row.edclType)}}
        </template>
      </el-table-column>
      <el-table-column label="保存联动记录" width="100" align="center">
        <template scope="scope">
          <el-switch v-if="mode === 'edit'" :on-value="1" :off-value="0" on-text="是" off-text="否" v-model="scope.row.edcnLinkPreservable"
          @change="changeEdcnLinkPreservable(scope.row)"></el-switch>
          <span v-else>{{scope.row.edcnLinkPreservable === 1 ? '是':'否'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="联动时效"width="120" align="center">
        <template scope="scope">
          <span v-if="scope.row.edclUpdateType === 'sync'">{{UTILS.getDictName('edm_update_type', scope.row.edclUpdateType)}}</span>
          <span v-if="scope.row.edclUpdateType === 'async'">
            {{UTILS.getDictName('edm_update_type', scope.row.edclUpdateType)}}
            ({{UTILS.getDictName('edm_asyncType_priority', scope.row.asyncTypePriority)}})
          </span>
          <span v-if="scope.row.edclUpdateType === 'time'">
            {{UTILS.getDictName('edm_update_type', scope.row.edclUpdateType)}}
            ({{scope.row.edclUpdateTime}})
          </span>
        </template>
      </el-table-column>
      <el-table-column label="维护人" width="80"  align="center" prop="moduser"></el-table-column>
      <el-table-column label="维护时间" width="150" align="center" prop="modtimeStr"></el-table-column>
    </el-table>
  </div>
</template>
<script>
  import LinkEditor from './LinkEditor'
  import TriggerConditionEditor from '@/components/commons/trigger-condition-editor/TriggerConditionEditor'
  import { dictTypes, propertyTypes } from '@/types'
  import { propertyService } from '@/api'

  export default {
    name: 'property-link',
    props: ['propertyId', 'mode'],
    components: {
      TriggerConditionEditor
    },
    created () {
      // 获得数据字典
      this.$store.dispatch(dictTypes.GET_DICT_BY_CODES, ['edm_asyncType_priority', 'edm_update_type', 'edm_connect_type']).then(() => {
        // 获取关联属性
        this.getLinks()
        // 获取触发条件
        propertyService.queryCondition(this.propertyId).then(data => {
          if (data) {
            this.isUpdate = true
            this.UTILS.setDataFromOther(this.condition, data)
          } else {
            this.isUpdate = false
            this.condition.edcoEdmpId = this.propertyId
          }
        })
      })
    },
    data () {
      return {
        condition: {
          edcoCond: '',
          condFormula: '',
          condFormulaDesc: '',
          id: '',
          edcoEdmpId: ''
        },
        // 查询中
        isSearching: false,
        // 列表数据
        tableData: [],
        // 选中行
        checkedRows: [],
        // 是否是编辑状态
        isUpdate: false
      }
    },
    methods: {
      // 查找关联数据
      getLinks () {
        this.isSearching = true
        propertyService.getPropertyLinks(this.propertyId).then(data => {
          this.tableData = data
          this.isSearching = false
        })
      },
      // 添加关联属性
      createLink () {
        this.$openDialog({
          name: 'create-link',
          component: LinkEditor,
          options: {
            title: '新增关联属性',
            customClass: 'dialog-width-m'
          },
          props: {
            mode: propertyTypes.EDIT_MODE_CREATE,
            propertyId: this.propertyId
          },
          events: {
            close: () => {
              this.$closeDialog('create-link')
            },
            createSuccess: () => {
              // 刷新列表
              this.getLinks()
              this.$closeDialog('create-link')
            }
          }
        })
      },
      editLink (row) {
        this.$openDialog({
          name: 'edit-link',
          component: LinkEditor,
          options: {
            title: '编辑关联属性',
            customClass: 'dialog-width-m'
          },
          props: {
            mode: propertyTypes.EDIT_MODE_UPDATE,
            linkInfo: row
          },
          events: {
            close: () => {
              this.$closeDialog('edit-link')
            },
            updateSuccess: () => {
              // 刷新列表
              this.getLinks()
              this.$closeDialog('edit-link')
            },
            removeCondition: (row) => {
              // 删除关联公式
              row.formulaDesc = ''
              row.formula = ''
            }
          }
        })
      },
      changeEdcnLinkPreservable (row) {
        this.$nextTick(() => {
          propertyService.updatePropertyLink({
            id: row.id,
            edcnLinkPreservable: row.edcnLinkPreservable
          })
        })
      },
      // 更新选中行
      handleChecked (rows) {
        if (this.mode === 'edit') {
          this.checkedRows = rows
        }
      },
      // 选中行，自动选中复选框
      checkCurrent (row) {
        this.$refs.currentTable.toggleRowSelection(row)
      },
      // 选中高亮样式
      tableCheckedClass (row, index) {
        if (this.checkedRows.indexOf(row) >= 0) {
          return 'table-checked'
        }
        return ''
      },
      removeLink () {
        if (this.checkedRows.length === 0) {
          this.$message.warning('至少选中一行！')
        } else {
          const ids = []
          this.checkedRows.forEach(item => {
            ids.push(item.id)
          })
          this.$confirm('确定删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            propertyService.deletePropertyLink(ids).then(data => {
              // 刷新列表
              this.getLinks()
            })
          })
        }
      },
      // 保存触发条件公式
      saveCondition () {
        if (this.condition.edcoCond) {
          if (this.isUpdate) {
            // 更新
            propertyService.updateCondition(this.condition).then(data => {
              this.$message.success('更新成功！')
            })
          } else {
            // 保存
            propertyService.createCondition(this.condition).then(data => {
              this.$message.success('保存成功！')
              this.condition.id = data
              this.isUpdate = true
            })
          }
        } else {
          this.$message.warning('请先编辑触发条件公式！')
        }
      }
    }
  }
</script>
<style scoped>
  .input{
    width: 300px;
  }
  .button-area{
    margin-top: 10px;
    background-color: #F1F3FF;
    height: 37px;
    line-height: 37px;
    border: solid 1px #DFE6EC;
    border-bottom: none;
  }
  .condition{
    height: 35px;
    line-height: 35px;
  }
  .title{
    float:left;
    font-size: 14px;
    font-weight: bold;
    margin-left: 20px;
  }
  .button{
    float: right;
    margin-right: 10px;
  }
</style>
