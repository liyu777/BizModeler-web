<template>
<div>
	<el-form :inline="true" :model="model" >
  				<el-form-item label="模型编码:">
  					<el-input type="text" class="input-width"  size="small"></el-input>
  				</el-form-item>
  				<el-form-item label="模型名称:">
  					<el-input type="text" class="input-width" size="small"></el-input>
  				</el-form-item>
  	</el-form>
	<div class="textBoard">
		<div v-for="item in mod">
		<p class="text-styl">版本：{{item.version}} &nbsp;&nbsp;&nbsp;&nbsp;更新时间：{{item.time}}</p>
		<pre class="text-styl">更新说明:{{item.explain}}</pre>
		</div>
	</div>
</div>
</template>

<script>
export default{
  name: 'modelUpdateHis',
  data () {
    return {
      mod: [ {
        version: 'V0.02',
        time: '2017-03-20 10:30',
        explain: '\n   ' + '1.*************\n   2.*************'
      }, {
        version: 'V0.01',
        time: '2017-03-20 10:00',
        explain: '\n   ' + '1.*************\n   2.*************'
      }],
      model: {}
    }
  }
}
</script>

<style>
.input-width{
    width: 183px
}
.textBoard{
	border: 1px solid #000000;
	width: 500px;
	padding: 10px
}
.text-styl{
	font-size: 14px;
    color: #48576a;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    margin-bottom: 5px;
    margin-top: 5px
}
</style>
