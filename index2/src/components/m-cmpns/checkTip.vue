<template>
  <div v-if="checkShow" id="checkTips">
    <div class="el-icon-check"  v-show="check"></div>
    <div class="el-icon-close close" v-show="!check"></div>
  </div>
</template>

<script>
  export default {
    name: 'checkTip',
    props: ['checkShow', 'check']
  }

</script>

<style>
  .el-icon-check, .close{
    position: absolute;
    top: 12px;
    left: 83.5%;
    margin-left: 5px;
    width: 100%;
    color: #13CE66;
  }
  .close {
    color: #FF4949;
  }

</style>
