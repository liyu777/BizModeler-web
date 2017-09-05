<template>
  <div id="app">
    <el-menu default-active="1" class="el-menu-demo" mode="horizontal" id="tabs">
  	<!--<el-menu-item index="1">处理中心</el-menu-item>
  	<el-submenu index="1" >
    	<template slot="title">EDM相关</template>
    	<router-link to='/list' class="link-line"><el-menu-item index="1-1">EDM列表</el-menu-item></router-link>
    	<router-link to='/modelDefine/1/0'class="link-line" ><el-menu-item index="1-2">EDM版本定义</el-menu-item></router-link>-->
    	<!--<router-link to='/modelUpdateHis'class="link-line" ><el-menu-item index="1-3">模型更新历史</el-menu-item></router-link>
    	<router-link to='/modelCompare'class="link-line" ><el-menu-item index="1-4">模型比较</el-menu-item></router-link>
      <router-link to='/modelList' class="link-line"><el-menu-item index="1-5">模型列表</el-menu-item></router-link>
  	</el-submenu>-->
      <router-link to='/list' class="link-line"><el-menu-item index="1-1">EDM列表</el-menu-item></router-link>
  	<!--<el-submenu index="2">
    	<template slot="title">模型维护</template>
    	<router-link to='/modelMain/1/0' class="link-line"><el-menu-item index="2-1">模型维护</el-menu-item></router-link>
      <router-link to='/setMain' class="link-line"><el-menu-item index="2-2">属性集维护</el-menu-item></router-link>
  	</el-submenu>-->
      <div id="menus">
		<el-submenu index="3">
    	<template slot="title"><span class="menuClass">方法维护</span></template>
    	<router-link to='/method-manage' class="link-line"><el-menu-item index="3-1">方法管理</el-menu-item></router-link>
      <!--<router-link to='/method-define' class="link-line"><el-menu-item index="3-2">方法维护</el-menu-item></router-link>-->
			<router-link to='/method-model' class="link-line"><el-menu-item index="3-3">方法与模型关系查询</el-menu-item></router-link>
      <router-link to='/F-model' class="link-line"><el-menu-item index="3-4">卷积公式与模型关系查询</el-menu-item></router-link>
  	</el-submenu>
      </div>
      <!--<el-submenu index="4">
        <template slot="title">方法相关</template>
        <router-link to='/methodChoice/0/1' class="link-line"><el-menu-item index="4-1">方法选择</el-menu-item></router-link>
        <router-link to='/methodClassify' class="link-line"><el-menu-item index="4-2">方法分类</el-menu-item></router-link>
      </el-submenu>-->
      <!--<el-submenu index="5">
        <template slot="title">属性扩展维护</template>
        <router-link to='/attributeVindicate/0' class="link-line"><el-menu-item index="5-1">属性扩展维护</el-menu-item></router-link>
        <router-link to='/classDefine/1/0' class="link-line"><el-menu-item index="5-2">类定义</el-menu-item></router-link>
      </el-submenu>-->
		</el-menu>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  methods: {
    reload: function () {
      window.location.reload()
    }
  }
}
</script>

<style>
#app{
	padding-top: 5px
}
#tabs{
	margin-bottom: 20px
}
.link-line{
  text-decoration:none
}
/*菜单字体*/
.menuClass {
  color: #FFFFFF;
  font-size: 16px;
}
/*三角图标颜色*/
#app .el-submenu__title .el-submenu__icon-arrow {
  color: #FFFFFF;
}
/*导航栏渐变色*/
.el-menu-demo {
  background: linear-gradient(to right, #beb5ff, #7b9aff, #8599ff, #9fbcff); /* 标准的语法 */
}
/*导航菜单下拉框背景色*/
#app .el-menu-item:hover{
  background: linear-gradient(to right, #beb5ff, #ADAEFF);
}
/*导航菜单背景色*/
#app .el-submenu__title{
  background: linear-gradient(to right, #AEAFFF, #a0a9ff);
}
/*导航栏选项标题下边框*/
#menus{
  display: inline-table;
  border-bottom: 5px solid transparent;
}
#menus:hover{
  border-bottom: 5px solid #8E7BFF;
}
#menus .el-menu-item:hover, .el-submenu__title:hover{
  color: #ffffff;
}
#app .el-submenu.is-active .el-submenu__title{
  border-bottom:none
}
/*导航栏下拉列表字体*/
#menus .el-menu-item, .el-submenu__title{
  color: #6B6B74;
  font-size: 14px;
  }
.link-line>.el-menu-item{
  color: #ffffff;
}
  #app .el-menu--horizontal .el-submenu .el-menu-item{
    height: 45px;
    line-height: 45px;
  }
</style>
