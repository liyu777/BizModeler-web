  <template>

  <div>

      <!--<div id="bod1"></div>-->
      <div id="top-form">
  <el-form :inline="true" :model="formInline" class="demo-form-inline"  style="margin-left: 20px">
                          <el-form-item label="类编码:">
                            <el-input v-model="formInline.edmcCode" :readonly="true"> </el-input>
                          </el-form-item>
                          <el-form-item label="类名称:">
                            <el-input v-model="formInline.edmcName" :readonly="true"> </el-input>
                          </el-form-item>
                          <el-form-item label="类英文名称:">
                            <el-input v-model="formInline.edmcNameEn" :readonly="true"> </el-input>
                          </el-form-item>
                          <el-form-item label="适用行业:">
                            <el-input v-model="formInline.eType" :readonly="true"> </el-input>
                          </el-form-item>
                          <el-form-item>
                            <el-button type="info" v-if="!ifShowFather" v-on:click="ShowFather" class="btn-size">显示继承属性</el-button>
                            <el-button type="info" v-else v-on:click="ShowFather" class="btn-size">隐藏继承属性</el-button>
                          </el-form-item>
                   		</el-form>
      </div>
      <div id="main" class="maintain" style="padding: 0 10px">
  <el-form>
  <el-menu  class="" mode="horizontal" @select="handleSelect">
    <router-link to='/model/1'><el-menu-item index="1" >属性</el-menu-item></router-link>
    <router-link to='/methods/1'><el-menu-item index="2">方法</el-menu-item></router-link>
    <router-link to='/constant/1'><el-menu-item index="3">常量</el-menu-item></router-link>
    <router-link to='/basic/1'><el-menu-item index="4">基础信息</el-menu-item></router-link>
  </el-menu>
  </el-form>
  <router-view v-bind:ifShowFather="ifShowFather" style="width: 99.5%"></router-view>
      </div>

  </div>

</template>
<script>
import Tree from '@/components/method-manage/Tree'
export default {
  name: 'modelMain2',
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
    },
    OpenTree: function () {
      this.treeVisible = true
    },
    ShowFather: function () {
      this.ifShowFather = !this.ifShowFather
    },
    queryModel (id) {
      var vm = this
      console.log(id)
      window.axios.get('v1/classes/' + id)
        .then(function (response) {
          console.info(response)
          if (response.data.data === null) {
            vm.formInline = {}
          } else {
            vm.formInline = response.data.data
          }
        }).catch(function (error) {
          console.info(error)
        })
    }
  },
  mounted: function () {
    this.queryModel(this.$route.params.id)
  },
  created: function () {
    this.$store.dispatch('modelMainLeftTreeCurrSelect', this.$route.params.id)
  },
  data () {
    return {
      value: '',
      ifShowFather: false,
      treeVisible: false,
      formInline: {}
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
/*!*阴影条样式*!
#bod1{
  display: inline-block;
  height: 140px;
  width: 10px;
  position: absolute;
  top: -20px;
  background:  linear-gradient(to right, #F7F7FC, #ffffff);
}*/
/*右边上方表单样式*/
#top-form .el-input__inner{
  border-radius: 15px;
}
/*右侧表格外div大小*/
.maintain, #main ul{
  background-color: #F0F2FA;
}
.maintain{
  margin-left: 10px;
  width: 99.3%;
  min-height:765px;
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
#main .is-active{
  background: linear-gradient(to right, #a89eff, #7e9aff);
  color: #ffffff;
  font-weight: 200;
}
</style>
