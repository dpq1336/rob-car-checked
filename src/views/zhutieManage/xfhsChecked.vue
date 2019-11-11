<template>

  <detail v-if="show"
          :isShow="isShow"
          :handlePendingImageCollection="handlePendingImageCollection"
          style="padding:10px;padding-left:0px"
          :albumId="albumId"
          :status="status"
          :taskCode="taskCode"
          :firstTitle="title"></detail>

  <div class="main-box"
       v-else>
    <!-- 搜索模块 -->

    <el-row>
      <el-col :span="6">
        用户：<el-select v-model="value"
                   placeholder="请选择"
                   @change="handleChangeUserId(value)">
          <el-option v-for="item in options"
                     :key="item.userId"
                     :label="item.userName"
                     :value="item.userId">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="18"
              style="float:left">
        <!-- 二级联动子组件 -->

        车型：<selectModels style="margin-left:20px;margin-top:0px;display:inline-block;"
                      @carChangeEvent="modelId=$event.car.id==-10?null:$event.car.id"
                      :firstId="modelId"></selectModels>

        <!-- 二级联动子组件 -->
      </el-col>
    </el-row>

    <!-- 搜索模块 -->
    <!-- tab切换模块 -->
    <el-tabs v-model="activeName"
             type="card">
      <!-- 待审核模块 -->
      <el-tab-pane :label="`待审核（${pendingTotal}个图集）`"
                   name="first">
        <!-- 待审核内容 -->
        <el-row>
          <el-col :span="4"
                  v-for=" item in pendingData.albumList"
                  :key="item.albumId"
                  :offset="1">

            <el-card :body-style="{ padding: '0px',position: 'relative',}"
                     class="card">
              <div class="image"> <img :src="item.coverPhotoUrl"
                     class="image"
                     @click="handlePandingDetail(item.albumId,3,item.taskCode,item.albumName)"
                     style="cursor: pointer;">
                <span class="photo-count-pending">{{item.photoCount}}张</span></div>

              <div style="padding: 14px;">
                <span style="height:36px;display:inline-block;overflow: hidden;">{{item.albumName}}</span>
                <div style="margin-top:5px;">
                  外观<span class="appearance"
                        :style="{background:item.colorRgb}"></span>
                  内饰<span class="trim-front"
                        :style="{background:item.innerFirst}"></span><span class="trim-behind"
                        :style="{background:item.innerLast||item.innerFirst}"></span>
                </div>
                <div class="bottom clearfix">
                  <!-- <div> <span>提审时间 ：</span><span style="font-size:10px">{{ currentDate }}</span></div> -->
                  <!-- <el-button tydive="text"
                             class="button">操作按钮</el-button> -->
                  <div style="font-size:14px;margin-bottom:5px">提审时间：{{item.submitTime|getTime}}</div>
                  <div style="font-size:14px">提审人：{{item.submitUser}}</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <!-- 待审核内容 -->
        <el-tag :style="{display:pendingShow==0?'block':'none'}"
                class="nodata"
                type="info">暂无数据</el-tag>

        <!-- 待审核分页 -->
        <el-pagination background
                       layout="prev, pager, next"
                       :total="pendingTotal"
                       @current-change="handlePendingPage"
                       :current-page="pendingPage"
                       :page-size="pagesize"
                       style="margin-bottom:40px">
        </el-pagination>
        <!-- 待审核分页 -->

      </el-tab-pane>
      <!-- 待审核模块 -->
      <!-- 审核通过模块 -->
      <el-tab-pane :label="`(审核通过${completedTotal}个图集）`"
                   name="second">
        <el-row>
          <el-col :span="4"
                  v-for="item in completedData.albumList"
                  :key="item.albumId"
                  :offset="1">

            <el-card :body-style="{ padding: '0px',position: 'relative',}"
                     class="card">
              <div class="image"><img :src="item.coverPhotoUrl"
                     class="image"
                     @click="handleCompletedDetail(item.albumId,1,item.taskCode,item.albumName)"
                     style="cursor: pointer;">
                <span class="photo-count-completed"
                      style="transform:translateY(-5px)">{{item.photoCount}}张</span></div>

              <span class="photo-delete"
                    @click="handleDelete(item.albumId)">删除</span>
              <div style="padding: 14px;">
                <span style="height:36px;display:inline-block;overflow: hidden;">{{item.albumName}}</span>
                <div style="margin-top:5px;">
                  外观<span class="appearance"
                        :style="{background:item.colorRgb}"></span>
                  内饰<span class="trim-front"
                        :style="{background:item.innerFirst}"></span><span class="trim-behind"
                        :style="{background:item.innerLast||item.innerFirst}"></span>
                </div>
                <div class="bottom clearfix">
                  <!-- <div> <span>提审时间 ：</span><span style="font-size:10px">{{ currentDate }}</span></div> -->
                  <!-- <el-button tydive="text"
                             class="button">操作按钮</el-button> -->
                  <!-- <div style="font-size:14px;margin-bottom:5px">经销商：{{item.dealerName}}</div> -->
                  <!-- <div style="font-size:14px;margin-bottom:5px">场景：外观</div> -->
                  <div style="font-size:14px;margin-bottom:5px">提审时间：{{item.submitTime|getTime}}</div>
                  <div style="font-size:14px;margin-bottom:5px">提审人：{{item.submitUser}}</div>
                  <div style="font-size:14px">审核人：{{item.checkUserName}}</div>

                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-tag :style="{display:completedShow==0?'block':'none'}"
                class="nodata"
                type="info">暂无数据</el-tag>

        <el-pagination background
                       layout="prev, pager, next"
                       :page-size="pagesize"
                       :total="completedTotal"
                       :current-page="completedPage"
                       @current-change="handleCompletedPage"
                       style="margin-bottom:40px">
        </el-pagination>
      </el-tab-pane>
      <!-- 审核通过模块 -->

    </el-tabs>
  </div>
  <!-- <detail></detail> -->
</template>
<script>
import { getDataFun, postDataFun } from '@/utils/request.js'
import selectModels from '@/components/selectModels/selectModels.vue'
import detail from '@/views/zhutieManage/detail'
import { getInnerColor } from '@/utils/inner.js'
export default {
  components: {
    detail, selectModels

  },
  filters: {
    getTime (val) {

      let date = new Date(val),
        Y = date.getFullYear() + '-',
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-',
        D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ',
        h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':',
        m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()),
        s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());

      return Y + M + D + h + m;


    }
  },
  watch: {
    //监听tab栏name，并同步修改status的值
    activeName (val) {
      if (val == 'first') {
        this.status = 3
        this.handleGetUser()
        this.handlePendingImageCollection()
      } else {
        this.status = 1
        this.handleGetUser()
        this.handleCompletedImageCollection()
      }

    },
    //监听车型id，下拉框发生变化就自动搜索
    modelId (val) {
      //如果车型搜索，则无法用户搜索
      if (val !== -null) {
        this.value = ''
        this.userId = null
      }
      // console.log(val, 1234567)
      if (this.status == 3) {
        this.handlePendingImageCollection()
      } else {
        this.handleCompletedImageCollection()
      }


    },
    //监听用户，下拉框发生变化就自动搜索
    value (val) {
      //如果用户搜索则无法车型搜索
      if (val !== '') {
        console.log(123)
        this.modelId = null
      }
      if (this.status == 3) {
        this.handlePendingImageCollection()
      } else {
        this.handleCompletedImageCollection()
      }
      console.log(this.userId)
    }
  },
  data () {
    return {
      // data: 100,
      modelId: null,    //车型id
      userId: null,     //图集提交人id
      pendingPage: 1,// 待审核图集当前页码
      completedPage: 1, //审核通过图集当前页码
      pendingDetailPage: null, //待审核详情图集页码
      completedDetailPage: null,//审核通过详情图集页码
      pagesize: 100,    //图集每页显示个数
      //待审核图集数据
      pendingData: {
      },

      //审核完毕图集数据
      completedData: {},

      albumId: null,    //当前的图集id
      status: 3,        //当前图集状态
      pendingPage: 1,     //待审核图集当前页码
      completedPage: 1, //审核通过图集当前页码
      pendingTotal: 1, //待审核图集总数
      completedTotal: 1,//审核通过图集总数
      show: false,      //控制子组件是否显示
      options: [        //用户下拉选项

      ],
      value: '',        //用户下拉当前值
      // value1: '',
      // value2: '',

      activeName: 'first',
      currentDate: '2019-08-08 09:10:56',
      pendingShow: false,   //待审核图集暂无数据是否显示
      completedShow: false,  //审核通过图集暂无数据是否显示
      taskCode: '',  //当前图集任务code
      title: ''          //子组件标题
    }
  },
  created () {
    this.handleGetUser()
    this.handlePendingImageCollection()
    this.handleCompletedImageCollection()
  },
  methods: {
    //控制父子组件切换显示
    isShow () {
      this.show = !this.show
    },
    //获取用户下拉框内容
    async handleGetUser () {
      try {
        var arg = { url: '/yipaimanager/check/getUserList', data: { checkState: this.status } };
        var res = await getDataFun(arg)
        res.data.unshift({
          userId: null,
          userName: '全部'
        })
        this.options = res.data
        // console.log(this.options, 123456)


      } catch (err) {
        console.log(err)
      }
    },
    //用户下拉框改变时，同步改变userId
    handleChangeUserId (val) {
      this.userId = val

      console.log(val, '-----------------123456')
    },
    //展示待审核图集列表
    async handlePendingImageCollection () {
      try {
        // console.log('加载待审核')
        var arg = { url: '/yipaimanager/check/getCheckAlbumList', data: { modelId: this.modelId, userId: this.userId, checkState: 3, pageSize: this.pagesize, pageNumber: this.pendingPage } };
        var res = await getDataFun(arg)
        var a = res.data
        console.log(a, 1234567)
        //处理图片路径

        for (var i = 0; i < a.albumList.length; i++) {
          if (a.albumList[i].coverPhotoUrl) {
            var str1 = a.albumList[i].coverPhotoUrl.split("_")[0];
            // console.log(str1,12345678)
            var str2 = a.albumList[i].coverPhotoUrl.split("_")[2].split(".")[1];
            var url = str1.concat(".", str2);
            a.albumList[i].coverPhotoUrl = url;

          }
          this.imageList = res.data;
        }


        // console.log(this.imageList, 666)


        // getInnerColor(res.data.albumList)
        console.log(res.data, 5555555555555)
        this.pendingData = res.data
        this.pendingTotal = this.pendingData.total.waitingPass
        this.pendingShow = this.pendingData.albumList.length
        console.log(this.pendingData, 222222222)

        // this.taskCode=
      } catch (err) {
        console.log(err)
      }
    },
    //展示审核通过图集列表
    async handleCompletedImageCollection () {
      try {
        var arg = { url: '/yipaimanager/check/getCheckAlbumList', data: { modelId: this.modelId, userId: this.userId, checkState: 1, pageSize: this.pagesize, pageNumber: this.completedPage } };
        var res = await getDataFun(arg)
        var a = res.data
        // console.log(a.albumList)
        if (a) {
          for (var i = 0; i < a.albumList.length; i++) {
            if (a.albumList[i].coverPhotoUrl) {
              var str1 = a.albumList[i].coverPhotoUrl.split("_")[0];
              // console.log(str1,12345678)
              var str2 = a.albumList[i].coverPhotoUrl.split("_")[2].split(".")[1];
              var url = str1.concat(".", str2);
              a.albumList[i].coverPhotoUrl = url;
            }

            this.imageList = res.data;
          }


          console.log(this.imageList, 666)

        }
        getInnerColor(res.data.albumList)

        this.completedData = res.data
        this.completedTotal = this.completedData.total.pass

        this.completedShow = this.completedData.albumList.length

      } catch (err) {
        console.log(err)
      }
    },
    //待审核图集详情列表跳转
    handlePandingDetail (id, status, taskCode, title) {
      this.taskCode = taskCode
      console.log(title, 666777)
      this.isShow()
      this.albumId = id
      this.status = status
      this.title = title
      console.log(this.status, this.albumId)

      // console.log(id)
    },
    //审核通过图集详情列表跳转
    handleCompletedDetail (id, status, taskCode, title) {
      this.isShow()
      this.taskCode = taskCode
      this.albumId = id
      this.status = status
      this.title = title

      // console.log(this.status, this.albumId)


    },
    //删除图集
    async handleDelete (albumId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var arg = { url: '/yipaimanager/album/deleteAlbum', data: { albumId: albumId, source: 1 } }
        postDataFun(arg).then((res) => {
          console.log(arg, res)
          if (res.status == 1) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.handleCompletedImageCollection()
          } else {
            this.$message({
              type: 'warning',
              message: '删除失败!'
            });
          }
        })


      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //待审核图集分页
    handlePendingPage (val) {
      console.log(val)
      this.pendingPage = val    //val 就是当前切换后的页码，重新赋值给data声明的数据
      this.handlePendingImageCollection()    //重新掉接口展示当前内容
    },
    //审核通过图集分页
    handleCompletedPage (val) {
      console.log(val)
      this.completedPage = val
      this.handleCompletedImageCollection()
    }
  }
}
</script>
<style lang="scss" scoped>
.main-box {
  padding: 20px;
}
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
.el-tabs {
  margin-top: 30px;
}
.image {
  position: relative;
}
.photo-count-pending {
  color: white;
  position: absolute;
  top: 87%;
  font-weight: 900;
  left: 5px;
}
.photo-count-completed {
  color: white;
  position: absolute;
  top: 90%;
  font-weight: 900;
  left: 5px;
}
.photo-delete {
  font-weight: bold;
  position: absolute;
  display: inline-block;
  width: 70px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.3);
  cursor: pointer;
  color: white;
  // opacity: 0.3;
  right: 0;
  transform: translateY(-100%);
}

.appearance {
  display: inline-block;
  width: 20px;
  height: 10px;
  // background-color: black;
  margin-right: 20px;
  margin-left: 5px;
  border-radius: 10%;
}
.trim-front {
  display: inline-block;
  // background-color: black;
  width: 10px;
  height: 10px;
  margin-left: 5px;
  border-top-left-radius: 20%;
  border-bottom-left-radius: 20%;
}
.trim-behind {
  display: inline-block;
  // background-color: #ccc;
  width: 10px;
  height: 10px;
  border-top-right-radius: 20%;
  border-bottom-right-radius: 20%;
}
.card {
  // float: left;
  margin-bottom: 20px;
}
.nodata {
  text-align: center;
  height: 50px;
  line-height: 50px;
}
</style>