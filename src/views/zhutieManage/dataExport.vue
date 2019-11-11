<template>
  <div class="main-box">
    <h2>请选择图集创建时间：</h2>
    <div class="block">
      <span class="demonstration"></span>
      <el-date-picker v-model="value"
                      type="daterange"
                      align="right"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      :default-time="['08:00:00', '08:00:00']"
                      format="yyyy 年 MM 月 dd 日"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      :clearable="false">
      </el-date-picker>
    </div>

    <el-card class="box-card"
             style="margin-top:20px">
      <h2>请选择导出字段：</h2>
      <!-- <el-checkbox-group v-model="checkList"> -->
      <el-checkbox-group v-model="checkList"
                         @change="handelChange">

        <el-checkbox label="图集名称"
                     disabled></el-checkbox>
        <el-checkbox label="图集ID"
                     disabled></el-checkbox>
        <el-checkbox label="审核通过时间"></el-checkbox>
        <el-checkbox label="车款ID"></el-checkbox>
        <el-checkbox label="外观颜色"></el-checkbox>
        <el-checkbox label="内饰颜色"></el-checkbox>
        <el-checkbox label="外包人员账号"></el-checkbox>
        <el-checkbox label="外包人员名称"></el-checkbox>
        <el-checkbox label="审核人账号"></el-checkbox>
        <el-checkbox label="审核人名称"></el-checkbox>
        <el-checkbox label="图集状态"></el-checkbox>

      </el-checkbox-group>

    </el-card>
    <el-button type="primary"
               style="margin-top:20px;padding:0"
               size="medium"
               native-type="submit"
               class="export"
               :disabled="value.length==2?false:true">
      <a :href="value.length!==2?`javascript:`:`http://photo.op.bitauto.com/yipaimanager/export/albumExcel?albumId=1&albumName=1&startTime=${value[0]}&endTime=${value[1]}&passTime=${passTime}&styleId=${styleId}&colorId=${colorId}&innerColorId=${innerColorId}&userId=${userId}&userName=${userName}&checkUserId=${checkUserId}&checkUserName=${checkUserName}&albumState=${albumState}`">导出</a></el-button>
  </div>
</template>
<script>
import { getDataFun, postDataFun } from '@/utils/request.js'
import axios from 'axios'
export default {
  data () {
    return {
      value: '',   //导出时间段
      passTime: 0,
      styleId: 0,
      colorId: 0,
      innerColorId: 0,
      userId: 0,
      userName: 0,
      checkUserId: 0,
      checkUserName: 0,
      albumState: 0,
      checkList: ['图集名称', '图集ID'],


    }
  },
  methods: {
    handelChange () {
      if (this.checkList.indexOf('审核通过时间') !== -1) {
        this.passTime = 1
      } else {
        this.passTime = 0
      }
      if (this.checkList.indexOf('车款ID') !== -1) {
        this.styleId = 1
      } else {
        this.styleId = 0
      }
      if (this.checkList.indexOf('车款ID') !== -1) {
        this.colorId = 1
      } else {
        this.colorId = 0
      }
      if (this.checkList.indexOf('内饰颜色') !== -1) {
        this.innerColorId = 1
      } else {
        this.innerColorId = 0
      }
      if (this.checkList.indexOf('外包人员账号') !== -1) {
        this.userId = 1
      } else {
        this.userId = 0
      }
      if (this.checkList.indexOf('外包人员名称') !== -1) {
        this.userName = 1
      } else {
        this.userName = 0
      }
      if (this.checkList.indexOf('审核人账号') !== -1) {
        this.checkUserId = 1
      } else {
        this.checkUserId = 0
      }
      if (this.checkList.indexOf('审核人名称') !== -1) {
        this.checkUserName = 1
      } else {
        this.checkUserName = 0
      }
      if (this.checkList.indexOf('图集状态') !== -1) {
        this.albumState = 1
      } else {
        this.albumState = 0
      }


    },


  },

}
</script>
<style lang="scss"  scoped>
.main-box {
  padding: 30px;
}
.export /deep/ span {
  display: inline-block;
  width: 90px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  a {
    display: inline-block;
    width: 100%;
    height: 100%;
  }
}
</style>
