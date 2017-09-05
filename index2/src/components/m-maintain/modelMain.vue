  <template>
  <el-row  :gutter="10" >

    <el-col  v-if="!ifShowTree" :xs="15" :sm="10" :md="6" :lg="4" style="width: 15%"><!-- left col 4 class tree begin -->
      <div>
        <div class="ver-title">{{edmVer}}</div>
      <div class="class-filter-form"  >
        <el-form class="class-filter-form"  :model="classFilterForm">
          <div id="left-title">
          <el-form-item style="margin-bottom: 10px">
            <el-input  readonly="readonly" label="" v-model="treeNodeCodeNameStr"
              placeholder="请选择行业" size="large">
                <el-button slot="append"  icon="plus"   @click="openSelect"></el-button>
            </el-input>
          </el-form-item>
          <div class="industries-tree-wrapper" id="show" style="display:none">
            <el-tree
              check-strictly=""
              :data="industriesTreeData"
              show-checkbox
              ref="treeSelect"
              node-key="id"
              :props="defaultProps"
              @check-change="industriesTreeCheckChanged"
              :render-content="renderContent4IndustriesTree">
            </el-tree>
          </div>
          <el-form-item>
            <el-input placeholder="输入类名" v-model="filterClassName" icon="rx-sousuo1" size="large"></el-input>
          </el-form-item>
          </div>
          <div id="left-tree" style="height: 500px;overflow-y:visible;overflow-x:hidden">
        <el-tree style="border: none;" class="class-tree" node-key="id"
         :default-expanded-keys = 'ExArr'
         :data="data"
         highlight-current :props="defaultProps" :filter-node-method="filterNode" ref="classTree"
         :expand-on-click-node="false" :render-content="renderContent4ClassTree"
         @current-change="classTreeCurChange" >
        </el-tree>
          </div>
        </el-form>
      </div> <!-- /.class-filter-form -->

      </div>
    </el-col> <!-- left col 4 class tree end -->

    <el-col  :xs="8" :sm="13" :md="17" :lg="20" :class="{'el-col-lg-24':ifShowTree===true}" style="position: relative" > <!-- right col 4 main area begin -->
      <div id="bod"></div>
      <div id="top-form" style="padding-left: 43px">
      <el-form class="class-info-form" :inline="true"  :model="classInfoForm" >
        <el-form-item label="类编码:">
          {{ classInfoForm.edmcCode }}
   			</el-form-item>
        <el-form-item label="类简称:">
          {{ edmcShortName }}
        </el-form-item>
   			<el-form-item label="类名称:">
          {{ classInfoForm.edmcName }}
        </el-form-item>
        <el-form-item label="类英文名称:">
          {{ classInfoForm.edmcNameEn }}
        </el-form-item>
        <el-form-item label="适用行业:">
          {{ classInfoForm.industry }}
        </el-form-item>
        <el-form-item label="是否实体类:">
          <div v-if="classInfoForm.isEntity === 1 ">
            {{ '是' }}
          </div>
          <div v-else-if="classInfoForm.isEntity === 0 ">
            {{ '否' }}
          </div>
        </el-form-item>
        <el-form-item label="数据库类型:">
          {{ classInfoForm.databaseName }}
        </el-form-item>
   			<el-form-item>
  				<el-button type="info" v-if="!ifShowFather" v-on:click="ShowFather" class="btn-size">显示继承属性</el-button>
          <el-button type="info" v-else v-on:click="ShowFather" class="btn-size">隐藏继承属性</el-button>
   			</el-form-item>
   		</el-form><!-- /.class-info-form -->
      </div>

      <div id="main" class="maintain" >
        <div class="right-btn" >
          <span class="el-icon-arrow-left" v-if="!ifShowTree" @click="ShowTree" ></span>
          <span class="el-icon-arrow-right" v-else @click="ShowTree" ></span>
        </div>
      <el-form>
        <el-menu  class="" mode="horizontal" @select="handleSelect" >
          <router-link to="/model" ><el-menu-item index="1" >属性</el-menu-item></router-link>
          <router-link to='/methods'><el-menu-item index="2">方法</el-menu-item></router-link>
          <router-link to='/constant'><el-menu-item index="3">常量</el-menu-item></router-link>
          <router-link to='/basic'><el-menu-item index="4">基础信息</el-menu-item></router-link>
        </el-menu>
      </el-form>
      <router-view v-bind:ifShowFather="ifShowFather" :ifoperate="ifoperate" style="width: 98.7%"></router-view>
      </div>
    </el-col><!-- right col 4 main area end -->
  </el-row>
</template>
<script>
import Tree from '@/components/method-manage/Tree'
export default {
  name: 'modelMain',
  data: function () {
    return {
      ExArr: [],
      value: '',
      ifShowFather: false,
      ifoperate: true,
      ifShowTree: false,
      treeVisible: false,
      filterClassName: '',
      input: '',
      edmVer: '',
      edmcShortName: '',
      classInfoForm: {},
      classFilterForm: {},
      treeNodeCodeNameStr: '',
      treeNodeCodeValueStr: '',
      data: [],
      industriesTreeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    handleSelect (key, keyPath) {
    },
    /**
     * 取层级值
     * @param arr 数组对象
     * @param attr 取值属性
     * @param depth 层级 默认1级
     * @param child 子集字段 数组留空
     */
    plucks (arr, attr = 'id', depth = 1, child, self) {
      let rs = []
      for (let i in arr) {
        rs.push(arr[i][attr])
        if (depth > 1) {
          rs = rs.concat(self(arr[i][child], attr, depth - 1, child))
        }
      }
      return rs
    },
    handleIconClick (ev) {
    },
    OpenTree: function () {
      this.treeVisible = true
    },
    append (store, data) {
      store.append({ label: 'model', children: [] }, data)
    },
    remove (store, data) {
      store.remove(data)
    },
    filterNode (value, data) {
      console.log(value)
      if (value !== null && value !== '') {
        var values = value.split(',')
        console.log(values)
        for (var i = 0; i < values.length; i++) {
          value = values[i].toLowerCase()
          console.log(value)
          var row = data.edmcName
          var code = data.edmcIndustryCode
          code = code.toLowerCase()
          row = row.toLowerCase()
          if (!value) return true
          return (row.indexOf(value) !== -1 || code.indexOf(value) !== -1)
        }
      } else {
        return true
      }
    },
    openSelect () {
      var ifOpen = document.getElementById('show').style.display
      if (ifOpen === 'none') {
        document.getElementById('show').style.display = 'block'
      } else {
        document.getElementById('show').style.display = 'none'
      }
    },
    handleClick (data) {
      this.$store.dispatch('modelMainLeftTreeCurrSelect', data.id)
    },
    handleNodeClick (data) {
      var vm = this
      var name = data.srcElement.className
      var id = this.$store.state.modelMainLeftTreeCurrSelectId
      if (name === 'el-icon-plus') {
        // window.location.href = '/#classDefine/0/' + id
        this.$router.push('/classDefine/0/' + id)
      }
      if (name === 'el-icon-edit') {
        // window.location.href = '/#classDefine/1/' + id
        this.$router.push('/classDefine/1/' + id)
      }
      if (name === 'el-icon-document') {
        // window.location.href = '/#classDefine/2/' + id
        this.$router.push('/classDefine/2/' + id)
      }
      if (name === 'el-icon-arrow-up') {
        window.axios.put('/v1/classes/moveUp/' + id)
          .then(function (response) {
            var data = response.data
            if (data.retCode === 1) {
              vm.$message({
                showClose: true,
                message: '上移成功'
              })
              vm.queryClassTree()
            } else {
              console.log(data.errMsg)
            }
          }).catch(function (error) {
            console.log(error)
          })
      }
      if (name === 'el-icon-arrow-down') {
        window.axios.put('/v1/classes/moveDown/' + id)
          .then(function (response) {
            var data = response.data
            if (data.retCode === 1) {
              vm.$message({
                showClose: true,
                message: '下移成功'
              })
              vm.queryClassTree()
            } else {
              console.log(data.errMsg)
            }
          }).catch(function (error) {
            console.log(error)
          })
      }
    },
    industriesTreeCheckChanged () {
      var nodeArr = this.$refs.treeSelect.getCheckedNodes()
      var codeNameArr = []
      var codeValueArr = []
      for (var i = 0; i < nodeArr.length; i++) {
        codeNameArr.push(nodeArr[i].codeName)
        codeValueArr.push(nodeArr[i].codeValue)
      }
      this.treeNodeCodeNameStr = codeNameArr.join(',')
      this.treeNodeCodeValueStr = codeValueArr.join(',')
      console.info(nodeArr)
      console.info(codeValueArr)
    },
    classTreeCurChange (object, node) {
      /* var vm = this */
      /* vm.classInfoForm = node.data */
      this.$store.dispatch('treeEdmcEdmdId', object.edmcEdmdId)
      this.$store.dispatch('modelMainLeftTreeCurrSelect', object.id)
      var vm = this
      window.axios.get('/v1/classes/' + object.id)
          .then(function (response) {
            if (response.data.data) {
              console.log(response.data.data)
              vm.classInfoForm = response.data.data
            } else {
              vm.classInfoForm = {}
            }
          })
      window.axios.get('/v1/classes/simple/' + object.id)
        .then(function (response) {
          if (response.data.data) {
            console.log(response.data.data)
            vm.edmcShortName = response.data.data.edmcShortName
          } else {
            vm.edmcShortName = ''
          }
        })
      window.axios.get('/v1/codes/edm_db_type')
        .then(function (response) {
          for (var i = 0; i < response.data.data.length; i++) {
            if (vm.classInfoForm.databaseType === response.data.data[i].codeValue) {
              vm.classInfoForm.databaseName = response.data.data[i].codeName
            }
          }
        }).catch(function (error) {
          console.info(error)
        })
    },
    queryClassTree () {
      var _this = this
      var id = this.$route.params.id
      window.axios.get('/v1/modelers/' + id + '/classes')
      .then(function (response) {
        if (response.data.data) {
          _this.data = response.data.data
          console.info(response.data.data)
        } else {
          _this.data = []
        }
        _this.ExArr = _this.plucks(_this.data, 'id', 2, 'children', _this.plucks)
        // console.info(_this.ExArr + '....~~~')
      }).catch(function (error) {
        console.log(error)
      })
    },
    queryIndustriesTree () {
      var vm = this
      window.axios.get('/v1/codes/industries')
        .then(function (response) {
          vm.industriesTreeData = response.data.data
        }).catch(function (error) {
          console.log(error)
        })
    },
    queryCode () {
      var vm = this
      var code = this.$store.state.edmCodeName
      vm.edmVer = code
    },
    renderContent4ClassTree (h, arg) {
      let nodeData = arg.data
      if (arg._self.ifoperate && arg.data.edmcParentId !== null) {
        return h('div', {
          // 和`v-bind:class`一样的 API
          'class': {
            tooltip: true
          }
        },
          [h('span', arg.data.edmcName),
            h('div', {
              // 和`v-bind:class`一样的 API
              'class': {
                tooltiptext: true
              },
              on: {
                click: this.handleNodeClick
              }
            }, [
              h('i', {
                'class': {
                  'el-icon-plus': true
                },
                'style': {
                  'cursor': 'pointer'
                },
                on: {
                  click: () => {
                    this.handleClick(nodeData)
                  }
                }
              }
              ),
              h('i', {
                'class': {
                  'el-icon-edit': true
                },
                'style': {
                  'cursor': 'pointer'
                },
                on: {
                  click: () => {
                    this.handleClick(nodeData)
                  }
                }
              }
              ),
              h('i', {
                'class': {
                  'el-icon-document': true
                },
                'style': {
                  'cursor': 'pointer'
                },
                on: {
                  click: () => {
                    this.handleClick(nodeData)
                  }
                }
              }
              ),
              h('i', {
                'class': {
                  'el-icon-arrow-down': true
                },
                'style': {
                  'cursor': 'pointer'
                },
                on: {
                  click: () => {
                    this.handleClick(nodeData)
                  }
                }
              }
              ),
              h('i', {
                'class': {
                  'el-icon-arrow-up': true
                },
                'style': {
                  'cursor': 'pointer'
                },
                on: {
                  click: () => {
                    this.handleClick(nodeData)
                  }
                }
              }
              )
            ])
          ]
        )
      } else {
        return h('div', {
            // 和`v-bind:class`一样的 API
          'class': {
            tooltip: true
          }
        },
          [h('span', arg.data.edmcName),
            h('div', {
              // 和`v-bind:class`一样的 API
              'class': {
                tooltiptext: true
              },
              on: {
                click: this.handleNodeClick
              }
            }, [
              h('i', {
                'class': {
                  'el-icon-plus': true
                },
                'style': {
                  'cursor': 'pointer'
                },
                on: {
                  click: () => {
                    this.handleClick(nodeData)
                  }
                }
              }
              ),
              h('i', {
                'class': {
                  'el-icon-document': true
                },
                'style': {
                  'cursor': 'pointer'
                },
                on: {
                  click: () => {
                    this.handleClick(nodeData)
                  }
                }
              }
              ),
              h('i', {
                'class': {
                  'el-icon-arrow-down': true
                },
                'style': {
                  'cursor': 'pointer'
                },
                on: {
                  click: () => {
                    this.handleClick(nodeData)
                  }
                }
              }
              ),
              h('i', {
                'class': {
                  'el-icon-arrow-up': true
                },
                'style': {
                  'cursor': 'pointer'
                },
                on: {
                  click: () => {
                    this.handleClick(nodeData)
                  }
                }
              }
              )
            ])
          ]
        )
      }
    },
    renderContent4IndustriesTree (h, arg) {
      return h('div', {
          // 和`v-bind:class`一样的 API
        'class': {
          tooltip: true
        }},
        [h('span', arg.data.codeName),
          h('div', {
            // 和`v-bind:class`一样的 API
            'class': {
              tooltiptext: true
            }}, [
              h('i', {
                'class': {
                },
                'style': {
                }
              }
          )
            ])
        ]
      )
    },
    hoverTreeItem: function (arg1, arg2) {
    },
    ShowFather: function () {
      this.ifShowFather = !this.ifShowFather
    },
    ShowTree: function () {
      this.ifShowTree = !this.ifShowTree
    }
  },
  mounted: function () {
    this.queryClassTree()
    this.queryIndustriesTree()
    this.queryCode()
  },
  watch: {
    filterClassName (val) {
      if (this.treeNodeCodeValueStr === '') {
        this.$refs.classTree.filter(val)
      } else {
        var codes = val + ',' + this.treeNodeCodeValueStr
        this.$refs.classTree.filter(codes)
      }
    },
    treeNodeCodeValueStr (val) {
      if (this.filterClassName === '') {
        this.$refs.classTree.filter(val)
      } else {
        var codes = val + ',' + this.filterClassName
        this.$refs.classTree.filter(codes)
      }
    },
    modelMainLeftTreeCurrSelectId: function () {
      return this.$store.state.modelMainLeftTreeCurrSelectId
    },
    edmCodeName: function () {
      return this.$store.state.edmCodeName
    },
    treeEdmcEdmdId: function () {
      return this.$store.state.treeEdmcEdmdId
    }
  },
  created: function () {
    this.$store.dispatch('modelMainLeftTreeCurrSelect', '')
    if (this.$route.params.if === '0') {
      this.ifoperate = false
    }
  },
  components: {
    Tree
  }
}
</script>

<style>
.el-menu-item {
  font-weight: bold
}
.tooltip {
  position: relative;
  display: inline-block;
  width: 100%;
}
/*左边树每行高度*/
/*#left-tree .el-tree-node,#left-tree .el-tree-node__content,#left-tree .tooltip{
  height: 45px;
  line-height: 45px;
}*/
/*浮显按钮样式*/
.tooltip .tooltiptext {
  display: inline-block;
  visibility: hidden;
  width: 100px;
  text-align: left;
  padding: 0 0 0 15px;
  /* 定位 */
  position: absolute;
  /*left:110px;*/
  top:0px;
  z-index: 1;
}
.tooltip:hover .tooltiptext {
  visibility: visible;
}
i{
  display:block;
  margin:3px;
}
/*左侧行业树样式*/
.industries-tree-wrapper {
  position: relative;
}

.industries-tree-wrapper .el-tree{
  position: absolute;
  top: 0;
  left: 0;
  z-index: 101;
  width: 100%;
  min-height: 100px;
}
/*左上角版本号样式*/
  .ver-title{
    display: inline-block;
    width: 100%;
    font-size: 26px;
    color: #91A0FB;
    text-align: center;
  }
  /*左边标题输入框样式*/
#left-title .el-form-item__content{
  display: block;
}
  /*行业输入框中右侧+图标样式*/
  #left-title .el-input-group__append{
    border: none;
    position: absolute;
    top: 24px;
    right: 5px;
  }
#left-title .el-input-group--append .el-input__inner, .el-input-group__prepend, #left-title .el-input__inner{
  border-radius: 4px;
  border-top-right-radius:4px;
  border-bottom-right-radius: 4px;
}
  #left-title .el-input__inner{
    font-size: 14px;
  }
#left-title .el-icon-plus{
  font-size: 10px;
}
/*中间纵向“阴影”样式*/
#bod{
  display: inline-block;
  margin-left: 10px;
  height: 140px;
  width: 10px;
  position: absolute;
  top: -20px;
  background:  linear-gradient(to right, #F7F7FC, #ffffff);
}
/*右边上方表单样式*/
  #top-form .el-input__inner{
    border-radius: 15px;
  }
/*#top-form .btn-size{
  width: 110px;
}*/
/*四个页签按钮后面的背景色*/
.maintain, #main ul{
    background-color: #F0F2FA;
  }
/*右侧表格外div大小*/
  .maintain{
    width: 105.4%;
    min-height:765px;
  }
#main{
  position: relative;
  padding-left: 30px
}
  /*中间展开按钮样式*/
  .right-btn{
    display: inline-block;
    position: absolute;
    z-index: 1;
    left: 0;
    top: 220px;
    color: #91A0FB;
    height: 60px;
    line-height: 60px;
    width: 13px;
    border-bottom-right-radius: 4px;
    border-top-right-radius: 4px;
    background-color: #ffffff;
    cursor:pointer;
  }
  .el-icon-arrow-left, .el-icon-arrow-right{
    font-size: 10px;
  }
  /*四个页签按钮样式*/
  #main .el-menu-item{
    margin: 30px 10px 10px 0px;
    border: 1px solid rgba(7, 17, 27, 0.1);
    border-radius: 18px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    background: #ffffff;
    width: 96px;
  }
#main .el-menu-item:hover{
  border:none;
  color: #ffffff;
}
#main .is-active{
    background: linear-gradient(to right, #a89eff, #7e9aff);
    color: #ffffff;
    font-weight: 200;
  }
/*操作栏圆形按钮*/
  #main .el-button+.el-button{
    margin-left: 4px;
  }
  /*左边类树样式*/
#left-tree i{
    color: #ffffff;
  }
/*EDM节点*/
  #left-tree .el-tree-node__content{
    font-size: 16px;
    color: #6B6B74;
  }
#left-tree .el-tree-node__content:hover{
  color: #ffffff;
}
/*树的子节点*/
  #left-tree .el-tree-node__children .tooltip{
    font-size: 14px;
    color: #9496a0;
  }
#left-tree .el-tree-node__children .tooltip:hover{
  color: #ffffff;
}
  /*表格内输入框样式*/
  #main .el-input__inner{
    border-radius: 4px;
  }
  /*表单内容防止被覆盖*/
#main .el-form-item__content{
  display: block;
}
</style>
